import React from 'react';

/**
 * StatusBadge Component
 * Color Discipline:
 * - Calm / nominal: Neutral Gray
 * - Stressed / critical: Subtle Amber/Red
 * - Fatigued: Subtle Blue
 * - Strategy / tactical: Minimal Black & White
 */
export const StatusBadge = ({
  status = 'nominal', // 'live' | 'critical' | 'high-stress' | 'nominal' | 'fatigued' | 'warning' | 'strategy' | 'info' | 'success'
  label,
  children,
  size = 'md',
  dot = true,
  className = '',
}) => {
  const displayText = label || children || (status.charAt(0).toUpperCase() + status.slice(1));

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const statusConfigs = {
    live: {
      badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700',
      dotColor: 'bg-rose-500 animate-pulse',
    },
    critical: {
      badge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-medium',
      dotColor: 'bg-rose-500',
    },
    'high-stress': {
      badge: 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/50',
      dotColor: 'bg-rose-400',
    },
    fatigued: {
      badge: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60 font-medium',
      dotColor: 'bg-sky-500',
    },
    warning: {
      badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60',
      dotColor: 'bg-amber-500',
    },
    nominal: {
      badge: 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80',
      dotColor: 'bg-zinc-400 dark:bg-zinc-500',
    },
    strategy: {
      badge: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border border-zinc-900 dark:border-white font-medium shadow-2xs',
      dotColor: 'bg-white dark:bg-black',
    },
    info: {
      badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700',
      dotColor: 'bg-zinc-500',
    },
    success: {
      badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60',
      dotColor: 'bg-emerald-500',
    },
  };

  // Map lowercase or alias statuses
  let normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'stressed') normalizedStatus = 'critical';
  if (normalizedStatus === 'calm') normalizedStatus = 'nominal';

  const currentConfig = statusConfigs[normalizedStatus] || statusConfigs.nominal;

  return (
    <span
      className={`inline-flex items-center rounded-md select-none tracking-tight transition-colors duration-150 ${currentConfig.badge} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {dot && (
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentConfig.dotColor}`} />
      )}
      <span>{displayText}</span>
    </span>
  );
};

export default StatusBadge;
