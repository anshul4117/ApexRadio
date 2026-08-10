import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DashboardPage from './pages/DashboardPage';
import RadioAnalysisPage from './pages/RadioAnalysisPage';
import LapPerformancePage from './pages/LapPerformancePage';
import AiAlertsPage from './pages/AiAlertsPage';
import RaceTimelinePage from './pages/RaceTimelinePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated / Pit Wall Product Shell Layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/radio" element={<RadioAnalysisPage />} />
        <Route path="/dashboard/performance" element={<LapPerformancePage />} />
        <Route path="/dashboard/alerts" element={<AiAlertsPage />} />
        <Route path="/dashboard/timeline" element={<RaceTimelinePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
