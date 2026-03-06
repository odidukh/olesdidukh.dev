import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ExperienceForm } from '@/app/admin/experience/components/ExperienceForm';
import type { Experience } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Experience | Admin Dashboard',
};

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const experience = data as Experience;

  return <ExperienceForm experience={experience} mode="edit" />;
}
