'use client';

import { useEffect } from 'react';
import { useWebVitals } from '@/hooks';
import { captureMessage, setContext } from '@/lib/sentry';

interface PerformanceMonitorProps {
  /**
   * Report metrics to Sentry when degraded
   */
  reportToSentry?: boolean;
  /**
   * Threshold score below which to report to Sentry
   */
  sentryThreshold?: number;
  /**
   * Enable debug mode
   */
  debug?: boolean;
}

/**
 * Performance monitoring component
 * Tracks Web Vitals and reports degraded performance to Sentry
 */
export function PerformanceMonitor({
  reportToSentry = true,
  sentryThreshold = 50,
  debug = process.env.NODE_ENV === 'development',
}: PerformanceMonitorProps) {
  const { metrics, score, isDegraded, getSummary } = useWebVitals({
    reportToAnalytics: true,
    debug,
  });

  // Report to Sentry when performance is degraded
  useEffect(() => {
    if (reportToSentry && isDegraded && score < sentryThreshold) {
      const summary = getSummary();

      // Set performance context
      setContext('performance', {
        score: summary.score,
        degraded: summary.degraded,
        goodCount: summary.goodCount,
        needsImprovementCount: summary.needsImprovementCount,
        poorCount: summary.poorCount,
        metrics: summary.metrics.map(m => ({
          name: m.name,
          value: m.value,
          rating: m.rating,
        })),
      });

      // Report poor metrics individually
      const poorMetrics = summary.metrics.filter(m => m.rating === 'poor');
      poorMetrics.forEach(metric => {
        captureMessage(
          `Poor ${metric.name} performance: ${metric.value}`,
          'warning',
          {
            metricName: metric.name,
            value: metric.value,
            rating: metric.rating,
            threshold: 'poor',
          }
        );
      });
    }
  }, [isDegraded, score, reportToSentry, sentryThreshold, getSummary]);

  // Log performance summary in debug mode
  useEffect(() => {
    if (debug && metrics.length > 0) {
      console.log('[PerformanceMonitor] Current metrics:', {
        score,
        isDegraded,
        metrics: metrics.map(m => `${m.name}: ${m.value} (${m.rating})`),
      });
    }
  }, [debug, metrics, score, isDegraded]);

  // This component doesn't render anything
  return null;
}
