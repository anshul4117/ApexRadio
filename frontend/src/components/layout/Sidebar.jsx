import React from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Activity,
  ShieldAlert,
  Clock,
  User,
  X,
  LogOut,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      name: 'Radio Analysis',
      path: '/dashboard/radio',
      icon: Radio,
    },
    {
      name: 'Lap Performance',
      path: '/dashboard/performance',
      icon: Activity,
    },
    {
      name: 'AI Alerts',
      path: '/dashboard/alerts',
      icon: ShieldAlert,
      badge: '3',
      alertBadge: true,
    },
    {
      name: 'Race Timeline',
      path: '/dashboard/timeline',
      icon: Clock,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ];

  const drivers = [
    { id: 'VER-01', name: 'Max Verstappen', num: '1', active: true },
    { id: 'HAM-44', name: 'Lewis Hamilton', num: '44', active: false },
    { id: 'NOR-04', name: 'Lando Norris', num: '4', active: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 border-r border-zinc-200/80 dark:border-zinc-800/80">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-semibold text-xs shadow-xs transition-transform group-hover:scale-105">
            <Radio className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-white">
              ApexRadio <span className="text-xs text-zinc-400 font-normal">AI</span>
            </span>
            <span className="text-[11px] text-zinc-500 font-normal leading-none">
              Pit Wall Intelligence
            </span>
          </div>
        </Link>

        {setIsMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Session Status Strip */}
      <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/30">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
          <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Silverstone GP
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium font-tabular">Lap 18/52</span>
        </div>
        <div className="w-full bg-zinc-200/80 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
          <div className="bg-zinc-900 dark:bg-zinc-300 h-full rounded-full" style={{ width: '34.6%' }} />
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-medium shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors ${isActive ? 'text-zinc-950 dark:text-white stroke-[2.2]' : ''}`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-normal leading-none ${
                    isActive
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                      : item.alertBadge
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 font-medium'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Driver Feed Switcher */}
        <div className="pt-6 px-3">
          <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mb-2">
            Active Telemetry Feed
          </div>
          <div className="space-y-1">
            {drivers.map((d) => (
              <div
                key={d.id}
                className={`p-2 rounded-md border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  d.active
                    ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-950 dark:text-white font-medium'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-semibold text-zinc-400">#{d.num}</span>
                  <span className="truncate">{d.name}</span>
                </div>
                {d.active && <StatusBadge status="live" size="sm" dot>Live</StatusBadge>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Operator Footer with Logout */}
      <div className="px-4 py-3 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-500 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
          <div className="truncate">
            <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {user?.name || 'GP Lambiase'}
            </div>
            <div className="text-[10px] text-zinc-400 truncate">
              {user?.callSign || 'APEX-ENG-01'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30 shadow-2xs">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full shadow-xl z-10 animate-in slide-in-from-left duration-150">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
