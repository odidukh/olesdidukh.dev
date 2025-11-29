import * as React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Card variant styles using class-variance-authority.
 *
 * @property {'default' | 'elevated' | 'ghost' | 'bordered' | 'interactive'} variant - Visual style variant.
 * @property {'none' | 'sm' | 'md' | 'lg' | 'xl'} padding - Internal padding size.
 */
const cardVariants = cva('rounded-xl border bg-card text-card-foreground', {
  variants: {
    variant: {
      default: 'shadow-sm',
      elevated: 'shadow-lg hover:shadow-xl transition-shadow duration-300',
      ghost: 'border-0 shadow-none',
      bordered: 'shadow-none',
      interactive:
        'shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

/**
 * A compound card component for displaying content in a contained box.
 *
 * Use with CardHeader, CardTitle, CardDescription, CardContent, CardFooter, and CardImage
 * for a complete card structure.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Interactive card (clickable)
 * <Card variant="interactive" onClick={handleClick}>
 *   <CardContent>Clickable card</CardContent>
 * </Card>
 *
 * // Card with image
 * <Card padding="none">
 *   <CardImage src="/image.jpg" alt="Description" />
 *   <CardHeader className="p-4">
 *     <CardTitle>Project Name</CardTitle>
 *   </CardHeader>
 * </Card>
 * ```
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding }), className)}
    {...props}
  />
));
Card.displayName = 'Card';

/** Card header container for title and description */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/** Card title element (renders as h3) */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-semibold text-xl leading-none tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

/** Card description text (muted styling) */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/** Card main content area */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/** Card footer for actions (flexbox row) */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

/**
 * Card image component with responsive aspect ratios.
 *
 * @property {string} [src] - Image source URL.
 * @property {string} [alt] - Image alt text for accessibility.
 * @property {'square' | 'video' | 'wide' | 'portrait'} [aspectRatio='video'] - Aspect ratio preset.
 */
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Image source URL */
    src?: string;
    /** Image alt text for accessibility */
    alt?: string;
    /** Aspect ratio: 'square' (1:1), 'video' (16:9), 'wide' (21:9), 'portrait' (3:4) */
    aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  }
>(({ className, src, alt, aspectRatio = 'video', ...props }, ref) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-t-xl bg-muted',
        aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Card image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">No image</div>
        </div>
      )}
    </div>
  );
});
CardImage.displayName = 'CardImage';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  cardVariants,
};
