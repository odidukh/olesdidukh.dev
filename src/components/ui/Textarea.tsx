import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Textarea variant styles using class-variance-authority.
 *
 * @property {'default' | 'error' | 'success' | 'warning'} variant - Visual state variant.
 * @property {'sm' | 'md' | 'lg' | 'xl'} size - Textarea minimum height.
 */
const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-success focus-visible:ring-success',
        warning: 'border-warning focus-visible:ring-warning',
      },
      size: {
        sm: 'min-h-[60px] text-xs',
        md: 'min-h-[80px]',
        lg: 'min-h-[120px] text-base',
        xl: 'min-h-[160px] text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  success?: boolean;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, success, autoResize, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = ref || textareaRef;

    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };

        adjustHeight();
        textarea.addEventListener('input', adjustHeight);

        return () => {
          textarea.removeEventListener('input', adjustHeight);
        };
      }
      return undefined;
    }, [autoResize, props.value]);

    // Determine variant based on error/success props
    const computedVariant = error
      ? 'error'
      : success
        ? 'success'
        : variant || 'default';

    return (
      <textarea
        aria-invalid={error || undefined}
        className={cn(
          textareaVariants({ variant: computedVariant, size }),
          autoResize && 'resize-none',
          className
        )}
        ref={combinedRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
