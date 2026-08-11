import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertsContext = createContext(null);

const INITIAL_ALERTS = [
  {
    id: 'alt_001',
    severity: 'Critical',
    severityKey: 'critical',
    title: 'Driver Acoustic Stress Spike & Turn 4 Lockup Risk',
    timestamp: '14:22:15 UTC (30s ago)',
    driver: 'Max Verstappen (Car #1)',
    driverState: 'Stressed',
    lap: 18,
    confidence: 94.2,
    recommendedAction: 'Enforce radio silence through Turn 4–6 sequence & prepare immediate pit box for Lap 21 entry.',
    whyGenerated: 'Vocal pitch jitter jumped +42.5 Hz following severe front-left tire slip in Turn 4. Combined telemetry correlation indicates an 84% probability of front brake lockup.',
    category: 'Acoustic Stress & Telemetry Anomaly',
    acknowledged: false,
  },
  {
    id: 'alt_002',
    severity: 'High',
    severityKey: 'high',
    title: 'Pace Degradation & Sector 2 Thermal Cliff',
    timestamp: '14:20:45 UTC (2m ago)',
    driver: 'Max Verstappen (Car #1)',
    driverState: 'Stressed',
    lap: 18,
    confidence: 91.5,
    recommendedAction: 'Reduce radio communication load and review tire compound switch to Hard on Lap 21.',
    whyGenerated: 'Lap time dropped by +1.820s vs stint best (1:29.420). Front left surface temperatures exceeded 112°C in high-G corner exits.',
    category: 'Pace & Thermal Degradation',
    acknowledged: false,
  },
  {
    id: 'alt_003',
    severity: 'Medium',
    severityKey: 'medium',
    title: 'Rival Brake Concern & Undercut Window Threat (HAM #44)',
    timestamp: '14:12:02 UTC (10m ago)',
    driver: 'Lewis Hamilton (Car #44)',
    driverState: 'Fatigued',
    lap: 12,
    confidence: 91.8,
    recommendedAction: 'Inform Verstappen of rival Turn 1 brake vibration weakness & monitor gap (+1.42s).',
    whyGenerated: 'Hamilton pitted on Lap 12 for Hard tires. Acoustic transcription revealed heavy brake vibration complaints into Turn 1.',
    category: 'Rival Telemetry Intelligence',
    acknowledged: false,
  },
  {
    id: 'alt_004',
    severity: 'Low',
    severityKey: 'low',
    title: 'Automated Radio Brevity Mode Activated',
    timestamp: '14:15:30 UTC (7m ago)',
    driver: 'Max Verstappen (Car #1)',
    driverState: 'Calm',
    lap: 16,
    confidence: 98.0,
    recommendedAction: 'No action required — background automation suppressing non-essential telemetry callouts.',
    whyGenerated: 'Deceleration telemetry recorded 4.8G braking into Stowe corner, triggering automated silence protocol.',
    category: 'Background Automation',
    acknowledged: true,
  },
];

export const AlertsProvider = ({ children }) => {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  const addAlert = useCallback((newAlert) => {
    const alertRecord = {
      id: `alt_${Date.now()}`,
      severity: newAlert.severity || (newAlert.stressScore >= 75 ? 'Critical' : newAlert.stressScore >= 50 ? 'High' : 'Medium'),
      severityKey: (newAlert.severityKey || (newAlert.stressScore >= 75 ? 'critical' : newAlert.stressScore >= 50 ? 'high' : 'medium')).toLowerCase(),
      title: newAlert.title || 'Driver Radio & Telemetry Anomaly Detected',
      timestamp: `${new Date().toLocaleTimeString()} (Just now)`,
      driver: newAlert.driver || 'Max Verstappen (Car #1)',
      driverState: newAlert.driverState || 'Stressed',
      lap: newAlert.lap || 18,
      confidence: newAlert.confidence || 94.2,
      recommendedAction: newAlert.recommendedAction || newAlert.action || 'Enforce radio silence & prepare pit window.',
      whyGenerated: newAlert.whyGenerated || `Acoustic stress spike detected with ${newAlert.pitchJitter || '+42.5 Hz'} pitch jitter.`,
      category: newAlert.category || 'Real-Time Radio Directive',
      acknowledged: false,
    };

    setAlerts((prev) => [alertRecord, ...prev]);
    return alertRecord;
  }, []);

  const acknowledgeAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: !a.acknowledged } : a))
    );
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  }, []);

  const resetAlerts = useCallback(() => {
    setAlerts(INITIAL_ALERTS);
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'CRITICAL') return a.severityKey === 'critical';
    if (filter === 'HIGH') return a.severityKey === 'high';
    if (filter === 'MEDIUM') return a.severityKey === 'medium';
    if (filter === 'LOW') return a.severityKey === 'low';
    return true;
  });

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        filteredAlerts,
        activeAlertsCount,
        filter,
        setFilter,
        addAlert,
        acknowledgeAlert,
        acknowledgeAll,
        resetAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};

export default AlertsContext;
