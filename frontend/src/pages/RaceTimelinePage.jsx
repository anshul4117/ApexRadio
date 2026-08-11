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
  const { lapStats } = useLap();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'RADIO' | 'LAP' | 'RISK' | 'AI'

  // Chronological timeline events
  const defaultEvents = [
    {
      id: 'tl_01',
      lap: 18,
      time: '14:22:30 UTC',
      category: 'RADIO',
      categoryLabel: 'Radio Acoustic Analysis',
      title: 'Verstappen Radio Transmission: Understeer Warning',
      description: '"Front left is completely gone guys, massive understeer in Turn 4, I cannot rotate the car." High vocal pitch jitter recorded (+42.5 Hz).',
      badge: 'Stress 78%',
      status: 'critical',
      icon: Radio,
    },
    {
      id: 'tl_02',
      lap: 18,
      time: '14:22:15 UTC',
      category: 'AI',
      categoryLabel: 'Tactical Recommendation',
      title: 'AI Strategy Trigger: Radio Silence in Sector 2',
      description: 'System automatically triggered brevity directive to prevent driver cognitive overload during high-G deceleration into Turn 4.',
      badge: 'Directive Issued',
      status: 'strategy',
      icon: Zap,
    },
    {
      id: 'tl_03',
      lap: 18,
      time: '14:22:00 UTC',
      category: 'RISK',
      categoryLabel: 'Risk Score Escalation',
      title: 'Performance Risk Score Raised: 22% → 61% (High)',
      description: 'Multi-factor correlation engine flagged +0.84s pace loss, front-left tire degradation (40.4%), and consecutive high-stress radio callouts.',
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
      lap: 8,
      time: '14:02:00 UTC',
      category: 'RADIO',
      categoryLabel: 'Radio Telemetry Check',
      title: 'Verstappen Radio: Gap Check to Hamilton',
      description: '"Gap to Lewis behind?" Engineer response: "+2.5s, pace is strong."',
      badge: 'Stress 18%',
      status: 'nominal',
      icon: Radio,
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
        subtitle="Multi-track event stream correlating driver radio, vocal emotion spikes, lap deltas, risk score escalations and AI directives"
        badge={<Badge variant="neutral">Silverstone GP · Laps 1–18</Badge>}
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
              Scrub to Lap 18
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
                      : evt.status === 'success'
                      ? 'bg-emerald-500'
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
                      status={evt.status === 'critical' ? 'critical' : evt.status === 'strategy' ? 'strategy' : 'nominal'}
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
