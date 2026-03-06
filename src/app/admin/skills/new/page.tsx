import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SkillForm } from '@/app/admin/skills/components/SkillForm';
import type { SkillCategory } from '@/lib/supabase/types';

export const metadata = {
  title: 'Add Skill | Admin Dashboard',
};

export default async function NewSkillPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('skill_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  const categories = (data as SkillCategory[]) || [];

  if (categories.length === 0) {
    redirect('/admin/skills/categories');
  }

  return <SkillForm categories={categories} mode="create" />;
}
