import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  ...props
}) => {
  return (
    <div
      className={`rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-zinc-800/60">
          <div>
            {title && <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
