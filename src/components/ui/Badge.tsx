import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge variant styles using class-variance-authority.
 *
 * @example
 * ```tsx
 * // Apply variants directly
 * <span className={badgeVariants({ variant: 'success', size: 'lg' })} />
 * ```
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline:
          'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
        success:
          'border-transparent bg-success text-success-foreground shadow hover:bg-success/80',
        warning:
          'border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80',
        info: 'border-transparent bg-info text-info-foreground shadow hover:bg-info/80',
        mocha:
          'border-transparent bg-mocha-500 text-white shadow hover:bg-mocha-600',
        navy: 'border-transparent bg-navy-500 text-white shadow hover:bg-navy-600',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      rounded: {
        full: 'rounded-full',
        lg: 'rounded-lg',
        md: 'rounded-md',
        sm: 'rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'full',
    },
  }
);

/**
 * Props for the Badge component.
 *
 * @property {'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'mocha' | 'navy' | 'ghost'} [variant='default'] - Visual style variant.
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Badge size.
 * @property {'full' | 'lg' | 'md' | 'sm'} [rounded='full'] - Border radius style.
 * @property {React.ReactNode} [icon] - Icon to display before the badge text.
 * @property {() => void} [onRemove] - Callback when remove button is clicked. Shows an X button when provided.
 */
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon to display before the badge text */
  icon?: React.ReactNode;
  /** Callback when remove button is clicked. Shows an X button when provided. */
  onRemove?: () => void;
}

/**
 * A small status indicator or label component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Badge>New</Badge>
 *
 * // With variant
 * <Badge variant="success">Active</Badge>
 *
 * // With icon
 * <Badge variant="info" icon={<InfoIcon className="h-3 w-3" />}>
 *   Info
 * </Badge>
 *
 * // Removable badge
 * <Badge variant="secondary" onRemove={() => handleRemove(id)}>
 *   React
 * </Badge>
 *
 * // Different sizes
 * <Badge size="sm">Small</Badge>
 * <Badge size="lg">Large</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, rounded, icon, onRemove, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, rounded }), className)}
        {...props}
      >
        {icon && <span className="mr-1 flex items-center">{icon}</span>}
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 hover:opacity-75 focus:outline-none"
            aria-label="Remove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// ─── SelectableBadge ────────────────────────────────────────────────────────

interface SelectableBadgeProps extends Omit<
  BadgeProps,
  'variant' | 'role' | 'tabIndex' | 'onClick'
> {
  /** Whether this badge is currently selected */
  selected: boolean;
  /** Called when the badge is selected via click or keyboard */
  onSelect: () => void;
}

/**
 * A badge that acts as a toggle button with proper keyboard and a11y support.
 * Used for selectable option groups (project type, budget, timeline, etc.).
 */
const SelectableBadge = React.forwardRef<HTMLDivElement, SelectableBadgeProps>(
  ({ selected, onSelect, className, children, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant={selected ? 'default' : 'outline'}
        className={cn(
          'cursor-pointer transition-all hover:scale-105',
          className
        )}
        onClick={onSelect}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        {...props}
      >
        {children}
      </Badge>
    );
  }
);

SelectableBadge.displayName = 'SelectableBadge';

export { Badge, badgeVariants, SelectableBadge };
