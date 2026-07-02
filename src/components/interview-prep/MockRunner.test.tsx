import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MockRunner } from './MockRunner';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

const categories: InterviewCategory[] = [
  {
    id: 'c1',
    name: 'System Design',
    slug: 'sd',
    sort_order: 0,
    weight: 1,
    created_at: 'x',
    updated_at: 'x',
  },
];
const question = (id: string): InterviewQuestion => ({
  id,
  category_id: 'c1',
  story_id: null,
  question: `Q ${id}`,
  model_answer: `A ${id}`,
  tips: [{ point: `tip ${id}`, detail: null }],
  difficulty: 'medium',
  time_estimate_sec: null,
  tags: [],
  is_custom: false,
  source: null,
  created_at: 'x',
  updated_at: 'x',
});
const questions = [question('q1'), question('q2'), question('q3')];

beforeEach(() =>
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  })
);

describe('MockRunner flow', () => {
  it('runs setup → reveal/rate each question → summary, writing confidence', async () => {
    const user = userEvent.setup();
    render(<MockRunner questions={questions} categories={categories} />);

    await user.click(screen.getByRole('button', { name: /Start mock/i }));
    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();

    for (let n = 1; n <= 3; n += 1) {
      await user.click(screen.getByRole('button', { name: /Reveal/i }));
      expect(screen.getByText(/Model answer/i)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'OK' })); // confidence 2
    }

    expect(screen.getByText(/Mock complete/i)).toBeInTheDocument();
    const entries = useInterviewProgressStore.getState().entries;
    expect(Object.keys(entries)).toHaveLength(3);
    expect(Object.values(entries).every(e => e.confidence === 2)).toBe(true);
  });

  it('can run another mock from the summary', async () => {
    const user = userEvent.setup();
    render(<MockRunner questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: /Start mock/i }));
    for (let n = 1; n <= 3; n += 1) {
      await user.click(screen.getByRole('button', { name: /Reveal/i }));
      await user.click(screen.getByRole('button', { name: 'OK' }));
    }
    await user.click(screen.getByRole('button', { name: /Run another/i }));
    expect(
      screen.getByRole('button', { name: /Start mock/i })
    ).toBeInTheDocument();
  });
});

describe('MockRunner timer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts up once per second while running', () => {
    render(<MockRunner questions={questions} categories={categories} />);
    act(() => {
      screen.getByRole('button', { name: /Start mock/i }).click();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('0:03')).toBeInTheDocument();
  });
});
