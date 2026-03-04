'use client';

import { useAnalytics } from '@/hooks';
import { useNewsletterForm } from '@/hooks';
import { trackNewsletterConversion } from '@/lib/conversions';
import { Button } from './Button';
import { Input } from './Input';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const { trackFormSubmission } = useAnalytics();

  const { email, setEmail, status, error, clearError, handleSubmit } =
    useNewsletterForm({
      onSuccess: () => {
        trackFormSubmission('newsletter', 'success', {
          location: window.location.pathname,
        });
        trackNewsletterConversion({
          location: window.location.pathname,
        });
      },
    });

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
              clearError();
            }}
            className={`pl-10 ${error ? 'border-destructive' : ''}`}
            disabled={status === 'loading'}
            aria-label="Email address"
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
