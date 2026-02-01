import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * IconBox variant styles using class-variance-authority.
 *
 * @property {'default' | 'gradient' | 'outline' | 'ghost'} variant - Visual style variant.
 * @property {'sm' | 'md' | 'lg' | 'xl'} size - Icon box size.
 * @property {'full' | 'xl' | 'lg' | 'md'} rounded - Border radius.
 */
const iconBoxVariants = cva(
  'inline-flex items-center justify-center shrink-0 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        gradient: 'bg-gradient-to-br text-white shadow-md',
        outline: 'border-2 border-current bg-transparent',
        ghost: 'bg-transparent',
        solid: 'bg-primary text-primary-foreground shadow-sm',
      },
      size: {
        xs: 'w-8 h-8 p-1.5',
        sm: 'w-10 h-10 p-2',
        md: 'w-12 h-12 p-2.5',
        lg: 'w-14 h-14 p-3',
        xl: 'w-16 h-16 p-4',
      },
      rounded: {
        full: 'rounded-full',
        xl: 'rounded-xl',
        lg: 'rounded-lg',
        md: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'xl',
    },
  }
);

/**
 * Predefined gradient color presets for common use cases.
 */
export const iconBoxGradients = {
  mocha: 'from-mocha-500 to-mocha-600',
  navy: 'from-navy-500 to-navy-600',
  info: 'from-info-500 to-info-600',
  success: 'from-success-500 to-success-600',
  warning: 'from-warning-500 to-warning-600',
  error: 'from-error-500 to-error-600',
  primary: 'from-primary to-primary/80',
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  indigo: 'from-indigo-500 to-violet-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-red-500',
} as const;

/** Type for gradient color presets */
export type IconBoxGradient = keyof typeof iconBoxGradients;

/**
 * Props for the IconBox component.
 */
export interface IconBoxProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconBoxVariants> {
  /** The icon component to render (from lucide-react) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Gradient color preset (only applies when variant="gradient") */
  gradient?: IconBoxGradient;
  /** Custom gradient classes (overrides gradient preset) */
  gradientClassName?: string;
  /** Custom class for the icon inside */
  iconClassName?: string;
  /** Whether to animate scale on hover when inside a group */
  groupHoverScale?: boolean;
}

/**
 * A container component for icons with various visual styles.
 *
 * Supports solid colors, gradients, outlines, and ghost variants.
 * Commonly used for feature icons, contact method icons, and category indicators.
 *
 * @example
 * ```tsx
 * // Basic usage with default styling
 * <IconBox icon={Mail} />
 *
 * // Gradient variant with preset color
 * <IconBox icon={Phone} variant="gradient" gradient="mocha" />
 *
 * // Custom gradient
 * <IconBox
 *   icon={MessageSquare}
 *   variant="gradient"
 *   gradientClassName="from-cyan-500 to-blue-600"
 * />
 *
 * // Different sizes
 * <IconBox icon={Star} size="lg" />
 * <IconBox icon={Code2} size="sm" rounded="full" />
 *
 * // Inside a group with hover scale
 * <a className="group flex items-center">
 *   <IconBox icon={Github} variant="gradient" gradient="navy" groupHoverScale />
 * </a>
 *
 * // With children instead of icon prop
 * <IconBox variant="gradient" gradient="success">
 *   <CustomIcon />
 * </IconBox>
 * ```
 */
const IconBox = React.forwardRef<HTMLDivElement, IconBoxProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      icon: Icon,
      gradient,
      gradientClassName,
      iconClassName,
      groupHoverScale = false,
      children,
      ...props
    },
    ref
  ) => {
    const gradientClass =
      variant === 'gradient'
        ? gradientClassName ||
          (gradient ? iconBoxGradients[gradient] : iconBoxGradients.primary)
        : '';

    return (
      <div
        ref={ref}
        className={cn(
          iconBoxVariants({ variant, size, rounded }),
          gradientClass,
          groupHoverScale && 'group-hover:scale-105 group-hover:shadow-lg',
          className
        )}
        {...props}
      >
        {Icon ? (
          <Icon className={cn('w-full h-full', iconClassName)} />
        ) : (
          children
        )}
      </div>
    );
  }
);

IconBox.displayName = 'IconBox';

export { IconBox, iconBoxVariants };
