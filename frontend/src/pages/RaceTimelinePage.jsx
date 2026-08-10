import React, { useState } from 'react';
import {
  Volume2,
  Activity,
  Zap,
  Flag,
  Filter,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  Gauge,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';
import { useDemo } from '../context/DemoContext';

export const RaceTimelinePage = () => {
  const { history } = useRadio();
  const { lapStats, correlation, filename } = useLap();
  const { isDemoMode } = useDemo();
  const [filterType, setFilterType] = useState('ALL');

  // Multi-Track Chronological Event Stream (Laps 1 to 18)
  const allTimelineEvents = [
    {
      id: 'tl_01',
      lap: 18,
      time: '14:22:21 UTC',
      category: 'AI',
      categoryLabel: 'AI Directive',
      title: 'Radio Silence Directive Issued (Sector 2)',
      description: 'AI detected 78% vocal stress and elevated Turn 4 lockup probability. Enforced radio silence through high-G braking and queued Lap 21 pit window for Hard compound.',
      badge: 'Pit Directive',
      status: 'strategy',
      icon: Zap,
    },
    {
      id: 'tl_02',
      lap: 18,
      time: '14:22:15 UTC',
      category: 'RADIO',
      categoryLabel: 'Radio & Emotion Spike',
      title: 'Verstappen Radio: "Front Left is Completely Gone"',
      description: 'Speech STT transcript: "Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car." Pitch jitter: +42.5 Hz, vocal intensity: 88 dB.',
      badge: 'Stress 78%',
      status: 'critical',
      icon: Volume2,
    },
    {
      id: 'tl_03',
      lap: 18,
      time: '14:22:00 UTC',
      category: 'RISK',
      categoryLabel: 'Risk Score Escalation',
      title: 'Performance Risk Score Raised: 22% → 61% (High)',
      description: 'Multi-factor correlation engine flagged +0.84s pace loss, front-left tire degradation (40.4%), and 2 consecutive high-stress radio callouts.',
      badge: 'Risk: 61%',
      status: 'critical',
      icon: Gauge,
    },
    {
      id: 'tl_04',
      lap: 18,
      time: '14:20:00 UTC',
      category: 'LAP',
      categoryLabel: 'Lap Completion',
      title: 'Lap 18 Pace Degradation (+1.82s Delta)',
      description: 'Lap time: 1:31.240. Sector 2 split: 35.610s (+1.400s vs stint best). Front left surface thermal overheating detected.',
      badge: 'Lap 18',
      status: 'nominal',
      icon: Flag,
    },
    {
      id: 'tl_05',
      lap: 16,
      time: '14:18:40 UTC',
      category: 'RADIO',
      categoryLabel: 'Radio Callout',
      title: 'Verstappen Radio: Traffic in Sector 2',
      description: 'Speech STT transcript: "Traffic ahead in Sector 2! He is weaving on the straight." Stress evaluated at 62% (High). Pace loss in S2: +0.32s.',
      badge: 'Traffic Callout',
      status: 'high-stress',
      icon: Volume2,
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
      status: 'success',
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
      id: 'tl_09',
      lap: 4,
      time: '13:58:10 UTC',
      category: 'RADIO',
      categoryLabel: 'Radio Callout',
      title: 'Verstappen Radio: Gap Stability Check',
      description: 'Transcript: "Gap to car behind is stable at plus two point five seconds. Balance feels good." Stress score: 18% (Calm).',
      badge: 'Calm Baseline',
      status: 'nominal',
      icon: Volume2,
    },
    {
      id: 'tl_10',
      lap: 1,
      time: '13:52:00 UTC',
      category: 'LAP',
      categoryLabel: 'Race Start',
      title: 'Lights Out · Silverstone Grand Prix Start',
      description: 'Verstappen retained P1 into Copse corner. Clear air established with 0.8s gap to Hamilton.',
      badge: 'Lights Out',
      status: 'live',
      icon: Flag,
    },
  ];

  const filteredEvents = allTimelineEvents.filter((e) => {
    if (filterType === 'RADIO') return e.category === 'RADIO';
    if (filterType === 'EMOTION') return e.category === 'RADIO' && e.status === 'critical';
    if (filterType === 'LAP') return e.category === 'LAP';
    if (filterType === 'RISK') return e.category === 'RISK';
    if (filterType === 'AI') return e.category === 'AI';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Chronological Race & Telemetry Timeline"
        subtitle="Multi-track event stream correlating driver radio, vocal emotion spikes, lap deltas, risk score escalations and AI directives"
        badge={<Badge variant="neutral">Silverstone GP · Laps 1–18</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-50 dark:bg-zinc-900/60">
              {['ALL', 'RADIO', 'LAP', 'RISK', 'AI'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterType(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
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
              Scrub to Lap 18
            </Button>
          </div>
        }
      />

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-5 text-xs ml-2 sm:ml-4">
        {filteredEvents.map((evt) => {
          const Icon = evt.icon;

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-3.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white flex items-center justify-center shadow-2xs">
                <div
                  className={`w-1 h-1 rounded-full ${
                    evt.status === 'critical'
                      ? 'bg-rose-500'
                      : evt.status === 'success'
                      ? 'bg-emerald-500'
                      : evt.status === 'strategy'
                      ? 'bg-amber-400'
                      : 'bg-zinc-900 dark:bg-white'
                  }`}
                />
              </div>

              <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <Badge variant="white" size="sm">Lap {evt.lap}</Badge>
                      <span className="text-zinc-400 text-xs font-tabular">{evt.time}</span>
                      <span className="text-zinc-500 text-[11px] font-medium">({evt.categoryLabel})</span>
                    </div>
                    <StatusBadge status={evt.status} size="sm">
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
