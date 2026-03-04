'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { validateEmail } from '@/lib/validation';

type NewsletterStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseNewsletterFormReturn {
  email: string;
  setEmail: (email: string) => void;
  status: NewsletterStatus;
  error: string;
  clearError: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Shared newsletter form logic used by both NewsletterForm (footer)
 * and NewsletterSignup (full section). Handles validation, submission,
 * and auto-reset after success.
 */
export function useNewsletterForm(options?: {
  resetDelay?: number;
  onSuccess?: () => void;
}): UseNewsletterFormReturn {
  const { resetDelay = 5000, onSuccess } = options ?? {};

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<NewsletterStatus>('idle');
  const [error, setError] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email) {
        setError('Email is required');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email');
        return;
      }

      setStatus('loading');
      setError('');

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data: { success?: boolean; error?: string } =
          await response.json();

        if (!response.ok) {
          setStatus('error');
          setError(data.error ?? 'Something went wrong. Please try again.');
          return;
        }

        setStatus('success');
        setEmail('');
        onSuccess?.();

        timeoutRef.current = setTimeout(() => {
          setStatus('idle');
        }, resetDelay);
      } catch {
        setStatus('error');
        setError('Something went wrong. Please try again.');
      }
    },
    [email, resetDelay, onSuccess]
  );

  return { email, setEmail, status, error, clearError, handleSubmit };
}
