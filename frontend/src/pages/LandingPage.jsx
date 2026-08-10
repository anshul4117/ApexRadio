import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Gauge,
  Zap,
  Volume2,
  Shield,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';

export const LandingPage = () => {
  return (
    <div className="space-y-24 py-12">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="neutral" size="sm">
            Formula Telemetry + Speech AI
          </Badge>
          <StatusBadge status="live" size="sm">
            Live Demo
          </StatusBadge>
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.15]">
          Real-time driver stress analysis and pit wall intelligence.
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
          ApexRadio AI analyzes Formula-style driver communications, detects acoustic stress and fatigue, correlates signals with lap telemetry, and delivers tactical decision support to race engineers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="gap-2">
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Engineer Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Live Preview Teaser Card */}
      <section className="max-w-4xl mx-auto">
        <Card
          title="Live Radio & Stress Telemetry Feed"
          subtitle="Real-time multi-modal driver acoustic analysis simulation"
          badge={<StatusBadge status="live" size="sm">Active Feed</StatusBadge>}
          className="border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
        >
          <div className="space-y-4">
            
            {/* Header Telemetry Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-zinc-950 dark:text-white">Car #1 (Max Verstappen)</span>
                <span>·</span>
                <span>Lap 18/52</span>
                <span>·</span>
                <span>Sector 2</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Tire: <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Medium (18 laps)</strong></span>
                <span>Delta to P2: <strong className="text-zinc-900 dark:text-zinc-100 font-medium font-tabular">+1.420s</strong></span>
              </div>
            </div>

            {/* Radio Transmissions */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-semibold text-zinc-950 dark:text-white">Max Verstappen</span>
                    <span className="text-zinc-400 text-[11px]">14:22:15 UTC</span>
                  </div>
                  <StatusBadge status="critical" size="sm">
                    Stress 78% · Elevated
                  </StatusBadge>
                </div>
                <p className="text-zinc-800 dark:text-zinc-200 text-sm pl-3.5 border-l-2 border-zinc-900 dark:border-zinc-100 leading-relaxed italic">
                  "Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car."
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <span>Pitch Delta: <strong className="text-zinc-800 dark:text-zinc-300 font-tabular">+42.5 Hz</strong> · Cadence: <strong className="text-zinc-800 dark:text-zinc-300 font-tabular">185 WPM</strong></span>
                  <span>Confidence: 94.2%</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-800/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">GP Lambiase (Race Engineer)</span>
                    <span className="text-zinc-400 text-[11px]">14:22:21 UTC</span>
                  </div>
                  <StatusBadge status="nominal" size="sm">
                    Stress 15% · Nominal
                  </StatusBadge>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm pl-3.5 border-l-2 border-zinc-300 dark:border-zinc-700 leading-relaxed">
                  "Copy Max, we see the thermal degradation. Switch to Strat 4 and adjust brake bias +1 forward."
                </p>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-3.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">AI Strategy Directive:</span>
                <span className="opacity-90">Enforce radio silence during Turn 4-6 braking sequence.</span>
              </div>
              <Link to="/dashboard" className="font-medium underline underline-offset-4 self-end sm:self-center">
                Open in Pit Wall &rarr;
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Built for mission-critical race operations
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Engineered to deliver rapid, low-friction insights under intense Grand Prix conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Acoustic Voice Stress"
            subtitle="Multi-modal biometric detection"
          >
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-medium text-sm">
                <Gauge className="w-4 h-4 text-zinc-500" />
                <span>Pitch Jitter & Cadence</span>
              </div>
              <p>
                Extracts subtle vocal tension and speech rate deviations to detect driver cognitive fatigue before lap times degrade.
              </p>
            </div>
          </Card>

          <Card
            title="Telemetry Delta Correlation"
            subtitle="Speech + vehicle data alignment"
          >
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-medium text-sm">
                <BarChart3 className="w-4 h-4 text-zinc-500" />
                <span>Corner Lockups & Apexes</span>
              </div>
              <p>
                Correlates driver frustration with brake point inconsistency, tire degradation, and apex misses to evaluate performance risk.
              </p>
            </div>
          </Card>

          <Card
            title="Pit Wall Decision Support"
            subtitle="Autonomous race recommendations"
          >
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-medium text-sm">
                <Zap className="w-4 h-4 text-zinc-500" />
                <span>Brevity & Strategy Timing</span>
              </div>
              <p>
                Recommends radio silence windows during high-G maneuvers, optimal pit windows, and targeted concise engineer responses.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-xl mx-auto py-8 space-y-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Experience pit wall telemetry intelligence
        </h3>
        <p className="text-xs text-zinc-500">
          Explore driver stress analysis, lap correlation, and AI recommendations.
        </p>
        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="gap-2">
              <Activity className="w-4 h-4" />
              Enter Dashboard
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
