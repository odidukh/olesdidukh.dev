import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/app/admin/lib/auth';

// The interview-prep tool is a self-contained inline-script HTML app served
// only to the authenticated admin. It lives outside `public/` (which is
// world-readable) and is streamed through this handler so access is gated by
// `requireAdmin()`. Middleware enforces the same gate as an outer layer.
export const dynamic = 'force-dynamic';

const CONTENT_PATH = join(
  process.cwd(),
  'src',
  'app',
  'interview-prep',
  'content.html'
);

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();

  if (error) {
    const url = request.nextUrl.clone();
    if (error === 'Not authenticated') {
      url.pathname = '/login';
      url.search = '';
      url.searchParams.set('redirect', '/interview-prep');
    } else {
      // Authenticated but not the admin — mirror the middleware's /admin gate.
      url.pathname = '/';
      url.search = '';
    }
    return NextResponse.redirect(url);
  }

  try {
    const html = await readFile(CONTENT_PATH, 'utf8');
    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        // Never let a shared cache hold the gated document.
        'cache-control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('Failed to read interview-prep content:', err);
    return new NextResponse('Not found', { status: 404 });
  }
}
