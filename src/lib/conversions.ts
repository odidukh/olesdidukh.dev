/**
 * Conversion tracking utilities
 * Tracks key user actions across multiple analytics platforms
 */

import { track } from '@vercel/analytics';
import {
  trackGA4Event,
  trackGA4Conversion,
} from '@/components/analytics/GoogleAnalytics';
import {
  trackClarityEvent,
  upgradeClaritySession,
} from '@/components/analytics/MicrosoftClarity';

export type ConversionType =
  | 'contact_form_submit'
  | 'newsletter_signup'
  | 'resume_download'
  | 'project_view'
  | 'blog_read'
  | 'external_link_click'
  | 'social_link_click'
  | 'email_click'
  | 'phone_click';

export interface ConversionData {
  type: ConversionType;
  value?: number | undefined;
  currency?: string | undefined;
  label?: string | undefined;
  category?: string | undefined;
  metadata?: Record<string, string | number | boolean> | undefined;
}

/**
 * Track a conversion event across all analytics platforms
 */
export function trackConversion(data: ConversionData): void {
  const { type, value, currency, label, category, metadata } = data;

  // Vercel Analytics
  track(type, {
    value: value || 0,
    label: label || type,
    category: category || 'conversion',
    ...metadata,
  });

  // Google Analytics 4
  trackGA4Event(type, {
    event_category: category || 'conversion',
    event_label: label || type,
    value: value || 0,
    currency: currency || 'USD',
    ...metadata,
  });

  // Microsoft Clarity - upgrade session for important conversions
  trackClarityEvent(type);
  if (isHighValueConversion(type)) {
    upgradeClaritySession(type);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Conversion]', type, data);
  }
}

/**
 * Determine if a conversion is high-value (worth capturing more session data)
 */
function isHighValueConversion(type: ConversionType): boolean {
  return [
    'contact_form_submit',
    'newsletter_signup',
    'resume_download',
  ].includes(type);
}

/**
 * Track contact form submission
 */
export function trackContactFormConversion(
  metadata?: Record<string, string | number | boolean>
): void {
  trackConversion({
    type: 'contact_form_submit',
    category: 'engagement',
    label: 'Contact Form Submission',
    value: 10, // Assign a value for ROI calculations
    metadata,
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterConversion(
  metadata?: Record<string, string | number | boolean>
): void {
  trackConversion({
    type: 'newsletter_signup',
    category: 'engagement',
    label: 'Newsletter Subscription',
    value: 5,
    metadata,
  });
}

/**
 * Track resume download
 */
export function trackResumeDownloadConversion(format?: string): void {
  trackConversion({
    type: 'resume_download',
    category: 'engagement',
    label: 'Resume Download',
    value: 3,
    metadata: format ? { format } : undefined,
  });
}

/**
 * Track project view (for popular projects tracking)
 */
export function trackProjectViewConversion(
  projectId: string,
  projectTitle: string
): void {
  trackConversion({
    type: 'project_view',
    category: 'content',
    label: projectTitle,
    metadata: {
      project_id: projectId,
      project_title: projectTitle,
    },
  });
}

/**
 * Track blog post read completion
 */
export function trackBlogReadConversion(
  postSlug: string,
  postTitle: string,
  readTime?: number
): void {
  trackConversion({
    type: 'blog_read',
    category: 'content',
    label: postTitle,
    metadata: {
      post_slug: postSlug,
      post_title: postTitle,
      ...(readTime ? { read_time_seconds: readTime } : {}),
    },
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLinkConversion(
  url: string,
  linkType?: string
): void {
  trackConversion({
    type: 'external_link_click',
    category: 'outbound',
    label: url,
    metadata: {
      url,
      link_type: linkType || 'external',
    },
  });
}

/**
 * Track social media link clicks
 */
export function trackSocialLinkConversion(platform: string, url: string): void {
  trackConversion({
    type: 'social_link_click',
    category: 'social',
    label: platform,
    metadata: {
      platform,
      url,
    },
  });
}

/**
 * Track email clicks
 */
export function trackEmailClickConversion(email: string): void {
  trackConversion({
    type: 'email_click',
    category: 'contact',
    label: 'Email Click',
    metadata: {
      email_domain: email.split('@')[1] || 'unknown',
    },
  });
}

/**
 * Track phone clicks
 */
export function trackPhoneClickConversion(): void {
  trackConversion({
    type: 'phone_click',
    category: 'contact',
    label: 'Phone Click',
  });
}

/**
 * Setup Google Ads conversion tracking
 * Call this function when a conversion event occurs
 */
export function trackGoogleAdsConversion(
  conversionId: string,
  value?: number,
  currency?: string
): void {
  trackGA4Conversion(conversionId, value, currency);
}
