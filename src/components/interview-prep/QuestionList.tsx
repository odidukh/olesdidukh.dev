'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { QuestionRow } from './QuestionRow';
import type { InterviewQuestion } from '@/lib/supabase/types';

export interface QuestionListProps {
  questions: InterviewQuestion[];
  renderActions?: (question: InterviewQuestion) => React.ReactNode;
}

export function QuestionList({ questions, renderActions }: QuestionListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return questions;
    return questions.filter(q => q.question.toLowerCase().includes(needle));
  }, [questions, query]);

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search questions…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search questions"
      />
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No questions match your search.</p>
      ) : (
        <ul>
          {filtered.map(question => (
            <QuestionRow
              key={question.id}
              question={question}
              actions={renderActions?.(question)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
