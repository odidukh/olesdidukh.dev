import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SkillForm } from '../components/SkillForm';

export const metadata = {
  title: 'Edit Skill | Admin Dashboard',
};

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: skill }, { data: categories }] = await Promise.all([
    supabase.from('skills').select('*').eq('id', id).single(),
    supabase
      .from('skill_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  if (!skill || !categories) {
    notFound();
  }

  return <SkillForm skill={skill} categories={categories} mode="edit" />;
}
