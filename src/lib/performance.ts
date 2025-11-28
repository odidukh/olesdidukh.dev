/**
 * Performance monitoring utilities
 * Provides tools for tracking Web Vitals and custom performance metrics
 */

import type { Metric } from 'web-vitals';

// Performance thresholds based on Google's Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
} as const;

export type MetricName = keyof typeof PERFORMANCE_THRESHOLDS;
export type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get rating for a metric value
 */
export function getMetricRating(name: MetricName, value: number): MetricRating {
  const threshold = PERFORMANCE_THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric value for display
 */
export function formatMetricValue(name: MetricName, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

export interface PerformanceMetric {
  name: MetricName;
  value: number;
  rating: MetricRating;
  delta: number;
  id: string;
  navigationType: string;
  timestamp: number;
}

/**
 * Convert web-vitals Metric to our PerformanceMetric format
 */
export function normalizeMetric(metric: Metric): PerformanceMetric {
  const name = metric.name as MetricName;
  return {
    name,
    value: metric.value,
    rating: getMetricRating(name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType || 'unknown',
    timestamp: Date.now(),
  };
}

// Storage for collected metrics
const collectedMetrics: Map<string, PerformanceMetric> = new Map();

/**
 * Store a performance metric
 */
export function storeMetric(metric: PerformanceMetric): void {
  collectedMetrics.set(metric.name, metric);
}

/**
 * Get all collected metrics
 */
export function getCollectedMetrics(): PerformanceMetric[] {
  return Array.from(collectedMetrics.values());
}

/**
 * Get a specific metric
 */
export function getMetric(name: MetricName): PerformanceMetric | undefined {
  return collectedMetrics.get(name);
}

/**
 * Clear all collected metrics
 */
export function clearMetrics(): void {
  collectedMetrics.clear();
}

// Custom performance marks storage
const performanceMarks: Map<string, number> = new Map();

/**
 * Create a performance mark
 */
export function markPerformance(markName: string): void {
  if (typeof performance !== 'undefined') {
    performance.mark(markName);
    performanceMarks.set(markName, performance.now());

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] Mark: ${markName}`);
    }
  }
}

/**
 * Measure between two marks
 */
export function measurePerformance(
  measureName: string,
  startMark: string,
  endMark?: string
): number | null {
  if (typeof performance === 'undefined') return null;

  try {
    const endMarkName = endMark || `${measureName}-end`;

    if (!endMark) {
      performance.mark(endMarkName);
    }

    performance.measure(measureName, startMark, endMarkName);

    const entries = performance.getEntriesByName(measureName, 'measure');
    const lastEntry = entries[entries.length - 1];

    if (lastEntry) {
      const duration = lastEntry.duration;

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Performance] Measure: ${measureName} = ${duration.toFixed(2)}ms`
        );
      }

      return duration;
    }

    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Performance] Failed to measure: ${measureName}`, error);
    }
    return null;
  }
}

/**
 * Get all performance marks
 */
export function getPerformanceMarks(): Record<string, number> {
  return Object.fromEntries(performanceMarks);
}

/**
 * Get all performance measures
 */
export function getPerformanceMeasures(): PerformanceEntryList {
  if (typeof performance === 'undefined') return [];
  return performance.getEntriesByType('measure');
}

/**
 * Clear all custom performance data
 */
export function clearPerformanceData(): void {
  performanceMarks.clear();
  if (typeof performance !== 'undefined') {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Report metrics to analytics
 */
export type MetricReporter = (metric: PerformanceMetric) => void;

let metricReporter: MetricReporter | null = null;

/**
 * Set the metric reporter function
 */
export function setMetricReporter(reporter: MetricReporter): void {
  metricReporter = reporter;
}

/**
 * Report a metric using the configured reporter
 */
export function reportMetric(metric: PerformanceMetric): void {
  storeMetric(metric);

  if (metricReporter) {
    metricReporter(metric);
  }

  if (process.env.NODE_ENV === 'development') {
    const color =
      metric.rating === 'good'
        ? '\x1b[32m'
        : metric.rating === 'needs-improvement'
          ? '\x1b[33m'
          : '\x1b[31m';
    const reset = '\x1b[0m';
    console.log(
      `[Web Vitals] ${color}${metric.name}: ${formatMetricValue(metric.name, metric.value)} (${metric.rating})${reset}`
    );
  }
}

/**
 * Check if performance is degraded based on collected metrics
 */
export function isPerformanceDegraded(): boolean {
  const metrics = getCollectedMetrics();
  return metrics.some(m => m.rating === 'poor');
}

/**
 * Get overall performance score (0-100)
 */
export function getPerformanceScore(): number {
  const metrics = getCollectedMetrics();
  if (metrics.length === 0) return 100;

  const scores: number[] = metrics.map(m => {
    if (m.rating === 'good') return 100;
    if (m.rating === 'needs-improvement') return 50;
    return 0;
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): {
  score: number;
  degraded: boolean;
  metrics: PerformanceMetric[];
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
} {
  const metrics = getCollectedMetrics();
  const goodCount = metrics.filter(m => m.rating === 'good').length;
  const needsImprovementCount = metrics.filter(
    m => m.rating === 'needs-improvement'
  ).length;
  const poorCount = metrics.filter(m => m.rating === 'poor').length;

  return {
    score: getPerformanceScore(),
    degraded: isPerformanceDegraded(),
    metrics,
    goodCount,
    needsImprovementCount,
    poorCount,
  };
}
