import React from 'react';
import {
  Play,
  Pause,
  X,
  Radio,
  Sparkles,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';
import Badge from './Badge';
import StatusBadge from './StatusBadge';

const STAGES = [
  { id: 1, name: 'Listening', time: '0s - 10s', icon: Radio, desc: 'Ingesting cockpit radio stream' },
  { id: 2, name: 'Transcribing', time: '10s - 15s', icon: Activity, desc: 'Whisper STT speech transcription' },
  { id: 3, name: 'Understanding', time: '15s - 20s', icon: Sparkles, desc: 'Extracting vocal pitch jitter & emotion' },
  { id: 4, name: 'Correlating', time: '20s - 30s', icon: Layers, desc: 'Fusing biometrics with CAN bus telemetry' },
  { id: 5, name: 'Predicting', time: '30s - 50s', icon: TrendingDown, desc: 'Calculating Performance Risk Score' },
  { id: 6, name: 'Recommending', time: '50s - 60s', icon: Zap, desc: 'Issuing tactical pit wall directive' },
];

export const LiveDemoOverlay = ({
  isRunning = false,
  seconds = 0,
  stageIndex = 1,
  isPaused = false,
  onPauseToggle,
  onStop,
}) => {
  if (!isRunning) return null;

  const currentStage = STAGES[Math.min(stageIndex - 1, STAGES.length - 1)] || STAGES[0];
  const progressPercent = Math.min(100, Math.round((seconds / 60) * 100));

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 rounded-xl bg-zinc-950/95 text-white dark:bg-zinc-900/95 border border-zinc-700/80 shadow-2xl backdrop-blur-md space-y-3">
        
        {/* Top Row: Title, Stage Badge, Timer, Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              Live Race Demo Presentation
            </span>
            <Badge variant="white" size="sm">
              Stage {stageIndex}/6: {currentStage.name}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-zinc-300 font-semibold font-tabular">
              {formatTime(seconds)} / 01:00
            </span>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={onPauseToggle}
              className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
              title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>

            {/* Close / Stop Button */}
            <button
              type="button"
              onClick={onStop}
              className="p-1.5 rounded-md bg-zinc-800 hover:bg-rose-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Stop Live Demo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 6-Stage Progress Stepper Bar */}
        <div className="grid grid-cols-6 gap-1.5 text-[10px]">
          {STAGES.map((stg) => {
            const isActive = stg.id === stageIndex;
            const isCompleted = stg.id < stageIndex;
            const Icon = stg.icon;

            return (
              <div
                key={stg.id}
                className={`p-1.5 rounded text-center transition-all flex flex-col items-center gap-1 ${
                  isActive
                    ? 'bg-rose-600 text-white font-semibold shadow-xs ring-1 ring-rose-400'
                    : isCompleted
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-zinc-900 text-zinc-500 opacity-60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="truncate w-full">{stg.name}</span>
              </div>
            );
          })}
        </div>

        {/* Sub-label description of current activity */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5 border-t border-zinc-800">
          <span>
            Active Process: <strong className="text-white">{currentStage.desc}</strong>
          </span>
          <span className="text-zinc-500">Autonomous 60s Orchestrator</span>
        </div>

        {/* Overall Linear Progress Bar */}
        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

      </div>
    </div>
  );
};

export default LiveDemoOverlay;
