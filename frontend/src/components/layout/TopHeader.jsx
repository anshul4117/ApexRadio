import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronRight, Bell, LogOut } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const TopHeader = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const routeTitles = {
    '/dashboard': 'Overview',
    '/dashboard/radio': 'Radio Analysis',
    '/dashboard/performance': 'Lap Performance',
    '/dashboard/alerts': 'AI Alerts',
    '/dashboard/timeline': 'Race Timeline',
    '/profile': 'Engineer Profile',
  };

  const currentTitle = routeTitles[location.pathname] || 'Pit Wall';

  const getInitials = (name) => {
    if (!name) return 'GP';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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

        {/* Right: Driver Info, Live Status, Theme Toggle, User Profile & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Active Car & Pace Delta */}
          <div className="hidden lg:flex items-center gap-2 text-xs border-r border-zinc-200 dark:border-zinc-800 pr-3 text-zinc-500">
            <span>Car #1 VER</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium font-tabular">(P1 | +1.420s)</span>
          </div>

          {/* Telemetry Live Badge */}
          <StatusBadge status="live" size="sm" className="hidden sm:inline-flex">
            Live Stream
          </StatusBadge>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* AI Strategy Alerts Icon */}
          <Link
            to="/dashboard/alerts"
            className="relative p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
            title="AI Strategy Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </Link>

          {/* Operator Profile Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
            title="View Profile Settings"
          >
            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-semibold">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline-block text-xs font-medium truncate max-w-[120px]">
              {user?.name || 'GP Lambiase'}
            </span>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors shadow-2xs cursor-pointer"
            title="Sign out of console"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default TopHeader;
