'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { projectSchema } from './schema';
import type { ProjectInsert } from '@/lib/supabase/types';

export async function createProject(projectData: ProjectInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = projectSchema.safeParse(projectData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase.from('projects').insert([projectData]);
  if (error) return { error: error.message };

  revalidatePath('/admin/projects');
  return { success: true };
}

export async function updateProject(id: string, projectData: ProjectInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = projectSchema.safeParse(projectData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/projects');
  return { success: true };
}

export async function deleteProject(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/projects');
  return { success: true };
}
