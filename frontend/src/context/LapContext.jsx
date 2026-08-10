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
