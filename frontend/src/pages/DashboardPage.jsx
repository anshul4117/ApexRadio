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
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const DashboardPage = () => {
  const [activeDriver, setActiveDriver] = useState('VER-01');
  const [isAcked, setIsAcked] = useState(false);

  const radioEvents = [
    {
      id: 'tx-1',
      time: '14:22:15 UTC',
      sender: 'Max Verstappen (Car #1)',
      text: 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.',
      stressScore: 78,
      stressLevel: 'critical',
      pitchDelta: '+42.5 Hz',
      cadence: '185 WPM',
      lap: 18,
    },
    {
      id: 'tx-2',
      time: '14:22:21 UTC',
      sender: 'GP Lambiase (Race Engineer)',
      text: 'Copy Max, we see the thermal degradation. Switch to Strat 4 and adjust brake bias +1 forward.',
      stressScore: 15,
      stressLevel: 'nominal',
      pitchDelta: '+12.0 Hz',
      cadence: '130 WPM',
      lap: 18,
    },
    {
      id: 'tx-3',
      time: '14:18:40 UTC',
      sender: 'Max Verstappen (Car #1)',
      text: 'Traffic ahead in Sector 2! He is weaving on the straight.',
      stressScore: 62,
      stressLevel: 'high-stress',
      pitchDelta: '+31.2 Hz',
      cadence: '172 WPM',
      lap: 16,
    },
  ];

  const miniTimelineEvents = [
    {
      time: '14:22:15',
      type: 'stress',
      label: 'Stress Spike (78%)',
      desc: 'Driver reported front-left understeer in Turn 4',
      badge: 'Critical',
      status: 'critical',
    },
    {
      time: '14:20:00',
      type: 'lap',
      label: 'Lap 18 Completed',
      desc: 'Pace: 1:31.240 (+1.82s vs best stint lap)',
      badge: 'Lap 18',
      status: 'nominal',
    },
    {
      time: '14:18:40',
      type: 'radio',
      label: 'Radio Callout (Sector 2)',
      desc: 'Backmarker traffic encountered on Hangar Straight',
      badge: 'Radio',
      status: 'high-stress',
    },
    {
      time: '14:15:30',
      type: 'ai',
      label: 'Brevity Suppressed',
      desc: 'Comms held during 4.8G braking into Stowe',
      badge: 'AI Brevity',
      status: 'nominal',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Pit Wall Control Center"
        subtitle="Real-time driver acoustic stress monitoring, vehicle telemetry & tactical pit decisions"
        badge={<StatusBadge status="live">Session Active</StatusBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> Re-sync
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
          badge={<StatusBadge status="critical" size="sm">Stressed</StatusBadge>}
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                78<span className="text-sm font-normal text-zinc-400">/100</span>
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +24% vs baseline
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Cognitive Stress Index</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">Elevated</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between text-xs text-zinc-500">
              <span>Heart Rate Est:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">168 BPM</span>
            </div>
          </div>
        </Card>

        {/* 2. Performance Risk Score Card */}
        <Card
          title="Performance Risk Score"
          subtitle="Telemetry anomaly likelihood"
          badge={<StatusBadge status="high-stress" size="sm">Risk 64%</StatusBadge>}
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
                64<span className="text-sm font-normal text-zinc-400">%</span>
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                Moderate Risk
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Lockup Probability:</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">84% (Turn 4)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Apex Miss Delta:</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium font-tabular">+0.34s loss</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between text-xs text-zinc-500">
              <span>Brake Stability:</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">Degrading</span>
            </div>
          </div>
        </Card>

        {/* 3. Session & Lap Summary */}
        <Card
          title="Session & Pace Summary"
          subtitle="Silverstone Grand Prix"
          badge={<Badge variant="outline" size="sm">Lap 18/52</Badge>}
        >
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Session Time:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">01:24:35</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="text-zinc-500">Average Lap Time:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 font-tabular">1:30.120</span>
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
              <span>Enforce <strong>radio silence</strong> through Sector 2 high-G corners.</span>
            </div>
            
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-500">Pit Window: <strong>Lap 21</strong></span>
              <button
                type="button"
                onClick={() => setIsAcked(true)}
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

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Radio Activity & Lap Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Radio Activity Feed */}
          <Card
            title="Live Team Radio & Speech Transcripts"
            subtitle="Driver-to-pit audio analysis with pitch jitter and stress classification"
            action={<Badge variant="neutral" size="sm">Channel 1</Badge>}
            footer={
              <div className="flex items-center justify-between">
                <span>3 transmissions recorded this stint</span>
                <span className="text-zinc-400">Audio Ingestion Active</span>
              </div>
            }
          >
            <div className="space-y-3.5">
              {radioEvents.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-xs text-zinc-950 dark:text-white">{tx.sender}</span>
                      <Badge variant="outline" size="sm">Lap {tx.lap}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-xs">{tx.time}</span>
                      <StatusBadge status={tx.stressLevel} size="sm">
                        Stress {tx.stressScore}%
                      </StatusBadge>
                    </div>
                  </div>

                  <p className="text-zinc-800 dark:text-zinc-200 text-sm pl-3.5 border-l-2 border-zinc-900 dark:border-zinc-100 leading-relaxed italic">
                    "{tx.text}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40">
                    <span>Pitch Delta: <strong className="text-zinc-800 dark:text-zinc-200 font-tabular">{tx.pitchDelta}</strong></span>
                    <span>Speech Cadence: <strong className="text-zinc-800 dark:text-zinc-200 font-tabular">{tx.cadence}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lap Performance Telemetry Chart Preview */}
          <Card
            title="Lap Telemetry & Pace Degradation Overlay"
            subtitle="Multi-axis telemetry correlation between driver stress spikes and lap delta (Recharts ready)"
            action={<Badge variant="white" size="sm">Recharts Engine</Badge>}
          >
            <div className="h-64 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-col items-center justify-center p-6 text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Multi-Axis Telemetry Chart Canvas
                </h4>
                <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
                  Interactive time series rendering Speed Trap (km/h), Throttle %, Brake Pressure (bar), and Driver Stress Curve across Laps 1–18.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" /> Speed (km/h)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-500" /> Throttle %
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Stress Score
                </span>
              </div>
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
                {miniTimelineEvents.map((evt, i) => (
                  <div key={i} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-400 dark:border-zinc-600 flex items-center justify-center">
                      <div className={`w-1 h-1 rounded-full ${evt.status === 'critical' ? 'bg-rose-500' : 'bg-zinc-500'}`} />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-950 dark:text-white">
                          {evt.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-tabular">{evt.time}</span>
                      </div>
                      <p className="text-zinc-500 leading-relaxed text-xs">
                        {evt.desc}
                      </p>
                    </div>
                  </div>
                ))}
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
                <span className="font-medium text-rose-600 dark:text-rose-400">3 Laps remaining</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500">Projected Pit Loss:</span>
                <span className="font-medium text-zinc-950 dark:text-white font-tabular">21.4s</span>
              </div>

              <div className="pt-2">
                <Button variant="primary" size="sm" className="w-full gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Initiate Pit Protocol (Lap 21)
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
