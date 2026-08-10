import React from 'react';
import { Activity, Radio, Cpu, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/60 py-8 text-xs text-zinc-500 font-mono mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Radio className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-semibold">ApexRadio AI</span>
            <span className="text-zinc-600">|</span>
            <span>Formula-Style Pit Wall Radio & Telemetry Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              v1.0.0-hackathon-alpha
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">© 2026 ApexRadio AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
