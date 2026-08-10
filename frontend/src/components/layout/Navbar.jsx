import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Radio, ArrowRight, LogOut } from 'lucide-react';
import { healthApi } from '../../services/api';
import StatusBadge from '../ui/StatusBadge';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [serverStatus, setServerStatus] = useState('checking'); // 'healthy' | 'offline' | 'checking'
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-semibold text-xs shadow-xs transition-transform group-hover:scale-105">
                <Radio className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-white flex items-center gap-1.5">
                  ApexRadio <span className="text-xs text-zinc-400 font-normal">AI</span>
                </span>
              </div>
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

          {/* Navigation Links */}
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
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                }`
              }
            >
              Settings
            </NavLink>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="primary" size="sm" className="gap-1.5">
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
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white px-2.5 py-1.5 rounded-md transition-colors"
                >
                  Sign In
                </Link>

                <Link to="/dashboard">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    Launch Console <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
