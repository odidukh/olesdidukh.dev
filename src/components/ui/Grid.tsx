import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
      auto: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
      'auto-sm': 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
      'auto-lg': 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
      responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      'responsive-2': 'grid-cols-1 md:grid-cols-2',
      'responsive-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      'responsive-4':
        'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      12: 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
  },
  defaultVariants: {
    cols: 'responsive',
    gap: 6,
    align: 'stretch',
    justify: 'stretch',
  },
});

interface GridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  asChild?: boolean;
  as?: React.ElementType;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols,
      gap,
      align,
      justify,
      asChild = false,
      as: Component = 'div',
      children,
      ...props
    },
    ref
  ) => {
    // Using 'any' for dynamic component is standard pattern for polymorphic components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = asChild ? Slot : Component;

    return (
      <Comp
        className={cn(gridVariants({ cols, gap, align, justify, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Grid.displayName = 'Grid';

const gridItemVariants = cva('', {
  variants: {
    span: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      6: 'col-span-6',
      12: 'col-span-12',
      full: 'col-span-full',
      auto: 'col-auto',
    },
  },
  defaultVariants: {
    span: 'auto',
  },
});

interface GridItemProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  asChild?: boolean;
  as?: React.ElementType;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      className,
      span,
      asChild = false,
      as: Component = 'div',
      children,
      ...props
    },
    ref
  ) => {
    // Using 'any' for dynamic component is standard pattern for polymorphic components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = asChild ? Slot : Component;

    return (
      <Comp
        className={cn(gridItemVariants({ span, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

GridItem.displayName = 'GridItem';

export { Grid, gridVariants, GridItem, gridItemVariants };
export type { GridProps, GridItemProps };
