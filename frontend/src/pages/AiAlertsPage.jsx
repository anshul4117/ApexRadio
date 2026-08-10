import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  Volume2,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';

export const AiAlertsPage = () => {
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  const alerts = [
    {
      id: 'alt-1',
      priority: 'critical',
      priorityLabel: 'High Priority',
      title: 'Acoustic Stress Spike in Turn 4',
      description: 'Voice tension jumped +42.5 Hz following front-left tire slip. 84% probability of brake lockup on Lap 19.',
      timestamp: '30s ago (14:22:15 UTC)',
      car: 'Car #1 (VER)',
      actionPrompt: 'Radio silence through Turn 4-6 braking sequence.',
      actionCategory: 'Radio Brevity',
      status: 'Unacknowledged',
    },
    {
      id: 'alt-2',
      priority: 'warning',
      priorityLabel: 'Medium Priority',
      title: 'Tire Thermal Cliff Imminent',
      description: 'Front left compound at 112°C (+8°C above optimal window). Undercut window opens Lap 21.',
      timestamp: '2m ago (14:20:45 UTC)',
      car: 'Car #1 (VER)',
      actionPrompt: 'Prepare Hard compound in pit box for Lap 21 entry.',
      actionCategory: 'Pit Strategy',
      status: 'In Review',
    },
    {
      id: 'alt-3',
      priority: 'warning',
      priorityLabel: 'Medium Priority',
      title: 'Rival Radio Anomaly Detected (Mercedes #44)',
      description: 'Lewis Hamilton reported brake vibration into Turn 1. Hamilton pace dropped by +0.380s in Sector 1.',
      timestamp: '9m ago (14:13:30 UTC)',
      car: 'Car #44 (HAM)',
      actionPrompt: 'Inform Max Verstappen of rival Turn 1 brake vibration weakness.',
      actionCategory: 'Race Tactical',
      status: 'In Review',
    },
    {
      id: 'alt-4',
      priority: 'info',
      priorityLabel: 'Low Priority',
      title: 'Brevity Automation Active',
      description: 'Non-urgent radio comms suppressed during heavy deceleration into Stowe corner.',
      timestamp: '4m ago (14:18:10 UTC)',
      car: 'Car #1 (VER)',
      actionPrompt: 'Auto-suppression active (Braking > 4.5G).',
      actionCategory: 'Automation',
      status: 'Auto Resolved',
    },
  ];

  const alertHistory = [
    {
      id: 'hist-1',
      title: 'Brake Balance Offset Warning',
      resolvedAt: '14:05:22 UTC (Lap 8)',
      actionTaken: 'Engineer instructed BBias +1 forward',
      engineer: 'GP Lambiase',
    },
    {
      id: 'hist-2',
      title: 'Traffic Delta Warning in Sector 2',
      resolvedAt: '13:58:10 UTC (Lap 4)',
      actionTaken: 'Suppressed engineer gap updates on straight',
      engineer: 'GP Lambiase',
    },
  ];

  const handleAcknowledge = (id) => {
    setAcknowledgedIds((prev) => new Set([...prev, id]));
  };

  const handleAcknowledgeAll = () => {
    setAcknowledgedIds(new Set(alerts.map((a) => a.id)));
  };

  const filteredAlerts = alerts.filter((a) => {
    if (priorityFilter === 'HIGH') return a.priority === 'critical';
    if (priorityFilter === 'MEDIUM') return a.priority === 'warning';
    if (priorityFilter === 'LOW') return a.priority === 'info';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="AI Strategy & Pit Wall Alerts"
        subtitle="Automated driver stress warnings, vehicle anomaly alerts and tactical action prompts"
        badge={<Badge variant="danger">2 Unacknowledged</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handleAcknowledgeAll}>
              Acknowledge All
            </Button>
            <div className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-50 dark:bg-zinc-900/60">
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    priorityFilter === p
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* 3 Alert Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <Card title="Critical Priority (High)" subtitle="Immediate tactical impact">
          <div className="space-y-1">
            <span className="text-2xl font-semibold tracking-tight text-rose-600 dark:text-rose-400 font-tabular">1 Active</span>
            <p className="text-zinc-500 text-[11px]">Vocal stress spike + Turn 4 lockup risk</p>
          </div>
        </Card>

        <Card title="Medium Priority" subtitle="Strategy & rival watch">
          <div className="space-y-1">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-tabular">2 Active</span>
            <p className="text-zinc-500 text-[11px]">Tire cliff + rival vibration alert</p>
          </div>
        </Card>

        <Card title="Low Priority / Automated" subtitle="Background automation">
          <div className="space-y-1">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-tabular">1 Active</span>
            <p className="text-zinc-500 text-[11px]">Radio brevity suppression active</p>
          </div>
        </Card>
      </div>

      {/* Main Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alt) => {
          const isAcked = acknowledgedIds.has(alt.id);

          return (
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
                      {alt.priorityLabel}
                    </StatusBadge>
                    <span className="font-semibold text-xs text-zinc-950 dark:text-white">{alt.car}</span>
                    <span className="text-zinc-400 text-xs">· {alt.timestamp}</span>
                  </div>

                  <Badge variant={isAcked ? 'neutral' : alt.priority === 'critical' ? 'danger' : 'outline'} size="sm">
                    {isAcked ? 'Acknowledged' : alt.status}
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

                <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                      <Zap className="w-3 h-3" />
                      <span>RECOMMENDED ENGINEER ACTION ({alt.actionCategory}):</span>
                    </div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      "{alt.actionPrompt}"
                    </p>
                  </div>

                  <Button
                    variant={isAcked ? 'outline' : 'secondary'}
                    size="sm"
                    onClick={() => handleAcknowledge(alt.id)}
                    className="self-end sm:self-center flex-shrink-0"
                  >
                    {isAcked ? 'Resolved' : 'Acknowledge Directive'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alert History Section */}
      <Card
        title="Resolved Alert History"
        subtitle="Past race alerts acknowledged by pit wall engineering"
      >
        <div className="space-y-2.5 text-xs">
          {alertHistory.map((h) => (
            <div
              key={h.id}
              className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="font-semibold text-zinc-950 dark:text-white block">{h.title}</span>
                <span className="text-zinc-500 text-[11px]">Action: {h.actionTaken}</span>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                <div>Resolved: {h.resolvedAt}</div>
                <div>Signed: {h.engineer}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default AiAlertsPage;
