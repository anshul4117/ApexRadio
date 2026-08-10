import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800/60 ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = ({ rows = 3 }) => {
  return (
    <div className="p-5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c0c0e] space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2 pt-1">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" style={{ width: `${85 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-3.5 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} rows={2} />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonCard rows={4} />
          <SkeletonCard rows={3} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
