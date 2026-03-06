import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SkillForm } from '@/app/admin/skills/components/SkillForm';
import type { Skill, SkillCategory } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Skill | Admin Dashboard',
};

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: skillData }, { data: categoriesData }] = await Promise.all([
    supabase.from('skills').select('*').eq('id', id).single(),
    supabase
      .from('skill_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  if (!skillData || !categoriesData) {
    notFound();
  }

  const skill = skillData as Skill;
  const categories = categoriesData as SkillCategory[];

  return <SkillForm skill={skill} categories={categories} mode="edit" />;
}
