import React from 'react';

export const StatusBadge = ({
  status = 'nominal', // 'live' | 'critical' | 'high-stress' | 'nominal' | 'warning' | 'strategy' | 'info' | 'success'
  label,
  children,
  size = 'md',
  dot = true,
  className = '',
}) => {
  const displayText = label || children || (status.charAt(0).toUpperCase() + status.slice(1));

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  // Color discipline: Grayscale (black/white/zinc) + subtle red accent for critical/alerts
  const statusConfigs = {
    live: {
      badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700',
      dotColor: 'bg-rose-500 animate-pulse',
    },
    critical: {
      badge: 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 font-medium',
      dotColor: 'bg-rose-500',
    },
    'high-stress': {
      badge: 'bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/40',
      dotColor: 'bg-rose-400',
    },
    warning: {
      badge: 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700',
      dotColor: 'bg-zinc-500',
    },
    nominal: {
      badge: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800',
      dotColor: 'bg-zinc-400 dark:bg-zinc-600',
    },
    strategy: {
      badge: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border border-zinc-900 dark:border-white font-medium',
      dotColor: 'bg-white dark:bg-black',
    },
    info: {
      badge: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800',
      dotColor: 'bg-zinc-500',
    },
    success: {
      badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700',
      dotColor: 'bg-zinc-900 dark:bg-zinc-100',
    },
  };

  const currentConfig = statusConfigs[status] || statusConfigs.nominal;

  return (
    <span
      className={`inline-flex items-center rounded-md font-normal select-none tracking-tight ${currentConfig.badge} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {dot && (
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentConfig.dotColor}`} />
      )}
      <span>{displayText}</span>
    </span>
  );
};

export default StatusBadge;
