'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'];

/**
 * Google Analytics 4 component
 * Loads GA4 script and provides gtag functionality
 */
export function GoogleAnalytics() {
  // Don't render in development or if no measurement ID
  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Track a custom event in GA4
 */
export function trackGA4Event(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
): void {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, parameters);

    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] Event:', eventName, parameters);
    }
  }
}

/**
 * Track a page view in GA4
 */
export function trackGA4PageView(url: string, title?: string): void {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] Page View:', url, title);
    }
  }
}

/**
 * Track a conversion event in GA4
 */
export function trackGA4Conversion(
  conversionId: string,
  value?: number,
  currency?: string
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency || 'USD',
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] Conversion:', conversionId, value);
    }
  }
}
