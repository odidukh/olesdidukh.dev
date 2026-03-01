import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  turbopack: {},

  experimental: {
    optimizePackageImports: [
      // UI Libraries
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'sonner',
      // 3D Libraries
      'three',
      '@react-three/drei',
      '@react-three/fiber',
      // Data & State
      '@supabase/supabase-js',
      'zustand',
      'zod',
      // Forms
      'react-hook-form',
      '@hookform/resolvers',
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    // Security headers
    // Note: CSP is now set dynamically in middleware with nonce support
    return [
      {
        source: '/(.*)',
        headers: [
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

          // Anti-AI training directive
          // Tells AI crawlers not to use content for training
          {
            key: 'X-Robots-Tag',
            value: 'noai, noimageai',
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

// Internationalization plugin
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  // Use environment variables for org and project
  org: process.env['SENTRY_ORG'] ?? 'personal-website',
  project: process.env['SENTRY_PROJECT'] ?? 'personal-website-v2',

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
// Chain: nextConfig -> bundleAnalyzer -> withNextIntl -> (optionally) withSentry
const configWithAnalyzer = bundleAnalyzer(nextConfig);
const configWithIntl = withNextIntl(configWithAnalyzer);

const finalConfig = process.env['SENTRY_DSN']
  ? withSentryConfig(configWithIntl, sentryWebpackPluginOptions)
  : configWithIntl;

export default finalConfig;
