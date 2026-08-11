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
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import ExplainabilityPanel from '../components/ui/ExplainabilityPanel';
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';
import { useAlerts } from '../context/AlertsContext';
import { useDemo } from '../context/DemoContext';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/SkeletonLoader';

const formatSec = (sec) => {
  if (!sec || isNaN(sec)) return '';
  const mins = Math.floor(sec / 60);
  const secs = (sec % 60).toFixed(2);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

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
  const chartData = lapStats?.chartData || [];

  // Session Health status
  const sessionHealth = isElevated ? 'Degraded (Stress High)' : isFatigued ? 'Fatigue Alert' : 'Nominal (Pace Stable)';

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-zinc-950 text-white dark:bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
          <div className="font-semibold flex justify-between gap-4 border-b border-zinc-800 pb-1">
            <span className="text-zinc-400">Lap {label}</span>
            <span className="font-tabular text-white font-mono">{data.lapTime}</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px] text-zinc-400">
            <span>5-Lap Moving Avg:</span>
            <span className="font-tabular text-zinc-200 font-mono">{data.movingAvg}</span>
          </div>
          {data.stressEvent && (
            <div className="text-[11px] text-rose-400 font-medium pt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {data.stressEvent}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Pit Wall Telemetry Top Control Header */}
      <SectionHeader
        title="Live Race Engineering Console"
        subtitle="Real-time multi-modal acoustic biometrics, CAN bus telemetry correlation and autonomous strategy triggers"
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
          <div className="flex items-center gap-2">
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

      {/* PRIMARY HERO METRIC CARDS (Top Priority Hierarchy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* HERO CARD 1: Driver Status & Biometric Load */}
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
                <p className="text-[11px] text-zinc-500 font-mono">Max Verstappen · Car #1</p>
              </div>
            </div>

            <StatusBadge
              status={isElevated ? 'critical' : isFatigued ? 'fatigued' : 'nominal'}
              size="sm"
            >
              {emotion.driverState || 'Calm'}
            </StatusBadge>
          </div>

          {/* Stress Score Gauge & Readout */}
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

            {/* Dual Layer Progress Bar */}
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isElevated ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : isFatigued ? 'bg-sky-500' : 'bg-zinc-900 dark:bg-zinc-100'
                }`}
                style={{ width: `${animatedStressScore}%` }}
              />
            </div>
          </div>

          {/* Acoustic Telemetry Breakdown Strip */}
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
                <p className="text-[11px] text-zinc-500 font-mono">Tire Deg + Stress Correlation</p>
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
                <span className="text-[11px] text-zinc-400 block font-mono">Pace Degradation</span>
                <span className="text-lg font-semibold text-rose-600 dark:text-rose-400 font-tabular font-mono">
                  {lapStats?.paceDeltaVsAvg || '+0.84s / lap'}
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
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Tire Wear Delta</span>
              <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                -3.2% stint pace
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
                <p className="text-[11px] text-zinc-500 font-mono">18 Laps · Soft Compound</p>
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
            <span>Rolling 5-Lap Avg:</span>
            <strong className="font-mono text-zinc-900 dark:text-zinc-100">{lapStats?.last5Avg || '1:30.660'}</strong>
          </div>
        </div>

      </div>

      {/* SECOND MOST IMPORTANT SECTION: LATEST AI STRATEGY DIRECTIVE */}
      <div className="rounded-2xl border-2 border-zinc-950 dark:border-white bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 dark:border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-rose-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 dark:text-rose-600 block">
                Autonomous Pit Wall Directive
              </span>
              <h4 className="text-sm sm:text-base font-bold tracking-tight">
                {currentAnalysis?.recommendation?.category || 'Radio Brevity Directive'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-zinc-300 dark:text-zinc-800 border border-zinc-800 dark:border-zinc-300">
              Target Pit: <strong className="text-white dark:text-black">{currentAnalysis?.recommendation?.pitWindow || 'Lap 21'}</strong>
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
          "{currentAnalysis?.recommendation?.action || 'Enforce radio silence through Sector 2 high-G corners and prepare undercut pit window.'}"
        </p>

        <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 dark:text-zinc-600 pt-1">
          <span>Root Cause: High pitch jitter (+42.5 Hz) detected on Lap 18 communication</span>
          <Link to="/dashboard/radio" className="hover:underline flex items-center gap-1 text-white dark:text-zinc-950 font-medium">
            Review voice transmission <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* AI Decision Explainability Section */}
      <ExplainabilityPanel
        recommendation={correlation?.recommendation || currentAnalysis?.recommendation}
        emotion={emotion}
        lapStats={lapStats}
        correlation={correlation}
        transcript={currentAnalysis?.transcript}
      />

      {/* MAIN 2-COLUMN TELEMETRY & RADIO STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: Live Radio Transcripts & Recharts Lap Curve */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Radio Transmissions Feed */}
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
                        <Badge variant="outline" size="sm">Lap {tx.lap || 18}</Badge>
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

          {/* Animated Recharts Lap Telemetry Curve */}
          <Card
            title="Lap Pace Degradation & Rolling Average"
            subtitle="Multi-lap telemetry pace drift overlaid with rolling 5-lap baseline"
            action={<Badge variant="white" size="sm">Telemetry CAN</Badge>}
          >
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="currentColor" />
                  <XAxis
                    dataKey="lap"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `L${val}`}
                  />
                  <YAxis
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${val}s`}
                    width={45}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                        {value === 'lapTimeSec' ? 'Actual Lap Time (s)' : '5-Lap Moving Average (s)'}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="lapTimeSec"
                    stroke="#18181b"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#18181b', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#f43f5e' }}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                    className="dark:stroke-white dark:dot-fill-white"
                  />
                  <Line
                    type="monotone"
                    dataKey="movingAvgSec"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* Right 1-Col: Live Strategy & Telemetry Anomaly Panel */}
        <div className="space-y-6">
          
          {/* Quick Pit Window Summary */}
          <Card
            title="Pit Window Telemetry"
            subtitle="Undercut & overcut predictions"
            badge={<Badge variant="outline" size="sm">Hard Compound</Badge>}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Optimum Box Lap</span>
                <span className="text-2xl font-bold font-mono text-zinc-950 dark:text-white">Lap 21</span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Undercut advantage over Mercedes #44 estimated at +1.4s with fresh Hard compound.
                </p>
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Pit Stop Loss Delta:</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">19.4s</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Tire Life Remaining:</span>
                  <span className="font-mono font-medium text-rose-500">32% (Thermal drop)</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Track Position on Exit:</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">P2 (Clear air)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Race Timeline Quick Preview */}
          <Card
            title="Chronological Event Stream"
            subtitle="Latest multi-track race telemetry events"
            footer={
              <Link to="/dashboard/timeline" className="text-xs text-zinc-900 dark:text-zinc-100 hover:underline font-medium flex items-center justify-between">
                <span>View Full Race Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-pulse" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 dark:text-white">Lap 18</span>
                    <span className="text-[10px] text-zinc-400 font-mono">14:22:30 UTC</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">Driver vocal stress spike recorded (+42.5 Hz jitter).</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 dark:text-white">Lap 18</span>
                    <span className="text-[10px] text-zinc-400 font-mono">14:22:00 UTC</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">Performance Risk Score raised to 61% (High Risk).</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 dark:text-white">Lap 14</span>
                    <span className="text-[10px] text-zinc-400 font-mono">14:12:00 UTC</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">Fastest stint lap recorded (1:29.420).</p>
                </div>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
