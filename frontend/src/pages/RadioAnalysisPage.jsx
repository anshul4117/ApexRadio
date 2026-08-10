import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
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

  const transcripts = [
    {
      id: 'tx-001',
      driver: 'Max Verstappen (Car #1)',
      role: 'Driver',
      lap: 18,
      sector: 'Sector 2 (Turn 4)',
      time: '14:22:15 UTC',
      text: 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.',
      stress: 78,
      urgency: 'Elevated',
      pitchJitter: '+42.5 Hz',
      vocalIntensity: '88 dB',
      speechRate: '185 WPM',
      status: 'critical',
    },
    {
      id: 'tx-002',
      driver: 'GP Lambiase',
      role: 'Race Engineer',
      lap: 18,
      sector: 'Sector 2',
      time: '14:22:21 UTC',
      text: 'Copy Max, we see the thermal degradation. Switch to Strat 4 and adjust brake bias +1 forward.',
      stress: 15,
      urgency: 'Nominal',
      pitchJitter: '+12.0 Hz',
      vocalIntensity: '72 dB',
      speechRate: '130 WPM',
      status: 'nominal',
    },
    {
      id: 'tx-003',
      driver: 'Max Verstappen (Car #1)',
      role: 'Driver',
      lap: 16,
      sector: 'Sector 2 (Hangar Straight)',
      time: '14:18:40 UTC',
      text: 'Traffic ahead in Sector 2! He is weaving on the straight.',
      stress: 62,
      urgency: 'Moderate',
      pitchJitter: '+31.2 Hz',
      vocalIntensity: '84 dB',
      speechRate: '172 WPM',
      status: 'high-stress',
    },
    {
      id: 'tx-004',
      driver: 'Lewis Hamilton (Car #44)',
      role: 'Driver',
      lap: 14,
      sector: 'Sector 1 (Turn 1)',
      time: '14:12:02 UTC',
      text: 'There is vibration under heavy braking into Turn 1. Check if the front wing is loose.',
      stress: 58,
      urgency: 'Moderate',
      pitchJitter: '+28.1 Hz',
      vocalIntensity: '79 dB',
      speechRate: '150 WPM',
      status: 'high-stress',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Radio & Speech Analyzer"
        subtitle="Audio stream processing, acoustic stress biometrics and NLP urgency classification"
        badge={<StatusBadge status="live">AI Ingestion Active</StatusBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" /> Filter Drivers
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5 text-zinc-500" /> Export Logs
            </Button>
          </div>
        }
      />

      {/* Waveform Player */}
      <Card
        title="Active Audio Stream & Acoustic Waveform"
        subtitle="Simulated real-time audio playback with synchronized pitch extraction"
        action={
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Stream' : 'Play Audio Feed'}
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="h-20 bg-zinc-50/70 dark:bg-zinc-950/60 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 p-3 flex items-end justify-between gap-1 overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => {
              const heightPct = Math.max(12, Math.sin(i * 0.4) * 45 + Math.cos(i * 0.9) * 30 + 35);
              const isHighlight = i >= 20 && i <= 32;
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
            <span>Timestamp: 14:22:15.340 UTC</span>
            <span className="text-rose-600 dark:text-rose-400 font-medium">Acoustic stress spike detected (Turn 4)</span>
            <span>Sample Rate: 48 kHz PCM</span>
          </div>
        </div>
      </Card>

      {/* Transcript Log Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          Ingested Radio Transmissions ({transcripts.length})
        </h3>

        <div className="space-y-3">
          {transcripts.map((item) => (
            <Card
              key={item.id}
              className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-semibold text-zinc-950 dark:text-white">{item.driver}</span>
                    <Badge variant="outline" size="sm">Lap {item.lap}</Badge>
                    <span className="text-zinc-400 text-xs">({item.sector})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs">{item.time}</span>
                    <StatusBadge status={item.status} size="sm">
                      Stress {item.stress}% · {item.urgency}
                    </StatusBadge>
                  </div>
                </div>

                <p className="text-zinc-800 dark:text-zinc-200 text-sm pl-3.5 border-l-2 border-zinc-900 dark:border-zinc-100 italic leading-relaxed">
                  "{item.text}"
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500">
                  <div>Pitch Delta: <strong className="text-zinc-900 dark:text-zinc-200 font-tabular">{item.pitchJitter}</strong></div>
                  <div>Intensity: <strong className="text-zinc-900 dark:text-zinc-200 font-tabular">{item.vocalIntensity}</strong></div>
                  <div>Cadence: <strong className="text-zinc-900 dark:text-zinc-200 font-tabular">{item.speechRate}</strong></div>
                  <div>Urgency: <strong className="text-zinc-900 dark:text-zinc-200">{item.urgency}</strong></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RadioAnalysisPage;
