import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * MetaItem variant styles using class-variance-authority.
 *
 * @property {'xs' | 'sm' | 'md' | 'lg'} size - Text and icon size.
 * @property {'muted' | 'primary' | 'mocha' | 'inherit'} color - Color scheme.
 */
const metaItemVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      xs: 'gap-1 text-xs',
      sm: 'gap-1 text-sm',
      md: 'gap-1.5 text-base',
      lg: 'gap-2 text-lg',
    },
    color: {
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      mocha: 'text-mocha-600 dark:text-mocha-400',
      inherit: '',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'muted',
  },
});

/**
 * Icon size classes mapped to component sizes.
 */
const iconSizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

/**
 * Props for the MetaItem component.
 */
export interface MetaItemProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof metaItemVariants> {
  /** The icon component to render (from lucide-react) */
  icon: React.ComponentType<{ className?: string }>;
  /** Custom class for the icon */
  iconClassName?: string;
}

/**
 * A component for displaying metadata with an icon and text.
 *
 * Used for dates, durations, locations, and other contextual information.
 * Commonly found in project cards, blog cards, and timeline entries.
 *
 * @example
 * ```tsx
 * // Basic usage with default styling
 * <MetaItem icon={Calendar}>2024</MetaItem>
 *
 * // With muted color (default)
 * <MetaItem icon={Clock} color="muted">3 months</MetaItem>
 *
 * // With mocha accent color
 * <MetaItem icon={MapPin} color="mocha">Remote</MetaItem>
 *
 * // Different sizes
 * <MetaItem icon={Calendar} size="xs">2024</MetaItem>
 * <MetaItem icon={Calendar} size="lg">2024</MetaItem>
 *
 * // With custom icon styling
 * <MetaItem icon={Users} iconClassName="text-mocha-500">Team of 5</MetaItem>
 *
 * // In a flex container with other meta items
 * <div className="flex items-center gap-4">
 *   <MetaItem icon={Calendar}>2024</MetaItem>
 *   <MetaItem icon={Clock}>3 months</MetaItem>
 *   <MetaItem icon={Users}>Solo</MetaItem>
 * </div>
 * ```
 */
const MetaItem = React.forwardRef<HTMLSpanElement, MetaItemProps>(
  (
    {
      className,
      size = 'sm',
      color = 'muted',
      icon: Icon,
      iconClassName,
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizeClasses[size ?? 'sm'];

    return (
      <span
        ref={ref}
        className={cn(metaItemVariants({ size, color }), className)}
        {...props}
      >
        <Icon className={cn(iconSize, iconClassName)} />
        {children}
      </span>
    );
  }
);

MetaItem.displayName = 'MetaItem';

export { MetaItem, metaItemVariants };
