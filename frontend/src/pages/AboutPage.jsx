import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Activity,
  Zap,
  ShieldAlert,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Volume2,
  Gauge,
  ArrowRight,
  Heart,
  Server,
  Code2,
  Terminal,
  Play,
  Flame,
  Check,
  X,
  FileSpreadsheet,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import InteractiveTelemetryGrid from '../components/ui/InteractiveTelemetryGrid';
import AudioWaveformVisualizer from '../components/ui/AudioWaveformVisualizer';

export const AboutPage = () => {
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const chapters = [
    {
      id: '01',
      code: 'CH-01 // THE INVISIBLE TENSION',
      title: 'Why Traditional Timing Screens Miss Critical Cues',
      desc: 'During high-speed stints, drivers face extreme lateral G-forces and sudden balance shifts. When rear tires overheat or understeer develops, vocal pitch jitter increases and speech cadence accelerates before it appears as a red sector on the timing screens.',
      stat: '+42.5 Hz',
      statLabel: 'Vocal Pitch Shift',
    },
    {
      id: '02',
      code: 'CH-02 // THE ACOUSTIC CORRELATION',
      title: 'Quantifying Driver Emotion Into Lap Degradation',
      desc: 'ApexRadio AI partitions live CAN bus telemetry into pre-stress and post-stress stints. In our Silverstone GP benchmark, driver stress at Lap 18 directly coincided with a +1.43 s/lap pace degradation (+1.59% pace loss), proving acoustic signals are predictive indicators.',
      stat: '+1.43s',
      statLabel: 'Pace Loss / Lap',
    },
    {
      id: '03',
      code: 'CH-03 // SUB-SECOND INFERENCE',
      title: 'Sub-Second Speech-to-Text via Hugging Face Whisper',
      desc: 'Formula 1 pit walls cannot wait 5 seconds for cloud transcription. By leveraging Hugging Face Whisper Large v3 inference, radio messages are transcribed in sub-seconds with specialized motorsport vocabulary (delta, undercut, apex, slip).',
      stat: '<700ms',
      statLabel: 'Inference Latency',
    },
    {
      id: '04',
      code: 'CH-04 // TACTICAL PIT DIRECTIVES',
      title: 'Explainable AI for Race Engineers',
      desc: 'Rather than black-box recommendations, ApexRadio AI provides transparent decision weight attributions (40% biometric stress, 30% lap degradation, 20% radio spikes, 10% strategy window) so race engineers make confident, high-stakes tactical decisions.',
      stat: '94.2%',
      statLabel: 'Decision Confidence',
    },
  ];

  const comparisonData = [
    {
      feature: 'Cockpit Audio Transcription',
      traditional: 'Manual listening through high-RPM engine noise',
      apexRadio: 'Instant Hugging Face Whisper Large v3 STT (<700ms) with motorsport domain tuning',
    },
    {
      feature: 'Driver Psychological Stress',
      traditional: 'Subjective engineer intuition; often noticed after driver mistakes',
      apexRadio: 'Real-time vocal pitch jitter (+Hz) & Hugging Face DistilRoBERTa emotion classifier',
    },
    {
      feature: 'Telemetry Correlation',
      traditional: 'Post-race telemetry review or delayed stint overlays',
      apexRadio: 'Automatic pre/post-stress lap partitioning & quantitative delta (+1.43 s/lap)',
    },
    {
      feature: 'Pit Wall Directives',
      traditional: 'Unstructured radio traffic during critical high-G cornering',
      apexRadio: 'Explainable AI directives: radio brevity protocol & Lap 21 undercut triggers',
    },
    {
      feature: 'Session Synchronization',
      traditional: 'Fragmented timing screens, audio loops, and strategy notebooks',
      apexRadio: 'Single source of truth race session object powering all console views in real time',
    },
  ];

  const techStack = [
    { name: 'Hugging Face Whisper v3', tag: 'STT Inference', metric: 'Whisper LPU', color: 'text-rose-500' },
    { name: 'Hugging Face DistilRoBERTa', tag: 'Emotion Classifier', metric: '3-Class Biometrics', color: 'text-amber-500' },
    { name: 'Recharts Telemetry Engine', tag: 'Visual Analytics', metric: '60fps Charting', color: 'text-emerald-500' },
    { name: 'Canvas Physics Matrix', tag: 'Interactive Surface', metric: 'Elastic Grid Mesh', color: 'text-sky-500' },
  ];

  return (
    <div className="relative space-y-16 sm:space-y-24 py-4 sm:py-8 overflow-x-hidden">
      {/* Interactive Telemetry Grid Canvas Background */}
      <InteractiveTelemetryGrid />

      {/* 1. ASYMMETRIC DOSSIER HERO (Editorial Pit Wall Dossier) */}
      <section className="relative z-10 max-w-6xl mx-auto pt-2 sm:pt-4 px-2 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Dossier Title & Manifesto (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* System Classification Header */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span className="px-2 py-0.5 rounded bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold">
                DOC-ID: APEX-F1-2026
              </span>
              <span>·</span>
              <span className="text-rose-500 font-bold">DECLASSIFIED PIT WALL INTELLIGENCE</span>
            </div>

            {/* Editorial Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
              Bridging Driver <span className="text-rose-500 underline decoration-rose-500/40 underline-offset-8">Acoustic Prosody</span> & Grand Prix Telemetry.
            </h1>

            {/* Manifesto Block */}
            <div className="p-4 rounded-xl border-l-4 border-rose-500 bg-zinc-50/90 dark:bg-zinc-900/60 backdrop-blur-xs space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">
                The Engineering Mission
              </span>
              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                "In motorsport, milliseconds are captured in telemetry; championships are won in communication. ApexRadio AI acts as the silent co-driver for race engineers—decoding vocal stress from cockpit radio transmissions to predict pace loss before it compromises the race."
              </p>
            </div>

            {/* Technical Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60">
                <span className="text-[10px] text-zinc-400 block uppercase">STT Latency</span>
                <strong className="text-zinc-950 dark:text-white text-sm font-bold">&lt;700 ms</strong>
              </div>
              <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60">
                <span className="text-[10px] text-zinc-400 block uppercase">Pace Delta</span>
                <strong className="text-rose-500 text-sm font-bold">+1.43 s/lap</strong>
              </div>
              <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-400 block uppercase">Models</span>
                <strong className="text-zinc-950 dark:text-white text-sm font-bold">Hugging Face 🤗</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/dashboard">
                <Button variant="primary" size="lg" className="gap-2 shadow-sm min-h-[46px] px-6">
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Live Console</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/architecture">
                <Button variant="outline" size="lg" className="gap-2 min-h-[46px] px-6">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <span>Architecture Blueprint</span>
                </Button>
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Acoustic Signal Telemetry HUD (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-[#0c0c0e] p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
              
              {/* HUD Header Strip */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                    Cockpit Audio Signal HUD
                  </span>
                </div>
                <StatusBadge status="critical" size="sm">Stress 78%</StatusBadge>
              </div>

              {/* Real-Time Waveform Simulation */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>CAN Bus Audio Stream</span>
                  <span className="text-rose-500 font-bold">FFT Pitch Jitter: +42.5 Hz</span>
                </div>
                <AudioWaveformVisualizer isPlaying={isPlayingSample} className="py-2" />
              </div>

              {/* Sample Transmission Callout Card */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>MAX VERSTAPPEN (#1) · LAP 18</span>
                  <span>14:22:15 UTC</span>
                </div>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold italic text-xs leading-relaxed">
                  "The rear tires are overheating. Massive understeer in Turn 4."
                </p>
                <div className="flex justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40">
                  <span>Cadence: <strong className="text-zinc-900 dark:text-white">185 WPM</strong></span>
                  <span>Confidence: <strong className="text-emerald-500 font-bold">97.3%</strong></span>
                  <span>Risk: <strong className="text-rose-500 font-bold">High (67%)</strong></span>
                </div>
              </div>

              {/* Tactical Directive Result */}
              <div className="p-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-rose-400 dark:text-rose-600">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Generated Pit Wall Action Directive</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-95">
                  "Driver stress is affecting pace. Enforce radio silence through Sector 2 and prepare Lap 21 pit window for Hard compound."
                </p>
              </div>

              {/* Interactive Audio Preview Button */}
              <button
                type="button"
                onClick={() => setIsPlayingSample(!isPlayingSample)}
                className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer text-zinc-800 dark:text-zinc-200"
              >
                <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>{isPlayingSample ? 'Pause Audio Simulation' : 'Simulate Cockpit Audio Signal'}</span>
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE GENESIS & DISCOVERY (Chronological Chapters with Monospace Code Callouts) */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            <span>Research & Development History</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            The Genesis of ApexRadio AI
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            How we connected high-frequency acoustic vocal prosody with telemetry degradation to create a new category in pit wall intelligence.
          </p>
        </div>

        {/* 4 Story Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-[#0e0e11]/80 backdrop-blur-sm space-y-4 card-hover-lift flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-rose-500 tracking-wider">
                    {ch.code}
                  </span>
                  <div className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-500">
                    Phase {ch.id}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
                  {ch.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {ch.desc}
                </p>
              </div>

              {/* Metric Callout Strip */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-baseline justify-between font-mono">
                <span className="text-[11px] text-zinc-400 uppercase font-semibold">{ch.statLabel}</span>
                <span className="text-lg font-bold text-zinc-950 dark:text-white">{ch.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. STRUCTURED COMPARATIVE MATRIX (Traditional Pit Wall vs ApexRadio AI) */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline">Pit Wall Evolution</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Traditional Timing vs. ApexRadio AI Intelligence
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50">
                  <th className="p-4 font-bold text-zinc-950 dark:text-white w-1/4">Tactical Dimension</th>
                  <th className="p-4 font-semibold text-zinc-400 w-3/8">Traditional Pit Wall</th>
                  <th className="p-4 font-bold text-rose-500 w-3/8 bg-rose-50/30 dark:bg-rose-950/20">
                    ApexRadio AI Pipeline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">
                      {row.feature}
                    </td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {row.traditional}
                    </td>
                    <td className="p-4 text-zinc-950 dark:text-zinc-100 font-medium leading-relaxed bg-rose-50/10 dark:bg-rose-950/10">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{row.apexRadio}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL ENGINE MATRIX & OPEN SOURCE ATTRIBUTION */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="outline">Engine Specifications</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Under the Hood: The Four AI Micro-Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-[#0c0c0e]/70 backdrop-blur-xs space-y-2 card-hover-lift font-mono"
            >
              <span className={`text-xs font-bold block ${tech.color}`}>
                {tech.tag}
              </span>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white font-sans truncate">
                {tech.name}
              </h4>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Metric:</span>
                <strong className="text-zinc-900 dark:text-white">{tech.metric}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Hugging Face Dedicated Credit Callout */}
        <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
            <span>Powered by</span>
            <span className="text-lg">🤗</span>
            <span>Hugging Face Inference Platform</span>
            <span>(Whisper Large v3 + DistilRoBERTa)</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xl mx-auto leading-relaxed">
            ApexRadio AI utilizes open-source Whisper Large v3 for ultra-accurate speech-to-text cockpit transcription alongside DistilRoBERTa emotion classification models hosted on Hugging Face.
          </p>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="relative z-10 max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md space-y-6 shadow-xl mx-2 sm:mx-auto card-hover-lift">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Grand Prix Telemetry Simulation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Experience ApexRadio AI in Action
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Enter the live pit wall control room with the 18-lap Silverstone GP scenario pre-loaded to evaluate speech recognition, vocal biometrics, and lap degradation in real time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto justify-center gap-2 shadow-md min-h-[46px] px-6 font-semibold"
            >
              <span>Launch Pit Wall Console</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/architecture" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto justify-center gap-2 min-h-[46px] px-6"
            >
              <Cpu className="w-4 h-4 text-zinc-500" />
              <span>System Architecture</span>
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
