'use client';

import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import { cn } from '@/lib/utils';
import type { InterviewQuestion } from '@/lib/supabase/types';

export interface QuestionRowProps {
  question: InterviewQuestion;
  actions?: React.ReactNode;
}

export function QuestionRow({ question, actions }: QuestionRowProps) {
  const starred = useInterviewProgressStore(
    s => s.entries[question.id]?.starred ?? false
  );
  const toggleStar = useInterviewProgressStore(s => s.toggleStar);

  return (
    <li className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
      <div className="space-y-1">
        <p className="text-sm text-foreground">{question.question}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" size="sm">
            {question.difficulty}
          </Badge>
          {question.is_custom && (
            <Badge variant="info" size="sm">
              custom
            </Badge>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => toggleStar(question.id)}
          aria-pressed={starred}
          aria-label={starred ? 'Unstar question' : 'Star question'}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-warning"
        >
          <Star
            className={cn('h-4 w-4', starred && 'fill-warning text-warning')}
          />
        </button>
        {question.is_custom ? actions : null}
      </div>
    </li>
  );
}
