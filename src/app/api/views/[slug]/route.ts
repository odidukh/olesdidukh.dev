export const runtime = 'edge';

import {
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
      return Response.json({ views: 0 });
    }

    const views = (await redis.get<number>(`page_views:${slug}`)) || 0;

    return Response.json({ views });
  } catch (error) {
    console.error('Error fetching views:', error);
    return Response.json({ views: 0 }, { status: 500 });
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
      return Response.json({ views: 0 });
    }

    // Rate limiting to prevent abuse
    const identifier = getIdentifier(request);
    const rateLimitResult = await checkRateLimit(
      'views',
      `${identifier}:${slug}`
    );

    if (rateLimitResult && !rateLimitResult.success) {
      return rateLimitExceededResponse(
        rateLimitResult,
        'Rate limit exceeded for views'
      );
    }

    // Increment view count
    const views = await redis.incr(`page_views:${slug}`);

    return Response.json({ views });
  } catch (error) {
    console.error('Error recording view:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
