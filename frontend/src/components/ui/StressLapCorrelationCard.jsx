import React from 'react';
import {
  Activity,
  TrendingDown,
  Gauge,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import StatusBadge from './StatusBadge';

/**
 * StressLapCorrelationCard Component
 * Implements GRAND PRIX Problem Statement Hero Summary Card:
 * - One-sentence engineering insight
 * - Correlation Level (High / Medium / Low)
 * - Performance Degradation (+1.58 s/lap)
 * - Percentage Pace Loss (+1.76%)
 * - Before Stress vs After Stress Lap Pace Readouts
 * - Confidence Score
 */
export const StressLapCorrelationCard = ({ correlation, currentAnalysis, lapStats }) => {
  const corr = correlation || {};
  const correlationLevel = corr.correlationLevel || 'High';
  const degradationStr = corr.performanceDegradationStr || '+1.58 s/lap';
  const paceLossStr = corr.paceLossPercentageStr || '+1.76%';
  const insight = corr.engineeringInsight || 'Driver stress increased at Lap 18 and lap performance worsened by 1.58 seconds per lap (+1.76% pace loss) afterward.';
  const beforePace = corr.avgBeforeStressTime || '1:29.540';
  const afterPace = corr.avgAfterStressTime || '1:31.120';
  const confidence = corr.confidence || currentAnalysis?.confidence || 94.2;
  const stressLap = corr.stressLap || 18;

  const isHigh = correlationLevel === 'High';
  const isMed = correlationLevel === 'Medium';

  return (
    <div className="rounded-2xl border-2 border-zinc-950 dark:border-white bg-white dark:bg-[#0e0e11] p-5 sm:p-6 shadow-md space-y-4 card-hover-lift">
      
      {/* Header Strip with Correlation Level & Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
            isHigh
              ? 'bg-rose-500 text-white animate-pulse'
              : isMed
              ? 'bg-amber-500 text-white'
              : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
          }`}>
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                Stress ↔ Lap Performance Correlation
              </h3>
              <StatusBadge
                status={isHigh ? 'critical' : isMed ? 'warning' : 'nominal'}
                size="sm"
              >
                {correlationLevel} Correlation
              </StatusBadge>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Grand Prix Acoustic Biometric Telemetry Fusion Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" size="sm">
            AI Confidence: <strong className="font-mono">{confidence}%</strong>
          </Badge>
          <Badge variant="white" size="sm">
            Stress Incident: Lap {stressLap}
          </Badge>
        </div>
      </div>

      {/* One-Sentence Engineering Insight Quote */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500 block">
          Pit Wall Engineering Insight
        </span>
        <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 italic leading-relaxed">
          "{insight}"
        </p>
      </div>

      {/* 4 Metric Pill HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* 1. Performance Degradation */}
        <div className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-0.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
            Performance Degradation
          </span>
          <span className={`text-xl font-bold font-mono ${isHigh ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-950 dark:text-white'}`}>
            {degradationStr}
          </span>
          <span className="text-[10px] text-zinc-500 block">Post-stress delta</span>
        </div>

        {/* 2. Percentage Pace Loss */}
        <div className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-0.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
            Pace Loss %
          </span>
          <span className={`text-xl font-bold font-mono ${isHigh ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-950 dark:text-white'}`}>
            {paceLossStr}
          </span>
          <span className="text-[10px] text-zinc-500 block">Stint efficiency loss</span>
        </div>

        {/* 3. Before Stress Pace */}
        <div className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-0.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
            Avg Before Stress
          </span>
          <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {beforePace}
          </span>
          <span className="text-[10px] text-emerald-500 font-medium block">Nominal Stint Pace</span>
        </div>

        {/* 4. After Stress Pace */}
        <div className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-0.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
            Avg After Stress
          </span>
          <span className="text-xl font-bold font-mono text-rose-500">
            {afterPace}
          </span>
          <span className="text-[10px] text-rose-500/80 font-medium block">Degraded Stint Pace</span>
        </div>

      </div>

    </div>
  );
};

export default StressLapCorrelationCard;
