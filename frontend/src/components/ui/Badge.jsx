import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // 'neutral' | 'outline' | 'white' | 'dark' | 'danger'
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-md font-normal select-none tracking-tight';

  const variants = {
    neutral: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60',
    outline: 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-transparent',
    white: 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium shadow-xs',
    dark: 'bg-zinc-950 text-white border border-zinc-800 font-medium',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'danger' ? 'bg-rose-500' : 'bg-zinc-400 dark:bg-zinc-500'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
