import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCategories, getStories } from '@/lib/interview-prep/data';
import { QuestionForm } from '@/app/admin/interview-prep/questions/components/QuestionForm';
import type { InterviewQuestion } from '@/lib/supabase/types';

export const metadata = {
  title: 'Edit Question | Admin Dashboard',
};

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data, error }, categories, stories] = await Promise.all([
    supabase.from('interview_questions').select('*').eq('id', id).single(),
    getCategories(),
    getStories(),
  ]);

  if (error || !data) {
    notFound();
  }

  const question = data as InterviewQuestion;

  return (
    <QuestionForm
      question={question}
      categories={categories}
      stories={stories}
      mode="edit"
    />
  );
}
