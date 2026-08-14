import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  Square,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle2,
  Radio,
  Sliders,
  Trash2,
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import StatusBadge from './StatusBadge';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

/**
 * LiveRadioRecorder Component
 * Allows race engineers and judges to record live voice directly from their microphone,
 * inspect real-time acoustic waveform, preview audio, and dispatch to Groq Whisper STT.
 */
export const LiveRadioRecorder = ({ onAnalyzeRecording, isAnalyzing = false }) => {
  const {
    recordingState,
    duration,
    audioBlob,
    audioUrl,
    audioFile,
    micPermission,
    error: recorderError,
    analyserNode,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    discardRecording,
  } = useAudioRecorder();

  const canvasRef = useRef(null);
  const audioPreviewRef = useRef(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [localError, setLocalError] = useState(null);

  // Real-time Canvas Waveform Animation using AnalyserNode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      if (recordingState === 'recording' && analyserNode) {
        analyserNode.getByteFrequencyData(dataArray);

        // Draw dynamic live frequency bars
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * (height * 0.85);

          // Dynamic gradient from dark to red accent
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0.95)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight - 4, Math.max(2, barWidth - 1), barHeight + 4);

          x += barWidth + 1;
          if (x > width) break;
        }
      } else if (recordingState === 'paused') {
        // Flatline amber bars for paused state
        ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
        for (let i = 0; i < width; i += 6) {
          ctx.fillRect(i, height / 2 - 2, 4, 4);
        }
      } else {
        // Idle gentle background gridline
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [recordingState, analyserNode]);

  // Audio Preview Player Handlers
  const togglePreviewPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
    } else {
      audioPreviewRef.current.play();
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioPreviewRef.current) {
      setPreviewTime(audioPreviewRef.current.currentTime);
      setPreviewDuration(audioPreviewRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingPreview(false);
    setPreviewTime(0);
  };

  // Dispatch to Analysis Pipeline
  const handleAnalyze = () => {
    setLocalError(null);
    if (!audioFile && !audioBlob) {
      setLocalError('Please record audio before analyzing.');
      return;
    }

    if (duration < 0.6) {
      setLocalError('Recording is too short (<1s). Please speak a complete radio message.');
      return;
    }

    if (onAnalyzeRecording) {
      onAnalyzeRecording(audioFile || audioBlob);
    }
  };

  // Format Seconds to MM:SS.S
  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const isLive = recordingState === 'recording';
  const isPaused = recordingState === 'paused';
  const isStopped = recordingState === 'stopped';
  const isIdle = recordingState === 'idle';

  return (
    <Card
      title="Live Radio Voice Recorder"
      subtitle="Speak directly into microphone for instant Hugging Face Whisper STT & emotion analysis"
      action={
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center gap-1 animate-pulse shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              REC LIVE
            </span>
          ) : isPaused ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold">
              PAUSED
            </span>
          ) : (
            <Badge variant="outline" size="sm">
              Channel 1 (Mic)
            </Badge>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        
        {/* Error Alert */}
        {(recorderError || localError) && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block">Microphone Notice</span>
              <p className="text-[11px] leading-relaxed">{recorderError || localError}</p>
            </div>
          </div>
        )}

        {/* Real-Time Waveform Display & Live Timer Canvas HUD */}
        <div className="p-4 rounded-xl bg-zinc-950 text-white dark:bg-[#070709] border border-zinc-800 space-y-3 relative overflow-hidden shadow-inner">
          
          {/* Top HUD Metadata Strip */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-rose-500 animate-ping' : isPaused ? 'bg-amber-400' : 'bg-zinc-600'}`} />
              <span className="text-zinc-300 font-bold tracking-wider text-[11px]">
                {isLive ? 'MIC ACTIVE · 44.1 kHz PCM' : isPaused ? 'TRANSMISSION PAUSED' : isStopped ? 'RECORDING READY' : 'MIC READY FOR TRANSMISSION'}
              </span>
            </div>

            <span className={`text-sm font-bold font-mono ${isLive ? 'text-rose-400 animate-pulse' : 'text-zinc-400'}`}>
              {formatTimer(duration)}
            </span>
          </div>

          {/* Canvas Waveform Box */}
          <div className="h-16 w-full rounded-lg bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-center relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={380}
              height={64}
              className="w-full h-full block"
            />
            {isIdle && (
              <span className="absolute text-[11px] text-zinc-500 font-mono tracking-tight select-none">
                Click "Start Live Transmission" to speak
              </span>
            )}
          </div>

          {/* Bottom HUD Strip */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/60">
            <span>Encoding: <strong className="text-zinc-300">16-Bit WAV (RIFF PCM)</strong></span>
            <span>Target: <strong className="text-zinc-300">Hugging Face Whisper (Large v3)</strong></span>
          </div>
        </div>

        {/* Audio Playback Verification Preview (When Recording Stopped) */}
        {isStopped && audioUrl && (
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2 animate-in fade-in">
            <audio
              ref={audioPreviewRef}
              src={audioUrl}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={handleAudioEnded}
              onPlay={() => setIsPlayingPreview(true)}
              onPause={() => setIsPlayingPreview(false)}
              className="hidden"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                Recorded Audio Playback Preview
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">
                {formatTimer(previewTime)} / {formatTimer(duration)}
              </span>
            </div>

            {/* Scrub Progress Bar */}
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${duration > 0 ? (previewTime / duration) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={togglePreviewPlay}
                className="gap-1.5 min-h-[34px]"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Preview
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Play Recorded Audio
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={discardRecording}
                className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Discard recording"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discard</span>
              </button>
            </div>
          </div>
        )}

        {/* Recording Controls Action Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isIdle && (
            <Button
              variant="primary"
              size="md"
              onClick={startRecording}
              disabled={isAnalyzing}
              className="w-full justify-center gap-2 shadow-sm min-h-[42px] bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              <Mic className="w-4 h-4" />
              <span>Start Live Recording (Driver Radio)</span>
            </Button>
          )}

          {isLive && (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={stopRecording}
                className="flex-1 justify-center gap-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 min-h-[42px]"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Recording</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={pauseRecording}
                className="gap-1.5 min-h-[42px] px-4"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={resumeRecording}
                className="flex-1 justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white min-h-[42px]"
              >
                <Mic className="w-4 h-4" />
                <span>Resume</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={stopRecording}
                className="gap-1.5 min-h-[42px]"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={discardRecording}
                className="gap-1.5 min-h-[42px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Discard</span>
              </Button>
            </>
          )}

          {isStopped && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <Button
                variant="primary"
                size="md"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 justify-center gap-2 min-h-[42px] font-bold shadow-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
              >
                <Zap className="w-4 h-4 text-rose-500 fill-current" />
                <span>⚡ Analyze Live Voice Recording</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={startRecording}
                disabled={isAnalyzing}
                className="gap-1.5 min-h-[42px]"
              >
                <RotateCcw className="w-4 h-4 text-zinc-500" />
                <span>Record Again</span>
              </Button>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
};

export default LiveRadioRecorder;
