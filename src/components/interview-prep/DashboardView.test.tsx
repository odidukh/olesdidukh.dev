import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DashboardView } from './DashboardView';
import {
  useInterviewProgressStore,
  defaultEntry,
} from '@/stores/useInterviewProgressStore';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

vi.mock('./ReadinessRing', () => ({
  ReadinessRing: ({ value }: { value: number }) => (
    <div data-testid="overall">{Math.round(value * 100)}</div>
  ),
}));

const category: InterviewCategory = {
  id: 'c1',
  name: 'System Design',
  slug: 'system-design',
  sort_order: 0,
  weight: 1,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};
const q = (id: string): InterviewQuestion => ({
  id,
  category_id: 'c1',
  story_id: null,
  question: `Q ${id}`,
  model_answer: null,
  tips: [],
  difficulty: 'medium',
  time_estimate_sec: null,
  tags: [],
  is_custom: false,
  source: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
});

beforeEach(() =>
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  })
);

describe('DashboardView', () => {
  it('computes overall readiness from the store', () => {
    useInterviewProgressStore.getState().hydrate('s1', [
      { ...defaultEntry('q1'), confidence: 3, status: 'known' },
      { ...defaultEntry('q2'), confidence: 3, status: 'known' },
    ]);
    render(
      <DashboardView
        slug="houston"
        categories={[category]}
        questions={[q('q1'), q('q2')]}
      />
    );
    expect(screen.getByTestId('overall')).toHaveTextContent('100');
    expect(screen.getByText('System Design')).toBeInTheDocument();
  });
});
