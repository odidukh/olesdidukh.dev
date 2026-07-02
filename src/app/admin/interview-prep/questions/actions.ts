'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { questionAdminSchema } from './schema';
import type { InterviewQuestionInsert } from '@/lib/supabase/types';

function revalidate() {
  revalidatePath('/admin/interview-prep/questions');
  revalidatePath('/interview-prep', 'layout');
}

export async function createQuestion(data: InterviewQuestionInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = questionAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase.from('interview_questions').insert([data]);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function updateQuestion(
  id: string,
  data: InterviewQuestionInsert
) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = questionAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase
    .from('interview_questions')
    .update(data)
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function deleteQuestion(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const { error } = await supabase
    .from('interview_questions')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}
