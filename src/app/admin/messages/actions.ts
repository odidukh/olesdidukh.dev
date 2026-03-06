'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';

export async function markMessageAsRead(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase
    .from('contact_submissions')
    .update({ read: true })
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/messages');
  return { success: true };
}

export async function markMessageAsReplied(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase
    .from('contact_submissions')
    .update({ replied: true })
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/messages');
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/messages');
  return { success: true };
}
