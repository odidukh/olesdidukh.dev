import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionCard } from './SessionCard';
import type { InterviewSession } from '@/lib/supabase/types';

vi.mock('./ReadinessRing', () => ({
  ReadinessRing: ({ value }: { value: number }) => (
    <div data-testid="ring">{Math.round(value * 100)}</div>
  ),
}));

const session: InterviewSession = {
  id: 's1',
  slug: 'houston',
  company: 'Houston Robotics',
  role: 'Senior Front-End Engineer',
  round: 'Onsite',
  scheduled_at: '2026-08-01T15:00:00Z',
  status: 'upcoming',
  product: null,
  interviewers: [],
  likely_topics: [],
  your_numbers: [],
  bottom_line: null,
  stack_map: [],
  focus_category_ids: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('SessionCard', () => {
  it('renders company, role, round and links to the session', () => {
    render(<SessionCard session={session} readiness={0.42} />);
    expect(screen.getByText('Houston Robotics')).toBeInTheDocument();
    expect(screen.getByText('Senior Front-End Engineer')).toBeInTheDocument();
    expect(screen.getByText('Onsite')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/interview-prep/houston'
    );
    expect(screen.getByTestId('ring')).toHaveTextContent('42');
  });
});
