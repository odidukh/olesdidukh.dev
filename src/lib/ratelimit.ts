import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client - will be undefined if env vars are not set
const redis =
  process.env['UPSTASH_REDIS_REST_URL'] &&
  process.env['UPSTASH_REDIS_REST_TOKEN']
    ? new Redis({
        url: process.env['UPSTASH_REDIS_REST_URL'],
        token: process.env['UPSTASH_REDIS_REST_TOKEN'],
      })
    : null;

// Rate limiter for contact form: 5 requests per 15 minutes
export const contactRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : null;

// Rate limiter for newsletter: 3 requests per hour
export const newsletterRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'ratelimit:newsletter',
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier
 * Returns null if rate limiting is not configured
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult | null> {
  if (!limiter) {
    return null;
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Create rate limit headers for the response
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Create a rate limit exceeded response
 */
export function rateLimitExceededResponse(
  result: RateLimitResult,
  message = 'Too many requests. Please try again later.'
): Response {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

  return Response.json(
    {
      error: message,
      retryAfter,
    },
    {
      status: 429,
      headers: {
        ...createRateLimitHeaders(result),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

/**
 * Get identifier from request (IP address or forwarded IP)
 */
export function getIdentifier(request: Request): string {
  // Check for forwarded IP (when behind proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Get the first IP in the chain (original client)
    return forwarded.split(',')[0]?.trim() ?? 'anonymous';
  }

  // Check for real IP header (Cloudflare, Vercel, etc.)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to anonymous (development)
  return 'anonymous';
}
