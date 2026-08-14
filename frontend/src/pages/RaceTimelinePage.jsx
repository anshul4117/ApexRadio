import React, { useState } from 'react';
import {
  Clock,
  Radio,
  Activity,
  Gauge,
  Zap,
  Flag,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  FileText,
  Check,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';

export const RaceTimelinePage = () => {
  const { history, currentAnalysis } = useRadio();
  const { lapStats, correlation, currentLap, lapsLoaded } = useLap();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'RADIO' | 'LAP' | 'RISK' | 'AI'

  const activeLap = currentLap || 18;
  const degradationStr = correlation?.performanceDegradationStr || '+1.58 s/lap';
  const paceLossStr = correlation?.paceLossPercentageStr || '+1.76%';
  const correlationLevel = correlation?.correlationLevel || 'High';

  // Chronological timeline events directly reflecting Grand Prix Problem Statement milestones
  const defaultEvents = [
    {
      id: 'tl_corr_update',
      lap: activeLap,
      time: '14:22:45 UTC',
      category: 'AI',
      categoryLabel: 'Correlation Updated',
      title: `Correlation Updated: ${correlationLevel} Correlation (${paceLossStr} Pace Loss)`,
      description: `Engine computed Before-Stress Pace (${correlation?.avgBeforeStressTime || '1:29.540'}) vs After-Stress Pace (${correlation?.avgAfterStressTime || '1:31.120'}). Performance degradation confirmed at ${degradationStr}. Recommendation: "${correlation?.recommendation?.action || 'Driver stress is affecting pace. Consider reducing radio traffic.'}"`,
      badge: `${correlationLevel} Correlation`,
      status: correlationLevel === 'High' ? 'critical' : 'nominal',
      icon: Activity,
    },
    {
      id: 'tl_lap_deg',
      lap: activeLap,
      time: '14:22:38 UTC',
      category: 'LAP',
      categoryLabel: 'Lap Degradation Detected',
      title: `Lap Degradation Detected: ${degradationStr} Pace Loss`,
      description: `Telemetry records thermal front-left surface degradation (40.4%). Lap time: 1:31.240 (+1.82s vs stint best). Sector 2 split: 35.610s.`,
      badge: degradationStr,
      status: 'critical',
      icon: TrendingDown,
    },
    {
      id: 'tl_stress_det',
      lap: activeLap,
      time: '14:22:34 UTC',
      category: 'RADIO',
      categoryLabel: 'Stress Detected',
      title: `Stress Detected: ${currentAnalysis?.emotion?.stressScore || 78}% Index (+42.5 Hz Jitter)`,
      description: `Acoustic pitch jitter (+42.5 Hz) and elevated cadence (185 WPM) classified driver state as "${currentAnalysis?.emotion?.driverState || 'Stressed'}".`,
      badge: `Stress ${currentAnalysis?.emotion?.stressScore || 78}%`,
      status: 'critical',
      icon: Gauge,
    },
    {
      id: 'tl_transcript_gen',
      lap: activeLap,
      time: '14:22:32 UTC',
      category: 'RADIO',
      categoryLabel: 'Transcript Generated',
      title: 'Transcript Generated via Hugging Face Whisper Large v3',
      description: `"${currentAnalysis?.transcript || 'Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car.'}" (Confidence: ${currentAnalysis?.confidence || 96.8}%)`,
      badge: 'Transcript 200 OK',
      status: 'nominal',
      icon: FileText,
    },
    {
      id: 'tl_radio_recv',
      lap: activeLap,
      time: '14:22:30 UTC',
      category: 'RADIO',
      categoryLabel: 'Radio Received',
      title: 'Radio Received: Turn 4 Cockpit Transmission',
      description: 'Incoming radio audio captured from Car #1 (Max Verstappen) during heavy braking into Turn 4.',
      badge: 'Radio Ingested',
      status: 'nominal',
      icon: Radio,
    },
    {
      id: 'tl_06',
      lap: 16,
      time: '14:15:30 UTC',
      category: 'AI',
      categoryLabel: 'AI Brevity Mode',
      title: 'Automated Radio Brevity Mode Active',
      description: 'Telemetry recorded 4.8G braking into Stowe corner. Background brevity protocol held non-essential engineer telemetry updates.',
      badge: 'Brevity Held',
      status: 'nominal',
      icon: Zap,
    },
    {
      id: 'tl_07',
      lap: 14,
      time: '14:12:00 UTC',
      category: 'LAP',
      categoryLabel: 'Fastest Stint Lap',
      title: 'Verstappen Sets Fastest Stint Lap (1:29.420)',
      description: 'Purple Sector 1 (28.110s) and Sector 3 (27.100s). Driver acoustic stress recorded at calm baseline (22%). Top speed: 328.9 km/h.',
      badge: 'Fastest Lap',
      status: 'nominal',
      icon: Flag,
    },
    {
      id: 'tl_08',
      lap: 12,
      time: '14:10:00 UTC',
      category: 'AI',
      categoryLabel: 'Rival Pit Strategy',
      title: 'Hamilton Pitted for Hard Compound (Mercedes #44)',
      description: 'Lewis Hamilton completed 2.4s stop. AI triggered undercut window alert for Verstappen with target pit entry on Lap 21.',
      badge: 'Undercut Threat',
      status: 'nominal',
      icon: Zap,
    },
    {
      id: 'tl_10',
      lap: 1,
      time: '13:50:00 UTC',
      category: 'LAP',
      categoryLabel: 'Race Start',
      title: 'Silverstone GP Lights Out & Stint Start',
      description: 'Max Verstappen holds P1 off the line into Turn 1 (Abbey). Initial telemetry baseline calibrated.',
      badge: 'Race Start',
      status: 'nominal',
      icon: Flag,
    },
  ];

  const filteredEvents = defaultEvents.filter((evt) => {
    if (filterType === 'ALL') return true;
    return evt.category === filterType;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <SectionHeader
        title="Chronological Race & Telemetry Timeline"
        subtitle="Multi-track event stream: Radio received &rarr; Transcript generated &rarr; Stress detected &rarr; Lap degradation detected &rarr; Correlation updated"
        badge={<Badge variant="neutral">Silverstone GP · Laps 1–{lapsLoaded || 18}</Badge>}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900/60 overflow-x-auto">
              {['ALL', 'RADIO', 'LAP', 'RISK', 'AI'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterType(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    filterType === cat
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm">
              Scrub to Lap {activeLap}
            </Button>
          </div>
        }
      />

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-6 text-xs ml-2 sm:ml-4">
        {filteredEvents.map((evt, idx) => {
          const Icon = evt.icon;

          return (
            <div
              key={evt.id}
              className="relative group animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Timeline Dot Node Indicator with Connector */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white flex items-center justify-center shadow-xs">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    evt.status === 'critical'
                      ? 'bg-rose-500 animate-pulse'
                      : evt.status === 'strategy'
                      ? 'bg-amber-400'
                      : 'bg-zinc-900 dark:bg-white'
                  }`}
                />
              </div>

              <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-xs card-hover-lift">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <Badge variant="white" size="sm">Lap {evt.lap}</Badge>
                      <span className="text-zinc-400 text-xs font-mono font-medium">{evt.time}</span>
                      <span className="text-zinc-500 text-[11px] font-medium hidden sm:inline">({evt.categoryLabel})</span>
                    </div>
                    <StatusBadge
                      status={evt.status === 'critical' ? 'critical' : 'nominal'}
                      size="sm"
                    >
                      {evt.badge}
                    </StatusBadge>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                    <Icon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <span>{evt.title}</span>
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RaceTimelinePage;
