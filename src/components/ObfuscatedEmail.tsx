'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { decodeEmail, ENCODED_EMAIL } from '@/lib/obfuscate';

interface ObfuscatedEmailProps {
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  /** If true, only show the email text without a mailto link */
  textOnly?: boolean;
}

/**
 * Displays an email address that is obfuscated in HTML source.
 * The email is decoded client-side only, preventing most scrapers
 * from extracting it.
 */
export function ObfuscatedEmail({
  className,
  showIcon = true,
  iconClassName = 'h-4 w-4',
  textOnly = false,
}: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Decode email only on client side
    setEmail(decodeEmail(ENCODED_EMAIL));
  }, []);

  // Show placeholder during SSR and hydration
  if (!email) {
    return (
      <span className={className}>
        {showIcon && <Mail className={iconClassName} />}
        <span className="opacity-50">Loading...</span>
      </span>
    );
  }

  if (textOnly) {
    return (
      <span className={className}>
        {showIcon && <Mail className={iconClassName} />}
        <span>{email}</span>
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {showIcon && <Mail className={iconClassName} />}
      <span>{email}</span>
    </a>
  );
}

interface ObfuscatedEmailLinkProps {
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * A simple mailto link with obfuscated email.
 * Useful for icon-only buttons.
 */
export function ObfuscatedEmailLink({
  className,
  children,
  ariaLabel = 'Email',
}: ObfuscatedEmailLinkProps) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(decodeEmail(ENCODED_EMAIL));
  }, []);

  if (!email) {
    return (
      <span className={className} aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
