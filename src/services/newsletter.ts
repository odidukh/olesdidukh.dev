/**
 * Newsletter Service - API abstraction for newsletter subscription
 */

import { apiClient } from './apiClient';

export interface NewsletterSubscribeData {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  error?: string;
}

/**
 * Subscribe to the newsletter
 */
async function subscribe(email: string): Promise<NewsletterResponse> {
  const response = await apiClient.post<
    NewsletterResponse,
    NewsletterSubscribeData
  >('/newsletter', { email });
  return response.data;
}

export const newsletterService = {
  subscribe,
};
