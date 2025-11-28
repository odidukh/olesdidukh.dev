import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-screen-sm', // 640px
      md: 'max-w-screen-md', // 768px
      lg: 'max-w-screen-lg', // 1024px
      xl: 'max-w-screen-xl', // 1280px
      '2xl': 'max-w-screen-2xl', // 1536px
      full: 'max-w-full',
      content: 'max-w-4xl', // 896px - optimized for reading
      narrow: 'max-w-2xl', // 672px - for text-heavy content
      wide: 'max-w-7xl', // 1280px - for dashboards
    },
    padding: {
      none: '',
      sm: 'px-4 sm:px-6',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
      xl: 'px-8 sm:px-12 lg:px-16',
    },
    paddingY: {
      none: '',
      sm: 'py-4',
      md: 'py-8',
      lg: 'py-12',
      xl: 'py-16',
      '2xl': 'py-20',
    },
  },
  defaultVariants: {
    size: 'xl',
    padding: 'md',
    paddingY: 'none',
  },
});

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size,
      padding,
      paddingY,
      asChild = false,
      as: Component = 'div',
      children,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = asChild ? Slot : Component;

    return (
      <Comp
        className={cn(
          containerVariants({ size, padding, paddingY, className })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Container.displayName = 'Container';

export { Container, containerVariants };
export type { ContainerProps };
