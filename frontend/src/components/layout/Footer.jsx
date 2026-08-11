import React from 'react';
import { Radio } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090b] py-6 sm:py-8 text-xs text-zinc-500 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-950 dark:text-white">
              <Radio className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>ApexRadio AI</span>
            </div>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-[11px] text-zinc-500">Formula Pit Wall Acoustic & Telemetry Intelligence</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-zinc-400 dark:text-zinc-500 text-[11px] font-mono">
            <span>v1.0.0</span>
            <span>·</span>
            <span>© 2026 ApexRadio AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
