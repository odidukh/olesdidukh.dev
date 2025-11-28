export const dynamic = 'force-dynamic';

// This API route demonstrates how errors are captured on the server side
export async function GET() {
  throw new Error('Sentry Example API Route Error');
}
