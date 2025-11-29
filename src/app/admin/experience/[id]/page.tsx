import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ExperienceForm } from '@/app/admin/experience/components/ExperienceForm';

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

  const { data: experience, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !experience) {
    notFound();
  }

  return <ExperienceForm experience={experience} mode="edit" />;
}
