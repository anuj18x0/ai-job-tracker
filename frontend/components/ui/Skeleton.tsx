"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton primitive — a shimmering rounded rectangle.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--bg-tertiary)]",
        className
      )}
    />
  );
}

/**
 * Mimics a single JobCard while loading.
 */
export function SkeletonCard() {
  return (
    <div className="relative bg-[var(--card-bg)] border border-[var(--border)]/40 p-3 rounded-lg overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-2 right-2 h-[2px] rounded-full">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        {/* Role title */}
        <Skeleton className="h-3.5 w-3/4 rounded" />

        {/* Company row */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-2.5 w-16 rounded" />
          <Skeleton className="h-2.5 w-12 rounded" />
        </div>

        {/* Skill tags */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Mimics one kanban column while loading.
 */
export function SkeletonColumn({ cardCount = 3 }: { cardCount?: number }) {
  return (
    <div className="flex flex-col flex-1 min-w-[220px] h-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-4 rounded" />
        </div>
        <Skeleton className="w-5 h-5 rounded-md" />
      </div>

      {/* Cards */}
      <div className="flex-1 flex flex-col gap-2 px-1 pb-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full kanban board skeleton — 5 columns with varying card counts.
 */
export function SkeletonBoard() {
  const columnCardCounts = [3, 2, 1, 2, 1];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-primary)]">
      {/* Stats skeleton */}
      <div className="flex items-center gap-6 px-6 py-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-8 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
            {i < 3 && <div className="w-px h-4 bg-[var(--border)]/40" />}
          </div>
        ))}
      </div>

      {/* Columns skeleton */}
      <div className="flex-1 overflow-x-auto no-scrollbar">
        <div className="flex h-full w-full px-4 py-2 gap-3">
          {columnCardCounts.map((count, i) => (
            <SkeletonColumn key={i} cardCount={count} />
          ))}
        </div>
      </div>
    </div>
  );
}
