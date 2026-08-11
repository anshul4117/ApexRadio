import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import LiveDemoOverlay from '../components/ui/LiveDemoOverlay';

const DemoContext = createContext(null);

const DEMO_STORAGE_KEY = 'apexradio_demo_mode';

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : true; // Default ON for judges
    } catch {
      return true;
    }
  });

  const [toast, setToast] = useState(null);

  // 60-Second Live Demo Orchestrator State
  const [isLiveDemoRunning, setIsLiveDemoRunning] = useState(false);
  const [isLiveDemoPaused, setIsLiveDemoPaused] = useState(false);
  const [liveDemoSeconds, setLiveDemoSeconds] = useState(0);
  const [liveDemoStage, setLiveDemoStage] = useState(1);
  const liveDemoTimerRef = useRef(null);

  const showToast = useCallback((title, message, type = 'info') => {
    setToast({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }

      showToast(
        next ? 'Demo Mode Activated' : 'Custom Mode Activated',
        next
          ? 'Full Silverstone GP Lap 1–18 race telemetry & acoustic stress scenario loaded.'
          : 'Ready for manual audio & telemetry CSV uploads.',
        'success'
      );

      return next;
    });
  }, [showToast]);

  /**
   * Start 60-Second Live Race Simulation Sequence
   */
  const startLiveDemo = useCallback(() => {
    setIsLiveDemoRunning(true);
    setIsLiveDemoPaused(false);
    setLiveDemoSeconds(0);
    setLiveDemoStage(1);

    showToast(
      '🏎️ 60s Live Race Demo Started',
      'Orchestrating autonomous end-to-end race engineer decision cycle.',
      'info'
    );
  }, [showToast]);

  const pauseLiveDemoToggle = useCallback(() => {
    setIsLiveDemoPaused((prev) => !prev);
  }, []);

  const stopLiveDemo = useCallback(() => {
    setIsLiveDemoRunning(false);
    setIsLiveDemoPaused(false);
    setLiveDemoSeconds(0);
    setLiveDemoStage(1);
    if (liveDemoTimerRef.current) {
      clearInterval(liveDemoTimerRef.current);
    }
    showToast('Live Race Demo Stopped', 'Returning to standard interactive console.', 'info');
  }, [showToast]);

  // Clock tick orchestrator for 60s live demo
  useEffect(() => {
    if (isLiveDemoRunning && !isLiveDemoPaused) {
      liveDemoTimerRef.current = setInterval(() => {
        setLiveDemoSeconds((prev) => {
          const nextSec = prev + 1;

          // Stage transitions & notifications
          if (nextSec === 5) {
            setLiveDemoStage(1); // Listening
          } else if (nextSec === 10) {
            setLiveDemoStage(2); // Transcribing
            showToast('📻 Radio Ingested', 'Whisper STT generating cockpit speech transcript...', 'info');
          } else if (nextSec === 15) {
            setLiveDemoStage(3); // Understanding
            showToast('⚠️ Biometric Stress Spike', 'Vocal pitch jitter jumped +42.5 Hz (78% Stress)', 'error');
          } else if (nextSec === 20) {
            setLiveDemoStage(4); // Correlating
            showToast('📊 Telemetry Correlated', 'Sector 2 pace lost +0.84s due to front-left understeer', 'info');
          } else if (nextSec === 30) {
            setLiveDemoStage(5); // Predicting
            showToast('🚨 Risk Score Raised', 'Performance Risk Score reached 61% (High Risk Tier)', 'error');
          } else if (nextSec === 40) {
            setLiveDemoStage(5);
            showToast('🚨 Critical AI Alert', 'Action Required: Reduce radio communication load', 'error');
          } else if (nextSec === 50) {
            setLiveDemoStage(6); // Recommending
            showToast('⚡ AI Directive Issued', 'Target: Enforce radio silence & prepare Lap 21 pit window', 'success');
          } else if (nextSec >= 60) {
            setIsLiveDemoRunning(false);
            showToast('🏁 Live Race Demo Completed', 'Full 60s pit wall intelligence cycle demonstrated.', 'success');
            return 60;
          }

          return nextSec;
        });
      }, 1000);
    } else {
      if (liveDemoTimerRef.current) {
        clearInterval(liveDemoTimerRef.current);
      }
    }

    return () => {
      if (liveDemoTimerRef.current) {
        clearInterval(liveDemoTimerRef.current);
      }
    };
  }, [isLiveDemoRunning, isLiveDemoPaused, showToast]);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        showToast,
        // Live Demo Simulation Controls
        isLiveDemoRunning,
        isLiveDemoPaused,
        liveDemoSeconds,
        liveDemoStage,
        startLiveDemo,
        pauseLiveDemoToggle,
        stopLiveDemo,
      }}
    >
      {children}

      {/* Floating 60s Live Demo Presentation Overlay */}
      <LiveDemoOverlay
        isRunning={isLiveDemoRunning}
        seconds={liveDemoSeconds}
        stageIndex={liveDemoStage}
        isPaused={isLiveDemoPaused}
        onPauseToggle={pauseLiveDemoToggle}
        onStop={stopLiveDemo}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          className="fixed bottom-5 right-5 z-50 p-4 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-zinc-800 dark:border-zinc-200 shadow-2xl text-xs max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
          )}

          <div className="space-y-0.5">
            <span className="font-semibold block">{toast.title}</span>
            <p className="opacity-90 leading-relaxed text-[11px]">{toast.message}</p>
          </div>
        </div>
      )}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export default DemoContext;
