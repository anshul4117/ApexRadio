import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  UploadCloud,
  FileAudio,
  Sparkles,
  Gauge,
  Activity,
  CheckCircle2,
  Filter,
  Download,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const RadioAnalysisPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSample, setActiveSample] = useState('lap18');

  const sampleRadios = [
    {
      id: 'lap18',
      title: 'Lap 18: Turn 4 Understeer & Tire Slip',
      driver: 'Max Verstappen (#1)',
      time: '14:22:15 UTC',
      duration: '4.2s',
      stress: 78,
      status: 'critical',
      transcript: 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.',
      engineerResponse: 'Copy Max, we see the thermal degradation. Switch to Strat 4 and adjust brake bias +1 forward.',
      pitchJitter: '+42.5 Hz',
      vocalIntensity: '88 dB',
      speechRate: '185 WPM',
      confidence: '94.2%',
    },
    {
      id: 'lap22',
      title: 'Lap 22: Brake Vibration Warning',
      driver: 'Lewis Hamilton (#44)',
      time: '14:12:02 UTC',
      duration: '3.8s',
      stress: 58,
      status: 'high-stress',
      transcript: 'There is vibration under heavy braking into Turn 1. Check if the front wing is loose.',
      engineerResponse: 'Copy Lewis, front downforce telemetry looks within nominal range. Monitoring front left disc temp.',
      pitchJitter: '+28.1 Hz',
      vocalIntensity: '79 dB',
      speechRate: '150 WPM',
      confidence: '91.8%',
    },
    {
      id: 'lap31',
      title: 'Lap 31: Sudden Rain Threat at Turn 9',
      driver: 'Lando Norris (#4)',
      time: '14:41:02 UTC',
      duration: '3.1s',
      stress: 88,
      status: 'critical',
      transcript: 'Rain drops on visor at Turn 9! Rain is getting heavier!',
      engineerResponse: 'Copy Lando, pit lane is on standby with intermediate tires. Stay out this lap if manageable.',
      pitchJitter: '+68.4 Hz',
      vocalIntensity: '92 dB',
      speechRate: '210 WPM',
      confidence: '96.5%',
    },
  ];

  const currentSample = sampleRadios.find((s) => s.id === activeSample) || sampleRadios[0];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Radio & Acoustic Speech Analyzer"
        subtitle="Multi-modal driver voice biometric processing, transcription and stress quantification"
        badge={<StatusBadge status="live">Speech AI Ingestion</StatusBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" /> Filter Transcripts
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5 text-zinc-500" /> Export Audio Logs
            </Button>
          </div>
        }
      />

      {/* Top 4 Confidence & Acoustic Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card title="Acoustic Model Confidence" subtitle="Biometric vocal extraction">
          <div className="space-y-1">
            <div className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
              {currentSample.confidence}
            </div>
            <p className="text-xs text-zinc-500">Fine-tuned motorsport speech model</p>
          </div>
        </Card>

        <Card title="Pitch Jitter Delta" subtitle="Voice tension deviation">
          <div className="space-y-1">
            <div className="text-2xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular">
              {currentSample.pitchJitter}
            </div>
            <p className="text-xs text-zinc-500">Compared to driver calm baseline</p>
          </div>
        </Card>

        <Card title="Speech Cadence Rate" subtitle="Vocal transmission speed">
          <div className="space-y-1">
            <div className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
              {currentSample.speechRate}
            </div>
            <p className="text-xs text-zinc-500">Normal conversation: 130–140 WPM</p>
          </div>
        </Card>

        <Card title="Vocal Intensity Peak" subtitle="Decibel pressure level">
          <div className="space-y-1">
            <div className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white font-tabular">
              {currentSample.vocalIntensity}
            </div>
            <p className="text-xs text-zinc-500">Filtered for engine/wind background</p>
          </div>
        </Card>

      </div>

      {/* 2-Column Split: Upload Dropzone & Audio Player on Left, Transcripts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Upload Area & Waveform */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Audio Upload Area (UI Only) */}
          <Card
            title="Ingest Driver Radio Audio"
            subtitle="Upload .wav, .mp3, or .flac radio feeds or load high-stress Formula 1 presets"
            action={<Badge variant="outline" size="sm">Prototype UI</Badge>}
          >
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-col items-center justify-center space-y-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-950 dark:text-white">
                    Click to browse or drag radio audio stream here
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Supports WAV, MP3, FLAC (sample rate 44.1kHz / 48kHz)
                  </p>
                </div>
              </div>

              {/* Sample Preset Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-zinc-500 block">
                  Or load simulated Grand Prix radio transmission:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sampleRadios.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setActiveSample(s.id);
                        setIsPlaying(false);
                      }}
                      className={`p-2.5 rounded-md border text-left text-xs transition-all cursor-pointer ${
                        activeSample === s.id
                          ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium shadow-2xs'
                          : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                      }`}
                    >
                      <div className="font-semibold truncate">{s.title.split(':')[0]}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{s.driver}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Waveform Player & Frequency Spectrum */}
          <Card
            title={`Active Audio Feed: ${currentSample.title}`}
            subtitle={`Duration: ${currentSample.duration} · ${currentSample.time}`}
            action={
              <Button
                variant="primary"
                size="sm"
                className="gap-2"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause Audio' : 'Play Sample'}
              </Button>
            }
          >
            <div className="space-y-4 text-xs">
              <div className="h-20 bg-zinc-50/70 dark:bg-zinc-950/60 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 p-3 flex items-end justify-between gap-1 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => {
                  const heightPct = Math.max(12, Math.sin(i * 0.4) * 45 + Math.cos(i * 0.9) * 30 + 35);
                  const isHighlight = i >= 18 && i <= 32;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-xs transition-all duration-300 ${
                        isHighlight
                          ? 'bg-rose-500 dark:bg-rose-400'
                          : isPlaying
                          ? 'bg-zinc-800 dark:bg-zinc-300'
                          : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-1">
                <span>Driver: <strong>{currentSample.driver}</strong></span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">Acoustic stress spike detected</span>
                <span>Sample Rate: 48 kHz PCM</span>
              </div>
            </div>
          </Card>

          {/* Emotion & Urgency Timeline Across Stint (Placeholder Canvas) */}
          <Card
            title="Stint Emotion & Vocal Tension Progression"
            subtitle="Lap-by-lap cognitive stress curve across Laps 1–18"
            action={<Badge variant="white" size="sm">Emotion Timeline</Badge>}
          >
            <div className="h-48 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-col items-center justify-center p-6 text-center space-y-2 text-xs">
              <Activity className="w-6 h-6 text-zinc-400" />
              <p className="font-semibold text-zinc-950 dark:text-white">
                Vocal Stress & Cadence Timeline Graph
              </p>
              <p className="text-zinc-500 max-w-md leading-relaxed">
                Visualizes transition from calm pacing (Lap 1–14: ~20% stress) to elevated tire degradation panic (Lap 18: 78% stress).
              </p>
            </div>
          </Card>

        </div>

        {/* Right Column: Synchronized Transcript & Recent Messages */}
        <div className="space-y-6">
          
          {/* Synchronized Transcript Panel */}
          <Card
            title="Synchronized Speech Transcripts"
            subtitle="Driver speech & race engineer callouts"
            badge={<StatusBadge status={currentSample.status} size="sm">Stress {currentSample.stress}%</StatusBadge>}
          >
            <div className="space-y-4 text-xs">
              {/* Driver Message */}
              <div className="p-3.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-950 dark:text-white">
                    {currentSample.driver}
                  </span>
                  <span className="text-zinc-400 text-[11px] font-tabular">{currentSample.time}</span>
                </div>
                <p className="text-zinc-800 dark:text-zinc-200 text-sm pl-3 border-l-2 border-zinc-900 dark:border-zinc-100 italic leading-relaxed">
                  "{currentSample.transcript}"
                </p>
              </div>

              {/* Engineer Message */}
              <div className="p-3.5 rounded-lg bg-zinc-50/40 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Race Engineer
                  </span>
                  <span className="text-zinc-400 text-[11px]">Response</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm pl-3 border-l-2 border-zinc-300 dark:border-zinc-700 leading-relaxed">
                  "{currentSample.engineerResponse}"
                </p>
              </div>
            </div>
          </Card>

          {/* Recent Radio Messages Summary */}
          <Card
            title="Stint Radio Transmissions"
            subtitle="All recorded team communications"
          >
            <div className="space-y-2 text-xs">
              {sampleRadios.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSample(s.id)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                    activeSample === s.id
                      ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/60'
                      : 'border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-950 dark:text-white truncate">
                      {s.driver}
                    </span>
                    <StatusBadge status={s.status} size="sm">
                      {s.stress}%
                    </StatusBadge>
                  </div>
                  <p className="text-zinc-500 truncate text-[11px]">
                    "{s.transcript}"
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default RadioAnalysisPage;
