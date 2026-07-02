'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { customQuestionSchema, type CustomQuestionInput } from './schema';
import type { InterviewQuestionInsert } from '@/lib/supabase/types';

export async function addCustomQuestion(input: CustomQuestionInput) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = customQuestionSchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const row: InterviewQuestionInsert = {
    category_id: validation.data.category_id,
    story_id: null,
    question: validation.data.question,
    model_answer: validation.data.model_answer,
    tips: [],
    difficulty: validation.data.difficulty,
    time_estimate_sec: null,
    tags: [],
    is_custom: true,
    source: 'custom',
  };

  const { error } = await supabase.from('interview_questions').insert([row]);
  if (error) return { error: error.message };

  revalidatePath('/interview-prep', 'layout');
  return { success: true };
}

export async function deleteCustomQuestion(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { data, error: fetchError } = await supabase
    .from('interview_questions')
    .select('is_custom')
    .eq('id', id)
    .maybeSingle();
  if (fetchError) return { error: fetchError.message };
  if (!data) return { error: 'Question not found' };
  if (!data.is_custom) return { error: 'Only custom questions can be deleted' };

  const { error } = await supabase
    .from('interview_questions')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/interview-prep', 'layout');
  return { success: true };
}

export async function resetSessionProgress(sessionId: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase
    .from('interview_progress')
    .delete()
    .eq('session_id', sessionId);
  if (error) return { error: error.message };

  revalidatePath('/interview-prep', 'layout');
  return { success: true };
}
