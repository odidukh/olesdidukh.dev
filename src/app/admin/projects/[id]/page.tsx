import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/app/admin/projects/components/ProjectForm';
import type { Project } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Project | Admin Dashboard',
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const project = data as Project;

  return <ProjectForm project={project} mode="edit" />;
}
