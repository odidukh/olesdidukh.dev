import { getCategories, getQuestions } from '@/lib/interview-prep/data';
import { StudyDeck } from '@/components/interview-prep/StudyDeck';

export default async function StudyPage() {
  const [categories, questions] = await Promise.all([
    getCategories(),
    getQuestions(),
  ]);
  return <StudyDeck questions={questions} categories={categories} />;
}
