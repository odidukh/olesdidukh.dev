'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { blogPostSchema } from './schema';
import type { BlogPostInsert } from '@/lib/supabase/types';

export async function createBlogPost(postData: BlogPostInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = blogPostSchema.safeParse(postData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase.from('blog_posts').insert([postData]);
  if (error) return { error: error.message };

  revalidatePath('/admin/blog');
  return { success: true };
}

export async function updateBlogPost(id: string, postData: BlogPostInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const validation = blogPostSchema.safeParse(postData);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(postData)
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/blog');
  return { success: true };
}
