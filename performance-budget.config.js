/**
 * Performance Budget Configuration
 *
 * Defines size limits for JavaScript bundles and other resources.
 * These budgets are checked during the build process.
 *
 * Budget targets based on:
 * - Core Web Vitals targets (LCP < 2.5s, INP < 200ms)
 * - Mobile 3G performance considerations
 * - Application complexity (Three.js, admin panel, MDX, Supabase)
 *
 * Note: These are RAW file sizes, not gzipped. Actual transfer sizes
 * will be ~70-80% smaller due to Brotli/gzip compression.
 */

/** @type {import('./scripts/check-bundle-size').PerformanceBudget} */
module.exports = {
  // JavaScript bundle budgets (raw sizes, not gzipped)
  bundles: {
    // First Load JS (what's downloaded on initial page load)
    // ~100KB gzipped for an app with animations and interactive features
    firstLoad: {
      maxSize: 350 * 1024, // 350KB raw (~90KB gzipped)
      warning: 300 * 1024, // Warn at 300KB
    },
    // Shared chunks (framework, common components)
    shared: {
      maxSize: 200 * 1024, // 200KB raw
      warning: 180 * 1024,
    },
    // Individual page bundles
    page: {
      maxSize: 100 * 1024, // 100KB raw per page
      warning: 80 * 1024,
    },
  },

  // Total resource budgets (raw sizes)
  resources: {
    // Total JavaScript (all chunks combined including dynamic imports)
    // Higher limit accounts for code-split chunks (Three.js, admin, MDX)
    totalJs: {
      maxSize: 3 * 1024 * 1024, // 3MB raw (~750KB gzipped)
      warning: 2.5 * 1024 * 1024,
    },
    // CSS budget
    totalCss: {
      maxSize: 150 * 1024, // 150KB raw (~40KB gzipped)
      warning: 120 * 1024,
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
