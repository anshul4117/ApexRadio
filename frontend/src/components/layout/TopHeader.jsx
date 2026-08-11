import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronRight, Bell, LogOut, Sparkles, Play } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertsContext';
import { useDemo } from '../../context/DemoContext';

export const TopHeader = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeAlertsCount } = useAlerts();
  const { isDemoMode, toggleDemoMode, isLiveDemoRunning, startLiveDemo, stopLiveDemo } = useDemo();

  const routeTitles = {
    '/dashboard': 'Overview',
    '/dashboard/radio': 'Radio Analysis',
    '/dashboard/performance': 'Lap Performance',
    '/dashboard/alerts': 'AI Alerts',
    '/dashboard/timeline': 'Race Timeline',
    '/profile': 'Profile',
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
    <header className="sticky top-0 z-20 w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between h-full px-3 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex-shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0">
            <span className="text-zinc-400 dark:text-zinc-500 font-normal hidden xs:inline">
              ApexRadio
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 hidden xs:inline flex-shrink-0" />
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 truncate max-w-[110px] sm:max-w-[180px] md:max-w-none">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Right: Actions, Live Demo, Theme, Alerts, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* One-Click Live Race Demo Button */}
          <button
            type="button"
            onClick={isLiveDemoRunning ? stopLiveDemo : startLiveDemo}
            className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap ${
              isLiveDemoRunning
                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90'
            }`}
            title="Simulate complete live race sequence for judges"
          >
            <Play className="w-3 h-3 fill-current flex-shrink-0" />
            <span className="hidden sm:inline">{isLiveDemoRunning ? 'Stop Live Demo' : 'Run Live Demo'}</span>
            <span className="sm:hidden text-[11px]">{isLiveDemoRunning ? 'Stop' : 'Demo'}</span>
          </button>

          {/* Demo Mode Switch (Desktop) */}
          <button
            type="button"
            onClick={toggleDemoMode}
            className={`hidden lg:flex px-2.5 py-1 rounded-md text-xs font-medium border items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              isDemoMode
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
            }`}
            title="Toggle pre-loaded Silverstone GP scenario"
          >
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>Demo Mode:</span>
            <span>{isDemoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* AI Alerts Bell with Badge */}
          <Link
            to="/dashboard/alerts"
            className="relative p-1.5 sm:p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs flex-shrink-0"
            title={`${activeAlertsCount} Active Pit Wall Alerts`}
          >
            <Bell className="w-3.5 h-3.5" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold">
                {activeAlertsCount}
              </span>
            )}
          </Link>

          {/* Operator Profile Avatar */}
          <Link
            to="/profile"
            className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs flex-shrink-0"
            title="View Profile Settings"
          >
            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-semibold">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline-block text-xs font-medium truncate max-w-[100px]">
              {user?.name || 'GP Lambiase'}
            </span>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
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
