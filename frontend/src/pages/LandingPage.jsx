import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Activity, Zap, Cpu, ArrowRight, Shield, BarChart3, MessageSquare, Gauge } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export const LandingPage = () => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="white" size="md">
            HACKATHON FOUNDATION
          </Badge>
          <Badge variant="outline" size="md">
            FORMULA TELEMETRY + AI
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-sans uppercase">
          ApexRadio <span className="text-zinc-500 font-mono">AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
          AI-powered race engineer assistant that analyzes Formula-style driver radio communication, detects stress or fatigue, correlates with lap performance, and delivers decision support to the pit wall.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="font-mono gap-2">
              <Activity className="w-4 h-4" />
              OPEN PIT WALL DASHBOARD
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="font-mono gap-2">
              ENGINEER ACCESS <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Telemetry Stream Preview Teaser Card */}
      <section className="max-w-4xl mx-auto">
        <Card className="border-zinc-800 bg-zinc-950/80 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold">LIVE RADIO TELEMETRY FEED</span>
              <span className="text-zinc-600">|</span>
              <span>CAR #1 - VER</span>
            </div>
            <div className="flex items-center gap-4">
              <span>LAP 18 / 52</span>
              <span>DELTA: <span className="text-emerald-400">+1.420s</span></span>
            </div>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3">
              <Badge variant="neutral" size="sm" className="mt-0.5">14:22:15</Badge>
              <div className="flex-1">
                <span className="text-zinc-300 font-semibold">[DRIVER #01]: </span>
                <span className="text-zinc-400">"Front left is completely gone guys, massive understeer in Turn 4..."</span>
              </div>
              <Badge variant="danger" size="sm">STRESS: 78%</Badge>
            </div>

            <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/40 flex items-start gap-3">
              <Badge variant="neutral" size="sm" className="mt-0.5">14:22:21</Badge>
              <div className="flex-1">
                <span className="text-zinc-300 font-semibold">[RACE ENGINEER]: </span>
                <span className="text-zinc-400">"Copy Max, switch to STRAT 4 and adjust brake bias +1 forward."</span>
              </div>
              <Badge variant="neutral" size="sm">STRESS: 15%</Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card
          title="Acoustic Stress Analysis"
          subtitle="Voice biometric signal extraction"
          className="bg-zinc-900/30 border-zinc-800/70"
        >
          <div className="mt-2 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-200">
              <Gauge className="w-4 h-4 text-white" />
              <span>Real-time vocal tension & pitch jitter</span>
            </div>
            <p>Calculates cognitive overload and emotional urgency during critical race moments.</p>
          </div>
        </Card>

        <Card
          title="Lap Delta Correlation"
          subtitle="Telemetry + speech alignment"
          className="bg-zinc-900/30 border-zinc-800/70"
        >
          <div className="mt-2 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-200">
              <BarChart3 className="w-4 h-4 text-white" />
              <span>Micro-mistakes & brake zone degradation</span>
            </div>
            <p>Correlates driver stress spikes with lap time loss, lockups, and tire drop-off.</p>
          </div>
        </Card>

        <Card
          title="Pit Wall Decision Support"
          subtitle="Actionable engineer insights"
          className="bg-zinc-900/30 border-zinc-800/70"
        >
          <div className="mt-2 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-200">
              <Zap className="w-4 h-4 text-white" />
              <span>Brevity alerts & strategy window</span>
            </div>
            <p>Recommends optimal radio silence windows and pit timing to reduce driver cognitive load.</p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
