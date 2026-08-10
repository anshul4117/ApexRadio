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
  ...props
}) => {
  return (
    <div
      className={`relative rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111113] text-zinc-900 dark:text-zinc-100 shadow-xs transition-all duration-150 ${className}`}
      {...props}
    >
      {/* Optional Card Header */}
      {(title || subtitle || badge || action) && (
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {title}
                </h3>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-900/30 rounded-b-lg text-xs text-zinc-500 dark:text-zinc-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
