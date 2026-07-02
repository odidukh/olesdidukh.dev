import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionList } from './QuestionList';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import type { InterviewQuestion } from '@/lib/supabase/types';

const q = (id: string, text: string): InterviewQuestion => ({
  id,
  category_id: 'c1',
  story_id: null,
  question: text,
  model_answer: null,
  tips: [],
  difficulty: 'medium',
  time_estimate_sec: null,
  tags: [],
  is_custom: false,
  source: null,
  created_at: 'x',
  updated_at: 'x',
});
const questions = [
  q('q1', 'Explain hydration'),
  q('q2', 'Describe SSR streaming'),
];

beforeEach(() =>
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  })
);

describe('QuestionList', () => {
  it('filters questions by the search box (case-insensitive)', async () => {
    const user = userEvent.setup();
    render(<QuestionList questions={questions} />);
    expect(screen.getByText('Explain hydration')).toBeInTheDocument();
    expect(screen.getByText('Describe SSR streaming')).toBeInTheDocument();

    await user.type(screen.getByRole('searchbox'), 'ssr');
    expect(screen.queryByText('Explain hydration')).not.toBeInTheDocument();
    expect(screen.getByText('Describe SSR streaming')).toBeInTheDocument();
  });

  it('shows the empty state when no question matches the search', async () => {
    const user = userEvent.setup();
    render(<QuestionList questions={questions} />);
    await user.type(screen.getByRole('searchbox'), 'zzz-no-match');
    expect(screen.queryByText('Explain hydration')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Describe SSR streaming')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('No questions match your search.')
    ).toBeInTheDocument();
  });

  it('renders per-question actions via renderActions', () => {
    render(
      <QuestionList
        questions={[{ ...q('q3', 'Custom one'), is_custom: true }]}
        renderActions={question => <span>action-{question.id}</span>}
      />
    );
    expect(screen.getByText('action-q3')).toBeInTheDocument();
  });
});
