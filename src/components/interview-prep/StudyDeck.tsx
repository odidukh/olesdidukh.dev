'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectableBadge } from '@/components/ui/Badge';
import { Flashcard } from './Flashcard';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import { shuffle } from '@/lib/interview-prep/deck';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

// Confidence 0–3 (schema scale).
const CONFIDENCE_LABELS = ['Blank', 'Shaky', 'OK', 'Solid'] as const;

export interface StudyDeckProps {
  questions: InterviewQuestion[];
  categories: InterviewCategory[];
}

export function StudyDeck({ questions, categories }: StudyDeckProps) {
  const setConfidence = useInterviewProgressStore(s => s.setConfidence);
  const markSeen = useInterviewProgressStore(s => s.markSeen);
  const entries = useInterviewProgressStore(s => s.entries);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [onlyUnsure, setOnlyUnsure] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const byId = useMemo(
    () => new Map(questions.map(q => [q.id, q])),
    [questions]
  );

  // Snapshot the deck on filter/shuffle changes so live ratings don't
  // reshuffle the cards mid-review.
  const buildDeck = useCallback(
    (shuffleDeck: boolean) => {
      const current = useInterviewProgressStore.getState().entries;
      let pool = questions;
      if (categoryId) pool = pool.filter(q => q.category_id === categoryId);
      if (onlyUnsure) {
        pool = pool.filter(q => (current[q.id]?.confidence ?? 0) <= 1);
      }
      const ids = pool.map(q => q.id);
      setOrder(shuffleDeck ? shuffle(ids) : ids);
      setIndex(0);
      setFlipped(false);
    },
    [questions, categoryId, onlyUnsure]
  );

  useEffect(() => {
    buildDeck(false);
  }, [buildDeck]);

  if (questions.length === 0) {
    return <p className="text-muted-foreground">No questions to study.</p>;
  }

  const currentId = order[index];
  const current = currentId ? byId.get(currentId) : undefined;
  const currentConfidence = currentId
    ? (entries[currentId]?.confidence ?? 0)
    : 0;

  const handleFlip = () => {
    if (!current) return;
    if (!flipped) markSeen(current.id);
    setFlipped(f => !f);
  };
  const go = (delta: number) => {
    setFlipped(false);
    setIndex(i => Math.min(order.length - 1, Math.max(0, i + delta)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
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
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={onlyUnsure ? 'default' : 'outline'}
            size="sm"
            aria-pressed={onlyUnsure}
            onClick={() => setOnlyUnsure(v => !v)}
          >
            Only unsure
          </Button>
          <Button variant="outline" size="sm" onClick={() => buildDeck(true)}>
            Shuffle
          </Button>
        </div>
      </div>

      {order.length === 0 || !current ? (
        <p className="text-muted-foreground">No cards match this filter.</p>
      ) : (
        <>
          <Flashcard
            flipped={flipped}
            onFlip={handleFlip}
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
              onClick={() => go(-1)}
              disabled={index === 0}
            >
              Previous
            </Button>
            <span className="text-sm tabular-nums text-muted-foreground">
              {index + 1} / {order.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => go(1)}
              disabled={index === order.length - 1}
            >
              Next
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Rate:</span>
            {CONFIDENCE_LABELS.map((label, value) => (
              <Button
                key={label}
                size="sm"
                variant={currentConfidence === value ? 'default' : 'outline'}
                aria-pressed={currentConfidence === value}
                onClick={() => setConfidence(current.id, value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
