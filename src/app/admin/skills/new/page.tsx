import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SkillForm } from '@/app/admin/skills/components/SkillForm';

export const metadata = {
  title: 'Add Skill | Admin Dashboard',
};

export default async function NewSkillPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('skill_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (!categories || categories.length === 0) {
    redirect('/admin/skills/categories');
  }

  return <SkillForm categories={categories} mode="create" />;
}
