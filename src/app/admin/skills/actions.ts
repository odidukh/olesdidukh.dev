'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { skillSchema, skillCategorySchema } from './schema';
import type { SkillInsert, SkillCategoryInsert } from '@/lib/supabase/types';

// ── Skill actions ──────────────────────────────

export async function createSkill(skillData: SkillInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = skillSchema.safeParse(skillData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase.from('skills').insert([skillData]);
  if (error) return { error: error.message };

  revalidatePath('/admin/skills');
  return { success: true };
}

export async function updateSkill(id: string, skillData: SkillInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = skillSchema.safeParse(skillData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase
    .from('skills')
    .update(skillData)
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/skills');
  return { success: true };
}

export async function deleteSkill(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/skills');
  return { success: true };
}

// ── Skill Category actions ─────────────────────

export async function createSkillCategory(catData: SkillCategoryInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = skillCategorySchema.safeParse(catData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase.from('skill_categories').insert([catData]);
  if (error) return { error: error.message };

  revalidatePath('/admin/skills');
  revalidatePath('/admin/skills/categories');
  return { success: true };
}

export async function updateSkillCategory(
  id: string,
  catData: SkillCategoryInsert
) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = skillCategorySchema.safeParse(catData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase
    .from('skill_categories')
    .update(catData)
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/skills');
  revalidatePath('/admin/skills/categories');
  return { success: true };
}

export async function deleteSkillCategory(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/skills');
  revalidatePath('/admin/skills/categories');
  return { success: true };
}
