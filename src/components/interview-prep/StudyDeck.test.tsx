import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudyDeck } from './StudyDeck';
import {
  useInterviewProgressStore,
  defaultEntry,
} from '@/stores/useInterviewProgressStore';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));

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
  {
    id: 'c2',
    name: 'Behavioral',
    slug: 'bh',
    sort_order: 1,
    weight: 1,
    created_at: 'x',
    updated_at: 'x',
  },
];
const question = (
  id: string,
  category_id: string,
  over: Partial<InterviewQuestion> = {}
): InterviewQuestion => ({
  id,
  category_id,
  story_id: null,
  question: `Q ${id}`,
  model_answer: `A ${id}`,
  tips: [],
  difficulty: 'medium',
  time_estimate_sec: null,
  tags: [],
  is_custom: false,
  source: null,
  created_at: 'x',
  updated_at: 'x',
  ...over,
});
const questions = [
  question('q1', 'c1'),
  question('q2', 'c1'),
  question('q3', 'c2'),
];

beforeEach(() =>
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  })
);

describe('StudyDeck', () => {
  it('flips the current card to reveal the model answer and marks it seen', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    expect(screen.getByText('Q q1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Q q1/ }));
    expect(screen.getByText('A q1')).toBeInTheDocument();
    expect(useInterviewProgressStore.getState().entries['q1']?.timesSeen).toBe(
      1
    );
  });

  it('advances to the next card with Next', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Q q2')).toBeInTheDocument();
  });

  it('rates the current card, writing confidence to the store', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: 'Solid' }));
    expect(useInterviewProgressStore.getState().entries['q1']?.confidence).toBe(
      3
    );
  });

  it('filters to a category via its chip', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: 'Behavioral' }));
    expect(screen.getByText('Q q3')).toBeInTheDocument();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  it('restricts the deck to unsure cards when "Only unsure" is on', async () => {
    useInterviewProgressStore
      .getState()
      .hydrate('s1', [
        { ...defaultEntry('q1'), confidence: 3, status: 'known' },
      ]);
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: 'Only unsure' }));
    // q1 (confidence 3) drops out; q2 becomes the first card.
    expect(screen.getByText('Q q2')).toBeInTheDocument();
    expect(screen.queryByText('Q q1')).not.toBeInTheDocument();
  });
});
