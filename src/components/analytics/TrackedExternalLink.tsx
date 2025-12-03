'use client';

import * as React from 'react';
import { track } from '@vercel/analytics';

interface TrackedExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  linkType?: string;
  children: React.ReactNode;
}

export function TrackedExternalLink({
  href,
  linkType = 'external',
  children,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    track('external_link_click', {
      url: href,
      linkType,
      location: window.location.pathname,
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
