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

describe('StudyDeck flow', () => {
  it('starts a smart session from the setup screen', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    expect(
      screen.getByRole('button', { name: /Start studying/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Start studying/i }));
    // All entries unseen -> original order -> q1 first.
    expect(screen.getByText('Q q1')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('flips the card to reveal the answer and marks it seen', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: /Start studying/i }));
    await user.click(screen.getByRole('button', { name: /Q q1/ }));
    expect(screen.getByText('A q1')).toBeInTheDocument();
    expect(useInterviewProgressStore.getState().entries['q1']?.timesSeen).toBe(
      1
    );
  });

  it('rates the current card with a digit key and advances to the next', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: /Start studying/i }));
    await user.keyboard('[Space]'); // flip to reveal
    expect(screen.getByText('A q1')).toBeInTheDocument();
    await user.keyboard('3'); // rate Solid + advance
    expect(useInterviewProgressStore.getState().entries['q1']?.confidence).toBe(
      3
    );
    expect(screen.getByText('Q q2')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('rating the last card ends the session at the summary', async () => {
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    // Behavioral has a single question (q3) -> one card to the summary.
    await user.click(screen.getByRole('button', { name: 'Behavioral' }));
    await user.click(screen.getByRole('button', { name: /Start studying/i }));
    expect(screen.getByText('Q q3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Q q3/ })); // flip
    await user.click(screen.getByRole('button', { name: 'Solid' })); // rate + advance
    expect(screen.getByText(/Session complete/i)).toBeInTheDocument();
  });

  it('builds a weak-only deck from the Weak spots preset', async () => {
    useInterviewProgressStore
      .getState()
      .hydrate('s1', [
        { ...defaultEntry('q1'), confidence: 3, status: 'known' },
      ]);
    const user = userEvent.setup();
    render(<StudyDeck questions={questions} categories={categories} />);
    await user.click(screen.getByRole('button', { name: /Weak spots/i }));
    // q1 (confidence 3) is excluded; q2 (unseen) leads.
    expect(screen.getByText('Q q2')).toBeInTheDocument();
    expect(screen.queryByText('Q q1')).not.toBeInTheDocument();
  });
});
