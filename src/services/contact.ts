/**
 * Contact Service - API abstraction for contact form
 */

import { apiClient } from './apiClient';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  error?: string;
}

/**
 * Send a contact form submission
 */
async function submitContactForm(
  data: ContactFormData
): Promise<ContactResponse> {
  const response = await apiClient.post<ContactResponse, ContactFormData>(
    '/contact',
    data
  );
  return response.data;
}

export const contactService = {
  submit: submitContactForm,
};
