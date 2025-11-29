'use client';

import * as React from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';

interface TrackedLinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'onClick'> {
  /**
   * CTA name for tracking (e.g., "view_my_work", "contact_me")
   */
  ctaName: string;
  /**
   * Additional properties to track
   */
  trackingProps?: Record<string, string | number | boolean>;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * A Link component that tracks CTA clicks for analytics
 *
 * @example
 * ```tsx
 * <TrackedLink href="/projects" ctaName="view_my_work">
 *   View My Work
 * </TrackedLink>
 * ```
 */
export function TrackedLink({
  href,
  ctaName,
  trackingProps,
  children,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    track('cta_click', {
      cta: ctaName,
      destination: typeof href === 'string' ? href : href.pathname || '',
      location: typeof window !== 'undefined' ? window.location.pathname : '',
      ...trackingProps,
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
