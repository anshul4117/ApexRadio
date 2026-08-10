import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 disabled:opacity-40 disabled:pointer-events-none rounded-md select-none cursor-pointer tracking-tight';

  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-xs active:scale-[0.99]',
    secondary: 'bg-zinc-100 text-zinc-900 border border-zinc-200/80 hover:bg-zinc-200/60 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800/80 shadow-xs',
    outline: 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white bg-transparent',
    ghost: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 dark:hover:bg-rose-900/40',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-sm px-4 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
