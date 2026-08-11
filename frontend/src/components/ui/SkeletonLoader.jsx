import React from 'react';

/**
 * Skeleton Loader Components with subtle shimmer effect
 */

export const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0e0e11] p-5 space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-4 w-24" />
      <SkeletonBox className="h-5 w-14 rounded-full" />
    </div>
    <div className="flex items-baseline justify-between pt-1">
      <SkeletonBox className="h-8 w-20" />
      <SkeletonBox className="h-4 w-16" />
    </div>
    <SkeletonBox className="h-2 w-full rounded-full" />
    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-between">
      <SkeletonBox className="h-3.5 w-20" />
      <SkeletonBox className="h-3.5 w-16" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0e0e11] p-5 space-y-4">
    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
      <div className="space-y-1">
        <SkeletonBox className="h-4 w-44" />
        <SkeletonBox className="h-3 w-60" />
      </div>
      <SkeletonBox className="h-6 w-20" />
    </div>
    <div className="h-60 w-full flex items-end gap-3 pt-4 px-2">
      {[40, 65, 80, 55, 90, 75, 45, 85, 95, 60, 50, 70, 85, 65, 40].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <SkeletonBox className="w-full rounded-t" style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
  </div>
);

export const RadioTransmissionSkeleton = () => (
  <div className="p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-4 w-4 rounded-full" />
        <SkeletonBox className="h-4 w-32" />
      </div>
      <SkeletonBox className="h-4 w-20 rounded-full" />
    </div>
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-3/4" />
    <div className="flex justify-between pt-1 border-t border-zinc-200/40 dark:border-zinc-800/40">
      <SkeletonBox className="h-3 w-20" />
      <SkeletonBox className="h-3 w-20" />
    </div>
  </div>
);

export default {
  SkeletonBox,
  StatCardSkeleton,
  ChartSkeleton,
  RadioTransmissionSkeleton,
};
