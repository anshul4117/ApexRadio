import React from 'react';
import { Zap, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const AiAlertsPage = () => {
  const alerts = [
    {
      id: 'alt-1',
      priority: 'critical',
      title: 'Acoustic Stress Spike in Turn 4',
      description: 'Voice tension jumped +42.5 Hz following front-left tire slip. 84% probability of brake lockup on Lap 19.',
      timestamp: '30s ago (14:22:15 UTC)',
      car: 'Car #1 (VER)',
      action: 'Radio silence recommended during braking zone',
      status: 'Unacknowledged',
    },
    {
      id: 'alt-2',
      priority: 'warning',
      title: 'Tire Thermal Cliff Imminent',
      description: 'Front left compound at 112°C (+8°C above optimal window). Undercut window opens Lap 21.',
      timestamp: '2m ago (14:20:45 UTC)',
      car: 'Car #1 (VER)',
      action: 'Box Lap 21 for Hard compound (21.4s pit loss)',
      status: 'In Review',
    },
    {
      id: 'alt-3',
      priority: 'info',
      title: 'Brevity Automation Active',
      description: 'Non-urgent radio comms suppressed during heavy deceleration into Stowe corner.',
      timestamp: '4m ago (14:18:10 UTC)',
      car: 'Car #1 (VER)',
      action: 'Suppression active',
      status: 'Resolved',
    },
    {
      id: 'alt-4',
      priority: 'warning',
      title: 'Rival Radio Anomaly Detected',
      description: 'Car #44 reported brake vibration into Turn 1. Hamilton pace dropped by +0.380s in Sector 1.',
      timestamp: '9m ago (14:13:30 UTC)',
      car: 'Car #44 (HAM)',
      action: 'Inform Verstappen of rival braking weakness',
      status: 'Acknowledged',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="AI Race Strategy & Pit Wall Alerts"
        subtitle="Automated anomaly detection, driver cognitive load warnings and tactical pit decisions"
        badge={<Badge variant="danger">2 Unacknowledged</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm">
              Acknowledge All
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" /> Filter Priority
            </Button>
          </div>
        }
      />

      {/* Alert Feed List */}
      <div className="space-y-4">
        {alerts.map((alt) => (
          <Card
            key={alt.id}
            className={`border-l-4 ${
              alt.priority === 'critical'
                ? 'border-l-rose-500 border-zinc-200/80 dark:border-zinc-800/80'
                : 'border-l-zinc-400 dark:border-l-zinc-600 border-zinc-200/80 dark:border-zinc-800/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={alt.priority} size="sm">
                    {alt.priority.charAt(0).toUpperCase() + alt.priority.slice(1)}
                  </StatusBadge>
                  <span className="font-semibold text-xs text-zinc-950 dark:text-white">{alt.car}</span>
                  <span className="text-zinc-400 text-xs">· {alt.timestamp}</span>
                </div>

                <Badge variant="outline" size="sm">
                  {alt.status}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {alt.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {alt.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <Zap className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-medium">Recommended Action:</span>
                  <span>{alt.action}</span>
                </div>

                <Button variant="secondary" size="sm" className="self-end sm:self-center">
                  Acknowledge
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default AiAlertsPage;
