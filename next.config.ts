import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';

const nextConfig: NextConfig = {
  // Force webpack for production builds (required for Serwist PWA support)
  // Turbopack doesn't support Serwist yet: https://github.com/serwist/serwist/issues/54
  turbopack: {},

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      'sonner',
    ],
    webpackBuildWorker: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    // Content Security Policy
    // Note: 'unsafe-inline' and 'unsafe-eval' are needed for Next.js development
    // In production, consider using nonces for stricter CSP
    const isDev = process.env.NODE_ENV === 'development';

    const cspDirectives = [
      // Default fallback
      "default-src 'self'",

      // Scripts - allow self, inline (for Next.js), and specific CDNs
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.sentry.io"
        : "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://*.sentry.io",

      // Styles - allow self and inline (for Tailwind CSS)
      "style-src 'self' 'unsafe-inline'",

      // Images - allow self, data URIs, and placeholder services
      "img-src 'self' data: blob: https://via.placeholder.com https://img.youtube.com https://*.supabase.co",

      // Fonts - allow self and common font CDNs
      "font-src 'self' data:",

      // Connect - API endpoints
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.buttondown.email https://*.sentry.io https://va.vercel-scripts.com",

      // Frame ancestors - prevent clickjacking
      "frame-ancestors 'none'",

      // Form actions
      "form-action 'self'",

      // Base URI
      "base-uri 'self'",

      // Object sources
      "object-src 'none'",

      // Upgrade insecure requests in production
      ...(isDev ? [] : ['upgrade-insecure-requests']),
    ];

    const ContentSecurityPolicy = cspDirectives.join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },

          // Strict Transport Security (HSTS)
          // max-age: 2 years, includeSubDomains, preload ready
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // Prevent clickjacking (legacy, CSP frame-ancestors is preferred)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // XSS Protection (legacy, CSP is preferred but still useful for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // Permissions Policy (formerly Feature-Policy)
          {
            key: 'Permissions-Policy',
            value: [
              'accelerometer=()',
              'ambient-light-sensor=()',
              'autoplay=()',
              'battery=()',
              'camera=()',
              'cross-origin-isolated=()',
              'display-capture=()',
              'document-domain=()',
              'encrypted-media=()',
              'execution-while-not-rendered=()',
              'execution-while-out-of-viewport=()',
              'fullscreen=(self)',
              'geolocation=()',
              'gyroscope=()',
              'keyboard-map=()',
              'magnetometer=()',
              'microphone=()',
              'midi=()',
              'navigation-override=()',
              'payment=()',
              'picture-in-picture=()',
              'publickey-credentials-get=()',
              'screen-wake-lock=()',
              'sync-xhr=()',
              'usb=()',
              'web-share=(self)',
              'xr-spatial-tracking=()',
            ].join(', '),
          },

          // Cross-Origin policies for enhanced security
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env['ANALYZE'] === 'true',
});

// PWA/Service Worker configuration using Serwist
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  // Disable service worker in development for easier debugging
  disable: process.env.NODE_ENV === 'development',
});

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  org: 'your-sentry-org',
  project: 'your-sentry-project',

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: false,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
};

// Make sure adding Sentry options is the last code to run before exporting
// Chain: nextConfig -> bundleAnalyzer -> withSerwist -> (optionally) withSentry
const configWithAnalyzer = bundleAnalyzer(nextConfig);
const configWithSerwist = withSerwist(configWithAnalyzer);

const finalConfig = process.env['SENTRY_DSN']
  ? withSentryConfig(configWithSerwist, sentryWebpackPluginOptions)
  : configWithSerwist;

export default finalConfig;
