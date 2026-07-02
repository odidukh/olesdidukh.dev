'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectableBadge } from '@/components/ui/Badge';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import { pickRandom } from '@/lib/interview-prep/deck';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

const LENGTHS = [5, 8, 12] as const;
const DEFAULT_LENGTH = 8;
const CONFIDENCE_LABELS = ['Blank', 'Shaky', 'OK', 'Solid'] as const;

type Phase = 'setup' | 'running' | 'summary';

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export interface MockRunnerProps {
  questions: InterviewQuestion[];
  categories: InterviewCategory[];
}

export function MockRunner({ questions, categories }: MockRunnerProps) {
  const setConfidence = useInterviewProgressStore(s => s.setConfidence);
  const markSeen = useInterviewProgressStore(s => s.markSeen);

  const [phase, setPhase] = useState<Phase>('setup');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [length, setLength] = useState<number>(DEFAULT_LENGTH);
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);

  const byId = useMemo(
    () => new Map(questions.map(q => [q.id, q])),
    [questions]
  );

  const available = useMemo(
    () =>
      categoryId
        ? questions.filter(q => q.category_id === categoryId)
        : questions,
    [questions, categoryId]
  );

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const start = () => {
    setOrder(
      pickRandom(
        available.map(q => q.id),
        length
      )
    );
    setIndex(0);
    setRevealed(false);
    setSeconds(0);
    setRatedCount(0);
    setPhase('running');
  };

  const currentId = order[index];
  const current = currentId ? byId.get(currentId) : undefined;

  const reveal = () => {
    if (current) markSeen(current.id);
    setRevealed(true);
  };

  const rate = (value: number) => {
    if (!current) return;
    setConfidence(current.id, value);
    setRatedCount(c => c + 1);
    if (index >= order.length - 1) {
      setPhase('summary');
    } else {
      setIndex(i => i + 1);
      setRevealed(false);
    }
  };

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Category</p>
          <div className="flex flex-wrap gap-2">
            <SelectableBadge
              selected={categoryId === null}
              onSelect={() => setCategoryId(null)}
            >
              All
            </SelectableBadge>
            {categories.map(c => (
              <SelectableBadge
                key={c.id}
                selected={categoryId === c.id}
                onSelect={() => setCategoryId(c.id)}
              >
                {c.name}
              </SelectableBadge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Length</p>
          <div className="flex flex-wrap gap-2">
            {LENGTHS.map(n => (
              <SelectableBadge
                key={n}
                selected={length === n}
                onSelect={() => setLength(n)}
              >
                {n} questions
              </SelectableBadge>
            ))}
          </div>
        </div>
        <Button
          variant="gradient"
          onClick={start}
          disabled={available.length === 0}
        >
          Start mock
        </Button>
        <p className="text-sm text-muted-foreground">
          {available.length} question{available.length === 1 ? '' : 's'}{' '}
          available.
        </p>
      </div>
    );
  }

  if (phase === 'summary') {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mock complete</h2>
        <p className="text-muted-foreground">
          You answered {ratedCount} question{ratedCount === 1 ? '' : 's'} in{' '}
          {formatTime(seconds)}.
        </p>
        <Button variant="outline" onClick={() => setPhase('setup')}>
          Run another
        </Button>
      </div>
    );
  }

  // running
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="tabular-nums">
          Question {index + 1} of {order.length}
        </span>
        <span className="tabular-nums" aria-label="Elapsed time">
          {formatTime(seconds)}
        </span>
      </div>

      {current ? (
        <>
          <p className="text-lg font-medium">{current.question}</p>

          {!revealed ? (
            <Button variant="outline" onClick={reveal}>
              Reveal answer
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Model answer
                </span>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {current.model_answer ?? 'No model answer yet.'}
                </p>
              </div>
              {current.tips.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {current.tips.map(tip => (
                    <li key={tip.point}>
                      <span className="text-foreground">{tip.point}</span>
                      {tip.detail ? ` — ${tip.detail}` : ''}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  How did you do?
                </span>
                {CONFIDENCE_LABELS.map((label, value) => (
                  <Button
                    key={label}
                    size="sm"
                    variant="outline"
                    onClick={() => rate(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">No question to show.</p>
      )}
    </div>
  );
}
