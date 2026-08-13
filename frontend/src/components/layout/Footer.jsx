import React from 'react';
import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#09090b] py-6 sm:py-8 text-xs text-zinc-500 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          
          {/* Brand Logo & Tagline */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Link to="/" className="flex items-center gap-1.5 font-semibold text-zinc-950 dark:text-white hover:opacity-80 transition-opacity">
              <Radio className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>ApexRadio AI</span>
            </Link>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-[11px] text-zinc-500">Formula Pit Wall Acoustic & Telemetry Intelligence</span>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Overview
            </Link>
            <Link to="/architecture" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Architecture
            </Link>
            <Link to="/about" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link to="/dashboard" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Pit Wall Console
            </Link>
          </div>

        </div>

        {/* Copyright & Model Attribution */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span>Powered by Groq Whisper Large v3 & 🤗 Hugging Face Emotion Classifier</span>
          <span className="font-mono">© 2026 ApexRadio AI · v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
