import { getQuestions } from '@/lib/interview-prep/data';
import { QuestionList } from '@/components/interview-prep/QuestionList';

export default async function BrowsePage() {
  const questions = await getQuestions();
  return <QuestionList questions={questions} />;
}
