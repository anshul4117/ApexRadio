import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  badge,
  action,
  footer,
  noPadding = false,
  hoverable = true,
  ...props
}) => {
  return (
    <div
      className={`relative rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0e0e11] text-zinc-900 dark:text-zinc-100 shadow-xs ${
        hoverable ? 'card-hover-lift' : ''
      } ${className}`}
      {...props}
    >
      {/* Optional Card Header */}
      {(title || subtitle || badge || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3.5 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 truncate">
                  {title}
                </h3>
              )}
              {badge && <div className="flex-shrink-0">{badge}</div>}
            </div>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed truncate">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-b-xl text-xs text-zinc-500 dark:text-zinc-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
