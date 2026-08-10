import React, { useState } from 'react';
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
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';

const formatSec = (sec) => {
  if (!sec || isNaN(sec)) return '';
  const mins = Math.floor(sec / 60);
  const secs = (sec % 60).toFixed(2);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const DashboardPage = () => {
  const { currentAnalysis, history } = useRadio();
  const { lapStats, correlation, refreshSession } = useLap();
  const [isAcked, setIsAcked] = useState(false);

  const emotion = currentAnalysis?.emotion || {
    driverState: 'Stressed',
    stressScore: 78,
    pitchJitter: '+42.5 Hz',
    speechCadence: '185 WPM',
  };

  const isElevated = emotion.driverState === 'Stressed' || (emotion.stressScore || 0) >= 75;
  const isFatigued = emotion.driverState === 'Fatigued';

  const riskScore = correlation?.riskScore || (isElevated ? 64 : isFatigued ? 48 : 22);
  const riskTier = correlation?.riskTier || (isElevated ? 'High' : 'Nominal');
  const estimatedHR = isElevated ? 168 : isFatigued ? 152 : 135;
  const chartData = lapStats?.chartData || [];
  const explainability = correlation?.explainabilityFactors || [];

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 bg-zinc-950 text-white dark:bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-semibold flex justify-between gap-3 border-b border-zinc-800 pb-1">
            <span>Lap {label}</span>
            <span className="font-tabular text-zinc-300">{data.lapTime}</span>
          </div>
          <div className="flex justify-between gap-3 text-[11px] text-zinc-400">
            <span>Moving Avg:</span>
            <span className="font-tabular text-white">{data.movingAvg}</span>
          </div>
          {data.stressEvent && (
            <div className="text-[10px] text-rose-400 font-medium pt-0.5">
              ⚠ {data.stressEvent}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Pit Wall Control Center"
        subtitle="Real-time driver acoustic stress monitoring, vehicle telemetry & tactical pit decisions"
        badge={<StatusBadge status="live">Session Active</StatusBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={refreshSession} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> Re-sync Session
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" /> Calibrate Baseline
            </Button>
          </div>
        }
      />

      {/* Top 4-Card Control Center HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Driver Status Card (Calm / Stressed / Fatigued) */}
        <Card
          title="Driver Status"
          subtitle="Biometric acoustic load"
          badge={
            <StatusBadge status={isElevated ? 'critical' : isFatigued ? 'high-stress' : 'nominal'} size="sm">
              {emotion.driverState || 'Stressed'}
            </StatusBadge>
          }
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                {emotion.stressScore || 78}<span className="text-sm font-normal text-zinc-400">/100</span>
              </span>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'}`}>
                <TrendingUp className="w-3 h-3" /> {isElevated ? '+24% vs baseline' : 'Nominal baseline'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Cognitive Stress Index</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                  {isElevated ? 'Elevated' : isFatigued ? 'Moderate' : 'Nominal'}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isElevated ? 'bg-rose-500' : 'bg-zinc-900 dark:bg-white'}`}
                  style={{ width: `${emotion.stressScore || 78}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between text-xs text-zinc-500">
              <span>Heart Rate Est:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">{estimatedHR} BPM</span>
            </div>
          </div>
        </Card>

        {/* 2. Performance Risk Score Card (Correlation Engine) */}
        <Card
          title="Performance Risk Score"
          subtitle="Telemetry & stress correlation"
          badge={
            <StatusBadge status={correlation?.riskBadgeVariant || (riskScore >= 60 ? 'critical' : 'nominal')} size="sm">
              {riskTier} Risk
            </StatusBadge>
          }
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                {riskScore}<span className="text-sm font-normal text-zinc-400">%</span>
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                {riskTier} Performance Risk
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Pace Degradation:</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium font-tabular">
                  {lapStats?.paceDeltaVsAvg || '+0.84s / lap'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Trend Status:</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium capitalize">
                  {lapStats?.lapTrend || 'Worsening'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between text-xs text-zinc-500">
              <span>Brake Stability:</span>
              <span className={`font-medium ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {isElevated ? 'Degrading' : 'Optimal'}
              </span>
            </div>
          </div>
        </Card>

        {/* 3. Session & Lap Summary */}
        <Card
          title="Session & Pace Summary"
          subtitle="Silverstone Grand Prix"
          badge={<Badge variant="outline" size="sm">Lap {lapStats?.totalLaps || 18}/52</Badge>}
        >
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Fastest Stint Lap:</span>
              <span className="font-medium text-zinc-950 dark:text-white font-tabular">
                {lapStats?.fastestLap?.lapTime || '1:29.420'}
              </span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Average Stint Pace:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">
                {lapStats?.averageLapTime || '1:30.120'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Gap to P2: <strong className="text-zinc-900 dark:text-zinc-100 font-tabular">+1.420s (HAM)</strong></span>
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">Rain Threat 60%</span>
            </div>
          </div>
        </Card>

        {/* 4. Latest AI Recommendation */}
        <Card
          title="Latest AI Recommendation"
          subtitle="Autonomous engineer decision"
          badge={<StatusBadge status="strategy" size="sm">Tactical</StatusBadge>}
        >
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs leading-relaxed flex items-start gap-2 shadow-2xs">
              <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{correlation?.recommendation?.action || currentAnalysis?.recommendation?.action || 'Enforce radio silence through Sector 2 high-G corners.'}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-500">
                Pit Window: <strong>{correlation?.recommendation?.pitWindow || 'Lap 21'}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsAcked(!isAcked)}
                className={`font-medium transition-colors cursor-pointer ${
                  isAcked ? 'text-zinc-400 dark:text-zinc-500 flex items-center gap-1' : 'text-zinc-900 dark:text-white underline underline-offset-4'
                }`}
              >
                {isAcked ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-zinc-600 dark:text-zinc-400" /> Acknowledged
                  </>
                ) : (
                  'Acknowledge'
                )}
              </button>
            </div>
          </div>
        </Card>

      </div>

      {/* Correlation Explanation Banner */}
      {explainability.length > 0 && (
        <Card title="Correlation Engine & Risk Explanation Factors" subtitle="Why the Performance Risk Score was generated">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {explainability.map((factor) => (
              <div
                key={factor.id}
                className="p-3 rounded-md bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-950 dark:text-white">{factor.title}</span>
                  <StatusBadge status={factor.severity === 'critical' ? 'critical' : 'nominal'} size="sm">
                    {factor.severity}
                  </StatusBadge>
                </div>
                <p className="text-zinc-500 text-[11px] leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live Radio Activity & Recharts Lap Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Radio Activity Feed */}
          <Card
            title="Live Team Radio & Speech Transcripts"
            subtitle="Driver-to-pit audio analysis with pitch jitter and stress classification"
            action={<Badge variant="neutral" size="sm">Channel 1</Badge>}
            footer={
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{history.length} transmission(s) analyzed in session</span>
                <span className="text-zinc-400">AI Ingestion Pipeline Active</span>
              </div>
            }
          >
            <div className="space-y-3.5">
              {history.map((tx) => {
                const txElevated = tx.emotion?.driverState === 'Stressed' || (tx.emotion?.stressScore || 0) >= 75;
                const txFatigued = tx.emotion?.driverState === 'Fatigued';

                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-semibold text-xs text-zinc-950 dark:text-white">
                          {tx.driver} ({tx.car || 'Car #1'})
                        </span>
                        <Badge variant="outline" size="sm">Lap {tx.lap || 18}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-xs font-tabular">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </span>
                        <StatusBadge
                          status={txElevated ? 'critical' : txFatigued ? 'high-stress' : 'nominal'}
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
                      <span>Pitch Delta: <strong className="text-zinc-800 dark:text-zinc-200 font-tabular">{tx.emotion?.pitchJitter || '+12.0 Hz'}</strong></span>
                      <span>Speech Cadence: <strong className="text-zinc-800 dark:text-zinc-200 font-tabular">{tx.emotion?.speechCadence || '140 WPM'}</strong></span>
                      <span>Confidence: <strong className="text-zinc-800 dark:text-zinc-200 font-tabular">{tx.confidence || 94.2}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Live Recharts Lap Telemetry & Moving Average Chart */}
          <Card
            title="Lap Telemetry & Moving Average Curve"
            subtitle="Multi-axis pace degradation overlaid with 5-lap rolling average"
            action={<Badge variant="white" size="sm">Live Telemetry</Badge>}
          >
            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="lap"
                    tickLine={false}
                    axisLine={{ stroke: '#71717a', opacity: 0.3 }}
                    tick={{ fontSize: 11, fill: '#71717a' }}
                    tickFormatter={(val) => `L${val}`}
                  />
                  <YAxis
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tickLine={false}
                    axisLine={{ stroke: '#71717a', opacity: 0.3 }}
                    tick={{ fontSize: 11, fill: '#71717a' }}
                    tickFormatter={formatSec}
                    width={60}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 8, fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="lapTimeSec"
                    name="Lap Pace (s)"
                    stroke="#18181b"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#18181b' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="movingAvgSec"
                    name="5-Lap Moving Avg"
                    stroke="#71717a"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* Right Column: Mini Activity Timeline & Stint Strategy */}
        <div className="space-y-6">
          
          {/* Mini Activity Timeline Card */}
          <Card
            title="Mini Activity Timeline"
            subtitle="Chronological feed of telemetry & radio events"
            action={<Badge variant="outline" size="sm">Real-Time</Badge>}
          >
            <div className="space-y-4 text-xs">
              <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-4">
                
                {/* Latest Analyzed Event from live state */}
                {currentAnalysis && (
                  <div className="relative animate-in fade-in duration-200">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-400 dark:border-zinc-600 flex items-center justify-center">
                      <div className={`w-1 h-1 rounded-full ${isElevated ? 'bg-rose-500' : 'bg-zinc-500'}`} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-950 dark:text-white">
                          Radio: {emotion.driverState} ({emotion.stressScore}%)
                        </span>
                        <span className="text-[11px] text-zinc-400 font-tabular">
                          {new Date(currentAnalysis.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-zinc-500 leading-relaxed text-xs truncate">
                        "{currentAnalysis.transcript}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-400 dark:border-zinc-600 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-zinc-500" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-950 dark:text-white">
                        Lap 18 Completed
                      </span>
                      <span className="text-[11px] text-zinc-400 font-tabular">14:20:00</span>
                    </div>
                    <p className="text-zinc-500 leading-relaxed text-xs">
                      Pace: 1:31.240 (+1.82s vs best stint lap)
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-400 dark:border-zinc-600 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-zinc-500" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-950 dark:text-white">
                        Telemetry Correlation
                      </span>
                      <span className="text-[11px] text-zinc-400 font-tabular">14:18:00</span>
                    </div>
                    <p className="text-zinc-500 leading-relaxed text-xs">
                      Risk Score evaluated at {riskScore}% ({riskTier})
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </Card>

          {/* Stint & Strategy Matrix */}
          <Card
            title="Stint & Tire Strategy Matrix"
            subtitle="Compound thermal degradation model"
            className="text-xs"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500">Current Compound:</span>
                <span className="font-medium text-zinc-950 dark:text-white">Medium (Yellow)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500">Estimated Stint Life:</span>
                <span className={`font-medium ${isElevated ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {isElevated ? '3 Laps remaining (Tire Overheat)' : '8 Laps remaining'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500">Projected Pit Loss:</span>
                <span className="font-medium text-zinc-950 dark:text-white font-tabular">21.4s</span>
              </div>

              <div className="pt-2">
                <Button variant="primary" size="sm" className="w-full gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Initiate Pit Protocol ({correlation?.recommendation?.pitWindow || 'Lap 21'})
                </Button>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
