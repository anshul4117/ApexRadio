import React, { useState, useRef } from 'react';
import {
  Activity,
  UploadCloud,
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Flame,
  CheckCircle2,
  Filter,
  AlertCircle,
  Zap,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import ExplainabilityPanel from '../components/ui/ExplainabilityPanel';
import StressLapCorrelationCard from '../components/ui/StressLapCorrelationCard';
import HeroCorrelationChart from '../components/ui/HeroCorrelationChart';
import { useLap } from '../context/LapContext';
import { useRadio } from '../context/RadioContext';

// Helper to format seconds to M:SS.mmm in charts
const formatSec = (sec) => {
  if (!sec || isNaN(sec)) return '';
  const mins = Math.floor(sec / 60);
  const secs = (sec % 60).toFixed(2);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const LapPerformancePage = () => {
  const {
    lapStats,
    correlation,
    filename,
    isAnalyzing,
    uploadProgress,
    error: lapError,
    uploadCsv,
    loadSamplePreset,
    lapsLoaded,
    currentLap,
    driverName,
  } = useLap();

  const { currentAnalysis } = useRadio();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCsv(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadCsv(file);
    }
  };

  const fastestLap = lapStats?.fastestLap || { lap: 14, lapTime: '1:29.420', lapTimeSec: 89.42 };
  const slowestLap = lapStats?.slowestLap || { lap: 18, lapTime: '1:31.240', lapTimeSec: 91.24 };
  const laps = Array.isArray(lapStats?.laps) ? lapStats.laps : [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <SectionHeader
        title="Lap Telemetry & Pace Degradation Analysis"
        subtitle={`Grand Prix Stint Telemetry for ${driverName || 'Max Verstappen'} · Lap ${currentLap || 18} of ${lapsLoaded || 18}`}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={correlation?.correlationLevel === 'High' ? 'critical' : 'nominal'}>
              Correlation: {correlation?.correlationLevel || 'High'} ({correlation?.performanceDegradationStr || '+1.43 s/lap'})
            </StatusBadge>
            <Badge variant="outline" size="sm">
              {lapsLoaded || 18} Laps Ingested
            </Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-zinc-500" />
              Upload Telemetry CSV
            </Button>
            <Button variant="outline" size="sm" onClick={loadSamplePreset} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              Reset Silverstone Data
            </Button>
          </div>
        }
      />

      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, text/csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Alert */}
      {lapError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{lapError}</span>
        </div>
      )}

      {/* 1. HERO CORRELATION SUMMARY CARD */}
      <StressLapCorrelationCard
        correlation={correlation}
        currentAnalysis={currentAnalysis}
        lapStats={lapStats}
      />

      {/* 2. HERO CORRELATION CHART WITH MOOD MARKERS & VERTICAL STRESS EVENT LINE */}
      <HeroCorrelationChart
        correlation={correlation}
        lapStats={lapStats}
      />

      {/* 3. TOP 4 METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Fastest Lap */}
        <Card title="Fastest Stint Lap" subtitle="Purple Sector 1 & 3" badge={<Badge variant="white" size="sm">Lap {fastestLap.lap}</Badge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular font-mono">
              {fastestLap.lapTime}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Top Speed: <strong className="text-zinc-900 dark:text-zinc-100 font-tabular font-mono">328.9 km/h</strong></span>
              <span className="text-emerald-500 font-medium">Clear air</span>
            </div>
          </div>
        </Card>

        {/* Slowest Lap */}
        <Card title="Stint Degradation High" subtitle="Understeer incident" badge={<StatusBadge status="critical" size="sm">Lap {slowestLap.lap}</StatusBadge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular font-mono">
              {slowestLap.lapTime}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Delta vs Best:</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular font-mono">+1.820s (S2 Loss)</span>
            </div>
          </div>
        </Card>

        {/* Average Stint Pace */}
        <Card title="Average Stint Pace" subtitle={`${lapsLoaded || 18} Laps Completed`} badge={<Badge variant="outline" size="sm">Rolling Pace</Badge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular font-mono">
              {lapStats?.averageLapTime || '1:30.120'}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Standard Dev:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular font-mono">±0.48s</span>
            </div>
          </div>
        </Card>

        {/* Performance Degradation */}
        <Card title="Performance Degradation" subtitle="Post-stress dropoff" badge={<StatusBadge status="critical" size="sm">Pace Drop</StatusBadge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular font-mono">
              {correlation?.performanceDegradationStr || '+1.43 s/lap'}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Pace Loss %:</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular font-mono">{correlation?.paceLossPercentageStr || '+1.59%'}</span>
            </div>
          </div>
        </Card>

      </div>

      {/* 4. AI DECISION EXPLAINABILITY PANEL */}
      <ExplainabilityPanel
        recommendation={correlation?.recommendation || currentAnalysis?.recommendation}
        emotion={currentAnalysis?.emotion}
        lapStats={lapStats}
        correlation={correlation}
        transcript={currentAnalysis?.transcript}
      />

      {/* 5. SECTOR PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Sector 1 (Turns 1–5)" subtitle="High-speed complex">
          <div className="space-y-2 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular font-mono">
                {lapStats?.sectorAverages?.s1 || '28.180s'}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Optimal Pace</span>
            </div>
            <p className="text-zinc-500 text-[11px]">Braking stability nominal through Maggotts/Becketts.</p>
          </div>
        </Card>

        <Card title="Sector 2 (Turns 6–14)" subtitle="Heavy braking & traction">
          <div className="space-y-2 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular font-mono">
                {lapStats?.sectorAverages?.s2 || '34.720s'}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular font-mono">+0.51s degradation</span>
            </div>
            <p className="text-zinc-500 text-[11px]">Front left understeer in Turn 4 causing apex exit delay.</p>
          </div>
        </Card>

        <Card title="Sector 3 (Turns 15–18)" subtitle="Stowe to Club chicane">
          <div className="space-y-2 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular font-mono">
                {lapStats?.sectorAverages?.s3 || '27.180s'}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Stable</span>
            </div>
            <p className="text-zinc-500 text-[11px]">Brevity mode held comms into heavy deceleration.</p>
          </div>
        </Card>
      </div>

      {/* 6. LAP TELEMETRY TABLE */}
      <Card
        title="Lap By Lap Telemetry Logs"
        subtitle={`Session dataset: ${filename || 'silverstone_stint1_telemetry.csv'} · ${laps.length} Total Laps`}
        noPadding
        className="overflow-hidden"
      >
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 font-medium">
              <tr>
                <th className="px-5 py-3">Lap</th>
                <th className="px-5 py-3">Lap Time</th>
                <th className="px-5 py-3">Delta vs Best</th>
                <th className="px-5 py-3">Sector 1</th>
                <th className="px-5 py-3">Sector 2</th>
                <th className="px-5 py-3">Sector 3</th>
                <th className="px-5 py-3">Top Speed</th>
                <th className="px-5 py-3">Tire Deg</th>
                <th className="px-5 py-3">Event / Radio Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 font-tabular">
              {laps.map((lap) => {
                const isFastest = lap.lap === fastestLap.lap;
                const isStress = lap.lap === (correlation?.stressLap || 18);

                return (
                  <tr
                    key={lap.lap}
                    className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors ${
                      isStress ? 'bg-rose-50/30 dark:bg-rose-950/20 font-medium' : ''
                    }`}
                  >
                    <td className="px-5 py-3 font-semibold text-zinc-950 dark:text-white">
                      Lap {lap.lap}
                    </td>
                    <td className="px-5 py-3 font-mono font-medium">
                      <span className={isFastest ? 'text-emerald-500 font-bold' : isStress ? 'text-rose-500 font-bold' : ''}>
                        {lap.lapTime}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono">
                      {isFastest ? (
                        <span className="text-emerald-500 font-semibold">BEST</span>
                      ) : (
                        <span className="text-zinc-600 dark:text-zinc-400">+{lap.deltaVsFastest || '0.000'}s</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-zinc-500">{lap.s1 || '28.180'}s</td>
                    <td className="px-5 py-3 font-mono text-zinc-500">{lap.s2 || '34.720'}s</td>
                    <td className="px-5 py-3 font-mono text-zinc-500">{lap.s3 || '27.180'}s</td>
                    <td className="px-5 py-3 font-mono text-zinc-500">{lap.topSpeed || 320} km/h</td>
                    <td className="px-5 py-3 font-mono text-zinc-500">{lap.tireDeg || '30%'}</td>
                    <td className="px-5 py-3">
                      {isStress ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Stress Event (Audio Ingested)
                        </span>
                      ) : isFastest ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold w-fit">
                          Purple Stint Best
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default LapPerformancePage;
