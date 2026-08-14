import React from 'react';
import { Radio, FileSpreadsheet, Sparkles, ArrowRight, Zap, Play } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

/**
 * EngineeringEmptyState Component
 * Minimalist Formula engineering wireframe illustration & guidance for judge evaluation
 */
export const EngineeringEmptyState = ({ on1ClickDemo, onSelectAudioPreset, onLoadCsvPreset }) => {
  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] p-6 sm:p-8 text-center shadow-sm space-y-6 card-hover-lift">
      
      {/* Formula 1 Technical Telemetry Illustration */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-ping opacity-25" />
        <div className="relative w-20 h-20 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-xl border-2 border-zinc-800 dark:border-zinc-200">
          <Radio className="w-9 h-9" />
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-1.5 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Grand Prix Race Session Inputs Required
        </div>
        <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
          Feed Cockpit Radio & CAN Bus Lap Telemetry
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          ApexRadio AI correlates high-frequency voice biometrics with lap-time degradation to detect whether driver cognitive stress is hurting on-track performance.
        </p>
      </div>

      {/* 2 Required Inputs Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs">
        
        {/* Input 1: Cockpit Voice */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">1</span>
            <span className="font-bold text-zinc-950 dark:text-white">Cockpit Radio Audio</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            WAV or MP3 driver radio recording for Hugging Face Whisper transcription & pitch jitter extraction.
          </p>
        </div>

        {/* Input 2: Lap Time CSV */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">2</span>
            <span className="font-bold text-zinc-950 dark:text-white">Lap Timing CSV</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Timing dataset with columns <code>lap,lap_time</code> for pre/post-stress correlation.
          </p>
        </div>

      </div>

      {/* 1-Click Judge Demo CTA */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={on1ClickDemo}
          className="gap-2 shadow-md hover:scale-[1.02] transition-transform"
        >
          <Play className="w-4 h-4 fill-current text-white" />
          <span>⚡ Run 1-Click Judge Demo (Grand Prix Scenario)</span>
        </Button>
      </div>

    </div>
  );
};

export default EngineeringEmptyState;
