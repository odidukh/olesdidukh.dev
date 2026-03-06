import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogForm } from '@/app/admin/blog/components/BlogForm';
import type { BlogPost } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Blog Post | Admin Dashboard',
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as BlogPost;

  return <BlogForm post={post} mode="edit" />;
}
