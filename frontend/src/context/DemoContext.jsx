import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

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

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        showToast,
      }}
    >
      {children}

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
