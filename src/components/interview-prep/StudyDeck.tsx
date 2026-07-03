'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectableBadge } from '@/components/ui/Badge';
import { Flashcard } from './Flashcard';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import { buildSmartSession, summarizeSession } from '@/lib/interview-prep/deck';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

// Confidence 0–3 (schema scale); index === confidence value.
const CONFIDENCE_LABELS = ['Blank', 'Shaky', 'OK', 'Solid'] as const;
const SIZE_OPTIONS = [10, 20, 'All'] as const;

type Phase = 'setup' | 'running' | 'summary';
type SizeOption = (typeof SIZE_OPTIONS)[number];

const DEFAULT_SIZE: SizeOption = 10;

export interface StudyDeckProps {
  questions: InterviewQuestion[];
  categories: InterviewCategory[];
}

export function StudyDeck({ questions, categories }: StudyDeckProps) {
  const setConfidence = useInterviewProgressStore(s => s.setConfidence);
  const markSeen = useInterviewProgressStore(s => s.markSeen);
  const toggleStar = useInterviewProgressStore(s => s.toggleStar);

  const [phase, setPhase] = useState<Phase>('setup');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [size, setSize] = useState<SizeOption>(DEFAULT_SIZE);
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [startConfidences, setStartConfidences] = useState<
    Record<string, number>
  >({});
  const seenThisCard = useRef(false);

  const byId = useMemo(
    () => new Map(questions.map(q => [q.id, q])),
    [questions]
  );

  const start = useCallback(
    (opts?: {
      weakOnly?: boolean;
      categoryId?: string | null;
      size?: SizeOption;
    }) => {
      const cat = opts?.categoryId !== undefined ? opts.categoryId : categoryId;
      const sizeOpt = opts?.size ?? size;
      const numericSize = sizeOpt === 'All' ? questions.length : sizeOpt;
      const current = useInterviewProgressStore.getState().entries;
      const built = buildSmartSession(questions, current, {
        size: numericSize,
        categoryId: cat,
        weakOnly: opts?.weakOnly ?? false,
      });
      if (built.length === 0) return; // nothing matches; stay in setup
      const snapshot: Record<string, number> = {};
      for (const id of built) snapshot[id] = current[id]?.confidence ?? 0;
      setOrder(built);
      setStartConfidences(snapshot);
      setIndex(0);
      setFlipped(false);
      seenThisCard.current = false;
      setPhase('running');
    },
    [questions, categoryId, size]
  );

  const currentId = order[index];
  const current = currentId ? byId.get(currentId) : undefined;

  const flip = useCallback(() => {
    if (!flipped && currentId && !seenThisCard.current) {
      markSeen(currentId);
      seenThisCard.current = true;
    }
    setFlipped(f => !f);
  }, [flipped, currentId, markSeen]);

  const advance = useCallback(() => {
    if (index >= order.length - 1) {
      setPhase('summary');
      return;
    }
    setIndex(i => i + 1);
    setFlipped(false);
    seenThisCard.current = false;
  }, [index, order.length]);

  const rate = useCallback(
    (value: number) => {
      if (!currentId || !flipped) return;
      setConfidence(currentId, value);
      advance();
    },
    [currentId, flipped, setConfidence, advance]
  );

  const goPrev = useCallback(() => {
    setFlipped(false);
    seenThisCard.current = false;
    setIndex(i => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setFlipped(false);
    seenThisCard.current = false;
    setIndex(i => Math.min(order.length - 1, i + 1));
  }, [order.length]);

  useEffect(() => {
    if (phase !== 'running') return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 's' || e.key === 'S') {
        if (currentId) toggleStar(currentId);
      } else if (['0', '1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        rate(Number(e.key));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, flip, goPrev, goNext, rate, toggleStar, currentId]);

  if (questions.length === 0) {
    return <p className="text-muted-foreground">No questions to study.</p>;
  }

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
          <p className="text-sm font-medium">Session size</p>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map(n => (
              <SelectableBadge
                key={String(n)}
                selected={size === n}
                onSelect={() => setSize(n)}
              >
                {n === 'All' ? 'All' : `${n} cards`}
              </SelectableBadge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="gradient" onClick={() => start()}>
            Start studying
          </Button>
          <Button variant="outline" onClick={() => start({ weakOnly: true })}>
            Weak spots
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'summary') {
    // Terminal snapshot — read once via getState() rather than subscribing,
    // since the summary need not re-render on later store writes.
    const finalEntries = useInterviewProgressStore.getState().entries;
    const summary = summarizeSession(startConfidences, finalEntries);
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Session complete</h2>
        <p className="text-muted-foreground">
          Reviewed {order.length} card{order.length === 1 ? '' : 's'}.
        </p>
        <p className="text-sm tabular-nums">
          <span className="text-success">▲ {summary.improved} improved</span>
          {' · '}
          <span className="text-muted-foreground">
            ▬ {summary.unchanged} held
          </span>
          {' · '}
          <span className="text-error">▼ {summary.dropped} dropped</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {summary.stillShaky.length > 0 && (
            <Button
              variant="gradient"
              onClick={() => start({ weakOnly: true, size: 'All' })}
            >
              Study those ({summary.stillShaky.length} shaky)
            </Button>
          )}
          <Button variant="outline" onClick={() => start()}>
            Go again
          </Button>
          <Button variant="ghost" onClick={() => setPhase('setup')}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  // running
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="tabular-nums">
          {index + 1} / {order.length}
        </span>
        <span aria-hidden>Space flip · 0–3 rate · ←/→ move</span>
      </div>

      {current ? (
        <>
          <Flashcard
            flipped={flipped}
            onFlip={flip}
            front={
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Question
                </span>
                <p className="text-lg font-medium">{current.question}</p>
              </div>
            }
            back={
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Model answer
                </span>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {current.model_answer ?? 'No model answer yet.'}
                </p>
              </div>
            }
          />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goPrev}
              disabled={index === 0}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              disabled={index === order.length - 1}
            >
              Next
            </Button>
          </div>

          {flipped && (
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
          )}
        </>
      ) : (
        <p className="text-muted-foreground">No card to show.</p>
      )}
    </div>
  );
}
