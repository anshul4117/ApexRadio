import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { lapsApi } from '../services/api';

const LapContext = createContext(null);

export const LapProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    try {
      const response = await lapsApi.getSession();
      if (response.success && response.data) {
        setSessionData(response.data);
      }
    } catch (err) {
      console.warn('Could not fetch lap session from backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  /**
   * Recalculates correlation and risk score dynamically when new driver radio emotion is analyzed
   */
  const correlateWithEmotion = useCallback((emotionData) => {
    setSessionData((prev) => {
      if (!prev) return prev;

      const stress = Number(emotionData?.stressScore || (emotionData?.driverState === 'Stressed' ? 78 : emotionData?.driverState === 'Fatigued' ? 52 : 20));
      const paceLoss = Number(prev.correlation?.paceLossSeconds || 0.84);
      
      // Calculate dynamic risk score: (stress * 0.4) + (paceLoss * 35) + modifier
      let dynamicRisk = Math.round((stress * 0.45) + ((paceLoss / 2.0) * 35) + 10);
      dynamicRisk = Math.min(98, Math.max(12, dynamicRisk));

      let riskTier = 'Low';
      let riskBadgeVariant = 'nominal';
      if (dynamicRisk >= 80) {
        riskTier = 'Critical';
        riskBadgeVariant = 'critical';
      } else if (dynamicRisk >= 60) {
        riskTier = 'High';
        riskBadgeVariant = 'critical';
      } else if (dynamicRisk >= 30) {
        riskTier = 'Medium';
        riskBadgeVariant = 'nominal';
      }

      const explainabilityFactors = [
        {
          id: `fac-stress-${Date.now()}`,
          title: `Vocal Stress Detected (${stress}%)`,
          description: `Driver state evaluated as ${emotionData.driverState || 'Stressed'} with ${emotionData.pitchJitter || '+42.5 Hz'} vocal pitch jitter.`,
          severity: stress >= 65 ? 'critical' : 'nominal',
        },
        {
          id: `fac-pace-${Date.now()}`,
          title: 'Sector 2 Pace Loss (+0.84s)',
          description: 'Telemetry delta indicates front-left thermal degradation into Turn 4 apex.',
          severity: 'critical',
        },
        {
          id: `fac-undercut-${Date.now()}`,
          title: 'Undercut Threat (HAM #44)',
          description: 'P2 rival running on fresh Hard compound, gaining +0.4s/lap in clean air.',
          severity: 'nominal',
        },
      ];

      return {
        ...prev,
        correlation: {
          ...prev.correlation,
          riskScore: dynamicRisk,
          riskTier,
          riskBadgeVariant,
          paceLossSeconds: paceLoss,
          explainabilityFactors,
          recommendation: emotionData.recommendation || prev.correlation?.recommendation,
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

  return (
    <LapContext.Provider
      value={{
        sessionData,
        lapStats: sessionData?.lapStats || null,
        correlation: sessionData?.correlation || null,
        filename: sessionData?.filename || 'silverstone_stint1_telemetry.csv',
        isAnalyzing,
        uploadProgress,
        error,
        uploadCsv,
        loadSamplePreset,
        refreshSession: fetchSession,
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
