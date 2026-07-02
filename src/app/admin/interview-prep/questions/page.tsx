import Link from 'next/link';
import { getQuestions, getCategories } from '@/lib/interview-prep/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil } from 'lucide-react';
import { DeleteQuestionButton } from './components/DeleteQuestionButton';

export const metadata = {
  title: 'Questions | Admin Dashboard',
};

export default async function QuestionsPage() {
  const [questions, categories] = await Promise.all([
    getQuestions(),
    getCategories(),
  ]);
  const catName = new Map(categories.map(c => [c.id, c.name]));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Questions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your interview questions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/interview-prep/questions/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {questions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Question
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Difficulty
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Custom
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map(q => (
                  <tr key={q.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground line-clamp-2">
                        {q.question}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {catName.get(q.category_id ?? '') ?? 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" size="sm">
                        {q.difficulty}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {q.is_custom && (
                        <Badge variant="info" size="sm">
                          custom
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/interview-prep/questions/${q.id}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteQuestionButton
                          questionId={q.id}
                          questionLabel={q.question.slice(0, 60)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No questions yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first question
            </p>
            <Link href="/admin/interview-prep/questions/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
