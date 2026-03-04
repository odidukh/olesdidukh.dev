/**
 * CSRF Protection Utilities
 *
 * Provides origin-based CSRF protection for API routes.
 * Validates that requests come from allowed origins.
 */

// Allowed origins for API requests
const ALLOWED_ORIGINS = [
  // Production domain
  'https://olesdidukh.dev',
  'https://www.olesdidukh.dev',
  // Vercel preview deployments (restricted to project slug)
  /^https:\/\/pws(-[a-z0-9-]+)?\.vercel\.app$/,
  // Local development
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

/**
 * Check if the origin is allowed
 */
function isOriginAllowed(origin: string): boolean {
  return ALLOWED_ORIGINS.some(allowed => {
    if (typeof allowed === 'string') {
      return origin === allowed;
    }
    // RegExp for pattern matching (e.g., Vercel previews)
    return allowed.test(origin);
  });
}

/**
 * Validate CSRF by checking Origin/Referer headers
 * Returns null if valid, or an error Response if invalid
 */
export function validateCsrf(request: Request): Response | null {
  // Skip CSRF validation in development for easier testing
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  // Get Origin header (preferred) or Referer header (fallback)
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // For same-origin requests, Origin header should be present
  if (origin) {
    if (!isOriginAllowed(origin)) {
      return Response.json(
        { error: 'Invalid origin' },
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    return null;
  }

  // Fallback to Referer header if Origin is not present
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;

      if (!isOriginAllowed(refererOrigin)) {
        return Response.json(
          { error: 'Invalid referer' },
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      return null;
    } catch {
      // Invalid URL in Referer
      return Response.json(
        { error: 'Invalid referer format' },
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Neither Origin nor Referer present - reject in production to prevent CSRF bypass
  return Response.json(
    { error: 'Missing origin information' },
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Higher-order function to wrap API handlers with CSRF protection
 */
export function withCsrfProtection(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const csrfError = validateCsrf(request);
    if (csrfError) {
      return csrfError;
    }
    return handler(request);
  };
}
