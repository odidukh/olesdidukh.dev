import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * StatusIndicator variant styles using class-variance-authority.
 *
 * @property {'available' | 'busy' | 'offline' | 'error'} variant - Status type.
 * @property {'sm' | 'md' | 'lg'} size - Indicator size.
 */
const statusIndicatorVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      available: '',
      busy: '',
      offline: '',
      error: '',
    },
    size: {
      sm: 'gap-1.5 text-xs',
      md: 'gap-2 text-sm',
      lg: 'gap-2.5 text-base',
    },
  },
  defaultVariants: {
    variant: 'available',
    size: 'md',
  },
});

/**
 * Dot size classes mapped to component sizes.
 */
const dotSizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
} as const;

/**
 * Color classes for each status variant.
 */
const statusColorClasses = {
  available: {
    dot: 'bg-green-500',
    text: 'text-green-500',
  },
  busy: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-500',
  },
  offline: {
    dot: 'bg-gray-400',
    text: 'text-gray-400',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-500',
  },
} as const;

/**
 * Default labels for each status variant.
 */
const defaultLabels = {
  available: 'Available for opportunities',
  busy: 'Currently busy',
  offline: 'Offline',
  error: 'Unavailable',
} as const;

/**
 * Props for the StatusIndicator component.
 */
export interface StatusIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  /** Optional custom label (overrides default) */
  label?: string;
  /** Whether to show the label text */
  showLabel?: boolean;
  /** Whether to animate the dot (pulse) */
  pulse?: boolean;
  /** Custom class for the dot */
  dotClassName?: string;
  /** Custom class for the label text */
  labelClassName?: string;
}

/**
 * A status indicator component with a pulsing dot and optional label.
 *
 * Used to display availability status, online/offline state, or system status.
 * Commonly found in hero sections and contact areas.
 *
 * @example
 * ```tsx
 * // Basic usage - available status
 * <StatusIndicator />
 *
 * // With custom label
 * <StatusIndicator label="Open to work" />
 *
 * // Different statuses
 * <StatusIndicator variant="available" />
 * <StatusIndicator variant="busy" label="In a meeting" />
 * <StatusIndicator variant="offline" />
 * <StatusIndicator variant="error" label="Service unavailable" />
 *
 * // Dot only (no label)
 * <StatusIndicator showLabel={false} />
 *
 * // Without pulse animation
 * <StatusIndicator pulse={false} />
 *
 * // Different sizes
 * <StatusIndicator size="sm" />
 * <StatusIndicator size="lg" label="Available now" />
 *
 * // With custom styling
 * <StatusIndicator
 *   variant="available"
 *   dotClassName="shadow-lg"
 *   labelClassName="font-medium"
 * />
 * ```
 */
const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    {
      className,
      variant = 'available',
      size = 'md',
      label,
      showLabel = true,
      pulse = true,
      dotClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const dotSize = dotSizeClasses[size ?? 'md'];
    const colors = statusColorClasses[variant ?? 'available'];
    const displayLabel = label ?? defaultLabels[variant ?? 'available'];

    return (
      <div
        ref={ref}
        className={cn(statusIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        <div
          className={cn(
            dotSize,
            colors.dot,
            'rounded-full',
            pulse && 'animate-pulse',
            dotClassName
          )}
        />
        {showLabel && (
          <span className={cn(colors.text, labelClassName)}>
            {displayLabel}
          </span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';

export { StatusIndicator, statusIndicatorVariants };
