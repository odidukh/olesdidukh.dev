import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/interview-prep/data';
import { SessionForm } from '@/app/admin/interview-prep/sessions/components/SessionForm';
import type { InterviewSession } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Session | Admin Dashboard',
};

interface EditSessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSessionPage({
  params,
}: EditSessionPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data, error }, categories] = await Promise.all([
    supabase.from('interview_sessions').select('*').eq('id', id).single(),
    getCategories(),
  ]);

  if (error || !data) {
    notFound();
  }

  const session = data as InterviewSession;

  return <SessionForm session={session} categories={categories} mode="edit" />;
}
