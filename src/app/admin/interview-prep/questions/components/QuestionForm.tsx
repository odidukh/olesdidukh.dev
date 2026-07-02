'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Save, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import {
  RepeatableFieldset,
  type RepeatableField,
} from '@/app/admin/interview-prep/components/RepeatableFieldset';
import {
  createQuestion,
  updateQuestion,
} from '@/app/admin/interview-prep/questions/actions';
import { questionAdminSchema } from '@/app/admin/interview-prep/questions/schema';
import type {
  InterviewQuestion,
  InterviewQuestionInsert,
  InterviewCategory,
  InterviewStory,
} from '@/lib/supabase/types';

interface QuestionFormProps {
  question?: InterviewQuestion;
  categories: InterviewCategory[];
  stories: InterviewStory[];
  mode: 'create' | 'edit';
}

// A tip is edited as all-strings; detail '' maps to null on submit.
interface TipRow extends Record<string, string> {
  point: string;
  detail: string;
}

const tipFields: RepeatableField<TipRow>[] = [
  { key: 'point', label: 'Point', placeholder: 'Short guidance' },
  {
    key: 'detail',
    label: 'Detail',
    type: 'textarea',
    placeholder: 'Optional elaboration',
  },
];

const emptyTip: TipRow = { point: '', detail: '' };

const difficulties = ['easy', 'medium', 'hard'] as const;

export function QuestionForm({
  question,
  categories,
  stories,
  mode,
}: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [modelAnswer, setModelAnswer] = useState(question?.model_answer || '');
  const [categoryId, setCategoryId] = useState(question?.category_id || '');
  const [storyId, setStoryId] = useState(question?.story_id || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    question?.difficulty ?? 'medium'
  );
  const [timeEstimate, setTimeEstimate] = useState(
    question?.time_estimate_sec != null
      ? String(question.time_estimate_sec)
      : ''
  );
  const [tags, setTags] = useState<string[]>(question?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isCustom, setIsCustom] = useState(question?.is_custom ?? false);
  const [source, setSource] = useState(question?.source || '');
  const [tips, setTips] = useState<TipRow[]>(
    question?.tips.map(t => ({ point: t.point, detail: t.detail ?? '' })) ?? []
  );

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data: InterviewQuestionInsert = {
      question: questionText,
      model_answer: modelAnswer || null,
      category_id: categoryId || null,
      story_id: storyId || null,
      difficulty,
      time_estimate_sec: timeEstimate.trim()
        ? parseInt(timeEstimate, 10)
        : null,
      tags,
      tips: tips
        .filter(t => t.point.trim())
        .map(t => ({
          point: t.point,
          detail: t.detail.trim() ? t.detail : null,
        })),
      is_custom: isCustom,
      source: source || null,
    };

    const validation = questionAdminSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues.map(i => i.message).join(', '));
      setLoading(false);
      return;
    }

    const res =
      mode === 'create'
        ? await createQuestion(data)
        : await updateQuestion(question!.id, data);

    if ('error' in res) {
      setError(res.error);
      setLoading(false);
      return;
    }

    router.push('/admin/interview-prep/questions');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {mode === 'create' ? 'New Question' : 'Edit Question'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Add a new interview question'
                : 'Update question details'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Question
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Question</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Textarea
                  id="question"
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  placeholder="Interview question"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelAnswer">Model Answer</Label>
                <Textarea
                  id="modelAnswer"
                  value={modelAnswer}
                  onChange={e => setModelAnswer(e.target.value)}
                  placeholder="Suggested answer"
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* Tips */}
          <RepeatableFieldset
            legend="Tips"
            rows={tips}
            fields={tipFields}
            emptyRow={emptyTip}
            onChange={setTips}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Classification */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Classification
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="">General</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Story</Label>
                <select
                  id="story"
                  value={storyId}
                  onChange={e => setStoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="">None</option>
                  {stories.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={e =>
                    setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeEstimate">Time Estimate (seconds)</Label>
                <Input
                  id="timeEstimate"
                  type="number"
                  value={timeEstimate}
                  onChange={e => setTimeEstimate(e.target.value)}
                  placeholder="e.g., 90"
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Tags</h2>

            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 p-0.5 hover:bg-muted-foreground/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Details</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustom}
                  onChange={e => setIsCustom(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Custom question</span>
              </label>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="e.g., Glassdoor, personal notes"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
