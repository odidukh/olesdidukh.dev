'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { clientEnv } from '@/lib/env';
import { Button } from '@/components/ui/Button';
import { Github, Send, LogOut, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface GuestbookFormProps {
  user: User | null;
}

export function GuestbookForm({ user }: GuestbookFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleGitHubSignIn = async () => {
    setSigningIn(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/guestbook`,
      },
    });
    if (error) {
      setError(error.message);
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setSubmitting(true);
    setError(null);

    const avatarUrl =
      user.user_metadata?.['avatar_url'] ??
      user.user_metadata?.['picture'] ??
      '';
    const fullName =
      user.user_metadata?.['full_name'] ??
      user.user_metadata?.['name'] ??
      user.email?.split('@')[0] ??
      'Anonymous';

    const payload = {
      user_id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      message: message.trim(),
    };
    const { error } = await supabase.from('guestbook_entries').insert(payload);

    if (error) {
      // Detect rate-limit or RLS policy errors and show a friendly message
      const msg = error.message.toLowerCase();
      if (
        msg.includes('rate') ||
        msg.includes('too many') ||
        error.code === '429'
      ) {
        setError(
          'You\u2019re posting too fast — please wait a minute and try again.'
        );
      } else if (msg.includes('policy') || msg.includes('permission')) {
        setError(
          'Something went wrong with permissions. Try signing out and back in.'
        );
      } else {
        setError(error.message);
      }
    } else {
      setSuccess(true);
      setMessage('');
      // Refresh server components (GuestbookList) without a full page reload
      router.refresh();
      // Auto-hide success banner after 3 s
      setTimeout(() => setSuccess(false), 3000);
    }

    setSubmitting(false);
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
      >
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Github className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Sign in to leave a message
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Share a kind word, a thought, or just say hello. All it takes is a
          GitHub account.
        </p>
        <Button
          onClick={handleGitHubSignIn}
          disabled={signingIn}
          className="gap-2"
          id="github-signin-btn"
        >
          <Github className="h-4 w-4" />
          {signingIn ? 'Redirecting…' : 'Continue with GitHub'}
        </Button>
        {error && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </motion.div>
    );
  }

  const avatarUrl =
    user.user_metadata?.['avatar_url'] ?? user.user_metadata?.['picture'] ?? '';
  const fullName =
    user.user_metadata?.['full_name'] ??
    user.user_metadata?.['name'] ??
    user.email?.split('@')[0] ??
    'You';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      {/* User info header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={36}
              height={36}
              className="rounded-full ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {fullName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground">{fullName}</p>
            <p className="text-xs text-muted-foreground">
              Signed in via GitHub
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            id="guestbook-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Share a thought, kind word, or just say hi…"
            maxLength={500}
            rows={3}
            className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            disabled={submitting || success}
            required
          />
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {message.length}/500
          </span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1.5 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Message posted! The list will update shortly.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting || success || !message.trim()}
            className="gap-2"
            id="guestbook-submit-btn"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Posting…' : 'Post message'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
