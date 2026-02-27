export const runtime = 'edge';

import {
  reactionsRateLimiter,
  checkRateLimit,
  getIdentifier,
  rateLimitExceededResponse,
  redis,
} from '@/lib/ratelimit';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug) {
      return Response.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Skip if redis is not configured
    if (!redis) {
      return Response.json({ reactions: 0 });
    }

    const reactions = (await redis.get<number>(`page_reactions:${slug}`)) || 0;

    return Response.json({ reactions });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return Response.json({ reactions: 0 }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug) {
      return Response.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Skip if redis is not configured
    if (!redis) {
      return Response.json({ reactions: 0 });
    }

    // Rate limiting to prevent abuse
    const identifier = getIdentifier(request);
    const rateLimitResult = await checkRateLimit(
      reactionsRateLimiter,
      `${identifier}:${slug}`
    );

    if (rateLimitResult && !rateLimitResult.success) {
      return rateLimitExceededResponse(
        rateLimitResult,
        'Rate limit exceeded for reactions'
      );
    }

    const body = await request.json().catch(() => ({}));
    const count =
      typeof body.count === 'number'
        ? Math.min(Math.max(body.count, 1), 50)
        : 1;

    // Increment reaction count
    const reactions = await redis.incrby(`page_reactions:${slug}`, count);

    return Response.json({ reactions });
  } catch (error) {
    console.error('Error recording reaction:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
