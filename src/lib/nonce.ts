import { headers } from 'next/headers';
import { CSP_NONCE_HEADER } from './csp';

/**
 * Gets the CSP nonce from request headers.
 * This should only be called from server components.
 *
 * @returns The nonce string or undefined if not available
 */
export async function getNonce(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get(CSP_NONCE_HEADER) ?? undefined;
}
