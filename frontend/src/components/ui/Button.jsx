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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none rounded-md select-none';

  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-200 active:bg-zinc-300 shadow-sm',
    secondary: 'bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800/80 active:bg-zinc-800',
    outline: 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
    danger: 'bg-red-950/50 text-red-400 border border-red-900/60 hover:bg-red-900/40',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
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
