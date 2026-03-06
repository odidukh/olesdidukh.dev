import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button variant styles using class-variance-authority.
 *
 * @example
 * ```tsx
 * // Apply variants directly
 * <div className={buttonVariants({ variant: 'outline', size: 'lg' })} />
 * ```
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow hover:shadow-lg transition-all duration-200',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow hover:shadow-lg transition-all duration-200',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow hover:shadow-md transition-all duration-200',
        ghost:
          'hover:bg-accent hover:text-accent-foreground transition-all duration-200',
        link: 'text-primary underline-offset-4 hover:underline transition-all duration-200',
        gradient:
          'bg-gradient-to-r from-primary via-mocha-400 to-primary text-primary-foreground hover:scale-105 hover:shadow-glow transition-all duration-300 relative overflow-hidden',
        glow: 'bg-primary text-primary-foreground shadow-glow hover:shadow-glow-strong hover:scale-105 transition-all duration-300',
        code: 'border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Props for the Button component.
 *
 * @property {boolean} [asChild=false] - When true, renders as a Slot component to merge props with child element.
 *   Useful for rendering custom elements or links as buttons.
 * @property {boolean} [loading=false] - Shows a loading spinner and disables the button.
 * @property {string} [loadingText] - Text to display while loading. If not provided, shows original children.
 * @property {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glow' | 'code'} [variant='default'] - Visual style variant.
 * @property {'default' | 'sm' | 'lg' | 'xl' | 'icon'} [size='default'] - Button size.
 */
interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, renders as a Slot to merge props with child element */
  asChild?: boolean;
  /** Shows a loading spinner and disables the button */
  loading?: boolean;
  /** Text to display while loading */
  loadingText?: string;
}

/**
 * A versatile button component with multiple variants, sizes, and loading states.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant and size
 * <Button variant="outline" size="lg">Large Outline</Button>
 *
 * // Loading state
 * <Button loading loadingText="Submitting...">Submit</Button>
 *
 * // As a link (using asChild)
 * <Button asChild>
 *   <Link href="/page">Go to page</Link>
 * </Button>
 *
 * // Gradient button with glow effect
 * <Button variant="gradient">Premium Action</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2
            className={cn(
              'animate-spin',
              size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
              children || loadingText ? 'mr-2' : ''
            )}
            aria-hidden="true"
          />
        )}

        {loading && loadingText ? loadingText : children}

        {loading && (
          <span id="button-loading" className="sr-only">
            Loading, please wait
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
