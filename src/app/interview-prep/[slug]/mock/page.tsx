import { getCategories, getQuestions } from '@/lib/interview-prep/data';
import { MockRunner } from '@/components/interview-prep/MockRunner';

export default async function MockPage() {
  const [categories, questions] = await Promise.all([
    getCategories(),
    getQuestions(),
  ]);
  return <MockRunner questions={questions} categories={categories} />;
}
