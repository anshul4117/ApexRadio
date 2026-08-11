import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { lapsApi, sessionApi } from '../services/api';

const LapContext = createContext(null);

export const LapProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    try {
      const [lapRes, sessionRes] = await Promise.allSettled([
        lapsApi.getSession(),
        sessionApi.getCurrentSession(),
      ]);

      if (lapRes.status === 'fulfilled' && lapRes.value?.success && lapRes.value?.data) {
        setSessionData(lapRes.value.data);
      }

      if (sessionRes.status === 'fulfilled' && sessionRes.value?.success && sessionRes.value?.data) {
        setCurrentSession(sessionRes.value.data);
      }
    } catch (err) {
      console.warn('Could not fetch session from backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  /**
   * Sync active session across the platform
   */
  const syncSession = useCallback((newSession) => {
    if (!newSession) return;
    setCurrentSession((prev) => ({
      ...prev,
      ...newSession,
    }));
    if (newSession.lapStats || newSession.correlation) {
      setSessionData((prev) => ({
        ...prev,
        ...newSession,
        lapStats: newSession.lapStats || prev?.lapStats,
        correlation: newSession.correlation || prev?.correlation,
      }));
    }
  }, []);

  /**
   * Recalculates correlation and risk score dynamically when new driver radio emotion is analyzed
   */
  const correlateWithEmotion = useCallback((emotionData) => {
    setSessionData((prev) => {
      if (!prev) return prev;

      const stress = Number(emotionData?.stressScore || (emotionData?.driverState === 'Stressed' ? 78 : emotionData?.driverState === 'Fatigued' ? 52 : 20));
      const paceLoss = Number(prev.correlation?.paceLossSeconds || 1.43);
      
      let dynamicRisk = Math.round((stress * 0.40) + ((paceLoss / 2.0) * 35) + 15);
      dynamicRisk = Math.min(98, Math.max(12, dynamicRisk));

      let riskTier = 'Low';
      let riskBadgeVariant = 'nominal';
      if (dynamicRisk >= 75) {
        riskTier = 'Critical';
        riskBadgeVariant = 'critical';
      } else if (dynamicRisk >= 55) {
        riskTier = 'High';
        riskBadgeVariant = 'critical';
      } else if (dynamicRisk >= 30) {
        riskTier = 'Medium';
        riskBadgeVariant = 'warning';
      }

      return {
        ...prev,
        correlation: {
          ...prev.correlation,
          riskScore: dynamicRisk,
          riskTier,
          riskBadgeVariant,
          correlatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Upload and parse telemetry CSV file
   */
  const uploadCsv = useCallback(async (file) => {
    setIsAnalyzing(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('csv', file);

      const onProgress = (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      };

      const response = await lapsApi.uploadCsv(formData, onProgress);

      if (response.success && response.data) {
        setSessionData(response.data);
        if (response.data.session) {
          setCurrentSession(response.data.session);
        }
        return { success: true, data: response.data };
      }

      throw new Error(response.message || 'Failed to parse CSV file');
    } catch (err) {
      const message = err.message || 'Failed to upload telemetry CSV';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Load standard Silverstone Stint 1 sample preset
   */
  const loadSamplePreset = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await lapsApi.analyzeLaps({ filename: 'silverstone_stint1_telemetry.csv' });
      if (response.success && response.data) {
        setSessionData(response.data);
        if (response.data.session) {
          setCurrentSession(response.data.session);
        }
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to load sample dataset');
    } catch (err) {
      const message = err.message || 'Failed to load sample dataset';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const lapsLoaded = sessionData?.lapsLoaded || sessionData?.lapStats?.totalLaps || currentSession?.totalLaps || 18;
  const currentLap = sessionData?.currentLap || sessionData?.lapStats?.currentLap || currentSession?.currentLap || 18;
  const driverName = currentSession?.driverName || 'Max Verstappen';

  return (
    <LapContext.Provider
      value={{
        sessionData,
        currentSession,
        driverName,
        lapStats: sessionData?.lapStats || currentSession?.lapStats || null,
        correlation: sessionData?.correlation || currentSession?.correlation || null,
        filename: sessionData?.filename || currentSession?.lapFilename || 'silverstone_stint1_telemetry.csv',
        lapsLoaded,
        currentLap,
        totalLaps: lapsLoaded,
        isAnalyzing,
        uploadProgress,
        error,
        uploadCsv,
        loadSamplePreset,
        refreshSession: fetchSession,
        syncSession,
        correlateWithEmotion,
      }}
    >
      {children}
    </LapContext.Provider>
  );
};

export const useLap = () => {
  const context = useContext(LapContext);
  if (!context) {
    throw new Error('useLap must be used within a LapProvider');
  }
  return context;
};

export default LapContext;
