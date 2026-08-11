import React from 'react';
import { Check, Mic, FileSpreadsheet, Activity, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DemoFlowStepper Component
 * Guided 4-step progress indicator for live judge demonstrations:
 * Step 1: Upload Driver Radio Audio
 * Step 2: Upload Lap-Time CSV
 * Step 3: Run Analysis
 * Step 4: View Correlation Dashboard
 */
export const DemoFlowStepper = ({
  currentStep = 1, // 1 | 2 | 3 | 4
  hasAudio = false,
  hasCsv = false,
  isAnalyzing = false,
  onRunAnalysis,
}) => {
  const steps = [
    {
      id: 1,
      title: 'Upload Radio Audio',
      subtitle: hasAudio ? 'Audio Ingested (.wav)' : 'Cockpit Voice Recording',
      icon: Mic,
      isCompleted: hasAudio,
      isActive: currentStep === 1,
    },
    {
      id: 2,
      title: 'Upload Lap CSV',
      subtitle: hasCsv ? '18 Laps Telemetry Loaded' : 'lap,lap_time Data',
      icon: FileSpreadsheet,
      isCompleted: hasCsv,
      isActive: currentStep === 2,
    },
    {
      id: 3,
      title: 'Run AI Pipeline',
      subtitle: isAnalyzing ? 'Processing 6 Stages...' : 'STT + Emotion + Telemetry',
      icon: Activity,
      isCompleted: hasAudio && hasCsv && !isAnalyzing,
      isActive: currentStep === 3 || isAnalyzing,
    },
    {
      id: 4,
      title: 'Correlation Dashboard',
      subtitle: 'Judge Evaluation Console',
      icon: LayoutDashboard,
      isCompleted: hasAudio && hasCsv && !isAnalyzing,
      isActive: currentStep === 4,
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-[#0e0e11]/80 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block">
            Guided Grand Prix Demo Flow
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">
            4-Step Race Engineering Ingestion & Correlation Cycle
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasAudio && hasCsv && (
            <Link
              to="/dashboard"
              className="px-3 py-1 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1 shadow-xs"
            >
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* 4 Steps Grid with Connectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = step.isCompleted;
          const isCurrent = step.isActive;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 relative ${
                isCurrent
                  ? 'border-zinc-950 bg-zinc-50/90 dark:border-white dark:bg-zinc-900/80 shadow-xs'
                  : isDone
                  ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/30 opacity-75'
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 animate-pulse'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
              </div>

              {/* Step Label */}
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-zinc-950 dark:text-white block truncate">
                  {step.title}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DemoFlowStepper;
