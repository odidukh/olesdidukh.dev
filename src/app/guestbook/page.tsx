import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { GuestbookForm } from '@/components/sections/GuestbookForm';
import { GuestbookList } from '@/components/sections/GuestbookList';
import { createClient } from '@/lib/supabase/server';
import { Skeleton } from '@/components/ui/Skeleton';
import { BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guestbook | Oles Didukh',
  description:
    'Leave a message, share a thought, or just say hello. Sign in with GitHub to join the guestbook.',
  openGraph: {
    title: 'Guestbook | Oles Didukh',
    description: 'Leave a message and be part of the story.',
    url: 'https://olesdidukh.dev/guestbook',
    type: 'website',
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/guestbook',
  },
};

function GuestbookListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function GuestbookPageContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      {/* Form */}
      <GuestbookForm user={user} />

      {/* Entries */}
      <Suspense fallback={<GuestbookListSkeleton />}>
        <GuestbookList />
      </Suspense>
    </div>
  );
}

export default function GuestbookPage() {
  return (
    <>
      <BreadcrumbSchema page="guestbook" />
      <Navigation />
      <main id="main-content" className="min-h-screen pt-20 md:pt-28">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/40 to-background py-20">
          {/* Decorative background blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
          </div>

          <Container size="xl" className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="outline"
                className="mb-6 gap-1.5 border-primary/30 bg-primary/5 px-3 py-1.5 text-primary"
              >
                <Sparkles className="h-3 w-3" />
                Hall of Fame
              </Badge>

              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Guestbook
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground">
                A little corner of the internet where you can leave your mark.
                Share a thought, say hello, or just let me know you were here. I
                read every message.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary/70" />
                <span>Sign in with GitHub — it takes under 10 seconds.</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Content */}
        <section className="py-16">
          <Container size="xl">
            <div className="mx-auto max-w-2xl">
              <Suspense
                fallback={
                  <div className="space-y-8">
                    <Skeleton className="h-44 w-full rounded-2xl" />
                    <GuestbookListSkeleton />
                  </div>
                }
              >
                <GuestbookPageContent />
              </Suspense>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
