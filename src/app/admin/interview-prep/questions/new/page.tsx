import { getCategories, getStories } from '@/lib/interview-prep/data';
import { QuestionForm } from '@/app/admin/interview-prep/questions/components/QuestionForm';

export const metadata = {
  title: 'New Question | Admin Dashboard',
};

export default async function NewQuestionPage() {
  const [categories, stories] = await Promise.all([
    getCategories(),
    getStories(),
  ]);

  return (
    <QuestionForm mode="create" categories={categories} stories={stories} />
  );
}
