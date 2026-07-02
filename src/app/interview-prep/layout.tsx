import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/app/admin/lib/auth';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Interview Prep | Oles Didukh',
  robots: { index: false, follow: false },
};

export default async function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { error } = await requireAdmin();
  if (error === 'Not authenticated') {
    redirect('/login?redirect=/interview-prep');
  }
  if (error) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <Container size="wide" padding="md" className="py-10">
        {children}
      </Container>
    </div>
  );
}
