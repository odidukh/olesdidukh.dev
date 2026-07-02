'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { storyAdminSchema } from './schema';
import type { InterviewStoryInsert } from '@/lib/supabase/types';

function revalidate() {
  revalidatePath('/admin/interview-prep/stories');
  revalidatePath('/interview-prep', 'layout');
}

export async function createStory(data: InterviewStoryInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = storyAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase.from('interview_stories').insert([data]);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function updateStory(id: string, data: InterviewStoryInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = storyAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase
    .from('interview_stories')
    .update(data)
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function deleteStory(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const { error } = await supabase
    .from('interview_stories')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}
