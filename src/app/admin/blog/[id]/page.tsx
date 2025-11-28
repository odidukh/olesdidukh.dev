import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlogForm } from '../components/BlogForm';

export const metadata = {
  title: 'Edit Blog Post | Admin Dashboard',
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  return <BlogForm post={post} mode="edit" />;
}
