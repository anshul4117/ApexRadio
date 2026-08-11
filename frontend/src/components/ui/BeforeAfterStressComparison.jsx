import React from 'react';
import { ArrowRight, TrendingDown, Clock, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import Badge from './Badge';
import StatusBadge from './StatusBadge';

/**
 * BeforeAfterStressComparison Component
 * Displays compact Before vs After Stress pace, mood, and degradation comparison HUD
 */
export const BeforeAfterStressComparison = ({ correlation, currentAnalysis }) => {
  const corr = correlation || {};
  const beforeTime = corr.avgBeforeStressTime || '1:29.813';
  const beforeSec = corr.avgBeforeStressSec || 89.81;
  const afterTime = corr.avgAfterStressTime || '1:31.240';
  const afterSec = corr.avgAfterStressSec || 91.24;
  const degradationStr = corr.performanceDegradationStr || '+1.43 s/lap';
  const paceLossStr = corr.paceLossPercentageStr || '+1.59%';
  const stressLap = corr.stressLap || 18;
  const correlationLevel = corr.correlationLevel || 'High';

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] p-4 sm:p-5 shadow-sm space-y-3.5 card-hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
              Before vs After Driver Stress Telemetry Comparison
            </h4>
            <p className="text-[10px] text-zinc-500 font-mono">
              Partition split at Lap {stressLap} (Acoustic Stress Event)
            </p>
          </div>
        </div>

        <StatusBadge
          status={correlationLevel === 'High' ? 'critical' : 'nominal'}
          size="sm"
        >
          {correlationLevel} Correlation
        </StatusBadge>
      </div>

      {/* Side-by-side Comparative Split with Directional Delta */}
      <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
        
        {/* BEFORE STRESS PANEL (5 cols) */}
        <div className="sm:col-span-5 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Before Stress (Laps 1–{stressLap - 1})
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
              Calm Baseline
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase text-zinc-400 font-semibold block">Avg Lap Time</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-white">
                {beforeTime}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-zinc-400 font-semibold block">Pace Delta</span>
              <span className="text-xs font-mono font-medium text-emerald-500">Nominal Stint</span>
            </div>
          </div>
        </div>

        {/* DIRECTIONAL DEGRADATION ARROW (1 col) */}
        <div className="sm:col-span-1 flex flex-col items-center justify-center text-center py-1">
          <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shadow-2xs animate-pulse">
            <ArrowRight className="w-4 h-4 hidden sm:block" />
            <TrendingDown className="w-4 h-4 sm:hidden" />
          </div>
          <span className="text-[9px] font-mono font-bold text-rose-500 mt-1 whitespace-nowrap hidden sm:block">
            {degradationStr}
          </span>
        </div>

        {/* AFTER STRESS PANEL (5 cols) */}
        <div className="sm:col-span-5 p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              After Stress (Lap {stressLap}+)
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/30">
              Stressed ({corr.stressScore || 78}%)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase text-rose-500/80 font-semibold block">Avg Lap Time</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {afterTime}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-rose-500/80 font-semibold block">Degradation</span>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                {degradationStr} ({paceLossStr})
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BeforeAfterStressComparison;
