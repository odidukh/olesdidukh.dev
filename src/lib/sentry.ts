import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception and send it to Sentry
 */
export function captureException(
  error: unknown,
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.withScope(scope => {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key] as Sentry.Context);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message and send it to Sentry
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.withScope(scope => {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key] as Sentry.Context);
      });
      Sentry.captureMessage(message, level);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Add breadcrumb for better error context
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: Sentry.User | null) {
  Sentry.setUser(user);
}

/**
 * Set additional context
 */
export function setContext(key: string, context: Record<string, unknown>) {
  Sentry.setContext(key, context);
}

/**
 * Set a tag for categorizing errors
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}
