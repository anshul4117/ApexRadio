import React, { useState } from 'react';
import { Activity, Radio, BarChart3, Zap, ShieldAlert, Cpu, Play, Pause, RefreshCw, Volume2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export const DashboardPage = () => {
  const [selectedDriver, setSelectedDriver] = useState('VER-01');

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-4 font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="white" size="md">PIT WALL CONSOLE</Badge>
          <span className="text-zinc-600">|</span>
          <span className="text-xs text-zinc-300">SESSION: <strong className="text-white">SILVERSTONE GP 2026</strong></span>
          <span className="text-zinc-600">|</span>
          <span className="text-xs text-zinc-300">LAP: <strong className="text-white">18 / 52</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" size="sm" dot>TELEMETRY LIVE</Badge>
          <Button variant="secondary" size="sm" className="font-mono text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> RE-SYNC
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Radio Audio Transcripts Stream (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Live Team Radio & Speech Stream"
            subtitle="Driver-to-Pit voice stream with real-time acoustic stress scoring"
            action={<Badge variant="outline" size="sm">CHANNEL: CH-1 PRIMARY</Badge>}
            className="border-zinc-800 bg-zinc-950/60"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-white font-semibold">MAX VERSTAPPEN (#1)</span>
                    <Badge variant="neutral" size="sm">LAP 18</Badge>
                  </div>
                  <Badge variant="danger" size="sm">STRESS 78% [HIGH]</Badge>
                </div>
                <p className="text-zinc-300 font-sans text-sm pl-5 border-l-2 border-zinc-700">
                  "Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car."
                </p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>PITCH DELTA: +42.5Hz | CADENCE: 185 WPM</span>
                  <span>14:22:15 UTC</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-300 font-semibold">GIANPIERO LAMBIASE (ENGINEER)</span>
                    <Badge variant="neutral" size="sm">LAP 18</Badge>
                  </div>
                  <Badge variant="neutral" size="sm">STRESS 15% [NOMINAL]</Badge>
                </div>
                <p className="text-zinc-400 font-sans text-sm pl-5 border-l-2 border-zinc-800">
                  "Copy Max, we see the thermal degradation. Switch to STRAT 4 and adjust brake bias +1 forward."
                </p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>PITCH DELTA: +12.0Hz | CADENCE: 130 WPM</span>
                  <span>14:22:21 UTC</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Telemetry vs Stress Correlation Container Placeholder */}
          <Card
            title="Telemetry Correlation & Lap Delta"
            subtitle="Time-series correlation between driver stress spikes and lap times (Recharts ready)"
            action={<Badge variant="neutral" size="sm">RECHARTS ENGINE</Badge>}
            className="border-zinc-800 bg-zinc-950/60"
          >
            <div className="h-64 rounded-md border border-dashed border-zinc-800 flex flex-col items-center justify-center p-6 text-center text-zinc-500 font-mono text-xs space-y-3">
              <BarChart3 className="w-8 h-8 text-zinc-600" />
              <div className="space-y-1">
                <p className="text-zinc-300 font-semibold uppercase">Recharts Telemetry Module Placeholder</p>
                <p className="text-zinc-500 max-w-sm">
                  Lap-by-lap stress index vs sector deltas will be rendered here via Recharts in the next hackathon phase.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Driver State & Pit Decision Support */}
        <div className="space-y-6">
          {/* Driver Cognitive Load Card */}
          <Card
            title="Driver State Overview"
            subtitle="Cognitive load & fatigue index"
            className="border-zinc-800 bg-zinc-950/60"
          >
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>Current Stress Score</span>
                  <span className="text-rose-400 font-bold">78 / 100</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block">TIRE HEALTH</span>
                  <span className="text-white font-bold text-sm">73.6%</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block">MICRO MISTAKES</span>
                  <span className="text-white font-bold text-sm">1 (Turn 4)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Decision Support Feed */}
          <Card
            title="AI Pit Wall Recommendations"
            subtitle="Autonomous race engineer insights"
            className="border-zinc-800 bg-zinc-950/60"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded bg-zinc-900/80 border border-zinc-700/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>RECOMMENDED ACTION</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs">
                  Driver elevated stress detected after Turn 4 understeer. Maintain <strong>Radio Silence</strong> through Sector 2 high-speed complex.
                </p>
              </div>

              <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>STRATEGY WINDOW</span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">
                  Optimal undercut window opening in Lap 21. Hard compound prepared in pit box.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
