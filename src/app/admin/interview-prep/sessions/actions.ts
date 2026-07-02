'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { sessionAdminSchema } from './schema';
import type { InterviewSessionInsert } from '@/lib/supabase/types';

function revalidate() {
  revalidatePath('/admin/interview-prep/sessions');
  revalidatePath('/interview-prep', 'layout');
}

export async function createSession(data: InterviewSessionInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = sessionAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase.from('interview_sessions').insert([data]);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function updateSession(id: string, data: InterviewSessionInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = sessionAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase
    .from('interview_sessions')
    .update(data)
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function deleteSession(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const { error } = await supabase
    .from('interview_sessions')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}
