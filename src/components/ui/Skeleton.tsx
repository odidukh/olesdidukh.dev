import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Skeleton component.
 *
 * @property {'default' | 'card' | 'avatar' | 'text' | 'button'} [variant='default'] - Pre-built skeleton shape.
 * @property {number} [lines] - Number of text lines to render (for variant="text").
 * @property {boolean} [animate=true] - Whether to show pulse animation.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pre-built skeleton shape variant */
  variant?: 'default' | 'card' | 'avatar' | 'text' | 'button';
  /** Number of text lines (for variant="text") */
  lines?: number;
  /** Whether to show pulse animation */
  animate?: boolean;
}

/**
 * A loading placeholder skeleton component.
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton className="h-4 w-full" />
 *
 * // Text skeleton (multiple lines)
 * <Skeleton variant="text" lines={3} />
 *
 * // Avatar skeleton
 * <Skeleton variant="avatar" />
 *
 * // Card skeleton
 * <Skeleton variant="card" />
 *
 * // Button skeleton
 * <Skeleton variant="button" />
 *
 * // Without animation
 * <Skeleton animate={false} className="h-20 w-full" />
 * ```
 */
function Skeleton({
  className,
  variant = 'default',
  lines = 3,
  animate = true,
  ...props
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-muted rounded-md',
    animate && 'animate-pulse',
    className
  );

  if (variant === 'text') {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn(baseClasses, 'h-10 w-10 rounded-full')} {...props} />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn('rounded-xl border bg-card p-6 space-y-4', className)}
        {...props}
      >
        <div className={cn(baseClasses, 'h-40 w-full rounded-lg')} />
        <div className={cn(baseClasses, 'h-6 w-3/4')} />
        <div className="space-y-2">
          <div className={cn(baseClasses, 'h-4 w-full')} />
          <div className={cn(baseClasses, 'h-4 w-5/6')} />
        </div>
        <div className="flex gap-2">
          <div className={cn(baseClasses, 'h-6 w-16 rounded-full')} />
          <div className={cn(baseClasses, 'h-6 w-16 rounded-full')} />
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn(baseClasses, 'h-10 w-24 rounded-md')} {...props} />
    );
  }

  return <div className={baseClasses} {...props} />;
}

/**
 * Project card skeleton for loading states.
 */
function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="animate-pulse">
        <div className="bg-muted h-48 w-full" />
        <div className="p-6 space-y-4">
          <div className="bg-muted h-6 w-3/4 rounded" />
          <div className="space-y-2">
            <div className="bg-muted h-4 w-full rounded" />
            <div className="bg-muted h-4 w-5/6 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="bg-muted h-6 w-16 rounded-full" />
            <div className="bg-muted h-6 w-16 rounded-full" />
            <div className="bg-muted h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Blog post card skeleton for loading states.
 */
function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="animate-pulse">
        <div className="bg-muted h-40 w-full" />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-5 w-20 rounded-full" />
            <div className="bg-muted h-4 w-24 rounded" />
          </div>
          <div className="bg-muted h-6 w-full rounded" />
          <div className="space-y-2">
            <div className="bg-muted h-4 w-full rounded" />
            <div className="bg-muted h-4 w-4/5 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="bg-muted h-4 w-20 rounded" />
            <div className="bg-muted h-4 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skills grid skeleton for loading states.
 */
function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-4 animate-pulse space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="bg-muted h-10 w-10 rounded-lg" />
            <div className="bg-muted h-5 w-20 rounded" />
          </div>
          <div className="bg-muted h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Timeline skeleton for experience loading states.
 */
function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-muted h-4 w-4 rounded-full" />
            <div className="bg-muted h-full w-0.5 mt-2" />
          </div>
          <div className="flex-1 space-y-3 pb-8">
            <div className="bg-muted h-6 w-48 rounded" />
            <div className="bg-muted h-5 w-32 rounded" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-full rounded" />
              <div className="bg-muted h-4 w-5/6 rounded" />
              <div className="bg-muted h-4 w-4/5 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Contact form skeleton for loading states.
 */
function ContactFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded" />
          <div className="bg-muted h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded" />
          <div className="bg-muted h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-muted h-4 w-20 rounded" />
        <div className="bg-muted h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="bg-muted h-4 w-20 rounded" />
        <div className="bg-muted h-32 w-full rounded-lg" />
      </div>
      <div className="bg-muted h-10 w-32 rounded-lg" />
    </div>
  );
}

/**
 * Table skeleton for data loading states.
 */
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-muted/50 rounded-t-lg">
        <div className="bg-muted h-4 w-1/4 rounded" />
        <div className="bg-muted h-4 w-1/4 rounded" />
        <div className="bg-muted h-4 w-1/4 rounded" />
        <div className="bg-muted h-4 w-1/4 rounded" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          <div className="bg-muted h-4 w-1/4 rounded" />
          <div className="bg-muted h-4 w-1/4 rounded" />
          <div className="bg-muted h-4 w-1/4 rounded" />
          <div className="bg-muted h-4 w-1/4 rounded" />
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  ProjectCardSkeleton,
  BlogCardSkeleton,
  SkillsSkeleton,
  TimelineSkeleton,
  ContactFormSkeleton,
  TableSkeleton,
};
