import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  Zap,
  ArrowRight,
  Radio,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import SectionHeader from '../components/ui/SectionHeader';
import { useAlerts } from '../context/AlertsContext';
import { useLap } from '../context/LapContext';
import { useRadio } from '../context/RadioContext';

export const AiAlertsPage = () => {
  const { alerts, activeAlertsCount, acknowledgeAlert, acknowledgeAll, resetAlerts } = useAlerts();
  const { currentLap, lapsLoaded, driverName, correlation } = useLap();
  const { currentAnalysis } = useRadio();

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [searchTerm, setSearchTerm] = useState('');

  const activeDriver = driverName || currentAnalysis?.driver || 'Max Verstappen';
  const activeLap = currentLap || 18;
  const degradationStr = correlation?.performanceDegradationStr || '+1.43 s/lap';

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === 'ALL' || alert.severityKey.toUpperCase() === filter;
    const matchesSearch =
      (alert.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.whyGenerated || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.recommendedAction || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (severityKey) => {
    switch (severityKey) {
      case 'critical':
        return <StatusBadge status="critical" size="sm">P1 Critical</StatusBadge>;
      case 'high':
        return <StatusBadge status="critical" size="sm">P2 High</StatusBadge>;
      case 'medium':
        return <StatusBadge status="warning" size="sm">P3 Medium</StatusBadge>;
      default:
        return <StatusBadge status="nominal" size="sm">P4 Low</StatusBadge>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <SectionHeader
        title="AI Strategy & Pit Wall Alerts Center"
        subtitle={`Live Session Directives for ${activeDriver} · Lap ${activeLap}/${lapsLoaded || 18}`}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={activeAlertsCount > 0 ? 'critical' : 'nominal'}>
              {activeAlertsCount > 0 ? `${activeAlertsCount} Active Pit Alerts` : 'All Alerts Acknowledged'}
            </StatusBadge>
            <Badge variant="outline" size="sm">
              Degradation: {degradationStr}
            </Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
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
          className={`p-4 rounded-xl border transition-all cursor-pointer card-hover-lift ${
            filter === 'CRITICAL'
              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 ring-1 ring-rose-500 shadow-sm'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Critical Alerts</span>
            <StatusBadge status="critical" size="sm">P1</StatusBadge>
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">
            {alerts.filter((a) => a.severityKey === 'critical' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Vocal stress spikes & lockups</p>
        </div>

        {/* High */}
        <div
          onClick={() => setFilter('HIGH')}
          className={`p-4 rounded-xl border transition-all cursor-pointer card-hover-lift ${
            filter === 'HIGH'
              ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 ring-1 ring-rose-400 shadow-sm'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">High Severity</span>
            <StatusBadge status="critical" size="sm">P2</StatusBadge>
          </div>
          <div className="text-2xl font-bold text-rose-500 dark:text-rose-300 mt-1 font-mono">
            {alerts.filter((a) => a.severityKey === 'high' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Tire deg & pace degradation</p>
        </div>

        {/* Medium */}
        <div
          onClick={() => setFilter('MEDIUM')}
          className={`p-4 rounded-xl border transition-all cursor-pointer card-hover-lift ${
            filter === 'MEDIUM'
              ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 ring-1 ring-amber-500 shadow-sm'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Medium Strategy</span>
            <StatusBadge status="warning" size="sm">P3</StatusBadge>
          </div>
          <div className="text-2xl font-bold text-amber-500 dark:text-amber-400 mt-1 font-mono">
            {alerts.filter((a) => a.severityKey === 'medium' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Rival strategy & brake fatigue</p>
        </div>

        {/* Low */}
        <div
          onClick={() => setFilter('LOW')}
          className={`p-4 rounded-xl border transition-all cursor-pointer card-hover-lift ${
            filter === 'LOW'
              ? 'border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800 ring-1 ring-zinc-950 dark:ring-white shadow-sm'
              : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0e0e11] hover:border-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Low / Background</span>
            <Badge variant="outline" size="sm">P4</Badge>
          </div>
          <div className="text-2xl font-bold text-zinc-950 dark:text-white mt-1 font-mono">
            {alerts.filter((a) => a.severityKey === 'low' && !a.acknowledged).length} Active
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Brevity automation active</p>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 border border-zinc-200/80 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-900/60 overflow-x-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">No active alerts matching criteria</p>
            <p className="text-xs text-zinc-500 mt-1">All race triggers in this category are nominal.</p>
          </Card>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <Card
              key={alert.id}
              className={`transition-all animate-in fade-in slide-in-from-top-2 duration-300 card-hover-lift ${
                alert.acknowledged ? 'opacity-60 bg-zinc-50/50 dark:bg-zinc-900/20' : ''
              }`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="space-y-3">
                
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severityKey)}
                    <Badge variant="outline" size="sm">Lap {alert.lap || activeLap}</Badge>
                    <span className="text-zinc-400 text-xs font-mono">{alert.timestamp || '14:22:15 UTC'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.acknowledged ? (
                      <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Acknowledged
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                      </Button>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {alert.whyGenerated}
                  </p>
                </div>

                {/* Recommended Pit Wall Action Callout */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-semibold text-zinc-900 dark:text-white block">
                      Recommended Race Engineer Action:
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {alert.recommendedAction}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/40">
                  <span>Driver: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{alert.driver || activeDriver}</strong></span>
                  <span>Confidence: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{alert.confidence || 94.2}%</strong></span>
                  <span>Category: <strong className="text-zinc-700 dark:text-zinc-300">{alert.category || 'Pit Telemetry'}</strong></span>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};

export default AiAlertsPage;
