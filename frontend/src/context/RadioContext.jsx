import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { radioApi } from '../services/api';

const RadioContext = createContext(null);

const DEFAULT_ANALYSIS = {
  id: 'tx_seed_001',
  timestamp: new Date().toISOString(),
  driver: 'Max Verstappen',
  driverId: 'VER-01',
  car: 'Car #1',
  lap: 18,
  transcript: 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.',
  emotion: {
    driverState: 'Stressed',
    stressScore: 78,
    emotionLabel: 'Frustrated',
    pitchJitter: '+42.5 Hz',
    speechCadence: '185 WPM',
    vocalIntensity: '88 dB',
  },
  confidence: 94.2,
  recommendation: {
    action: 'Enforce radio silence through Sector 2 high-G corners.',
    category: 'Radio Brevity',
    pitWindow: 'Lap 21 (Hard compound)',
    priority: 'critical',
  },
  metadata: {
    audioDuration: '4.2s',
    audioFormat: 'WAV',
    fileSizeKb: 148,
    originalName: 'lap18_ver_understeer.wav',
  },
  processingTime: '1.14s',
};

export const RadioProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(DEFAULT_ANALYSIS);
  const [history, setHistory] = useState([DEFAULT_ANALYSIS]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('idle'); // 'idle' | 'uploading' | 'transcribing' | 'analyzing' | 'completed' | 'error'
  const [error, setError] = useState(null);

  // Fetch initial history from backend
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const response = await radioApi.getHistory();
        if (isMounted && response.success && Array.isArray(response.data?.history) && response.data.history.length > 0) {
          setHistory(response.data.history);
          setCurrentAnalysis(response.data.history[0]);
        }
      } catch (err) {
        console.warn('Could not fetch radio history, using default session data:', err);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Analyze an uploaded audio file (WAV or MP3)
   */
  const analyzeFile = useCallback(async (file, options = {}) => {
    setIsAnalyzing(true);
    setUploadProgress(0);
    setAnalysisStep('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('driverName', options.driverName || 'Max Verstappen');
      formData.append('driverId', options.driverId || 'VER-01');
      formData.append('car', options.car || 'Car #1');
      formData.append('lap', options.lap || '18');

      // Upload progress listener
      const onProgress = (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
          if (percent >= 100) {
            setAnalysisStep('transcribing');
          }
        }
      };

      // Slight step delay for smooth visual feedback
      setTimeout(() => {
        if (analysisStep === 'transcribing') {
          setAnalysisStep('analyzing');
        }
      }, 500);

      const response = await radioApi.analyzeAudio(formData, onProgress);

      if (response.success && response.data) {
        const record = response.data;
        setCurrentAnalysis(record);
        setHistory((prev) => [record, ...prev.filter((h) => h.id !== record.id)]);
        setAnalysisStep('completed');
        return { success: true, data: record };
      }

      throw new Error(response.message || 'Radio analysis failed');
    } catch (err) {
      const message = err.message || 'Failed to analyze radio audio file';
      setError(message);
      setAnalysisStep('error');
      return { success: false, error: message };
    } finally {
      setIsAnalyzing(false);
    }
  }, [analysisStep]);

  /**
   * One-click simulation preset analysis
   */
  const analyzePreset = useCallback(async (presetPayload) => {
    setIsAnalyzing(true);
    setUploadProgress(100);
    setAnalysisStep('transcribing');
    setError(null);

    try {
      setTimeout(() => setAnalysisStep('analyzing'), 350);

      const response = await radioApi.analyzeAudio({
        sampleHint: presetPayload.sampleHint || presetPayload.title,
        driverName: presetPayload.driver || 'Max Verstappen',
        driverId: presetPayload.driverId || 'VER-01',
        car: presetPayload.car || 'Car #1',
        lap: presetPayload.lap || 18,
      });

      if (response.success && response.data) {
        const record = response.data;
        setCurrentAnalysis(record);
        setHistory((prev) => [record, ...prev.filter((h) => h.id !== record.id)]);
        setAnalysisStep('completed');
        return { success: true, data: record };
      }

      throw new Error(response.message || 'Preset analysis failed');
    } catch (err) {
      const message = err.message || 'Failed to analyze preset';
      setError(message);
      setAnalysisStep('error');
      return { success: false, error: message };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetAnalysisState = useCallback(() => {
    setAnalysisStep('idle');
    setUploadProgress(0);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <RadioContext.Provider
      value={{
        currentAnalysis,
        history,
        isAnalyzing,
        uploadProgress,
        analysisStep,
        error,
        analyzeFile,
        analyzePreset,
        resetAnalysisState,
        setCurrentAnalysis,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};

export default RadioContext;
