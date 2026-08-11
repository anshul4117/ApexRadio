import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';

const SAMPLE_BARS = [
  24, 38, 45, 60, 75, 90, 84, 65, 45, 30, 48, 62, 85, 95, 78, 55, 40, 25, 35, 52,
  70, 88, 92, 68, 50, 38, 42, 60, 82, 94, 86, 64, 48, 32, 28, 44, 66, 80, 72, 50,
  35, 20, 28, 42, 58, 74, 88, 80, 62, 45, 30, 22, 38, 54, 70, 84, 90, 76, 52, 36,
];

export const AudioWaveformVisualizer = ({
  duration = '4.2s',
  isProcessing = false,
  stressLevel = 'high',
  onPlayToggle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const durationNum = parseFloat(duration) || 4.2;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (durationNum * 10));
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, durationNum]);

  const handleToggle = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (onPlayToggle) onPlayToggle(next);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const currentTime = ((progress / 100) * durationNum).toFixed(1);

  return (
    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
      {/* Waveform Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-950 dark:text-white">
            Team Radio Audio Stream
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {currentTime}s / {duration}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isProcessing
                ? 'bg-amber-400 animate-pulse'
                : isPlaying
                ? 'bg-rose-500 animate-ping'
                : 'bg-emerald-500'
            }`}
          />
          <span className="text-[10px] text-zinc-400 uppercase font-medium">
            {isProcessing ? 'Analyzing Stream' : isPlaying ? 'Transmitting' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Dynamic Animated Waveform Bars */}
      <div className="h-16 flex items-center justify-between gap-0.5 px-1 bg-white dark:bg-zinc-950 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
        {SAMPLE_BARS.map((height, i) => {
          const barProgress = (i / SAMPLE_BARS.length) * 100;
          const isPassed = barProgress <= progress;

          // Dynamic height modulation when playing
          const dynamicHeight = isPlaying
            ? Math.max(15, Math.min(100, height + (Math.sin(i + Date.now() / 150) * 25)))
            : isProcessing
            ? Math.max(20, (height * 0.7) + (Math.sin(i * 0.5) * 20))
            : height;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-center items-center h-full"
            >
              <div
                className={`w-full max-w-[4px] rounded-full transition-all duration-75 ${
                  isPassed
                    ? stressLevel === 'high'
                      ? 'bg-rose-500'
                      : 'bg-zinc-950 dark:bg-white'
                    : isProcessing
                    ? 'bg-zinc-300 dark:bg-zinc-700 animate-pulse'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
                style={{ height: `${dynamicHeight}%` }}
              />
            </div>
          );
        })}

        {/* Scrubber indicator line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-sm transition-all duration-75 pointer-events-none"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className="px-3 py-1 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Radio'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer"
            title="Reset Audio Playhead"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <div className="text-[11px] text-zinc-400">
          Acoustic Bandwidth: <strong>8.0 kHz</strong> · Mono 16-bit
        </div>
      </div>
    </div>
  );
};

export default AudioWaveformVisualizer;
