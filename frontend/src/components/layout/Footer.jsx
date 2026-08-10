import React from 'react';
import { Radio } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090b] py-8 text-xs text-zinc-500 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Radio className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">ApexRadio AI</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>Formula-Style Pit Wall Radio & Telemetry Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 text-[11px]">
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
