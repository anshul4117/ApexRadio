import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Zap,
  Volume2,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Gauge,
  AlertCircle,
  Flag,
  Flame,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Play,
  ArrowRight,
  Radio,
  Heart,
  Mic,
  FileSpreadsheet,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import ExplainabilityPanel from '../components/ui/ExplainabilityPanel';
import StressLapCorrelationCard from '../components/ui/StressLapCorrelationCard';
import HeroCorrelationChart from '../components/ui/HeroCorrelationChart';
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';
import { useAlerts } from '../context/AlertsContext';
import { useDemo } from '../context/DemoContext';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/SkeletonLoader';

export const DashboardPage = () => {
  const { currentAnalysis, history, isAnalyzing } = useRadio();
  const { lapStats, correlation, refreshSession, lapsLoaded, currentLap, currentSession } = useLap();
  const { activeAlertsCount } = useAlerts();
  const { isDemoMode, isLiveDemoRunning, startLiveDemo, stopLiveDemo } = useDemo();
  const [isAcked, setIsAcked] = useState(false);

  const activeDriverName = currentAnalysis?.driver || currentSession?.driverName || 'Max Verstappen';
  const activeCurrentLap = currentLap || currentSession?.currentLap || 18;
  const activeTotalLaps = lapsLoaded || currentSession?.totalLaps || 18;

  const emotion = currentAnalysis?.emotion || {
    driverState: 'Stressed',
    stressScore: 78,
    emotionLabel: 'Frustrated',
    pitchJitter: '+42.5 Hz',
    speechCadence: '185 WPM',
  };

  const isElevated = emotion.driverState === 'Stressed' || (emotion.stressScore || 0) >= 75;
  const isFatigued = emotion.driverState === 'Fatigued';

  const rawRiskScore = correlation?.riskScore || (isElevated ? 61 : isFatigued ? 48 : 22);
  const rawStressScore = emotion.stressScore || 78;

  // Animated numbers
  const animatedRiskScore = useAnimatedNumber(rawRiskScore, 900);
  const animatedStressScore = useAnimatedNumber(rawStressScore, 900);

  const riskTier = correlation?.riskTier || (isElevated ? 'High' : isFatigued ? 'Medium' : 'Nominal');
  const estimatedHR = isElevated ? 168 : isFatigued ? 152 : 135;

  // Session Health status
  const sessionHealth = isElevated ? 'Degraded (Stress High)' : isFatigued ? 'Fatigue Alert' : 'Nominal (Pace Stable)';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Pit Wall Telemetry Top Control Header */}
      <SectionHeader
        title="Live Race Engineering Console"
        subtitle="Grand Prix Telemetry Fusion: Stress ↔ Lap Performance Correlation, Voice Biometrics, CAN Bus Telemetry & Strategy Directives"
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={isElevated ? 'critical' : isFatigued ? 'fatigued' : 'nominal'} size="sm" dot>
              {isElevated ? 'High Acoustic Stress' : isFatigued ? 'Fatigue Detected' : 'Nominal Baseline'}
            </StatusBadge>
            <span className="text-zinc-400 dark:text-zinc-600 hidden sm:inline">|</span>
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              Silverstone GP · Lap {activeCurrentLap}/{activeTotalLaps} ({activeDriverName})
            </span>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isLiveDemoRunning ? 'danger' : 'primary'}
              size="sm"
              onClick={isLiveDemoRunning ? stopLiveDemo : startLiveDemo}
              className="gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isLiveDemoRunning ? 'Stop Live Demo' : 'Run 60s Live Race Demo'}</span>
              <span className="sm:hidden">{isLiveDemoRunning ? 'Stop Demo' : '60s Demo'}</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={refreshSession} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Re-sync</span>
            </Button>
          </div>
        }
      />

      {/* 1. GRAND PRIX CORE DELIVERABLE: STRESS ↔ LAP PERFORMANCE CORRELATION SUMMARY */}
      <StressLapCorrelationCard
        correlation={correlation}
        currentAnalysis={currentAnalysis}
        lapStats={lapStats}
      />

      {/* 2. PRIMARY HERO METRIC CARDS (Biometrics & Performance Risk Score) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* HERO CARD 1: Driver Biometric Status */}
        <div className="rounded-2xl border-2 border-zinc-900/10 dark:border-zinc-100/15 bg-gradient-to-b from-zinc-50/80 to-white dark:from-zinc-900/60 dark:to-[#0e0e11] p-5 shadow-sm space-y-4 relative overflow-hidden card-hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                #1
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                  Driver Biometric Status
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono">{activeDriverName} · Car #1</p>
              </div>
            </div>

            <StatusBadge
              status={isElevated ? 'critical' : isFatigued ? 'fatigued' : 'nominal'}
              size="sm"
            >
              {emotion.driverState || 'Calm'}
            </StatusBadge>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Cognitive Stress Index
                </span>
                <span className={`text-4xl font-bold font-tabular tracking-tight transition-colors duration-500 ${
                  isElevated ? 'text-rose-600 dark:text-rose-400' : isFatigued ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-950 dark:text-white'
                }`}>
                  {animatedStressScore}<span className="text-base font-normal text-zinc-400">/100</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-zinc-400 block font-mono">Heart Rate Est.</span>
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 font-tabular flex items-center justify-end gap-1">
                  <Heart className={`w-3.5 h-3.5 ${isElevated ? 'text-rose-500 animate-ping' : 'text-zinc-400'}`} />
                  {estimatedHR} BPM
                </span>
              </div>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isElevated ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : isFatigued ? 'bg-sky-500' : 'bg-zinc-900 dark:bg-zinc-100'
                }`}
                style={{ width: `${animatedStressScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 text-xs">
            <div className="p-2 rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Pitch Jitter</span>
              <span className={`font-semibold font-mono ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {emotion.pitchJitter || '+42.5 Hz'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Speech Cadence</span>
              <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                {emotion.speechCadence || '185 WPM'}
              </span>
            </div>
          </div>
        </div>

        {/* HERO CARD 2: Performance Risk Score */}
        <div className="rounded-2xl border-2 border-zinc-900/10 dark:border-zinc-100/15 bg-gradient-to-b from-zinc-50/80 to-white dark:from-zinc-900/60 dark:to-[#0e0e11] p-5 shadow-sm space-y-4 relative overflow-hidden card-hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                  Performance Risk Score
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono">Correlation & Pace Degradation</p>
              </div>
            </div>

            <StatusBadge
              status={rawRiskScore >= 60 ? 'critical' : rawRiskScore >= 40 ? 'fatigued' : 'nominal'}
              size="sm"
            >
              {riskTier} Risk
            </StatusBadge>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Aggregate Risk Index
                </span>
                <span className={`text-4xl font-bold font-tabular tracking-tight transition-colors duration-500 ${
                  rawRiskScore >= 60 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-950 dark:text-white'
                }`}>
                  {animatedRiskScore}<span className="text-base font-normal text-zinc-400">%</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-zinc-400 block font-mono">Performance Degradation</span>
                <span className="text-lg font-semibold text-rose-600 dark:text-rose-400 font-tabular font-mono">
                  {correlation?.performanceDegradationStr || '+1.58 s/lap'}
                </span>
              </div>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  rawRiskScore >= 60 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-zinc-900 dark:bg-zinc-100'
                }`}
                style={{ width: `${animatedRiskScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 text-xs">
            <div className="p-2 rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Session Health</span>
              <span className={`font-semibold truncate block ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {sessionHealth}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 space-y-0.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Pace Loss %</span>
              <span className="font-semibold font-mono text-rose-500">
                {correlation?.paceLossPercentageStr || '+1.76%'}
              </span>
            </div>
          </div>
        </div>

        {/* HERO CARD 3: Secondary Session Context Stats */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0e0e11] p-5 shadow-sm space-y-4 md:col-span-2 lg:col-span-1 card-hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                  Stint Pace Telemetry
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono">{activeTotalLaps} Laps · Soft Compound</p>
              </div>
            </div>

            <Badge variant="outline" size="sm">Stint 1</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Fastest Lap</span>
              <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                {lapStats?.fastestLap?.lapTime || '1:29.420'}
              </span>
              <span className="text-[10px] text-emerald-500 block font-medium">Purple Sector 1 & 3</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">Active Alerts</span>
              <span className="text-xl font-bold font-mono text-rose-500">
                {activeAlertsCount}
              </span>
              <Link to="/dashboard/alerts" className="text-[10px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline block">
                View alert queue →
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Lap Time Trend:</span>
            <strong className={`font-mono ${lapStats?.lapTrend === 'worsening' ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {lapStats?.lapTrend ? lapStats.lapTrend.toUpperCase() : 'WORSENING'}
            </strong>
          </div>
        </div>

      </div>

      {/* 3. AI STRATEGY DIRECTIVE BANNER (Derived from Correlation Result) */}
      <div className="rounded-2xl border-2 border-zinc-950 dark:border-white bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 dark:border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-rose-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 dark:text-rose-600 block">
                AI Tactical Directive ({correlation?.correlationLevel || 'High'} Correlation)
              </span>
              <h4 className="text-sm sm:text-base font-bold tracking-tight">
                {correlation?.recommendation?.category || 'Radio Brevity & Tire Strategy'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-zinc-300 dark:text-zinc-800 border border-zinc-800 dark:border-zinc-300">
              Target Pit: <strong className="text-white dark:text-black">{correlation?.recommendation?.pitWindow || 'Lap 21'}</strong>
            </div>

            <button
              type="button"
              onClick={() => setIsAcked(!isAcked)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isAcked
                  ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-700 border border-emerald-500/40'
                  : 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white hover:opacity-90'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isAcked ? 'Acknowledged' : 'Acknowledge'}
            </button>
          </div>
        </div>

        <p className="text-sm sm:text-base font-medium leading-relaxed italic opacity-95">
          "{correlation?.recommendation?.action || 'Driver stress is affecting pace. Consider reducing radio traffic and evaluating tire condition.'}"
        </p>

        <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 dark:text-zinc-600 pt-1">
          <span>Trigger: Driver stress spike at Lap {correlation?.stressLap || 18} &rarr; Performance Degradation {correlation?.performanceDegradationStr || '+1.58 s/lap'}</span>
          <Link to="/dashboard/radio" className="hover:underline flex items-center gap-1 text-white dark:text-zinc-950 font-medium">
            Review voice transmission <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. MAIN HERO CORRELATION CHART & DECISION METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: Hero Correlation Recharts Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <HeroCorrelationChart
            correlation={correlation}
            lapStats={lapStats}
          />
        </div>

        {/* Right 1-Col: Quick Correlation Decision Metrics Panel */}
        <div className="space-y-6">
          <Card
            title="Correlation Breakdown"
            subtitle="Grand Prix Decision Metrics"
            badge={<Badge variant="outline" size="sm">{correlation?.correlationLevel || 'High'}</Badge>}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Stress ↔ Pace Relationship
                </span>
                <span className="text-lg font-bold font-mono text-zinc-950 dark:text-white">
                  {correlation?.correlationLevel || 'High'} Correlation
                </span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Driver stress increase ({emotion?.pitchJitter || '+42.5 Hz'} jitter) directly matches pace drop of {correlation?.performanceDegradationStr || '+1.43 s/lap'}.
                </p>
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Pre-Stress Pace:</span>
                  <span className="font-mono font-medium text-emerald-500">{correlation?.avgBeforeStressTime || '1:29.813'}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Post-Stress Pace:</span>
                  <span className="font-mono font-medium text-rose-500">{correlation?.avgAfterStressTime || '1:31.240'}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Pace Loss %:</span>
                  <span className="font-mono font-medium text-rose-500">{correlation?.paceLossPercentageStr || '+1.59%'}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* 5. LIVE RADIO TRANSMISSIONS FEED */}
      <Card
        title="Cockpit Voice Transmissions"
        subtitle="Real-time radio transcription powered by Groq Whisper Large v3"
        action={<Badge variant="neutral" size="sm">Channel 1 Live</Badge>}
        footer={
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{history.length} transmission(s) analyzed in current session</span>
            <Link to="/dashboard/radio" className="text-zinc-900 dark:text-zinc-100 hover:underline font-medium">
              Open Voice Analyzer →
            </Link>
          </div>
        }
      >
        <div className="space-y-3">
          {history.map((tx) => {
            const txElevated = tx.emotion?.driverState === 'Stressed' || (tx.emotion?.stressScore || 0) >= 75;
            const txFatigued = tx.emotion?.driverState === 'Fatigued';

            return (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all card-hover-lift"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-zinc-400" />
                    <span className="font-semibold text-xs text-zinc-950 dark:text-white">
                      {tx.driver} ({tx.car || 'Car #1'})
                    </span>
                    <Badge variant="outline" size="sm">Lap {tx.lap || activeCurrentLap}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs font-tabular font-mono">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                    <StatusBadge
                      status={txElevated ? 'critical' : txFatigued ? 'fatigued' : 'nominal'}
                      size="sm"
                    >
                      Stress {tx.emotion?.stressScore || 50}% · {tx.emotion?.driverState || 'Nominal'}
                    </StatusBadge>
                  </div>
                </div>

                <p className="text-zinc-800 dark:text-zinc-200 text-sm pl-3.5 border-l-2 border-zinc-900 dark:border-zinc-100 leading-relaxed italic">
                  "{tx.transcript}"
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40">
                  <span>Pitch: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{tx.emotion?.pitchJitter || '+12.0 Hz'}</strong></span>
                  <span>Cadence: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{tx.emotion?.speechCadence || '140 WPM'}</strong></span>
                  <span>Confidence: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{tx.confidence || 96.8}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 6. AI DECISION EXPLAINABILITY & ROOT CAUSE ATTRIBUTION (Full Width) */}
      <ExplainabilityPanel
        recommendation={correlation?.recommendation || currentAnalysis?.recommendation}
        emotion={emotion}
        lapStats={lapStats}
        correlation={correlation}
        transcript={currentAnalysis?.transcript}
      />

    </div>
  );
};

export default DashboardPage;
