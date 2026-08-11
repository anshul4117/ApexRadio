import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { radioApi } from '../services/api';
import { useLap } from './LapContext';
import { useAlerts } from './AlertsContext';
import { useDemo } from './DemoContext';

const RadioContext = createContext();

const DEFAULT_ANALYSIS = {
  id: 'default_tx_01',
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
  const { correlateWithEmotion } = useLap();
  const { addAlert } = useAlerts();
  const { showToast } = useDemo();

  const [currentAnalysis, setCurrentAnalysis] = useState(DEFAULT_ANALYSIS);
  const [history, setHistory] = useState([DEFAULT_ANALYSIS]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('idle'); // 'idle' | 'uploading' | 'transcribing' | 'analyzing' | 'correlating' | 'completed' | 'error'
  const [error, setError] = useState(null);

  // Audio Playback Verification states
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(null);
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);
  const previousUrlRef = useRef(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

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
   * Internal helper to dispatch full dashboard state updates when analysis completes
   */
  const handleAnalysisCompleted = useCallback(
    (record) => {
      setCurrentAnalysis(record);
      setHistory((prev) => [record, ...prev.filter((h) => h.id !== record.id)]);

      // 1. Recalculate Telemetry Correlation and Risk Score in real time
      if (correlateWithEmotion) {
        correlateWithEmotion(record.emotion);
      }

      // 2. Generate dynamic alert in AlertsContext if stress is elevated
      const stress = Number(record.emotion?.stressScore || 0);
      const isStressed = record.emotion?.driverState === 'Stressed' || stress >= 60;
      const isFatigued = record.emotion?.driverState === 'Fatigued';

      if (isStressed || isFatigued) {
        addAlert({
          title: isStressed ? 'Driver Stress Surge' : 'Driver Fatigue Detected',
          severity: stress >= 75 ? 'critical' : 'high',
          severityKey: stress >= 75 ? 'critical' : 'high',
          driver: `${record.driver} (${record.car || 'Car #1'})`,
          driverState: record.emotion.driverState,
          lap: record.lap || 18,
          confidence: record.confidence || 94.2,
          recommendedAction: record.recommendation?.action || 'Enforce radio brevity and prepare pit entry.',
          whyGenerated: `Voice pitch jitter recorded at ${record.emotion?.pitchJitter || '+42.5 Hz'} with speech cadence ${record.emotion?.speechCadence || '185 WPM'}. Transcribed: "${record.transcript}"`,
          category: isStressed ? 'Acoustic Stress Spike' : 'Fatigue Telemetry',
          stressScore: stress,
        });

        showToast(
          isStressed ? '🚨 Critical Driver Stress Detected' : '⚠️ Tactical Driver Alert',
          `${record.driver}: "${record.transcript.slice(0, 48)}..." (Stress: ${stress}%)`,
          isStressed ? 'error' : 'info'
        );
      } else {
        showToast(
          '✅ Radio Transmission Analyzed',
          `${record.driver}: "${record.transcript.slice(0, 48)}..." (State: Calm)`,
          'success'
        );
      }
    },
    [correlateWithEmotion, addAlert, showToast]
  );

  /**
   * Analyze an uploaded audio file (WAV or MP3)
   */
  const analyzeFile = useCallback(
    async (file, options = {}) => {
      setIsAnalyzing(true);
      setUploadProgress(0);
      setAnalysisStep('uploading');
      setError(null);

      // Create persistent Object URL for browser audio playback
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      const audioUrl = URL.createObjectURL(file);
      previousUrlRef.current = audioUrl;
      setUploadedAudioUrl(audioUrl);
      setUploadedAudioFile(file);

      try {
        const formData = new FormData();
        formData.append('audio', file);
        formData.append('driverName', options.driverName || 'Max Verstappen');
        formData.append('driverId', options.driverId || 'VER-01');
        formData.append('car', options.car || 'Car #1');
        formData.append('lap', options.lap || '18');

        // Multi-stage visual feedback timer
        const onProgress = (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
            if (percent >= 100) {
              setAnalysisStep('transcribing');
            }
          }
        };

        // Simulate seamless pipeline progression
        setTimeout(() => {
          setAnalysisStep((prev) => (prev === 'transcribing' ? 'analyzing' : prev));
        }, 350);

        setTimeout(() => {
          setAnalysisStep((prev) => (prev === 'analyzing' ? 'correlating' : prev));
        }, 700);

        const response = await radioApi.analyzeAudio(formData, onProgress);

        if (response.success && response.data) {
          const record = response.data;
          handleAnalysisCompleted(record);
          setAnalysisStep('completed');
          return { success: true, data: record };
        }

        throw new Error(response.message || 'Radio analysis failed');
      } catch (err) {
        const message = err.message || 'Failed to analyze radio audio file';
        setError(message);
        setAnalysisStep('error');
        showToast('Analysis Error', message, 'error');
        return { success: false, error: message };
      } finally {
        setIsAnalyzing(false);
      }
    },
    [handleAnalysisCompleted, showToast]
  );

  /**
   * One-click simulation preset analysis
   */
  const analyzePreset = useCallback(
    async (presetPayload) => {
      setIsAnalyzing(true);
      setUploadProgress(100);
      setAnalysisStep('transcribing');
      setError(null);

      // Preset mode has no raw audio file uploaded directly
      setUploadedAudioFile(null);

      try {
        setTimeout(() => setAnalysisStep('analyzing'), 250);
        setTimeout(() => setAnalysisStep('correlating'), 500);

        const response = await radioApi.analyzeAudio({
          sampleHint: presetPayload.sampleHint || presetPayload.title,
          driverName: presetPayload.driver || 'Max Verstappen',
          driverId: presetPayload.driverId || 'VER-01',
          car: presetPayload.car || 'Car #1',
          lap: presetPayload.lap || 18,
        });

        if (response.success && response.data) {
          const record = response.data;
          handleAnalysisCompleted(record);
          setAnalysisStep('completed');
          return { success: true, data: record };
        }

        throw new Error(response.message || 'Preset analysis failed');
      } catch (err) {
        const message = err.message || 'Failed to analyze radio preset';
        setError(message);
        setAnalysisStep('error');
        showToast('Analysis Error', message, 'error');
        return { success: false, error: message };
      } finally {
        setIsAnalyzing(false);
      }
    },
    [handleAnalysisCompleted, showToast]
  );

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
        uploadedAudioUrl,
        uploadedAudioFile,
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
