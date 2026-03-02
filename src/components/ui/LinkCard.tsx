'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { IconBox, type IconBoxGradient, iconBoxGradients } from './IconBox';

// Re-export IconBoxGradient for consumers
export type { IconBoxGradient };
import { ChevronRight } from 'lucide-react';

/**
 * LinkCard variant styles using class-variance-authority.
 */
const linkCardVariants = cva(
  'group flex items-center gap-4 rounded-xl border transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'border-border bg-card hover:bg-muted/50 hover:border-primary/30 hover:shadow-lg',
        subtle: 'border-transparent hover:bg-muted',
        elevated:
          'border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Props for the LinkCard component.
 */
export interface LinkCardProps
  extends
    Omit<HTMLMotionProps<'a'>, 'children'>,
    VariantProps<typeof linkCardVariants> {
  /** The icon component to render (from lucide-react) */
  icon: React.ComponentType<{ className?: string }>;
  /** Main title text */
  title: string;
  /** Secondary description text */
  description?: string;
  /** Value or action text displayed below title */
  value?: string;
  /** URL for the link */
  href: string;
  /** Gradient color for the icon box */
  gradient?: IconBoxGradient;
  /** Custom gradient classes (overrides gradient preset) */
  gradientClassName?: string;
  /** Whether to show the arrow indicator */
  showArrow?: boolean;
  /** Custom aria-label for accessibility */
  ariaLabel?: string;
  /** Whether the link opens in a new tab (auto-detected from href) */
  external?: boolean;
  /** Animation delay for staggered entrances */
  animationDelay?: number;
  /** Whether to animate on mount */
  animate?: boolean;
}

/**
 * A clickable card component for links with an icon, title, description, and optional arrow.
 *
 * Perfect for contact methods, social links, navigation items, and any clickable
 * card pattern with an icon and descriptive content.
 *
 * @example
 * ```tsx
 * // Contact method card
 * <LinkCard
 *   icon={Mail}
 *   title="Email"
 *   description="Best for project inquiries"
 *   value="hello@example.com"
 *   href="mailto:hello@example.com"
 *   gradient="mocha"
 * />
 *
 * // Social link
 * <LinkCard
 *   icon={Github}
 *   title="GitHub"
 *   description="Code repositories"
 *   value="@username"
 *   href="https://github.com/username"
 *   gradient="navy"
 * />
 *
 * // Navigation item
 * <LinkCard
 *   icon={FileText}
 *   title="Resume"
 *   description="Download my CV"
 *   href="/resume.pdf"
 *   gradient="success"
 *   showArrow={false}
 * />
 *
 * // With animation
 * <LinkCard
 *   icon={Phone}
 *   title="Phone"
 *   value="+1 234 567 890"
 *   href="tel:+1234567890"
 *   gradient="info"
 *   animate
 *   animationDelay={0.2}
 * />
 * ```
 */
const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      title,
      description,
      value,
      href,
      gradient = 'primary',
      gradientClassName,
      showArrow = true,
      ariaLabel,
      external,
      animationDelay = 0,
      animate = false,
      ...props
    },
    ref
  ) => {
    // Auto-detect if link is external
    const isExternal = external ?? href.startsWith('http');

    const externalProps = isExternal
      ? {
          target: '_blank' as const,
          rel: 'noopener noreferrer',
        }
      : {};

    const motionProps = animate
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: animationDelay },
          whileHover: { x: 4 },
        }
      : {
          whileHover: { x: 4 },
        };

    return (
      <motion.a
        ref={ref}
        href={href}
        aria-label={ariaLabel || title}
        className={cn(linkCardVariants({ variant, size }), className)}
        {...externalProps}
        {...motionProps}
        {...props}
      >
        {/* Icon */}
        <IconBox
          icon={Icon}
          variant="gradient"
          gradient={gradient}
          {...(gradientClassName ? { gradientClassName } : {})}
          groupHoverScale
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-foreground">{title}</span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {' '}
                {description}
              </span>
            )}
          </div>
          {value && (
            <p className="text-sm sm:text-lg font-medium text-primary truncate">
              {value}
            </p>
          )}
        </div>

        {/* Arrow */}
        {showArrow && (
          <ChevronRight
            className="shrink-0 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
            aria-hidden="true"
          />
        )}
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

// Re-export gradient presets for convenience
export { iconBoxGradients as linkCardGradients };

export { LinkCard, linkCardVariants };
