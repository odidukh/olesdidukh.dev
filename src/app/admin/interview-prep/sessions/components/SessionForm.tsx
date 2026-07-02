'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import {
  RepeatableFieldset,
  type RepeatableField,
} from '@/app/admin/interview-prep/components/RepeatableFieldset';
import {
  createSession,
  updateSession,
} from '@/app/admin/interview-prep/sessions/actions';
import { sessionAdminSchema } from '@/app/admin/interview-prep/sessions/schema';
import type {
  InterviewSession,
  InterviewSessionInsert,
  InterviewCategory,
} from '@/lib/supabase/types';

interface SessionFormProps {
  session?: InterviewSession;
  categories: InterviewCategory[];
  mode: 'create' | 'edit';
}

// Each row type is a bare Record<string, string> so it satisfies the
// RepeatableFieldset generic constraint under strict TS. These sub-schemas
// are all plain-string fields, so rows map 1:1 to the schema objects.
interface InterviewerRow extends Record<string, string> {
  name: string;
  role: string;
  focus: string;
}
interface TopicRow extends Record<string, string> {
  topic: string;
  whereToDrill: string;
}
interface NumberRow extends Record<string, string> {
  label: string;
  value: string;
}
interface StackRow extends Record<string, string> {
  theirTech: string;
  yourStanding: string;
}

const interviewerFields: RepeatableField<InterviewerRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'focus', label: 'Focus', type: 'textarea' },
];
const topicFields: RepeatableField<TopicRow>[] = [
  { key: 'topic', label: 'Topic' },
  { key: 'whereToDrill', label: 'Where to drill' },
];
const numberFields: RepeatableField<NumberRow>[] = [
  { key: 'label', label: 'Label' },
  { key: 'value', label: 'Value' },
];
const stackFields: RepeatableField<StackRow>[] = [
  { key: 'theirTech', label: 'Their tech' },
  { key: 'yourStanding', label: 'Your standing', type: 'textarea' },
];

const emptyInterviewer: InterviewerRow = { name: '', role: '', focus: '' };
const emptyTopic: TopicRow = { topic: '', whereToDrill: '' };
const emptyNumber: NumberRow = { label: '', value: '' };
const emptyStack: StackRow = { theirTech: '', yourStanding: '' };

const statuses = ['upcoming', 'done', 'archived'] as const;

// scheduled_at <-> datetime-local, treated as UTC wall-clock (no timezone
// drift: the local input is read/written as if it were UTC).
const toInput = (iso: string | null) => (iso ? iso.slice(0, 16) : '');
const fromInput = (v: string) => (v ? `${v}:00Z` : null);

export function SessionForm({ session, categories, mode }: SessionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState(session?.slug || '');
  const [company, setCompany] = useState(session?.company || '');
  const [role, setRole] = useState(session?.role || '');
  const [round, setRound] = useState(session?.round || '');
  const [scheduledAt, setScheduledAt] = useState(
    toInput(session?.scheduled_at ?? null)
  );
  const [status, setStatus] = useState<'upcoming' | 'done' | 'archived'>(
    session?.status ?? 'upcoming'
  );
  const [product, setProduct] = useState(session?.product || '');
  const [bottomLine, setBottomLine] = useState(session?.bottom_line || '');
  const [interviewers, setInterviewers] = useState<InterviewerRow[]>(
    session?.interviewers ?? []
  );
  const [likelyTopics, setLikelyTopics] = useState<TopicRow[]>(
    session?.likely_topics ?? []
  );
  const [yourNumbers, setYourNumbers] = useState<NumberRow[]>(
    session?.your_numbers ?? []
  );
  const [stackMap, setStackMap] = useState<StackRow[]>(
    session?.stack_map ?? []
  );
  const [focusIds, setFocusIds] = useState<string[]>(
    session?.focus_category_ids ?? []
  );

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data: InterviewSessionInsert = {
      slug,
      company,
      role,
      round,
      scheduled_at: fromInput(scheduledAt),
      status,
      product: product || null,
      interviewers,
      likely_topics: likelyTopics,
      your_numbers: yourNumbers,
      bottom_line: bottomLine || null,
      stack_map: stackMap,
      focus_category_ids: focusIds,
    };

    const validation = sessionAdminSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues.map(i => i.message).join(', '));
      setLoading(false);
      return;
    }

    const res =
      mode === 'create'
        ? await createSession(data)
        : await updateSession(session!.id, data);

    if ('error' in res) {
      setError(res.error);
      setLoading(false);
      return;
    }

    router.push('/admin/interview-prep/sessions');
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
              {mode === 'create' ? 'New Session' : 'Edit Session'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Add a new interview session'
                : 'Update session details'}
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
                Save Session
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
            <h2 className="text-lg font-semibold text-foreground">Session</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="company-round-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g., Senior Front-End Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="round">Round *</Label>
                <Input
                  id="round"
                  value={round}
                  onChange={e => setRound(e.target.value)}
                  placeholder="e.g., Round 2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Textarea
                  id="product"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  placeholder="Product context"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottomLine">Bottom line</Label>
                <Textarea
                  id="bottomLine"
                  value={bottomLine}
                  onChange={e => setBottomLine(e.target.value)}
                  placeholder="Key takeaway"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Interviewers */}
          <RepeatableFieldset
            legend="Interviewers"
            rows={interviewers}
            fields={interviewerFields}
            emptyRow={emptyInterviewer}
            onChange={setInterviewers}
          />

          {/* Likely topics */}
          <RepeatableFieldset
            legend="Likely topics"
            rows={likelyTopics}
            fields={topicFields}
            emptyRow={emptyTopic}
            onChange={setLikelyTopics}
          />

          {/* Your numbers */}
          <RepeatableFieldset
            legend="Your numbers"
            rows={yourNumbers}
            fields={numberFields}
            emptyRow={emptyNumber}
            onChange={setYourNumbers}
          />

          {/* Stack map */}
          <RepeatableFieldset
            legend="Stack map"
            rows={stackMap}
            fields={stackFields}
            emptyRow={emptyStack}
            onChange={setStackMap}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Status</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={e =>
                    setStatus(
                      e.target.value as 'upcoming' | 'done' | 'archived'
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Scheduled at (UTC)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Focus categories */}
          <fieldset className="space-y-2 border border-border rounded-xl p-4">
            <legend className="px-1 text-sm font-medium text-foreground">
              Focus categories
            </legend>
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories yet.
              </p>
            )}
            {categories.map(c => (
              <label
                key={c.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={focusIds.includes(c.id)}
                  onChange={e =>
                    setFocusIds(
                      e.target.checked
                        ? [...focusIds, c.id]
                        : focusIds.filter(id => id !== c.id)
                    )
                  }
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">{c.name}</span>
              </label>
            ))}
          </fieldset>
        </div>
      </div>
    </form>
  );
}
