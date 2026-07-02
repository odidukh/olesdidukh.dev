import { getQuestions, getCategories } from '@/lib/interview-prep/data';
import { QuestionList } from '@/components/interview-prep/QuestionList';
import { AddQuestionModal } from '@/components/interview-prep/AddQuestionModal';
import { DeleteQuestionButton } from '@/components/interview-prep/DeleteQuestionButton';

export default async function BrowsePage() {
  const [questions, categories] = await Promise.all([
    getQuestions(),
    getCategories(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AddQuestionModal categories={categories} />
      </div>
      <QuestionList
        questions={questions}
        renderActions={question => <DeleteQuestionButton id={question.id} />}
      />
    </div>
  );
}
