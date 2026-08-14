import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Encodes Float32 PCM channel buffers into a standard 16-bit PCM WAV Blob
 */
function encodeWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = audioBuffer.length;
  const bufferLength = 44 + length * blockAlign;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Helper to write ASCII strings
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  /* RIFF identifier */
  writeString(0, 'RIFF');
  /* file length minus RIFF header */
  view.setUint32(4, 36 + length * blockAlign, true);
  /* RIFF type */
  writeString(8, 'WAVE');
  /* format chunk identifier */
  writeString(12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channels * bytes/sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(36, 'data');
  /* data chunk length */
  view.setUint32(40, length * blockAlign, true);

  // Interleave channels & write 16-bit PCM samples
  const channels = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(audioBuffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Clamp between -1.0 and 1.0
      sample = Math.max(-1, Math.min(1, sample));
      // Convert float32 [-1, 1] to signed int16 [-32768, 32767]
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * useAudioRecorder Hook
 * Full-featured browser microphone recorder with real-time AnalyserNode and WAV encoding
 */
export function useAudioRecorder() {
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'paused' | 'stopped'
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [error, setError] = useState(null);

  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const previousUrlRef = useRef(null);

  // Clean up object URLs and audio contexts
  const cleanup = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [cleanup]);

  /**
   * Start Live Recording
   */
  const startRecording = useCallback(async () => {
    setError(null);
    cleanup();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errMsg = 'Microphone access is not supported in this browser. Please use a modern browser like Chrome, Firefox, Safari, or Edge.';
      setError(errMsg);
      setMicPermission('denied');
      return false;
    }

    try {
      // 1. Request microphone stream with voice enhancements
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      mediaStreamRef.current = stream;
      setMicPermission('granted');

      // 2. Setup Web Audio API Context & AnalyserNode for live visualization
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      // 3. Setup MediaRecorder with best supported MIME type
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus' };
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      }

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const rawBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });

        try {
          // Decode raw audio and encode to clean 16-bit PCM WAV
          const arrayBuffer = await rawBlob.arrayBuffer();
          const decodeCtx = new (window.AudioContext || window.webkitAudioContext)();
          const decodedBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
          const wavBlob = encodeWav(decodedBuffer);
          decodeCtx.close();

          const timestamp = Date.now();
          const file = new File([wavBlob], `driver_radio_recording_${timestamp}.wav`, {
            type: 'audio/wav',
            lastModified: timestamp,
          });

          const url = URL.createObjectURL(wavBlob);
          if (previousUrlRef.current) URL.revokeObjectURL(previousUrlRef.current);
          previousUrlRef.current = url;

          setAudioBlob(wavBlob);
          setAudioUrl(url);
          setAudioFile(file);
        } catch (wavErr) {
          console.warn('WAV conversion fallback using raw Blob:', wavErr);
          // Fallback: use raw blob directly
          const ext = rawBlob.type.includes('mp4') ? 'm4a' : 'webm';
          const file = new File([rawBlob], `driver_radio_recording_${Date.now()}.${ext}`, {
            type: rawBlob.type,
          });
          const url = URL.createObjectURL(rawBlob);
          setAudioBlob(rawBlob);
          setAudioUrl(url);
          setAudioFile(file);
        }

        setRecordingState('stopped');
      };

      mediaRecorder.start(100); // 100ms slices for smooth streaming
      setRecordingState('recording');
      setDuration(0);

      // 4. Start timer
      const startTime = Date.now();
      timerIntervalRef.current = setInterval(() => {
        setDuration(Math.round((Date.now() - startTime) / 100) / 10);
      }, 100);

      return true;
    } catch (err) {
      console.error('Error starting audio recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission was denied. Please allow microphone access in your browser settings to record driver radio.');
        setMicPermission('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone device found on this system.');
      } else {
        setError(`Microphone error: ${err.message || 'Could not access audio device.'}`);
      }
      setRecordingState('idle');
      return false;
    }
  }, [cleanup]);

  /**
   * Pause Live Recording
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setRecordingState('paused');
    }
  }, [recordingState]);

  /**
   * Resume Paused Recording
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      const resumeStart = Date.now() - duration * 1000;
      timerIntervalRef.current = setInterval(() => {
        setDuration(Math.round((Date.now() - resumeStart) / 100) / 10);
      }, 100);
      setRecordingState('recording');
    }
  }, [recordingState, duration]);

  /**
   * Stop Live Recording
   */
  const stopRecording = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  /**
   * Discard Current Recording and Reset State
   */
  const discardRecording = useCallback(() => {
    cleanup();
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    setRecordingState('idle');
    setDuration(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioFile(null);
    setError(null);
  }, [cleanup]);

  return {
    recordingState,
    duration,
    audioBlob,
    audioUrl,
    audioFile,
    micPermission,
    error,
    analyserNode: analyserRef.current,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    discardRecording,
  };
}

export default useAudioRecorder;
