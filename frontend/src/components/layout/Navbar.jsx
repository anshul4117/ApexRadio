import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Radio, ArrowRight, LogOut, Cpu, Menu, X, Layers, LayoutDashboard } from 'lucide-react';
import { healthApi } from '../../services/api';
import StatusBadge from '../ui/StatusBadge';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [serverStatus, setServerStatus] = useState('checking');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    healthApi
      .getHealth()
      .then((res) => {
        if (isMounted) setServerStatus(res.success ? 'healthy' : 'offline');
      })
      .catch(() => {
        if (isMounted) setServerStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo & API Status */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-7 h-7 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-semibold text-xs shadow-xs transition-transform group-hover:scale-105 flex-shrink-0">
                <Radio className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-white flex items-center gap-1">
                ApexRadio <span className="text-xs text-zinc-400 font-normal">AI</span>
              </span>
            </Link>

            {/* Health status badge */}
            <div className="hidden sm:flex items-center">
              <StatusBadge
                status={serverStatus === 'healthy' ? 'live' : serverStatus === 'checking' ? 'nominal' : 'critical'}
                size="sm"
              >
                {serverStatus === 'healthy' ? 'API Online' : serverStatus === 'checking' ? 'Connecting' : 'API Offline'}
              </StatusBadge>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md font-medium transition-colors ${
                  isActive && location.pathname === '/'
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/architecture"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                }`
              }
            >
              Architecture
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                }`
              }
            >
              Pit Wall Console
            </NavLink>
          </nav>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <ThemeToggle />

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="primary" size="sm" className="gap-1.5 whitespace-nowrap">
                      Enter Console <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>

                  <Link to="/dashboard">
                    <Button variant="primary" size="sm" className="gap-1.5 whitespace-nowrap">
                      Launch Console <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Launch Button (Compact) */}
            <Link to="/dashboard" className="sm:hidden">
              <Button variant="primary" size="sm" className="px-2.5 py-1 text-xs whitespace-nowrap">
                Console
              </Button>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 cursor-pointer flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Collapsible Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400">Navigation</span>
            <StatusBadge
              status={serverStatus === 'healthy' ? 'live' : 'nominal'}
              size="sm"
            >
              {serverStatus === 'healthy' ? 'API Online' : 'Connecting'}
            </StatusBadge>
          </div>

          <div className="space-y-1 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive && location.pathname === '/'
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`
              }
            >
              <Radio className="w-4 h-4 text-zinc-400" />
              Overview
            </NavLink>

            <NavLink
              to="/architecture"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`
              }
            >
              <Layers className="w-4 h-4 text-zinc-400" />
              Architecture
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-400" />
              Pit Wall Console
            </NavLink>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  to="/login"
                  className="flex-1 py-2 text-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-zinc-950 dark:bg-white dark:text-zinc-950 rounded-lg"
                >
                  Enter Console
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
