import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Radio, Activity, User, LogIn, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';
import { healthApi } from '../../services/api';
import Badge from '../ui/Badge';

export const Navbar = () => {
  const [serverStatus, setServerStatus] = useState('checking'); // 'healthy' | 'offline' | 'checking'
  const location = useLocation();

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

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Pit Wall Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Engineer Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Telemetry Indicator */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-mono font-bold text-base transition-transform group-hover:scale-105">
                <Radio className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  APEXRADIO <span className="text-xs font-mono font-normal text-zinc-400">AI</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Pit Wall Telemetry</span>
              </div>
            </Link>

            {/* Server Status Badge */}
            <div className="hidden md:flex items-center">
              <Badge
                variant={serverStatus === 'healthy' ? 'success' : serverStatus === 'checking' ? 'neutral' : 'danger'}
                size="sm"
                dot
              >
                {serverStatus === 'healthy' ? 'API LIVE' : serverStatus === 'checking' ? 'PINGING' : 'API OFFLINE'}
              </Badge>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-xs font-medium font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-zinc-800 text-white border border-zinc-700/80 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`
                  }
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-900/60 transition-colors"
            >
              LOG IN
            </Link>
            <Link
              to="/register"
              className="text-xs font-mono font-medium bg-white text-black hover:bg-zinc-200 px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3 h-3 text-black fill-current" />
              LAUNCH
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
