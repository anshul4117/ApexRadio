import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import StatusBadge from '../ui/StatusBadge';

export const TopHeader = ({ onMobileMenuToggle }) => {
  const location = useLocation();

  const routeTitles = {
    '/dashboard': 'Overview',
    '/dashboard/radio': 'Radio Analysis',
    '/dashboard/performance': 'Lap Performance',
    '/dashboard/alerts': 'AI Alerts',
    '/dashboard/timeline': 'Race Timeline',
    '/profile': 'Engineer Profile',
  };

  const currentTitle = routeTitles[location.pathname] || 'Pit Wall';

  return (
    <header className="sticky top-0 z-20 w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500 font-normal">
              ApexRadio
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
            <h1 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 truncate">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Right: Driver Info, Live Status, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Active Car & Pace Delta */}
          <div className="hidden lg:flex items-center gap-2 text-xs border-r border-zinc-200 dark:border-zinc-800 pr-3 text-zinc-500">
            <span>Car #1 VER</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium font-tabular">(P1 | +1.420s)</span>
          </div>

          {/* Telemetry Live Badge with subtle red pulse */}
          <StatusBadge status="live" size="sm" className="hidden sm:inline-flex">
            Live Stream
          </StatusBadge>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* AI Strategy Alerts Notification Icon */}
          <Link
            to="/dashboard/alerts"
            className="relative p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
            title="AI Strategy Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </Link>

          {/* Operator Profile Shortcut */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
          >
            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-semibold">
              GP
            </div>
            <span className="hidden md:inline-block text-xs font-medium">
              GP Lambiase
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default TopHeader;
