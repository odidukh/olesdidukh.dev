'use client';

import * as React from 'react';
import { useAnalytics } from '@/hooks';
import { trackNewsletterConversion } from '@/lib/conversions';
import { Button } from './Button';
import { Input } from './Input';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const { trackFormSubmission } = useAnalytics();
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [error, setError] = React.useState('');
  const statusTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: { success?: boolean; error?: string } = await response.json();

      if (!response.ok) {
        setStatus('error');
        setError(data.error ?? 'Something went wrong.');
        return;
      }

      setStatus('success');
      setEmail('');

      // Track successful newsletter signup
      trackFormSubmission('newsletter', 'success', {
        location: window.location.pathname,
      });

      // Track conversion across all analytics platforms
      trackNewsletterConversion({
        location: window.location.pathname,
      });

      statusTimeoutRef.current = setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch {
      setStatus('error');
      setError('Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
        <CheckCircle className="h-4 w-4" />
        <span>Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setError('');
            }}
            className={`pl-10 ${error ? 'border-destructive' : ''}`}
            disabled={status === 'loading'}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={status === 'loading'}
          aria-label="Subscribe to newsletter"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
