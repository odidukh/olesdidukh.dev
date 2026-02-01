// This file configures the initialization of Sentry for server-side and edge routes.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

export async function register() {
  const SENTRY_DSN =
    process.env['SENTRY_DSN'] || process.env['NEXT_PUBLIC_SENTRY_DSN'];

  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Filter out known errors
      beforeSend(event, hint) {
        // Don't send events in development
        if (process.env['NODE_ENV'] === 'development') {
          console.error(
            'Sentry Event (dev):',
            hint.originalException || hint.syntheticException
          );
          return null;
        }

        return event;
      },
    });
  }

  if (process.env['NEXT_RUNTIME'] === 'edge') {
    // Edge runtime Sentry initialization
    Sentry.init({
      dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
