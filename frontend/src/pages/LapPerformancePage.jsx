import React, { useState } from 'react';
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
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const LapPerformancePage = () => {
  const [selectedFile, setSelectedFile] = useState('silverstone_stint1_telemetry.csv');

  const sectorData = [
    {
      sector: 'Sector 1 (Turns 1–5)',
      time: '28.110s',
      delta: 'Optimal (Purple)',
      status: 'success',
      speedTrap: '318.5 km/h',
      brakeStability: 'Nominal',
    },
    {
      sector: 'Sector 2 (Turns 6–14)',
      time: '35.610s',
      delta: '+1.400s vs Lap 16',
      status: 'critical',
      speedTrap: '326.1 km/h',
      brakeStability: 'Understeer / Slip',
    },
    {
      sector: 'Sector 3 (Turns 15–18)',
      time: '27.310s',
      delta: '+0.210s vs Lap 16',
      status: 'nominal',
      speedTrap: '298.2 km/h',
      brakeStability: 'Nominal',
    },
  ];

  const lapTelemetry = [
    {
      lap: 18,
      lapTime: '1:31.240',
      deltaToBest: '+1.820s',
      s1: '28.320s',
      s2: '35.610s',
      s3: '27.310s',
      topSpeed: '326.1 km/h',
      stressAvg: 78,
      tireDeg: '26.4%',
      status: 'critical',
      note: 'Turn 4 lockup & understeer reported on radio',
    },
    {
      lap: 17,
      lapTime: '1:29.850',
      deltaToBest: '+0.430s',
      s1: '28.190s',
      s2: '34.520s',
      s3: '27.140s',
      topSpeed: '327.9 km/h',
      stressAvg: 38,
      tireDeg: '18.7%',
      status: 'nominal',
      note: 'Clean lap',
    },
    {
      lap: 16,
      lapTime: '1:29.420',
      deltaToBest: 'Best Stint Lap',
      s1: '28.110s',
      s2: '34.210s',
      s3: '27.100s',
      topSpeed: '328.4 km/h',
      stressAvg: 22,
      tireDeg: '14.2%',
      status: 'success',
      note: 'Fastest lap of stint',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Lap Performance & Telemetry Analysis"
        subtitle="Ingest vehicle telemetry, analyze sector splits and correlate driver stress with pace deltas"
        badge={<Badge variant="neutral">Car #1 (VER)</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Compare with P2 (HAM)
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" /> Sector Filter
            </Button>
          </div>
        }
      />

      {/* CSV Ingestion Dropzone & Stint Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CSV Telemetry Upload Area (UI Only) */}
        <Card
          title="Telemetry CSV Ingestion"
          subtitle="Upload CAN bus telemetry, Motec logs or timing data"
          action={<Badge variant="outline" size="sm">Prototype UI</Badge>}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-col items-center justify-center space-y-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                  Drag and drop vehicle telemetry CSV / Motec file here
                </p>
                <p className="text-[11px] text-zinc-500">
                  Supported formats: .csv, .parquet, .ld (Motec i2 Pro)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
              <span>Active dataset: <strong className="text-zinc-900 dark:text-zinc-100">{selectedFile}</strong></span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">52 Laps Telemetry Loaded</span>
            </div>
          </div>
        </Card>

        {/* Performance Trend Summary */}
        <Card
          title="Performance Trend Summary"
          subtitle="Pace degradation & tire cliff"
        >
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Pace Degradation:</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium font-tabular">+0.42s / lap</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Front left compound overheating in high-load braking zones.
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Brake Consistency:</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">82% (Down from 96%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Undercut Window:</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">Lap 21 (+1.8s net gain)</span>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* 3 Sector Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sectorData.map((s, idx) => (
          <Card key={idx} title={s.sector} subtitle={`Speed Trap: ${s.speedTrap}`}>
            <div className="space-y-2 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                  {s.time}
                </span>
                <span className={s.status === 'critical' ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-zinc-700 dark:text-zinc-300'}>
                  {s.delta}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-between text-zinc-500">
                <span>Brake Zone Behavior:</span>
                <span className={s.status === 'critical' ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-zinc-900 dark:text-zinc-100'}>
                  {s.brakeStability}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Lap Telemetry Multi-Axis Chart Canvas */}
      <Card
        title="Multi-Lap Pace & Throttle Telemetry Overlay"
        subtitle="High-density time series across recent race stints (Recharts ready)"
        action={<Badge variant="white" size="sm">Telemetry Synced</Badge>}
      >
        <div className="h-64 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-col items-center justify-center p-6 text-center space-y-2 text-xs">
          <Activity className="w-6 h-6 text-zinc-400" />
          <p className="font-semibold text-zinc-950 dark:text-white">
            Lap Delta vs Throttle Modulation Overlay
          </p>
          <p className="text-zinc-500 max-w-md leading-relaxed">
            Displays braking points, corner apex speeds, and throttle traces correlated with driver stress spikes.
          </p>
        </div>
      </Card>

      {/* Driver Stress vs Telemetry Correlation Matrix Placeholder */}
      <Card
        title="Driver Stress vs Telemetry Correlation Matrix"
        subtitle="Statistical correlation between vocal pitch jitter, apex misses, and brake lockup probability"
        action={<Badge variant="outline" size="sm">Correlation Model</Badge>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <span className="text-zinc-500 block">Stress vs Brake Point Inconsistency</span>
            <span className="text-lg font-semibold text-rose-600 dark:text-rose-400 font-tabular">r = +0.82 (High)</span>
            <p className="text-zinc-400 text-[11px]">Vocal stress spikes directly precede late braking errors in Turn 4.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <span className="text-zinc-500 block">Stress vs Throttle Hesitation</span>
            <span className="text-lg font-semibold text-rose-600 dark:text-rose-400 font-tabular">r = +0.76 (High)</span>
            <p className="text-zinc-400 text-[11px]">Oversteer corrections cause jagged throttle re-application.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
            <span className="text-zinc-500 block">Stress vs Tire Thermal Overheat</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 font-tabular">r = +0.89 (Very High)</span>
            <p className="text-zinc-400 text-[11px]">Surface temperature above 110°C triggers repeated driver complaints.</p>
          </div>
        </div>
      </Card>

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
                <th className="px-5 py-3">Delta</th>
                <th className="px-5 py-3">Sector 1</th>
                <th className="px-5 py-3">Sector 2</th>
                <th className="px-5 py-3">Sector 3</th>
                <th className="px-5 py-3">Top Speed</th>
                <th className="px-5 py-3">Stress Score</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {lapTelemetry.map((row) => (
                <tr key={row.lap} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-zinc-950 dark:text-white">Lap {row.lap}</td>
                  <td className="px-5 py-3.5 font-medium font-tabular text-zinc-950 dark:text-white">{row.lapTime}</td>
                  <td className="px-5 py-3.5">
                    <span className={row.status === 'critical' ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-zinc-700 dark:text-zinc-300'}>
                      {row.deltaToBest}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-tabular text-zinc-500">{row.s1}</td>
                  <td className="px-5 py-3.5 font-tabular text-zinc-500">{row.s2}</td>
                  <td className="px-5 py-3.5 font-tabular text-zinc-500">{row.s3}</td>
                  <td className="px-5 py-3.5 font-tabular text-zinc-900 dark:text-zinc-100 font-medium">{row.topSpeed}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={row.status} size="sm">
                      {row.stressAvg}%
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default LapPerformancePage;
