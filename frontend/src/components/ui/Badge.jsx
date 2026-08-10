import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono rounded-full font-medium select-none';

  const variants = {
    neutral: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60',
    outline: 'border border-zinc-700 text-zinc-400 bg-transparent',
    white: 'bg-white text-black font-semibold',
    success: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60',
    warning: 'bg-amber-950/60 text-amber-300 border border-amber-800/60',
    danger: 'bg-rose-950/60 text-rose-300 border border-rose-800/60',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
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
            variant === 'success'
              ? 'bg-emerald-400 animate-pulse'
              : variant === 'warning'
              ? 'bg-amber-400'
              : variant === 'danger'
              ? 'bg-rose-400'
              : 'bg-zinc-400'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
