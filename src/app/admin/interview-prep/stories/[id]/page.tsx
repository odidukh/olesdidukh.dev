import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoryForm } from '@/app/admin/interview-prep/stories/components/StoryForm';
import type { InterviewStory } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Story | Admin Dashboard',
};

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('interview_stories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const story = data as InterviewStory;

  return <StoryForm story={story} mode="edit" />;
}
