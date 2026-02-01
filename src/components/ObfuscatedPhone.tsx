'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import {
  decodeString,
  ENCODED_PHONE,
  ENCODED_PHONE_DISPLAY,
} from '@/lib/obfuscate';

interface ObfuscatedPhoneProps {
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  /** If true, only show the phone text without a tel link */
  textOnly?: boolean;
}

/**
 * Displays a phone number that is obfuscated in HTML source.
 * The phone is decoded client-side only, preventing most scrapers
 * from extracting it.
 */
export function ObfuscatedPhone({
  className,
  showIcon = true,
  iconClassName = 'h-4 w-4',
  textOnly = false,
}: ObfuscatedPhoneProps) {
  const [phone, setPhone] = useState<string | null>(null);
  const [phoneDisplay, setPhoneDisplay] = useState<string | null>(null);

  useEffect(() => {
    // Decode phone only on client side
    setPhone(decodeString(ENCODED_PHONE));
    setPhoneDisplay(decodeString(ENCODED_PHONE_DISPLAY));
  }, []);

  // Show placeholder during SSR and hydration
  if (!phone || !phoneDisplay) {
    return (
      <span className={className}>
        {showIcon && <Phone className={iconClassName} />}
        <span className="opacity-50">Loading...</span>
      </span>
    );
  }

  if (textOnly) {
    return (
      <span className={className}>
        {showIcon && <Phone className={iconClassName} />}
        <span>{phoneDisplay}</span>
      </span>
    );
  }

  return (
    <a href={`tel:${phone}`} className={className}>
      {showIcon && <Phone className={iconClassName} />}
      <span>{phoneDisplay}</span>
    </a>
  );
}

interface ObfuscatedPhoneLinkProps {
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * A simple tel link with obfuscated phone.
 * Useful for icon-only buttons.
 */
export function ObfuscatedPhoneLink({
  className,
  children,
  ariaLabel = 'Phone',
}: ObfuscatedPhoneLinkProps) {
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    setPhone(decodeString(ENCODED_PHONE));
  }, []);

  if (!phone) {
    return (
      <span className={className} aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  return (
    <a href={`tel:${phone}`} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
