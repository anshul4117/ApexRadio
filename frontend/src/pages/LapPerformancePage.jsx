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
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceDot,
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
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
  const { lapStats, correlation, filename, isAnalyzing, uploadProgress, error: lapError, uploadCsv, loadSamplePreset } = useLap();
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

  const chartData = lapStats?.chartData || [];
  const fastestLap = lapStats?.fastestLap || { lap: 14, lapTime: '1:29.420' };
  const riskScore = correlation?.riskScore || 61;
  const riskTier = correlation?.riskTier || 'High';
  const explainability = correlation?.explainabilityFactors || [];

  // Recharts Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-zinc-950 text-white dark:bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-semibold flex items-center justify-between gap-3 border-b border-zinc-800 pb-1">
            <span>Lap {label}</span>
            <span className="font-tabular text-zinc-300">{data.lapTime}</span>
          </div>
          <div className="flex justify-between gap-3 text-[11px] text-zinc-400">
            <span>5-Lap Moving Avg:</span>
            <span className="font-tabular text-white">{data.movingAvg}</span>
          </div>
          <div className="flex justify-between gap-3 text-[11px] text-zinc-400">
            <span>Delta vs Best:</span>
            <span className={`font-tabular ${data.deltaToBestSec > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              +{data.deltaToBestSec}s
            </span>
          </div>
          {data.stressEvent && (
            <div className="pt-1 text-[10px] text-rose-400 font-medium flex items-center gap-1 border-t border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{data.stressEvent}</span>
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
        title="Lap Performance & Telemetry Analysis"
        subtitle="Ingest vehicle telemetry CSV feeds, evaluate sector degradation, and correlate pace loss with vocal stress"
        badge={<StatusBadge status={correlation?.riskBadgeVariant || 'critical'}>Risk Score {riskScore}%</StatusBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-zinc-500" /> Upload CSV
            </Button>
            <Button variant="outline" size="sm" onClick={loadSamplePreset} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> Load Silverstone Data
            </Button>
          </div>
        }
      />

      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, text/csv, text/plain"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Alert */}
      {lapError && (
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{lapError}</span>
        </div>
      )}

      {/* CSV Ingestion Dropzone & Stint Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CSV Telemetry Upload Area */}
        <Card
          title="Telemetry CSV Ingestion"
          subtitle={`Active dataset: ${filename}`}
          action={<Badge variant="outline" size="sm">CAN Bus Telemetry</Badge>}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            {isAnalyzing ? (
              <div className="p-6 text-center space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <Activity className="w-6 h-6 mx-auto text-zinc-900 dark:text-white animate-pulse" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                    Parsing Telemetry CSV & Running Multi-Factor Correlation... ({uploadProgress}%)
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Computing moving averages and correlating sector deltas with driver stress events.
                  </p>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-lg p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  dragOver
                    ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-900'
                    : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-950/30 hover:border-zinc-500'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                    Drag and drop lap timing CSV here, or click to browse
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Supports Motec, CAN bus, and standard timing export formats
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Parsed Laps: <strong className="text-zinc-900 dark:text-zinc-100 font-tabular">{lapStats?.totalLaps || 18} Laps</strong></span>
              <button
                type="button"
                onClick={loadSamplePreset}
                className="text-zinc-900 dark:text-white font-medium underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
              >
                Reset to Sample Stint 1
              </button>
            </div>
          </div>
        </Card>

        {/* Performance Trend Summary */}
        <Card
          title="Performance Trend Summary"
          subtitle="Pace degradation & moving average"
          badge={
            <Badge
              variant={
                lapStats?.lapTrend === 'worsening'
                  ? 'danger'
                  : lapStats?.lapTrend === 'improving'
                  ? 'success'
                  : 'neutral'
              }
              size="sm"
            >
              Trend: {lapStats?.lapTrend ? lapStats.lapTrend.charAt(0).toUpperCase() + lapStats.lapTrend.slice(1) : 'Worsening'}
            </Badge>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Fastest Stint Lap:</span>
              <span className="font-medium text-zinc-950 dark:text-white font-tabular">
                {fastestLap.lapTime} (Lap {fastestLap.lap})
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Average Stint Pace:</span>
              <span className="font-medium text-zinc-950 dark:text-white font-tabular">
                {lapStats?.averageLapTime || '1:30.120'}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Last 5 Laps Average:</span>
              <span className="font-medium text-rose-600 dark:text-rose-400 font-tabular">
                {lapStats?.lastFiveAvgTime || '1:30.660'} ({lapStats?.paceDeltaVsAvg || '+0.84s'})
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Undercut Threat:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">Lap 21 (+1.8s Gain)</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Interactive Recharts Multi-Line Lap Pace Chart */}
      <Card
        title="Lap Pace & Moving Average Telemetry Curve"
        subtitle="Lap-by-lap time progression correlated with 5-lap moving average and acoustic stress events"
        action={<Badge variant="white" size="sm">Recharts Engine</Badge>}
      >
        <div className="h-72 w-full pt-2">
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
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="lapTimeSec"
                name="Lap Pace (s)"
                stroke="#18181b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#18181b' }}
                activeDot={{ r: 6, fill: '#e11d48' }}
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

      {/* Correlation Summary & Explainability Panel */}
      <Card
        title="Driver Stress vs Telemetry Correlation & Explainability Panel"
        subtitle="Automated correlation between vocal pitch tension, lap degradation, and pit window urgency"
        badge={<StatusBadge status={correlation?.riskBadgeVariant || 'critical'}>{riskTier} Risk ({riskScore}%)</StatusBadge>}
      >
        <div className="space-y-4">
          
          {/* Explainability Reason Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {explainability.map((factor) => (
              <div
                key={factor.id}
                className={`p-3.5 rounded-lg border space-y-1 ${
                  factor.severity === 'critical'
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                    : factor.severity === 'warning'
                    ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/40'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-950 dark:text-white">
                    {factor.title}
                  </span>
                  <StatusBadge status={factor.severity === 'critical' ? 'critical' : 'nominal'} size="sm">
                    {factor.severity}
                  </StatusBadge>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>

          {/* AI Directive Banner */}
          {correlation?.recommendation && (
            <div className="p-4 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="font-semibold">AI Recommended Action ({correlation.recommendation.category}): </span>
                  <span>{correlation.recommendation.action}</span>
                </div>
              </div>
              <Badge variant="white" size="sm" className="self-start sm:self-center">
                Target: {correlation.recommendation.pitWindow}
              </Badge>
            </div>
          )}

        </div>
      </Card>

      {/* Sector Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Sector 1 (Turns 1–5)" subtitle="High-speed complex">
          <div className="space-y-2 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
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
              <span className="text-2xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular">
                {lapStats?.sectorAverages?.s2 || '34.720s'}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular">+0.51s degradation</span>
            </div>
            <p className="text-zinc-500 text-[11px]">Front left understeer in Turn 4 causing apex exit delay.</p>
          </div>
        </Card>

        <Card title="Sector 3 (Turns 15–18)" subtitle="Stowe to Club chicane">
          <div className="space-y-2 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                {lapStats?.sectorAverages?.s3 || '27.180s'}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Stable</span>
            </div>
            <p className="text-zinc-500 text-[11px]">Brevity mode held comms into heavy deceleration.</p>
          </div>
        </Card>
      </div>

      {/* Lap Telemetry Table */}
      <Card
        title="Lap By Lap Telemetry Logs"
        subtitle="Sector splits, speed trap velocities, and tire degradation indices"
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
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {(lapStats?.laps || []).map((row) => {
                const isBest = row.lap === fastestLap.lap;
                const deltaNum = Math.round((row.lapTimeSec - (fastestLap.lapTimeSec || 89.42)) * 1000) / 1000;

                return (
                  <tr key={row.lap} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3 font-semibold text-zinc-950 dark:text-white">Lap {row.lap}</td>
                    <td className="px-5 py-3 font-medium font-tabular text-zinc-950 dark:text-white">{row.lapTime}</td>
                    <td className="px-5 py-3 font-tabular">
                      {isBest ? (
                        <span className="text-zinc-950 dark:text-white font-semibold">Fastest Lap</span>
                      ) : (
                        <span className={deltaNum > 0.5 ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-zinc-600 dark:text-zinc-400'}>
                          +{deltaNum.toFixed(3)}s
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-tabular text-zinc-500">{row.s1}</td>
                    <td className="px-5 py-3 font-tabular text-zinc-500">{row.s2}</td>
                    <td className="px-5 py-3 font-tabular text-zinc-500">{row.s3}</td>
                    <td className="px-5 py-3 font-tabular text-zinc-900 dark:text-zinc-100 font-medium">{row.topSpeed}</td>
                    <td className="px-5 py-3 font-tabular text-zinc-500">{row.tireDeg}</td>
                    <td className="px-5 py-3 text-zinc-500">
                      {row.stressEvent ? (
                        <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                          {row.stressEvent}
                        </span>
                      ) : (
                        '-'
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
