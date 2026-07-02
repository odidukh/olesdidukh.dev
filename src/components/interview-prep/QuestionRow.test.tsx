import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionRow } from './QuestionRow';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import type { InterviewQuestion } from '@/lib/supabase/types';

const base: InterviewQuestion = {
  id: 'q1',
  category_id: 'c1',
  story_id: null,
  question: 'Explain hydration',
  model_answer: null,
  tips: [],
  difficulty: 'medium',
  time_estimate_sec: null,
  tags: [],
  is_custom: false,
  source: null,
  created_at: 'x',
  updated_at: 'x',
};

beforeEach(() =>
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  })
);

describe('QuestionRow', () => {
  it('toggles the star in the store', async () => {
    const user = userEvent.setup();
    render(<QuestionRow question={base} />);
    await user.click(screen.getByRole('button', { name: /star/i }));
    expect(useInterviewProgressStore.getState().entries['q1']?.starred).toBe(
      true
    );
  });

  it('renders actions only for custom questions', () => {
    const { rerender } = render(
      <QuestionRow question={base} actions={<span>del</span>} />
    );
    expect(screen.queryByText('del')).not.toBeInTheDocument();
    rerender(
      <QuestionRow
        question={{ ...base, is_custom: true }}
        actions={<span>del</span>}
      />
    );
    expect(screen.getByText('del')).toBeInTheDocument();
  });
});
