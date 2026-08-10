import React from 'react';
import { Activity } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const LapPerformancePage = () => {
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
        title="Lap Performance & Sector Telemetry"
        subtitle="Time-series telemetry correlation between stress spikes and pace degradation"
        badge={<Badge variant="neutral">Car #1 (VER)</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Sector Breakdown
            </Button>
            <Button variant="outline" size="sm">
              Compare with P2 (HAM)
            </Button>
          </div>
        }
      />

      {/* Telemetry Chart Canvas Placeholder */}
      <Card
        title="Multi-Lap Pace & Throttle Telemetry Overlay"
        subtitle="High-density time series across recent race stints (Recharts ready)"
        action={<Badge variant="outline" size="sm">Telemetry Synced</Badge>}
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
