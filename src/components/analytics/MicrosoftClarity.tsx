'use client';

import Script from 'next/script';

const CLARITY_PROJECT_ID = process.env['NEXT_PUBLIC_CLARITY_PROJECT_ID'];

/**
 * Microsoft Clarity component for heatmaps and session recordings
 * Free alternative to Hotjar with excellent features
 */
export function MicrosoftClarity() {
  // Don't render in development or if no project ID
  if (process.env.NODE_ENV !== 'production' || !CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}

// Type declarations for Clarity
declare global {
  interface Window {
    clarity: (
      command: 'set' | 'identify' | 'consent' | 'event' | 'upgrade',
      ...args: unknown[]
    ) => void;
  }
}

/**
 * Set custom tags in Clarity for filtering
 */
export function setClarityTag(key: string, value: string | string[]): void {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', key, value);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Clarity] Tag:', key, value);
    }
  }
}

/**
 * Identify a user in Clarity
 */
export function identifyClarityUser(
  userId: string,
  sessionId?: string,
  pageId?: string
): void {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('identify', userId, sessionId, pageId);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Clarity] Identify:', userId);
    }
  }
}

/**
 * Track a custom event in Clarity
 */
export function trackClarityEvent(eventName: string): void {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Clarity] Event:', eventName);
    }
  }
}

/**
 * Upgrade session to capture more data (useful for conversions)
 */
export function upgradeClaritySession(reason: string): void {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('upgrade', reason);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Clarity] Upgrade:', reason);
    }
  }
}
