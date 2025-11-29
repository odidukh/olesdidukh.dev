/**
 * Performance Budget Configuration
 *
 * Defines size limits for JavaScript bundles and other resources.
 * These budgets are checked during the build process.
 *
 * Budget targets based on:
 * - Google's recommendation: < 200KB for initial JS
 * - Core Web Vitals targets (LCP < 2.5s, INP < 200ms)
 * - Mobile 3G performance considerations
 */

/** @type {import('./scripts/check-bundle-size').PerformanceBudget} */
module.exports = {
  // JavaScript bundle budgets (gzipped sizes)
  bundles: {
    // First Load JS (what's downloaded on initial page load)
    firstLoad: {
      maxSize: 200 * 1024, // 200KB gzipped
      warning: 180 * 1024, // Warn at 180KB
    },
    // Shared chunks (framework, common components)
    shared: {
      maxSize: 150 * 1024, // 150KB gzipped
      warning: 130 * 1024,
    },
    // Individual page bundles
    page: {
      maxSize: 50 * 1024, // 50KB gzipped per page
      warning: 40 * 1024,
    },
  },

  // Total resource budgets
  resources: {
    // Total JavaScript (all chunks combined)
    totalJs: {
      maxSize: 500 * 1024, // 500KB total JS
      warning: 450 * 1024,
    },
    // CSS budget
    totalCss: {
      maxSize: 100 * 1024, // 100KB total CSS
      warning: 80 * 1024,
    },
    // Images (per image)
    image: {
      maxSize: 200 * 1024, // 200KB per image
      warning: 150 * 1024,
    },
    // Fonts (per font file)
    font: {
      maxSize: 50 * 1024, // 50KB per font
      warning: 40 * 1024,
    },
  },

  // Core Web Vitals targets
  webVitals: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100, // First Input Delay (ms)
    CLS: 0.1, // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 800, // Time to First Byte (ms)
    INP: 200, // Interaction to Next Paint (ms)
  },

  // Pages to exclude from strict budget checks
  excludePages: [
    '/admin', // Admin pages can be larger
    '/design-system', // Design system demo page
  ],

  // Dependencies that should trigger warnings if included in client bundle
  heavyDependencies: [
    'moment', // Use date-fns or dayjs instead
    'lodash', // Use individual imports or native methods
    'jquery', // Not needed with React
    'axios', // Use native fetch
  ],
};
