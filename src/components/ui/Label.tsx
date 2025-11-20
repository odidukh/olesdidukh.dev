import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        required: 'after:content-["*"] after:ml-0.5 after:text-destructive',
        optional: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-success',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    { className, variant, size, required, optional, children, ...props },
    ref
  ) => {
    const computedVariant = required
      ? 'required'
      : optional
        ? 'optional'
        : variant;

    return (
      <label
        ref={ref}
        className={cn(
          labelVariants({ variant: computedVariant, size }),
          className
        )}
        {...props}
      >
        {children}
        {optional && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </label>
    );
  }
);
Label.displayName = 'Label';

export { Label, labelVariants };
