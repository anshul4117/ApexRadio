import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { PageSkeleton } from './components/ui/Skeleton';

// Code-split pages for optimal performance and chunk loading
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RadioAnalysisPage = lazy(() => import('./pages/RadioAnalysisPage'));
const LapPerformancePage = lazy(() => import('./pages/LapPerformancePage'));
const AiAlertsPage = lazy(() => import('./pages/AiAlertsPage'));
const RaceTimelinePage = lazy(() => import('./pages/RaceTimelinePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function App() {
  return (
    <Suspense fallback={<div className="p-6 max-w-7xl mx-auto"><PageSkeleton /></div>}>
      <Routes>
        {/* Public Pages Layout (Landing, Architecture, About, Login, Register) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Pit Wall Product Shell Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/radio" element={<RadioAnalysisPage />} />
            <Route path="/dashboard/performance" element={<LapPerformancePage />} />
            <Route path="/dashboard/alerts" element={<AiAlertsPage />} />
            <Route path="/dashboard/timeline" element={<RaceTimelinePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
