import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const RaceTimelinePage = () => {
  const events = [
    {
      lap: 18,
      time: '14:22:15 UTC',
      type: 'RADIO_STRESS',
      title: 'Verstappen Radio Callout · Stress 78%',
      description: 'Reported severe understeer in Turn 4 with front-left thermal degradation.',
      badge: 'Stress Spike',
      status: 'critical',
    },
    {
      lap: 16,
      time: '14:18:40 UTC',
      type: 'RADIO_TRAFFIC',
      title: 'Traffic Callout on Hangar Straight',
      description: 'Verstappen reported backmarker weaving; lost 0.3s in Sector 2.',
      badge: 'Traffic Alert',
      status: 'high-stress',
    },
    {
      lap: 12,
      time: '14:10:00 UTC',
      type: 'PIT_RIVAL',
      title: 'Hamilton Pit Stop (Lap 12)',
      description: 'Mercedes pitted Car #44 for Hard Compound (2.4s stationary). Emerged P4 in clear air.',
      badge: 'Rival Pit Stop',
      status: 'nominal',
    },
    {
      lap: 1,
      time: '13:52:00 UTC',
      type: 'RACE_START',
      title: 'Race Start · Silverstone Grand Prix',
      description: 'Verstappen holds P1 into Copse; clean start across the front row.',
      badge: 'Race Start',
      status: 'live',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="Race Event & Radio Timeline"
        subtitle="Chronological event stream aligned with driver transmissions and stint deltas"
        badge={<Badge variant="neutral">52 Laps Total</Badge>}
        actions={
          <Button variant="secondary" size="sm">
            Scrub to Current Lap (18)
          </Button>
        }
      />

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-6 text-xs ml-2 sm:ml-4">
        {events.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white flex items-center justify-center shadow-2xs">
              <div className="w-1 h-1 rounded-full bg-zinc-900 dark:bg-white" />
            </div>

            <Card>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <Badge variant="white" size="sm">Lap {evt.lap}</Badge>
                    <span className="text-zinc-400 text-xs">{evt.time}</span>
                  </div>
                  <StatusBadge status={evt.status} size="sm">
                    {evt.badge}
                  </StatusBadge>
                </div>

                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {evt.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RaceTimelinePage;
