'use client';

import { useCallback, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';

type EventProperties = Record<string, string | number | boolean | null>;

interface AnalyticsEvent {
  name: string;
  properties?: EventProperties | undefined;
}

interface UseAnalyticsOptions {
  /**
   * Enable debug logging in development
   */
  debug?: boolean;
}

/**
 * Custom hook for analytics tracking
 * Provides utilities for tracking events, form submissions, and user interactions
 */
export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { debug = process.env.NODE_ENV === 'development' } = options;
  const eventQueueRef = useRef<AnalyticsEvent[]>([]);

  // Log events in debug mode
  const logEvent = useCallback(
    (eventName: string, properties?: EventProperties) => {
      if (debug) {
        console.log('[Analytics]', eventName, properties);
      }
    },
    [debug]
  );

  /**
   * Track a custom event
   */
  const trackEvent = useCallback(
    (eventName: string, properties?: EventProperties) => {
      logEvent(eventName, properties);
      track(eventName, properties ?? {});
    },
    [logEvent]
  );

  /**
   * Track a page view with optional metadata
   */
  const trackPageView = useCallback(
    (pageName: string, properties?: EventProperties) => {
      trackEvent('page_view', {
        page: pageName,
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track form submission events
   */
  const trackFormSubmission = useCallback(
    (
      formName: string,
      status: 'success' | 'error' | 'validation_error',
      properties?: EventProperties
    ) => {
      trackEvent(`${formName}_submission`, {
        status,
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track button clicks
   */
  const trackButtonClick = useCallback(
    (buttonName: string, properties?: EventProperties) => {
      trackEvent('button_click', {
        button: buttonName,
        location: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track external link clicks
   */
  const trackExternalLink = useCallback(
    (
      url: string,
      linkType: string = 'external',
      properties?: EventProperties
    ) => {
      trackEvent('external_link_click', {
        url,
        linkType,
        location: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track social link clicks
   */
  const trackSocialClick = useCallback(
    (platform: string, url: string, properties?: EventProperties) => {
      trackEvent('social_link_click', {
        platform,
        url,
        location: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track file downloads
   */
  const trackDownload = useCallback(
    (fileName: string, fileType: string, properties?: EventProperties) => {
      trackEvent('file_download', {
        fileName,
        fileType,
        location: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track search queries
   */
  const trackSearch = useCallback(
    (query: string, resultCount: number, properties?: EventProperties) => {
      trackEvent('search', {
        query,
        resultCount,
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track filter changes
   */
  const trackFilter = useCallback(
    (filterName: string, filterValue: string, properties?: EventProperties) => {
      trackEvent('filter_change', {
        filter: filterName,
        value: filterValue,
        location: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track modal/dialog interactions
   */
  const trackModal = useCallback(
    (
      modalName: string,
      action: 'open' | 'close',
      properties?: EventProperties
    ) => {
      trackEvent('modal_interaction', {
        modal: modalName,
        action,
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track scroll depth
   */
  const trackScrollDepth = useCallback(
    (depth: number, properties?: EventProperties) => {
      trackEvent('scroll_depth', {
        depth,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track time spent on page
   */
  const trackTimeOnPage = useCallback(
    (seconds: number, properties?: EventProperties) => {
      trackEvent('time_on_page', {
        seconds,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Track errors
   */
  const trackError = useCallback(
    (errorType: string, errorMessage: string, properties?: EventProperties) => {
      trackEvent('error', {
        type: errorType,
        message: errorMessage,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        ...properties,
      });
    },
    [trackEvent]
  );

  /**
   * Queue events for batch sending (useful for rapid events)
   */
  const queueEvent = useCallback(
    (eventName: string, properties?: EventProperties) => {
      eventQueueRef.current.push({ name: eventName, properties });
    },
    []
  );

  /**
   * Flush all queued events
   */
  const flushQueue = useCallback(() => {
    const events = eventQueueRef.current;
    eventQueueRef.current = [];
    events.forEach(event => {
      trackEvent(event.name, event.properties);
    });
  }, [trackEvent]);

  // Flush queue on unmount
  useEffect(() => {
    return () => {
      if (eventQueueRef.current.length > 0) {
        flushQueue();
      }
    };
  }, [flushQueue]);

  return {
    // Core tracking
    trackEvent,
    trackPageView,

    // Form tracking
    trackFormSubmission,

    // UI interaction tracking
    trackButtonClick,
    trackExternalLink,
    trackSocialClick,
    trackDownload,
    trackModal,

    // Content interaction tracking
    trackSearch,
    trackFilter,
    trackScrollDepth,
    trackTimeOnPage,

    // Error tracking
    trackError,

    // Batch operations
    queueEvent,
    flushQueue,
  };
}
