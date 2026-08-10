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
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import { useRadio } from '../context/RadioContext';
import { useLap } from '../context/LapContext';

export const RaceTimelinePage = () => {
  const { history } = useRadio();
  const { lapStats, correlation, filename } = useLap();
  const [filterType, setFilterType] = useState('ALL');

  // Dynamic Radio Events
  const dynamicRadioEvents = (history || []).map((h) => {
    const isStressed = h.emotion?.driverState === 'Stressed' || (h.emotion?.stressScore || 0) >= 75;
    return {
      id: h.id,
      lap: h.lap || 18,
      time: new Date(h.timestamp).toLocaleTimeString(),
      category: 'RADIO',
      typeLabel: 'Live Radio Ingestion',
      title: `${h.driver} Radio (${h.emotion?.driverState || 'Nominal'} · ${h.emotion?.stressScore || 50}%)`,
      description: `Driver callout: "${h.transcript}" Pitch jitter recorded at ${h.emotion?.pitchJitter || '+12 Hz'} with ${h.confidence || 94.2}% STT confidence.`,
      badge: isStressed ? 'Stress Spike' : 'Radio Callout',
      status: isStressed ? 'critical' : 'nominal',
      icon: Volume2,
    };
  });

  // Dynamic Telemetry & Correlation Events
  const telemetryEvents = [
    {
      id: 'evt-telemetry-upload',
      lap: lapStats?.totalLaps || 18,
      time: correlation?.correlatedAt ? new Date(correlation.correlatedAt).toLocaleTimeString() : '14:22:25 UTC',
      category: 'TELEMETRY',
      typeLabel: 'Telemetry CSV Ingestion',
      title: `Telemetry Dataset Parsed (${filename})`,
      description: `Ingested ${lapStats?.totalLaps || 18} laps. Fastest Lap: ${lapStats?.fastestLap?.lapTime} (Lap ${lapStats?.fastestLap?.lap}), Average Pace: ${lapStats?.averageLapTime}.`,
      badge: 'CSV Ingested',
      status: 'nominal',
      icon: FileSpreadsheet,
    },
    {
      id: 'evt-risk-correlation',
      lap: lapStats?.totalLaps || 18,
      time: '14:22:22 UTC',
      category: 'AI',
      typeLabel: 'Performance Risk Correlation',
      title: `Risk Score Evaluated: ${correlation?.riskScore || 61}% (${correlation?.riskTier || 'High'})`,
      description: `Multi-factor engine correlated driver vocal stress with +${correlation?.paceLossSeconds || '0.84'}s lap degradation. ${correlation?.explainabilityFactors?.[0]?.description || ''}`,
      badge: `${correlation?.riskTier || 'High'} Risk`,
      status: correlation?.riskBadgeVariant || 'critical',
      icon: Gauge,
    },
    {
      id: 'evt-recommendation-directive',
      lap: lapStats?.totalLaps || 18,
      time: '14:22:21 UTC',
      category: 'AI',
      typeLabel: 'Tactical Pit Directive',
      title: `AI Directive: ${correlation?.recommendation?.action || 'Enforce radio silence through Sector 2'}`,
      description: `Recommended Category: ${correlation?.recommendation?.category || 'Pit Protocol'}. Target Pit Window: ${correlation?.recommendation?.pitWindow || 'Lap 21'}.`,
      badge: 'Pit Directive',
      status: 'strategy',
      icon: Zap,
    },
  ];

  const staticEvents = [
    {
      id: 'evt-static-3',
      lap: 18,
      time: '14:20:00 UTC',
      category: 'LAP',
      typeLabel: 'Lap Completion',
      title: 'Lap 18 Stint Degradation',
      description: 'Lap time: 1:31.240 (+1.820s vs stint best). Sector 2 split degraded by +1.400s due to front left thermal slip.',
      badge: 'Lap 18',
      status: 'nominal',
      icon: Flag,
    },
    {
      id: 'evt-static-5',
      lap: 14,
      time: '14:15:30 UTC',
      category: 'LAP',
      typeLabel: 'Fastest Lap',
      title: 'Verstappen Sets Fastest Stint Lap',
      description: 'Lap time: 1:29.420 (Purple Sector 1 & Sector 3). Driver vocal stress recorded at nominal baseline (22%).',
      badge: 'Fastest Lap',
      status: 'success',
      icon: Flag,
    },
    {
      id: 'evt-static-6',
      lap: 12,
      time: '14:10:00 UTC',
      category: 'AI',
      typeLabel: 'Rival Pit Strategy',
      title: 'Hamilton Pitted for Hard Compound',
      description: 'Mercedes Car #44 completed 2.4s stop. AI triggered undercut window alert for Verstappen on Lap 21.',
      badge: 'Pit Strategy',
      status: 'nominal',
      icon: Zap,
    },
    {
      id: 'evt-static-7',
      lap: 1,
      time: '13:52:00 UTC',
      category: 'LAP',
      typeLabel: 'Race Start',
      title: 'Race Start · Silverstone Grand Prix',
      description: 'Verstappen retained P1 into Copse corner. Clear air established with 0.8s gap to Hamilton.',
      badge: 'Lights Out',
      status: 'live',
      icon: Flag,
    },
  ];

  // Combined timeline
  const combinedEvents = [...telemetryEvents, ...dynamicRadioEvents, ...staticEvents];

  const filteredEvents = combinedEvents.filter((e) => {
    if (filterType === 'RADIO') return e.category === 'RADIO';
    if (filterType === 'EMOTION') return e.category === 'RADIO' && e.status === 'critical';
    if (filterType === 'LAP') return e.category === 'LAP';
    if (filterType === 'TELEMETRY') return e.category === 'TELEMETRY';
    if (filterType === 'AI') return e.category === 'AI';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Chronological Race & Telemetry Timeline"
        subtitle="Multi-track event stream correlating driver radio, vocal emotion spikes, lap deltas and AI directives"
        badge={<Badge variant="neutral">52 Laps Total</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-50 dark:bg-zinc-900/60">
              {['ALL', 'RADIO', 'TELEMETRY', 'EMOTION', 'LAP', 'AI'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterType(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    filterType === cat
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs'
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
      <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-6 text-xs ml-2 sm:ml-4">
        {filteredEvents.map((evt) => {
          const Icon = evt.icon;

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-3 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white flex items-center justify-center shadow-2xs">
                <div className={`w-1 h-1 rounded-full ${evt.status === 'critical' ? 'bg-rose-500' : 'bg-zinc-900 dark:bg-white'}`} />
              </div>

              <Card>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <Badge variant="white" size="sm">Lap {evt.lap}</Badge>
                      <span className="text-zinc-400 text-xs font-tabular">{evt.time}</span>
                      <span className="text-zinc-500 text-[11px]">({evt.typeLabel})</span>
                    </div>
                    <StatusBadge status={evt.status} size="sm">
                      {evt.badge}
                    </StatusBadge>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    {evt.title}
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
