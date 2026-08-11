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
import ExplainabilityPanel from '../components/ui/ExplainabilityPanel';
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

  const fastestLap = lapStats?.fastestLap || { lap: 14, lapTime: '1:29.420', lapTimeSec: 89.42 };
  const slowestLap = lapStats?.slowestLap || { lap: 18, lapTime: '1:31.240', lapTimeSec: 91.24 };
  const chartData = lapStats?.chartData || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-zinc-950 text-white dark:bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[170px]">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
            <span className="font-semibold text-zinc-100">Lap {label}</span>
            <span className="font-tabular font-bold text-white">{data.lapTime}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>5-Lap Avg:</span>
            <span className="font-tabular text-zinc-200">{data.movingAvg}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Tire Life:</span>
            <span className="font-tabular text-zinc-200">{data.tireDeg}</span>
          </div>
          {data.stressEvent && (
            <div className="pt-1 text-rose-400 text-[11px] font-medium border-t border-zinc-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              {data.stressEvent}
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
        title="Lap Telemetry & Pace Degradation Analysis"
        subtitle="Sector timing splits, rolling moving averages & biometric risk score correlation"
        badge={
          <StatusBadge status={lapStats?.paceTrend === 'worsening' ? 'critical' : 'nominal'}>
            Pace Trend: {lapStats?.paceTrend ? lapStats.paceTrend.toUpperCase() : 'WORSENING (+0.84s)'}
          </StatusBadge>
        }
        actions={
          <div className="flex items-center gap-2">
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
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{lapError}</span>
        </div>
      )}

      {/* Upload Progress Stepper Card */}
      <Card
        title="CAN Bus / Telemetry CSV Ingestion"
        subtitle={`Active session dataset: ${filename || 'silverstone_stint1_telemetry.csv'}`}
        action={<Badge variant="outline" size="sm">CSV Parser</Badge>}
      >
        <div className="space-y-4">
          {isAnalyzing ? (
            <div className="p-6 text-center space-y-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <Activity className="w-8 h-8 mx-auto text-zinc-900 dark:text-white animate-pulse" />
              <div className="space-y-1 max-w-xs mx-auto">
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                  Parsing Telemetry Data ({uploadProgress}%)...
                </p>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress || 65}%` }}
                  />
                </div>
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
                  Drag and drop timing CSV here, or click to upload
                </p>
                <p className="text-[11px] text-zinc-500">
                  Headers required: lap, lapTime, s1, s2, s3, topSpeed, tireDeg
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Fastest Lap */}
        <Card title="Fastest Stint Lap" subtitle="Purple Sector 1 & 3" badge={<Badge variant="white" size="sm">Lap {fastestLap.lap}</Badge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
              {fastestLap.lapTime}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Top Speed: <strong className="text-zinc-900 dark:text-zinc-100 font-tabular">328.9 km/h</strong></span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Clear air</span>
            </div>
          </div>
        </Card>

        {/* Slowest Lap */}
        <Card title="Stint Degradation High" subtitle="Understeer incident" badge={<StatusBadge status="critical" size="sm">Lap {slowestLap.lap}</StatusBadge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular">
              {slowestLap.lapTime}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Delta vs Best:</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular">+1.820s (S2 Loss)</span>
            </div>
          </div>
        </Card>

        {/* Average Stint Pace */}
        <Card title="Average Stint Pace" subtitle="18 Laps Completed" badge={<Badge variant="outline" size="sm">Rolling Pace</Badge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
              {lapStats?.averageLapTime || '1:30.120'}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Standard Dev:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">±0.48s</span>
            </div>
          </div>
        </Card>

        {/* Last 5-Lap Pace Delta */}
        <Card title="Last 5-Lap Pace Drift" subtitle="Tire thermal dropoff" badge={<StatusBadge status="critical" size="sm">Pace Drop</StatusBadge>}>
          <div className="space-y-1">
            <span className="text-3xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular">
              {lapStats?.last5Avg || '1:30.660'}
            </span>
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Pace Drop:</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular">{lapStats?.paceDeltaVsAvg || '+0.84s / lap'}</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Main Recharts Telemetry Chart Card */}
      <Card
        title="Lap Pace vs 5-Lap Rolling Moving Average"
        subtitle="Telemetry pace trend with acoustic stress incident correlation"
        action={<Badge variant="neutral" size="sm">Silverstone GP Telemetry</Badge>}
      >
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
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
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12, fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="lapTimeSec"
                name="Lap Pace (s)"
                stroke="#18181b"
                strokeWidth={2.5}
                isAnimationActive={true}
                animationDuration={800}
                dot={{ r: 3, fill: '#18181b' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="movingAvgSec"
                name="5-Lap Moving Avg"
                stroke="#71717a"
                strokeWidth={2}
                strokeDasharray="4 4"
                isAnimationActive={true}
                animationDuration={800}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Decision Explainability Section */}
      <ExplainabilityPanel
        recommendation={correlation?.recommendation}
        emotion={currentAnalysis?.emotion}
        lapStats={lapStats}
        correlation={correlation}
        transcript={currentAnalysis?.transcript}
      />

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
