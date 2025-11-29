import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Input variant styles using class-variance-authority.
 *
 * @property {'default' | 'error' | 'success' | 'warning'} variant - Visual state variant.
 * @property {'sm' | 'md' | 'lg' | 'xl'} inputSize - Input height and padding.
 */
const inputVariants = cva(
  'flex w-full rounded-lg border bg-transparent px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-success focus-visible:ring-success',
        warning: 'border-warning focus-visible:ring-warning',
      },
      inputSize: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 py-2',
        lg: 'h-12 px-4 text-base',
        xl: 'h-14 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

/**
 * Props for the Input component.
 *
 * @property {React.ReactNode} [leftIcon] - Icon displayed on the left side of the input.
 * @property {React.ReactNode} [rightIcon] - Icon displayed on the right side of the input.
 * @property {boolean} [error] - Shorthand for variant="error". Shows error styling.
 * @property {boolean} [success] - Shorthand for variant="success". Shows success styling.
 * @property {'default' | 'error' | 'success' | 'warning'} [variant] - Visual state variant.
 * @property {'sm' | 'md' | 'lg' | 'xl'} [inputSize] - Input size (height and padding).
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Icon displayed on the left side of the input */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the input */
  rightIcon?: React.ReactNode;
  /** Shorthand for variant="error". Shows error styling. */
  error?: boolean;
  /** Shorthand for variant="success". Shows success styling. */
  success?: boolean;
}

/**
 * A form input component with validation states and icon support.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter your email" type="email" />
 *
 * // With icons
 * <Input
 *   leftIcon={<Mail className="h-4 w-4" />}
 *   placeholder="Email address"
 * />
 *
 * // Error state
 * <Input error placeholder="Invalid input" />
 *
 * // Different sizes
 * <Input inputSize="sm" placeholder="Small input" />
 * <Input inputSize="lg" placeholder="Large input" />
 *
 * // With form validation
 * <Input
 *   error={!!errors.email}
 *   {...register('email')}
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      leftIcon,
      rightIcon,
      error,
      success,
      ...props
    },
    ref
  ) => {
    // Determine variant based on error/success props
    const computedVariant = error
      ? 'error'
      : success
        ? 'success'
        : variant || 'default';

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: computedVariant, inputSize }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant: computedVariant, inputSize }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
