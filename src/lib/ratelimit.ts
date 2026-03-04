import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client - will be undefined if env vars are not set
export const redis =
  process.env['UPSTASH_REDIS_REST_URL'] &&
  process.env['UPSTASH_REDIS_REST_TOKEN']
    ? new Redis({
        url: process.env['UPSTASH_REDIS_REST_URL'],
        token: process.env['UPSTASH_REDIS_REST_TOKEN'],
      })
    : null;

// Rate limiter for contact form: 5 requests per 15 minutes
const contactRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'ratelimit:contact',
    })
  : null;

// Rate limiter for views: 1 request per post per 1 hour per IP
export const viewsRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1, '1 h'),
      analytics: true,
      prefix: 'ratelimit:views',
    })
  : null;

// Rate limiter for reactions (claps): 50 requests per post per 1 hour per IP
export const reactionsRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, '1 h'),
      analytics: true,
      prefix: 'ratelimit:reactions',
    })
  : null;

// Rate limiter for newsletter: 3 requests per hour
const newsletterRateLimiter = redis
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
 * In-memory rate limiter fallback when Redis is not configured.
 * Tracks requests per identifier with automatic cleanup.
 */
class InMemoryRateLimiter {
  private requests = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  limit(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests and filter to current window
    const existing = this.requests.get(identifier) ?? [];
    const recent = existing.filter(ts => ts > windowStart);

    const success = recent.length < this.maxRequests;
    if (success) {
      recent.push(now);
    }
    this.requests.set(identifier, recent);

    // Periodic cleanup: remove stale entries
    if (this.requests.size > 1000) {
      for (const [key, timestamps] of this.requests) {
        const active = timestamps.filter(ts => ts > windowStart);
        if (active.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, active);
        }
      }
    }

    return {
      success,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - recent.length),
      reset: now + this.windowMs,
    };
  }
}

// In-memory fallbacks keyed by name when Redis is unavailable
const inMemoryFallbacks: Record<string, InMemoryRateLimiter> = {
  contact: new InMemoryRateLimiter(5, 15 * 60 * 1000),
  newsletter: new InMemoryRateLimiter(3, 60 * 60 * 1000),
};

export type RateLimiterKey = 'contact' | 'newsletter';

const limiterMap: Record<RateLimiterKey, Ratelimit | null> = {
  contact: contactRateLimiter,
  newsletter: newsletterRateLimiter,
};

/**
 * Check rate limit for a given identifier.
 * Uses a key-based lookup to avoid identity comparison bugs when Redis is absent.
 * Falls back to in-memory rate limiting when Redis is not configured.
 */
export async function checkRateLimit(
  key: RateLimiterKey,
  identifier: string
): Promise<RateLimitResult | null> {
  const limiter = limiterMap[key];

  if (!limiter) {
    const fallback = inMemoryFallbacks[key];
    if (fallback) {
      return fallback.limit(identifier);
    }
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
 * Create a rate limit exceeded response
 *
 * Only includes the standard Retry-After header (RFC 7231) to avoid
 * exposing rate limit configuration details to potential attackers.
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
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

/**
 * Get identifier from request (IP address or forwarded IP).
 * On Vercel/reverse proxies, the last IP in X-Forwarded-For is appended by
 * the infrastructure and cannot be spoofed by the client.
 */
export function getIdentifier(request: Request): string {
  // Check for forwarded IP (when behind proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim());
    // Last IP is appended by infrastructure and is trustworthy
    return ips[ips.length - 1] ?? 'anonymous';
  }

  // Check for real IP header (Cloudflare, Vercel, etc.)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to anonymous (development)
  return 'anonymous';
}
