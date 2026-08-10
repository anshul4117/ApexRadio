import React from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Activity,
  Zap,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingDown,
  Volume2,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';

export const LandingPage = () => {
  const pipelineSteps = [
    {
      step: '01',
      title: 'Radio Ingestion',
      desc: 'Ingests noisy team radio audio streams via CAN bus or high-fidelity WAV/MP3 uploads.',
      icon: Volume2,
    },
    {
      step: '02',
      title: 'Speech-to-Text',
      desc: 'Hugging Face Whisper STT transcribes cockpit speech with motorsport domain vocabulary.',
      icon: Radio,
    },
    {
      step: '03',
      title: 'Emotion & Vocal Stress',
      desc: 'Acoustic pitch jitter & NLP models classify driver state (Calm, Stressed, Fatigued).',
      icon: Activity,
    },
    {
      step: '04',
      title: 'Telemetry Correlation',
      desc: 'Correlates vocal stress spikes with lap time loss, apex misses, and tire degradation.',
      icon: Layers,
    },
    {
      step: '05',
      title: 'AI Tactical Recommendation',
      desc: 'Generates real-time pit window triggers and radio brevity directives for the pit wall.',
      icon: Zap,
    },
  ];

  const features = [
    {
      title: 'Driver Stress & Biometric Load Detection',
      desc: 'Quantifies vocal pitch jitter (+42.5 Hz) and speech cadence to detect cognitive overload before mistakes happen.',
      icon: Activity,
      badge: 'Biometric AI',
    },
    {
      title: 'Live Radio Speech Transcription',
      desc: 'Transcribes high-speed team communications into text with sector tags and timecodes.',
      icon: Radio,
      badge: 'Whisper Large v3',
    },
    {
      title: 'Performance Risk Score (0–100)',
      desc: 'Multi-factor index correlating driver tension with lap pace drop-off (+0.84s) and lockup probability.',
      icon: TrendingDown,
      badge: 'Correlation Engine',
    },
    {
      title: 'Categorized AI Strategy Alerts',
      desc: 'Critical, High, Medium, and Low alerts with root cause telemetry explanations and ready-to-transmit prompts.',
      icon: ShieldAlert,
      badge: '4 Severity Tiers',
    },
    {
      title: 'Multi-Track Race Timeline',
      desc: 'Chronological event stream uniting speech transcripts, lap completions, risk escalations, and AI directives.',
      icon: Clock,
      badge: 'Chronological',
    },
    {
      title: 'One-Click Judge Demo Mode',
      desc: 'Pre-packaged Silverstone GP 18-lap scenario demonstrating calm pacing, sudden stress, and tactical pit execution.',
      icon: Sparkles,
      badge: 'Instant Evaluation',
    },
  ];

  return (
    <div className="space-y-24 py-6 sm:py-12">
      
      {/* 1. HERO SECTION (15-Second Pitch) */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs">
          <StatusBadge status="live" size="sm" dot>Pit Wall AI Intelligence</StatusBadge>
          <span className="text-zinc-400">·</span>
          <span>Formula 1 Telemetry Decision Support</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
          ApexRadio <span className="text-zinc-400 font-normal">AI</span>
          <span className="block text-2xl sm:text-3xl font-medium text-zinc-600 dark:text-zinc-400 mt-2">
            The Silent Co-Driver for Race Engineers
          </span>
        </h1>

        {/* 1-Line Value Proposition */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          AI-powered pit wall intelligence that analyzes driver radio communications, detects vocal stress spikes, correlates tension with lap time loss, and provides tactical decision support in real time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="gap-2 shadow-xs">
              Enter Pit Wall Console
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/architecture">
            <Button variant="outline" size="lg" className="gap-2">
              <Cpu className="w-4 h-4 text-zinc-500" />
              View System Architecture
            </Button>
          </Link>
        </div>

        {/* Live Race Preview Snapshot */}
        <div className="pt-6">
          <div className="max-w-2xl mx-auto p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-left shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-950 dark:text-white">Silverstone GP · Lap 18/52</span>
                <Badge variant="outline" size="sm">Car #1 VER</Badge>
              </div>
              <StatusBadge status="critical" size="sm">Driver Stressed (78%)</StatusBadge>
            </div>

            <p className="text-xs text-zinc-800 dark:text-zinc-200 pl-3 border-l-2 border-zinc-950 dark:border-white italic leading-relaxed">
              "Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car."
            </p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
              <span>Pace Loss: <strong className="text-rose-600 dark:text-rose-400 font-tabular">+0.84s</strong></span>
              <span>Risk Score: <strong className="text-rose-600 dark:text-rose-400 font-tabular">61% (High)</strong></span>
              <span className="font-medium text-zinc-900 dark:text-white">Directive: Enforce Radio Silence in S2</span>
            </div>
          </div>
        </div>

      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="neutral" size="sm">The Challenge</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Why Race Engineers Miss Critical Emotional Cues
          </h2>
          <p className="text-xs text-zinc-500 max-w-lg mx-auto">
            At 300+ km/h, the line between aggressive driving and catastrophic mistakes is paper-thin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Cognitive Overload on Pit Wall" subtitle="Too much telemetry, zero sentiment">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Engineers monitor 300+ live telemetry channels simultaneously. Subtle vocal pitch shifts that precede driver lockups get lost in raw numerical noise.
            </p>
          </Card>

          <Card title="Cockpit Acoustic Noise & Static" subtitle="120 dB engine interference">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Deafening engine roar and radio static mask micro-tremors in driver speech, making manual stress detection nearly impossible during high-G deceleration.
            </p>
          </Card>

          <Card title="Delayed Tactical Decisions" subtitle="Reacting after the lockup happens">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              By the time tire degradation shows up as a flat-spot on telemetry, the undercut window has closed and the race lead is lost.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. THE SOLUTION WORKFLOW */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="white" size="sm">End-to-End Pipeline</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            From Noisy Radio to Tactical Pit Decisions
          </h2>
          <p className="text-xs text-zinc-500 max-w-lg mx-auto">
            A real-time multi-modal intelligence loop connecting voice biometrics directly to pit strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} className="relative flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span className="font-semibold font-tabular text-zinc-900 dark:text-white">{step.step}</span>
                    <Icon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-950 dark:text-white">{step.title}</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. KEY FEATURES GRID */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="neutral" size="sm">Capabilities</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Built for Formula Race Engineers
          </h2>
          <p className="text-xs text-zinc-500 max-w-lg mx-auto">
            Combining the scannability of Notion with the precision of Linear and Formula 1 telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" size="sm">{feat.badge}</Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-zinc-950 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. ARCHITECTURE PREVIEW */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="white" size="sm">System Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Modular, Resilient & Real-Time
          </h2>
        </div>

        <Card className="p-6 text-center space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="font-semibold text-zinc-950 dark:text-white block">React 18 + Vite</span>
              <p className="text-zinc-500 text-[11px]">Recharts Telemetry, ThemeProvider, Context State Architecture</p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="font-semibold text-zinc-950 dark:text-white block">Express 4 + Multer</span>
              <p className="text-zinc-500 text-[11px]">Modular Service Layer, In-Memory Telemetry & JWT Auth</p>
            </div>

            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="font-semibold text-zinc-950 dark:text-white block">Hugging Face API</span>
              <p className="text-zinc-500 text-[11px]">Whisper Large v3 (STT) + DistilRoBERTa Emotion Classifier</p>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/architecture">
              <Button variant="secondary" size="sm" className="gap-1.5">
                Explore Complete Architecture Breakdown <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 space-y-6 shadow-xl">
        <div className="space-y-2">
          <Badge variant="white" size="sm">Hackathon Ready</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Experience the Pit Wall Control Room?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-600 max-w-md mx-auto leading-relaxed">
            Launch the console with Demo Mode pre-loaded to evaluate the full Silverstone GP race scenario in under 2 minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button variant="primary" size="md" className="gap-2 bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white hover:opacity-90">
              Launch Console (Demo Mode Pre-loaded) <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
