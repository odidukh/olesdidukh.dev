import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { generateNonce, buildCSP, CSP_NONCE_HEADER } from '@/lib/csp';

export async function middleware(request: NextRequest) {
  // Get the base response from Supabase session handling
  const response = await updateSession(request);

  // Generate a nonce for this request
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';

  // Add nonce to request headers so it can be accessed in server components
  response.headers.set(CSP_NONCE_HEADER, nonce);

  // Build and set CSP header
  const csp = buildCSP(nonce, isDev);
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except admin API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
