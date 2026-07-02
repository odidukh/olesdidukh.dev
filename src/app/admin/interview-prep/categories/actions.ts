'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { categoryAdminSchema } from './schema';
import type { InterviewCategoryInsert } from '@/lib/supabase/types';

function revalidate() {
  revalidatePath('/admin/interview-prep/categories');
  revalidatePath('/interview-prep', 'layout');
}

export async function createCategory(data: InterviewCategoryInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = categoryAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase.from('interview_categories').insert([data]);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function updateCategory(
  id: string,
  data: InterviewCategoryInsert
) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = categoryAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase
    .from('interview_categories')
    .update(data)
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const { error } = await supabase
    .from('interview_categories')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}
