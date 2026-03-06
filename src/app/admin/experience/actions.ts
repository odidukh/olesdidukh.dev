'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { experienceSchema } from './schema';
import type { ExperienceInsert } from '@/lib/supabase/types';

export async function createExperience(expData: ExperienceInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = experienceSchema.safeParse(expData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase.from('experiences').insert([expData]);
  if (error) return { error: error.message };

  revalidatePath('/admin/experience');
  return { success: true };
}

export async function updateExperience(id: string, expData: ExperienceInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = experienceSchema.safeParse(expData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase
    .from('experiences')
    .update(expData)
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/experience');
  return { success: true };
}

export async function deleteExperience(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/experience');
  return { success: true };
}
