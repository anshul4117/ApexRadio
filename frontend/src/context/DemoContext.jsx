import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  const [toastMessage, setToastMessage] = useState(null);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }

      setToastMessage(
        next
          ? 'Demo Mode Activated: Full Silverstone GP Lap 1–18 race telemetry & acoustic stress scenario loaded.'
          : 'Live Custom Mode: Awaiting manual audio & telemetry CSV uploads.'
      );

      setTimeout(() => setToastMessage(null), 4000);
      return next;
    });
  }, []);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        toastMessage,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-zinc-800 dark:border-zinc-200 shadow-2xl text-xs max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-pulse" />
          <div className="space-y-0.5">
            <span className="font-semibold block">ApexRadio System Status</span>
            <p className="opacity-90 leading-relaxed">{toastMessage}</p>
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
