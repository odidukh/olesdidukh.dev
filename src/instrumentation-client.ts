// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env['NEXT_PUBLIC_SENTRY_DSN'];

Sentry.init({
  dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 0.1%. You may want to change it to 100% while in development and then lower it in production.
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Filter out known errors
  beforeSend(event, hint) {
    // Ignore errors from browser extensions
    if (
      event.exception?.values?.[0]?.stacktrace?.frames?.some(
        frame =>
          frame.filename?.includes('chrome-extension://') ||
          frame.filename?.includes('moz-extension://')
      )
    ) {
      return null;
    }

    // Ignore ResizeObserver errors (common in browsers)
    const errorMessage =
      hint.originalException &&
      typeof hint.originalException === 'object' &&
      'message' in hint.originalException
        ? String(hint.originalException.message)
        : '';
    if (errorMessage.includes('ResizeObserver')) {
      return null;
    }

    return event;
  },
});

// Export hook for instrumenting navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
