import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  Volume2,
  AlertTriangle,
  Check,
  Search,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import { useAlerts } from '../context/AlertsContext';
import { useDemo } from '../context/DemoContext';

export const AiAlertsPage = () => {
  const {
    alerts,
    filteredAlerts,
    activeAlertsCount,
    filter,
    setFilter,
    acknowledgeAlert,
    acknowledgeAll,
    resetAlerts,
  } = useAlerts();

  const { isDemoMode } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');

  const displayedAlerts = filteredAlerts.filter((a) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.whyGenerated.toLowerCase().includes(term) ||
      a.recommendedAction.toLowerCase().includes(term) ||
      a.driver.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        title="AI Strategy & Pit Wall Alerts Center"
        subtitle="Automated acoustic stress triggers, telemetry anomaly alerts, and tactical race engineer directives"
        badge={
          <StatusBadge status={activeAlertsCount > 0 ? 'critical' : 'nominal'}>
            {activeAlertsCount > 0 ? `${activeAlertsCount} Active Pit Alerts` : 'All Alerts Acknowledged'}
          </StatusBadge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={acknowledgeAll} disabled={activeAlertsCount === 0}>
              Acknowledge All
            </Button>
            <Button variant="outline" size="sm" onClick={resetAlerts} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> Reset Alerts
            </Button>
          </div>
        }
      />

      {/* 4 Alert Severity Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Critical */}
        <div
          onClick={() => setFilter('CRITICAL')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            filter === 'CRITICAL'
              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 ring-1 ring-rose-500'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Critical Alerts</span>
            <StatusBadge status="critical" size="sm">P1</StatusBadge>
          </div>
          <div className="text-2xl font-semibold text-rose-600 dark:text-rose-400 mt-1 font-tabular">
            {alerts.filter((a) => a.severityKey === 'critical' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Vocal stress spikes & lockups</p>
        </div>

        {/* High */}
        <div
          onClick={() => setFilter('HIGH')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            filter === 'HIGH'
              ? 'border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800 ring-1 ring-zinc-950 dark:ring-white'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">High Alerts</span>
            <StatusBadge status="high-stress" size="sm">P2</StatusBadge>
          </div>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1 font-tabular">
            {alerts.filter((a) => a.severityKey === 'high' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Tire cliff & pace degradation</p>
        </div>

        {/* Medium */}
        <div
          onClick={() => setFilter('MEDIUM')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            filter === 'MEDIUM'
              ? 'border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800 ring-1 ring-zinc-950 dark:ring-white'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Medium Alerts</span>
            <StatusBadge status="nominal" size="sm">P3</StatusBadge>
          </div>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1 font-tabular">
            {alerts.filter((a) => a.severityKey === 'medium' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Rival strategy & brake fatigue</p>
        </div>

        {/* Low */}
        <div
          onClick={() => setFilter('LOW')}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            filter === 'LOW'
              ? 'border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800 ring-1 ring-zinc-950 dark:ring-white'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Low / Background</span>
            <Badge variant="outline" size="sm">P4</Badge>
          </div>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1 font-tabular">
            {alerts.filter((a) => a.severityKey === 'low' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Brevity automation active</p>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-50 dark:bg-zinc-900/60">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                filter === lvl
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by title or telemetry..."
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Alert Feed / Empty State */}
      {displayedAlerts.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              No Alerts Matching Current Filter
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              All tactical directives for this category have been acknowledged or filtered.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setFilter('ALL'); setSearchTerm(''); }}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedAlerts.map((alt) => (
            <Card
              key={alt.id}
              className={`border-l-4 transition-all ${
                alt.severityKey === 'critical'
                  ? 'border-l-rose-500'
                  : alt.severityKey === 'high'
                  ? 'border-l-zinc-950 dark:border-l-white'
                  : alt.severityKey === 'medium'
                  ? 'border-l-zinc-500'
                  : 'border-l-zinc-300 dark:border-l-zinc-700'
              } ${alt.acknowledged ? 'opacity-65' : ''}`}
            >
              <div className="space-y-3.5">
                
                {/* Header Row: Severity, Driver, Lap, Confidence, Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={
                        alt.severityKey === 'critical'
                          ? 'critical'
                          : alt.severityKey === 'high'
                          ? 'high-stress'
                          : 'nominal'
                      }
                      size="sm"
                    >
                      {alt.severity} Alert
                    </StatusBadge>
                    <span className="font-semibold text-xs text-zinc-950 dark:text-white">
                      {alt.driver}
                    </span>
                    <Badge variant="white" size="sm">Lap {alt.lap}</Badge>
                    <span className="text-[11px] text-zinc-500 font-medium font-tabular">
                      Confidence: {alt.confidence}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400 text-[11px] font-tabular">{alt.timestamp}</span>
                    <Badge variant={alt.acknowledged ? 'neutral' : 'outline'} size="sm">
                      {alt.acknowledged ? 'Resolved / Acked' : 'Action Required'}
                    </Badge>
                  </div>
                </div>

                {/* Title & Root Cause Explanation */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    {alt.title}
                  </h3>
                  
                  {/* Why Generated Section */}
                  <div className="p-3 rounded-md bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1 text-xs">
                    <span className="font-medium text-zinc-500 text-[11px] block">
                      WHY THIS ALERT WAS GENERATED (TELEMETRY CORRELATION):
                    </span>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs">
                      {alt.whyGenerated}
                    </p>
                  </div>
                </div>

                {/* Recommended Action Prompt Banner with Acknowledge Button */}
                <div className="p-3.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400 dark:text-rose-600" />
                    <div>
                      <span className="font-semibold block">RECOMMENDED ENGINEER ACTION:</span>
                      <p className="opacity-95 leading-relaxed font-normal">"{alt.recommendedAction}"</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => acknowledgeAlert(alt.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer self-end sm:self-center ${
                      alt.acknowledged
                        ? 'bg-zinc-700 text-zinc-300 dark:bg-zinc-300 dark:text-zinc-700'
                        : 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white hover:opacity-90'
                    }`}
                  >
                    {alt.acknowledged ? 'Mark Active' : 'Acknowledge Directive'}
                  </button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default AiAlertsPage;
