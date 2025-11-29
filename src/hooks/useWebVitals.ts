'use client';

import { useEffect, useState, useCallback } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import {
  normalizeMetric,
  reportMetric,
  getCollectedMetrics,
  getPerformanceSummary,
  setMetricReporter,
  type PerformanceMetric,
  type MetricReporter,
} from '@/lib/performance';
import { useAnalytics } from './useAnalytics';

export interface UseWebVitalsOptions {
  /**
   * Enable reporting to analytics
   */
  reportToAnalytics?: boolean;
  /**
   * Custom metric reporter
   */
  onMetric?: MetricReporter;
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

export interface WebVitalsState {
  metrics: PerformanceMetric[];
  score: number;
  isLoading: boolean;
  isDegraded: boolean;
}

/**
 * Hook to track and report Web Vitals metrics
 */
export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const {
    reportToAnalytics = true,
    onMetric,
    debug = process.env.NODE_ENV === 'development',
  } = options;

  const { trackEvent } = useAnalytics({ debug: false });
  const [state, setState] = useState<WebVitalsState>({
    metrics: [],
    score: 100,
    isLoading: true,
    isDegraded: false,
  });

  // Create metric handler
  const handleMetric = useCallback(
    (metric: PerformanceMetric) => {
      // Report to analytics if enabled
      if (reportToAnalytics) {
        trackEvent('web_vital', {
          name: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating,
          delta: Math.round(metric.delta),
          navigationType: metric.navigationType,
        });
      }

      // Call custom handler if provided
      onMetric?.(metric);

      // Update state
      setState(() => {
        const summary = getPerformanceSummary();
        return {
          metrics: summary.metrics,
          score: summary.score,
          isLoading: false,
          isDegraded: summary.degraded,
        };
      });
    },
    [reportToAnalytics, trackEvent, onMetric]
  );

  useEffect(() => {
    // Set up global metric reporter
    setMetricReporter(handleMetric);

    // Create metric handler
    const handleWebVitalMetric = (metric: Metric) => {
      const normalized = normalizeMetric(metric);
      reportMetric(normalized);
    };

    // Track all Core Web Vitals
    // Note: web-vitals callbacks are called once per metric type
    onCLS(handleWebVitalMetric); // Cumulative Layout Shift
    onFCP(handleWebVitalMetric); // First Contentful Paint
    onLCP(handleWebVitalMetric); // Largest Contentful Paint
    onTTFB(handleWebVitalMetric); // Time to First Byte
    onINP(handleWebVitalMetric); // Interaction to Next Paint

    // Log initialization in debug mode
    if (debug) {
      console.log(
        '[useWebVitals] Initialized - tracking CLS, FCP, LCP, TTFB, INP'
      );
    }

    // Set loading to false after a timeout if no metrics received
    const timeout = setTimeout(() => {
      setState(prev => {
        if (prev.isLoading && prev.metrics.length === 0) {
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [handleMetric, debug]);

  // Get current metrics
  const getMetrics = useCallback(() => {
    return getCollectedMetrics();
  }, []);

  // Get summary
  const getSummary = useCallback(() => {
    return getPerformanceSummary();
  }, []);

  return {
    ...state,
    getMetrics,
    getSummary,
  };
}
