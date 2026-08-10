import React from 'react';

export const SectionHeader = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200/80 dark:border-zinc-800/80 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h2>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
