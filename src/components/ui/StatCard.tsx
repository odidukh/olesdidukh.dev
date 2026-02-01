import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * StatCard variant styles using class-variance-authority.
 *
 * @property {'default' | 'elevated' | 'glass'} variant - Visual style variant.
 * @property {'sm' | 'md' | 'lg'} size - Card size affecting padding and text sizes.
 * @property {'left' | 'center'} align - Text alignment within the card.
 */
const statCardVariants = cva(
  'rounded-xl border bg-card text-card-foreground transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-border shadow-sm',
        elevated:
          'border-border shadow-md hover:shadow-lg hover:-translate-y-0.5',
        glass: 'border-border/50 bg-card/50 backdrop-blur',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      align: 'center',
    },
  }
);

const iconSizeClasses = {
  sm: 'w-6 h-6 mb-2',
  md: 'w-8 h-8 mb-3',
  lg: 'w-10 h-10 mb-4',
} as const;

const valueSizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
} as const;

const labelSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

/**
 * Props for the StatCard component.
 */
export interface StatCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  /** The icon component to render (from lucide-react) */
  icon?: React.ComponentType<{ className?: string }>;
  /** The main statistic value to display */
  value: string | number;
  /** The label describing the statistic */
  label: string;
  /** Custom class for the icon */
  iconClassName?: string;
  /** Custom class for the value */
  valueClassName?: string;
  /** Custom class for the label */
  labelClassName?: string;
}

/**
 * A card component for displaying statistics with an icon, value, and label.
 *
 * Used across the portfolio to show metrics like years of experience,
 * number of projects, skills count, etc.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <StatCard
 *   icon={Code2}
 *   value="26"
 *   label="Total Skills"
 * />
 *
 * // With custom styling
 * <StatCard
 *   icon={Star}
 *   value="7+"
 *   label="Years Experience"
 *   variant="elevated"
 *   iconClassName="text-mocha-500"
 *   valueClassName="text-primary"
 * />
 *
 * // Different sizes
 * <StatCard icon={Trophy} value="50+" label="Projects" size="lg" />
 *
 * // Left-aligned
 * <StatCard icon={Users} value="1K+" label="Users" align="left" />
 * ```
 */
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      variant,
      size = 'md',
      align,
      icon: Icon,
      value,
      label,
      iconClassName,
      valueClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizeClasses[size ?? 'md'];
    const valueSize = valueSizeClasses[size ?? 'md'];
    const labelSize = labelSizeClasses[size ?? 'md'];
    const isCentered = align === 'center' || align === undefined;

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant, size, align }), className)}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              iconSize,
              'text-primary',
              isCentered && 'mx-auto',
              iconClassName
            )}
          />
        )}
        <div className={cn(valueSize, 'font-bold mb-1', valueClassName)}>
          {value}
        </div>
        <div className={cn(labelSize, 'text-muted-foreground', labelClassName)}>
          {label}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export { StatCard, statCardVariants };
