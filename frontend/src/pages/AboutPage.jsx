import React, { useState, useEffect, useRef } from 'react';
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
  Database,
  Eye,
  AlertTriangle,
  Compass,
  CheckCircle,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import InteractiveTelemetryGrid from '../components/ui/InteractiveTelemetryGrid';
import { useTheme } from '../context/ThemeContext';

export const AboutPage = () => {
  const { resolvedTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [passedMilestones, setPassedMilestones] = useState(new Set());
  const [sequencePhase, setSequencePhase] = useState(0); // 0: Waveform, 1: Racing Line, 2: Lap Graph, 3: Stress Pulse, 4: Heartbeat, 5: Identity
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);
  const milestoneRefs = useRef([]);
  const animFrameRef = useRef(null);

  // Phase metadata for the creative visual sequence
  const sequenceStages = [
    { id: 0, label: '01 // Cockpit Radio Waveform', time: 'Acoustic Voice Frequency' },
    { id: 1, label: '02 // Apex Racing Line', time: 'Track Trajectory & Lateral G' },
    { id: 2, label: '03 // Lap-Time Telemetry Graph', time: 'Stint Pace Benchmark' },
    { id: 3, label: '04 // Acoustic Stress Surge', time: '+42.5 Hz Pitch Jitter Detected' },
    { id: 4, label: '05 // Biometric Heartbeat Signal', time: 'Driver Psychological Load' },
    { id: 5, label: '06 // ApexRadio AI Resolution', time: 'The Silent Co-Driver' },
  ];

  // 60fps Morphing Canvas Engine: Waveform -> Racing Line -> Lap Graph -> Stress Pulse -> Heartbeat -> ApexRadio AI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 900);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 280);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 900;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 280;
    };
    window.addEventListener('resize', handleResize);

    let startTime = Date.now();

    const render = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const elapsed = (Date.now() - startTime) / 1000;
      const totalCycle = 18; // 18-second cinematic loop
      const cycleTime = elapsed % totalCycle;

      // Determine current visual morph phase (0 to 5)
      let currentPhase = 0;
      let phaseT = 0; // 0 to 1 progress within phase

      if (cycleTime < 3) {
        currentPhase = 0; // Waveform
        phaseT = cycleTime / 3;
      } else if (cycleTime < 6) {
        currentPhase = 1; // Racing Line
        phaseT = (cycleTime - 3) / 3;
      } else if (cycleTime < 9) {
        currentPhase = 2; // Lap Graph
        phaseT = (cycleTime - 6) / 3;
      } else if (cycleTime < 12) {
        currentPhase = 3; // Stress Pulse
        phaseT = (cycleTime - 9) / 3;
      } else if (cycleTime < 15) {
        currentPhase = 4; // Heartbeat ECG
        phaseT = (cycleTime - 12) / 3;
      } else {
        currentPhase = 5; // Brand Resolution
        phaseT = (cycleTime - 15) / 3;
      }

      setSequencePhase(currentPhase);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const pointsCount = 200;
      const pathPoints = [];

      for (let i = 0; i <= pointsCount; i++) {
        const normX = i / pointsCount;
        const px = normX * width;
        let py = centerY;

        // Shape 0: Audio Waveform
        const waveY =
          centerY +
          Math.sin(normX * 18 + elapsed * 6) * 35 * Math.sin(normX * Math.PI) +
          Math.sin(normX * 42 - elapsed * 8) * 15 * Math.sin(normX * Math.PI);

        // Shape 1: Racing Line through Apex Kerb
        const apexY =
          centerY +
          Math.sin(normX * Math.PI) * -50 +
          Math.cos(normX * Math.PI * 1.5) * 20;

        // Shape 2: Lap Time Degradation Curve (Flat stint baseline then upward step)
        const lapDegY =
          normX < 0.55
            ? centerY - 15 + Math.sin(normX * 12) * 4
            : centerY - 15 + (normX - 0.55) * 110;

        // Shape 3: Stress Pulse Inflection with high-frequency vocal jitter
        let stressY = lapDegY;
        if (normX > 0.48 && normX < 0.62) {
          const dist = Math.abs(normX - 0.55) / 0.07;
          stressY += Math.sin((normX - 0.48) * 80 + elapsed * 24) * 45 * (1 - dist);
        }

        // Shape 4: Biometric Heartbeat ECG Curve
        let ecgY = centerY;
        const ecgPos = (normX * 3 + elapsed * 0.8) % 1;
        if (ecgPos > 0.4 && ecgPos < 0.44) ecgY -= 15; // P wave
        else if (ecgPos >= 0.44 && ecgPos < 0.47) ecgY += 25; // Q
        else if (ecgPos >= 0.47 && ecgPos < 0.52) ecgY -= 65; // R spike
        else if (ecgPos >= 0.52 && ecgPos < 0.56) ecgY += 35; // S
        else if (ecgPos >= 0.56 && ecgPos < 0.64) ecgY -= 20; // T wave

        // Shape 5: Elegant Horizon Line Resolving to Identity
        const resolveY = centerY + Math.sin(normX * Math.PI) * -6;

        // Interpolate points smoothly across current phase
        if (currentPhase === 0) {
          py = waveY;
        } else if (currentPhase === 1) {
          py = waveY * (1 - phaseT) + apexY * phaseT;
        } else if (currentPhase === 2) {
          py = apexY * (1 - phaseT) + lapDegY * phaseT;
        } else if (currentPhase === 3) {
          py = lapDegY * (1 - phaseT) + stressY * phaseT;
        } else if (currentPhase === 4) {
          py = stressY * (1 - phaseT) + ecgY * phaseT;
        } else {
          py = ecgY * (1 - phaseT) + resolveY * phaseT;
        }

        pathPoints.push({ x: px, y: py });
      }

      // Draw Main Glowing Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }

      // Dynamic Color & Glow depending on theme & phase
      const isStressedPhase = currentPhase === 3 || (currentPhase === 2 && phaseT > 0.6);
      const strokeColor = isStressedPhase
        ? '#f43f5e'
        : isDark
        ? '#ffffff'
        : '#09090b';

      const glowColor = isStressedPhase
        ? 'rgba(244, 63, 94, 0.85)'
        : isDark
        ? 'rgba(255, 255, 255, 0.45)'
        : 'rgba(9, 9, 11, 0.2)';

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5 * window.devicePixelRatio;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 18 * window.devicePixelRatio;
      ctx.stroke();
      ctx.restore();

      // Draw Stress Beacon Pulse at Lap 18 inflection point (x ~ 55%)
      if (currentPhase >= 2 && currentPhase <= 4) {
        const beaconX = 0.55 * width;
        const beaconY = pathPoints[Math.floor(pointsCount * 0.55)]?.y || centerY;
        const pulseRadius = (Math.sin(elapsed * 8) + 1) * 12 + 4;

        ctx.save();
        ctx.beginPath();
        ctx.arc(beaconX, beaconY, pulseRadius * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(beaconX, beaconY, 4 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [resolvedTheme]);

  // 7 Core Roadmap Milestones
  const milestones = [
    {
      stage: 'Stage 1',
      title: 'Radio Ingestion',
      tagline: 'Upload driver radio audio',
      desc: 'Ingests high-RPM cockpit voice audio through live microphone recording, WAV/MP3 uploads, or direct CAN bus telemetry feed.',
      icon: Volume2,
      badge: 'Live Audio & Stream',
      tech: 'Multer Disk Storage · Web Audio API · PCM 16-Bit',
      result: 'Raw audio stream buffered for acoustic processing',
    },
    {
      stage: 'Stage 2',
      title: 'Speech-to-Text',
      tagline: 'Groq Whisper converts audio into text',
      desc: 'High-speed Whisper Large v3 LPU & Hugging Face inference transcribes noisy cockpit speech with motorsport domain accuracy in sub-seconds.',
      icon: Radio,
      badge: 'Sub-700ms LPU',
      tech: 'Groq Whisper Large v3 · Hugging Face Router API',
      result: 'High-confidence motorsport transcript generated',
    },
    {
      stage: 'Stage 3',
      title: 'Emotion Detection',
      tagline: 'Driver classified as Calm, Stressed, or Tired',
      desc: 'Extracts acoustic vocal pitch jitter (+Hz), speech cadence (WPM), and intensity (dB) combined with DistilRoBERTa NLP classification.',
      icon: Activity,
      badge: 'Prosody & NLP',
      tech: 'DistilRoBERTa Emotion Model · Acoustic FFT Extraction',
      result: 'Classified: Stressed (78% Index, +42.5 Hz Jitter)',
    },
    {
      stage: 'Stage 4',
      title: 'Lap Telemetry Upload',
      tagline: 'CSV lap-time data is parsed and synchronized',
      desc: 'Parses timing CSV datasets with lap numbers and sector splits, establishing an 18-lap baseline to measure stint consistency.',
      icon: FileSpreadsheet,
      badge: 'CAN Telemetry',
      tech: 'PapaParse Telemetry Engine · Moving Average Filter',
      result: '18 Laps parsed with pre-stress baseline benchmark',
    },
    {
      stage: 'Stage 5',
      title: 'Correlation Engine',
      tagline: 'Stress is compared with lap performance before and after the stress event',
      desc: 'Partitions race telemetry around the detected radio event (Lap 18) to compare average lap time before stress (1:29.81s) vs after stress (1:31.24s).',
      icon: TrendingDown,
      badge: 'Stint Partitioning',
      tech: 'Statistical Partitioning Algorithm · Variance Analysis',
      result: 'Degradation Delta computed: +1.43 s/lap (+1.59% Pace Loss)',
    },
    {
      stage: 'Stage 6',
      title: 'Engineering Insight',
      tagline: 'Performance degradation, pace loss, and correlation level are calculated',
      desc: 'Synthesizes biometric load and lap pace into a quantitative risk tier (High / Medium / Low) with transparent explainability weight attribution.',
      icon: Zap,
      badge: 'Multi-Factor AI',
      tech: 'Explainability Attribution Matrix · Risk Scoring',
      result: 'High Correlation · Performance Risk Score 67% (Tier 3)',
    },
    {
      stage: 'Stage 7',
      title: 'Race Engineer Dashboard',
      tagline: 'Engineers receive a visual chart, timeline, alerts, and actionable recommendations',
      desc: 'Delivers real-time pit wall directives ("Enforce radio silence through Sector 2; prepare Lap 21 pit window for Hard compound") across interactive dashboards.',
      icon: Gauge,
      badge: 'Pit Wall HUD',
      tech: 'Recharts Telemetry Canvas · Real-Time Alert System',
      result: 'Instant tactical pit stop decision support for race engineer',
    },
  ];

  // High-performance, two-way scroll tracking (Works smoothly scrolling down AND scrolling up)
  useEffect(() => {
    let ticking = false;

    const updateTimeline = () => {
      if (!timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerY = windowHeight * 0.62; // Trigger threshold at 62% of viewport

      // 1. Calculate laser progress fill line height
      const lineStart = timelineRect.top;
      const totalLength = timelineRect.height;

      if (totalLength > 0) {
        const currentFill = triggerY - lineStart;
        const clampedFill = Math.max(0, Math.min(totalLength, currentFill));
        const progressPercentage = (clampedFill / totalLength) * 100;
        setScrollProgress(progressPercentage);
      }

      // 2. Determine active milestones based on DOM node centers (Two-way responsive)
      const passed = new Set();
      milestoneRefs.current.forEach((el, index) => {
        if (!el) return;
        const nodeRect = el.getBoundingClientRect();
        const nodeCenter = nodeRect.top + nodeRect.height / 2;
        if (nodeCenter <= triggerY) {
          passed.add(index);
        }
      });

      setPassedMilestones(passed);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTimeline);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateTimeline();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const problemPoints = [
    {
      title: 'Constant Cockpit Radio Noise',
      desc: 'Race engineers monitor dozens of live telemetry screens while simultaneously listening to noisy, compressed radio transmissions over high-RPM engine roar.',
      icon: Volume2,
      accent: 'border-zinc-300 dark:border-zinc-700',
    },
    {
      title: 'Emotional Warning Signs Are Missed',
      desc: 'Micro-tremors in vocal pitch (+42.5 Hz jitter) and elevated cadence signal driver overload, tire degradation, or brake fatigue before it appears on timing screens.',
      icon: AlertTriangle,
      accent: 'border-rose-500/40 text-rose-500',
    },
    {
      title: 'Driver Stress Hurts Lap Pace',
      desc: 'Psychological tension directly causes missed apexes, lockups, and overheating rear tires, leading to compounding lap degradation of up to +1.43 seconds per lap.',
      icon: TrendingDown,
      accent: 'border-rose-500/40 text-rose-500',
    },
    {
      title: 'The Missing Telemetry Connection',
      desc: 'Traditional timing software only tracks sector times, leaving race engineers without a unified system to connect voice stress with lap pace loss.',
      icon: ShieldAlert,
      accent: 'border-zinc-300 dark:border-zinc-700',
    },
  ];

  const solutionFlow = [
    { label: 'Driver Radio Audio', desc: 'Cockpit voice transmission', icon: Volume2 },
    { label: 'Groq / HF Whisper', desc: 'Sub-700ms transcription', icon: Radio },
    { label: 'Acoustic Transcript', desc: 'Motorsport vocabulary', icon: Activity },
    { label: 'Emotion Detection', desc: 'Pitch jitter & driver state', icon: Gauge },
    { label: 'Lap Telemetry CSV', desc: '18-Lap timing benchmark', icon: FileSpreadsheet },
    { label: 'Stress ↔ Lap Correlation', desc: '+1.43s pace degradation', icon: TrendingDown },
    { label: 'Engineering Insight', desc: 'Tactical pit window triggers', icon: Zap },
  ];

  const architectureLayers = [
    {
      title: 'Frontend Client',
      desc: 'Ultra-fast single-page race console with zero page reloads',
      icon: Code2,
      badge: 'Client Tier',
      items: [
        { name: 'React 18 + Vite', desc: 'Modular SPA architecture with concurrent rendering' },
        { name: 'Tailwind CSS System', desc: 'Minimalist high-contrast F1 pit wall design tokens' },
        { name: 'Recharts Telemetry', desc: 'Interactive 60fps pace degradation curves' },
        { name: 'Canvas Physics Grid', desc: 'Interactive elastic background surface & mobile waves' },
      ],
    },
    {
      title: 'Backend Services',
      desc: 'High-throughput Node.js micro-services & AI orchestrator',
      icon: Server,
      badge: 'Service Tier',
      items: [
        { name: 'Node.js + Express', desc: 'RESTful API with streaming multipart ingestion' },
        { name: 'Groq Whisper LPU', desc: 'Ultra-low latency cockpit speech-to-text' },
        { name: 'Hugging Face DistilRoBERTa', desc: 'Acoustic & NLP emotion classification' },
        { name: 'Correlation Engine', desc: 'Real-time statistical stint pace degradation calculator' },
      ],
    },
    {
      title: 'Data & State Layer',
      desc: 'Single source of truth synchronized race session',
      icon: Database,
      badge: 'Data Tier',
      items: [
        { name: 'Unified Race Session', desc: 'Central state singleton driving all dashboard views' },
        { name: 'Lap Telemetry Store', desc: '18-Lap moving average baseline & sector deltas' },
        { name: 'Driver Acoustic Biometrics', desc: 'Pitch jitter (+Hz), cadence (WPM), intensity (dB)' },
        { name: 'Explainability Matrix', desc: 'Multi-factor decision weights & telemetry evidence' },
      ],
    },
  ];

  const impactBenefits = [
    {
      title: 'Detect Hidden Driver Stress Early',
      desc: 'Identify vocal tension surges and psychological cognitive overload laps before driver mistakes happen on track.',
      stat: '+42.5 Hz',
      statLabel: 'Acoustic Jitter Detection',
      icon: Activity,
    },
    {
      title: 'Prevent Performance Degradation',
      desc: 'Quantify pace loss in real time to prevent thermal tire degradation and protect track position.',
      stat: '+1.43s',
      statLabel: 'Pace Degradation Delta',
      icon: TrendingDown,
    },
    {
      title: 'Support Faster Engineering Decisions',
      desc: 'Generate sub-second tactical directives (radio brevity, undercut pit stop windows) under race pressure.',
      stat: '<700ms',
      statLabel: 'Decision Pipeline Speed',
      icon: Zap,
    },
    {
      title: 'Improve Complete Strategy Awareness',
      desc: 'Unite cockpit audio with CAN bus timing data into a single synchronized race engineering cockpit.',
      stat: '100%',
      statLabel: 'Synchronized Session',
      icon: Gauge,
    },
  ];

  return (
    <div className="relative space-y-16 sm:space-y-24 pb-16 overflow-x-hidden transition-colors duration-300">
      
      {/* 1. CINEMATIC STORYTELLING HERO (Strict Requirement: Starts with Paragraph Only, morphs into living acoustic -> racing line -> lap curve -> heartbeat sequence) */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 py-12 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-zinc-50/80 dark:bg-[#050507] text-zinc-950 dark:text-white transition-colors duration-300 overflow-hidden select-none">
        
        {/* Soft Radial Vignette Overlay (Theme Aware) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/40 via-zinc-100/70 to-zinc-50/90 dark:from-zinc-900/40 dark:via-[#070709] dark:to-[#020203] pointer-events-none transition-colors duration-300" />

        {/* 1. FIRST THING VISIBLE: THE MANDATORY 2-3 LINE OPENING PARAGRAPH (No title, no badge, no heading) */}
        <div className="relative z-20 max-w-3xl mx-auto pt-6 sm:pt-10 px-2 animate-fade-in [animation-duration:1.2s]">
          <p className="text-lg sm:text-2xl md:text-3xl font-light text-zinc-900 dark:text-zinc-200 sm:leading-[1.4] tracking-tight font-sans">
            “ApexRadio AI listens to driver radio communication, understands the driver’s emotional state, compares it with lap-time performance, and helps race engineers detect hidden performance problems before they become race-losing decisions.”
          </p>
        </div>

        {/* 2. HIGHLY CREATIVE VISUAL MORPHING SEQUENCE (Waveform -> Racing Line -> Lap Graph -> Stress Pulse -> Heartbeat -> ApexRadio AI) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-4 sm:py-8 space-y-4">
          
          {/* Morphing Canvas Stage */}
          <div className="relative h-44 sm:h-56 w-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
            />

            {/* Resolved Brand Overlay at Phase 5 */}
            {sequencePhase === 5 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 animate-fade-in [animation-duration:0.8s] pointer-events-none">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  ApexRadio AI
                </h2>
                <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                  The Silent Co-Driver
                </span>
              </div>
            )}
          </div>

          {/* Sequence Phase Label Ticker */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-950/80 border border-zinc-200/90 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-800 dark:text-zinc-300 shadow-2xs">
              <span className={`w-1.5 h-1.5 rounded-full ${sequencePhase === 3 ? 'bg-rose-500 animate-ping' : 'bg-zinc-900 dark:bg-white'}`} />
              <span>{sequenceStages[sequencePhase]?.label}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              {sequenceStages[sequencePhase]?.time}
            </span>
          </div>

        </div>

        {/* 3. SUBTLE SCROLL CUE */}
        <div className="relative z-10 pb-4 animate-fade-in [animation-duration:2s]">
          <a
            href="#story-problem"
            className="group inline-flex flex-col items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <span className="tracking-widest uppercase text-[10px] sm:text-[11px] group-hover:text-rose-500 transition-colors">
              Continue the story ↓
            </span>
            <div className="w-4 h-7 rounded-full border border-zinc-300 dark:border-zinc-800 flex items-start justify-center p-1 group-hover:border-rose-500/80 transition-colors">
              <div className="w-1 h-1.5 bg-rose-500 rounded-full animate-bounce" />
            </div>
          </a>
        </div>

      </section>

      {/* Interactive Telemetry Grid for Lower Technical Sections */}
      <InteractiveTelemetryGrid />

      {/* 2. THE PROBLEM (Formula Racing Communication Challenge) */}
      <section id="story-problem" className="relative z-10 max-w-5xl mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>The Racing Challenge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            The Problem: The Invisible Gap in Formula Pit Walls
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Why modern race engineering teams miss vital psychological signals in high-pressure Grand Prix races.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {problemPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className={`p-5 sm:p-6 space-y-3 card-hover-lift border-t-2 ${item.accent}`}>
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">#0{idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. THE SOLUTION (Visual Flow Diagram) */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>The Architecture Solution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            The Solution: End-to-End Intelligence Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            How ApexRadio AI connects cockpit speech with live telemetry to produce sub-second pit wall directives.
          </p>
        </div>

        {/* Visual Flow Pipeline */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-[#0c0c0e]/80 p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
            {solutionFlow.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative group">
                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2 text-center h-full flex flex-col justify-between card-hover-lift">
                    <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 mx-auto flex items-center justify-center font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-zinc-950 dark:text-white block leading-tight">
                        {step.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 block leading-tight">
                        {step.desc}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-rose-500 block">
                      Step 0{idx + 1}
                    </span>
                  </div>

                  {/* Connecting Arrow for Desktop (between items) */}
                  {idx < solutionFlow.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-zinc-400">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
            <span className="font-bold tracking-wider">⚡ END-TO-END EXECUTION SPEED:</span>
            <span className="text-rose-400 dark:text-rose-600 font-bold">&lt; 700ms Inference Latency · Zero-Blocking Asynchronous Processing</span>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE ROADMAP TIMELINE (Main Storytelling Feature) */}
      <section ref={timelineRef} className="relative z-10 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-rose-500" />
            <span>Interactive Scroll-Linked Timeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Grand Prix System Execution Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Scroll down to watch the intelligence pipeline execute step by step in real time.
          </p>
        </div>

        {/* Vertical Animated Roadmap Container */}
        <div className="relative py-4">
          
          {/* Background Static Vertical Center Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-zinc-200 dark:bg-zinc-800" />

          {/* Active Animated Glowing Laser Fill Line (Two-Way Scroll-Driven) */}
          <div
            className="absolute left-6 md:left-1/2 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-rose-500 via-rose-500 to-rose-400 transition-all duration-150 shadow-[0_0_12px_rgba(244,63,94,0.7)] pointer-events-none"
            style={{ height: `${scrollProgress}%` }}
          />

          {/* Milestone Cards Stream */}
          <div className="space-y-12 sm:space-y-16">
            {milestones.map((m, idx) => {
              const Icon = m.icon;
              const isPassed = passedMilestones.has(idx);
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  ref={(el) => (milestoneRefs.current[idx] = el)}
                  className={`relative flex flex-col md:flex-row items-start md:items-center transition-all duration-300 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Center Node Indicator */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                        isPassed
                          ? 'bg-rose-500 text-white scale-110 shadow-[0_0_18px_rgba(244,63,94,0.7)] ring-4 ring-rose-500/20'
                          : 'bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-2 border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="text-xs font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Milestone Content Card (Left or Right on desktop, offset on mobile) */}
                  <div
                    className={`w-full md:w-[44%] pl-14 md:pl-0 ${
                      isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                    }`}
                  >
                    <div
                      className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 space-y-3 card-hover-lift ${
                        isPassed
                          ? 'border-zinc-900 dark:border-zinc-200 bg-white dark:bg-[#0e0e11] shadow-lg scale-[1.01]'
                          : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/30 opacity-60'
                      }`}
                    >
                      {/* Card Top Metadata Header */}
                      <div className={`flex flex-wrap items-center gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <span className="text-xs font-mono font-bold text-rose-500">
                          {m.stage}
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700">·</span>
                        <Badge variant={isPassed ? 'neutral' : 'outline'} size="sm">
                          {m.badge}
                        </Badge>
                      </div>

                      {/* Title & Tagline */}
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
                          {m.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400">
                          "{m.tagline}"
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {m.desc}
                      </p>

                      {/* Technical Spec Strip */}
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-[11px] font-mono">
                        <div className="text-zinc-500">
                          <strong>Tech:</strong> {m.tech}
                        </div>
                        <div className="text-zinc-900 dark:text-zinc-100 font-semibold">
                          <strong>Output:</strong> {m.result}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. ARCHITECTURE SECTION (Clean Card-Based Overview) */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-rose-500" />
            <span>Technical Blueprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Modular Three-Tier System Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Clean architectural separation uniting high-speed client interfaces, streaming AI models, and real-time session state.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {architectureLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <Card key={idx} className="p-5 sm:p-6 space-y-4 card-hover-lift flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" size="sm">{layer.badge}</Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                      {layer.title}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {layer.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {layer.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 space-y-0.5 text-xs">
                        <span className="font-bold text-zinc-950 dark:text-white block font-mono text-[11px]">
                          {item.name}
                        </span>
                        <p className="text-[10px] text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/architecture" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1">
                    View full technical schema <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 6. WHY IT MATTERS (The Impact of Voice Biometrics in Racing) */}
      <section className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Strategic Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Why ApexRadio AI Matters on the Pit Wall
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Turning raw acoustic stress into a competitive tactical advantage in Formula motorsport.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {impactBenefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-[#0e0e11]/80 backdrop-blur-xs space-y-3 card-hover-lift flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center font-bold text-xs">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-baseline justify-between font-mono">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">{item.statLabel}</span>
                  <span className="text-sm font-bold text-rose-500">{item.stat}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL VISION SECTION */}
      <section className="relative z-10 max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md space-y-4 shadow-xl mx-2 sm:mx-auto card-hover-lift">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>The Grand Prix Vision</span>
        </div>

        <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white leading-snug">
          “ApexRadio AI acts as a silent co-driver that listens when engineers are too busy watching the numbers.”
        </blockquote>
      </section>

    </div>
  );
};

export default AboutPage;
