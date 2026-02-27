'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { ObfuscatedEmailLink } from '@/components/ObfuscatedEmail';
import { MagneticEffect } from '@/components/ui/MagneticEffect';

/**
 * SocialIconButton variant styles using class-variance-authority.
 *
 * @property {'ghost' | 'outline' | 'subtle'} variant - Visual style variant.
 * @property {'sm' | 'md' | 'lg'} size - Button size.
 */
const socialIconButtonVariants = cva('transition-colors', {
  variants: {
    variant: {
      ghost: 'hover:text-primary',
      outline: 'border hover:text-primary hover:border-primary',
      subtle: 'hover:text-mocha-600 dark:hover:text-mocha-400',
    },
    size: {
      sm: 'h-8 w-8',
      md: 'h-9 w-9',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'md',
  },
});

/**
 * Icon size classes mapped to component sizes.
 */
const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

/**
 * Common social platform configurations.
 */
export const socialPlatforms = {
  github: {
    url: 'https://github.com/odidukh',
    label: 'GitHub',
  },
  linkedin: {
    url: 'https://linkedin.com/in/oles-didukh',
    label: 'LinkedIn',
  },
  threads: {
    url: 'https://www.threads.com/@oles.o.didukh',
    label: 'Threads',
  },
} as const;

/** Type for social platform presets */
export type SocialPlatform = keyof typeof socialPlatforms;

/**
 * Props for the SocialIconButton component.
 */
export interface SocialIconButtonProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>,
    VariantProps<typeof socialIconButtonVariants> {
  /** The icon component to render (from lucide-react) */
  icon: React.ComponentType<{ className?: string }>;
  /** URL for the social link */
  href?: string;
  /** Accessible label for the button */
  'aria-label': string;
  /** If true, wraps with ObfuscatedEmailLink for email protection */
  obfuscateEmail?: boolean;
  /** Custom class for the icon */
  iconClassName?: string;
}

/**
 * A button component for social media links with external link handling.
 *
 * Automatically adds target="_blank" and rel="noopener noreferrer" for external links.
 * Supports email obfuscation for spam protection.
 *
 * @example
 * ```tsx
 * // Basic usage with GitHub
 * <SocialIconButton
 *   icon={Github}
 *   href="https://github.com/odidukh"
 *   aria-label="GitHub"
 * />
 *
 * // LinkedIn with subtle variant
 * <SocialIconButton
 *   icon={Linkedin}
 *   href="https://linkedin.com/in/oles-didukh"
 *   aria-label="LinkedIn"
 *   variant="subtle"
 * />
 *
 * // Email with obfuscation
 * <SocialIconButton
 *   icon={Mail}
 *   aria-label="Email"
 *   obfuscateEmail
 * />
 *
 * // Different sizes
 * <SocialIconButton icon={Github} href="..." aria-label="GitHub" size="sm" />
 * <SocialIconButton icon={Github} href="..." aria-label="GitHub" size="lg" />
 *
 * // In a social links group
 * <div className="flex gap-2">
 *   <SocialIconButton icon={Github} href="..." aria-label="GitHub" />
 *   <SocialIconButton icon={Linkedin} href="..." aria-label="LinkedIn" />
 *   <SocialIconButton icon={Mail} aria-label="Email" obfuscateEmail />
 * </div>
 * ```
 */
const SocialIconButton = React.forwardRef<
  HTMLAnchorElement,
  SocialIconButtonProps
>(
  (
    {
      className,
      variant,
      size = 'md',
      icon: Icon,
      href,
      'aria-label': ariaLabel,
      obfuscateEmail = false,
      iconClassName,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizeClasses[size ?? 'md'];
    const buttonVariant = variant === 'outline' ? 'outline' : 'ghost';
    const combinedClassName = cn(
      socialIconButtonVariants({ variant, size }),
      className
    );

    const iconElement = <Icon className={cn(iconSize, iconClassName)} />;

    // Handle obfuscated email
    if (obfuscateEmail) {
      return (
        <MagneticEffect strength={30}>
          <Button
            variant={buttonVariant}
            size="icon"
            asChild
            className={combinedClassName}
          >
            <ObfuscatedEmailLink ariaLabel={ariaLabel}>
              {iconElement}
            </ObfuscatedEmailLink>
          </Button>
        </MagneticEffect>
      );
    }

    // Regular external link
    return (
      <MagneticEffect strength={30}>
        <Button
          variant={buttonVariant}
          size="icon"
          asChild
          className={combinedClassName}
        >
          <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            {...props}
          >
            {iconElement}
          </a>
        </Button>
      </MagneticEffect>
    );
  }
);

SocialIconButton.displayName = 'SocialIconButton';

export { SocialIconButton, socialIconButtonVariants };
