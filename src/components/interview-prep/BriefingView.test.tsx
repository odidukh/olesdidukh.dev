import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BriefingView } from './BriefingView';
import type { InterviewSession } from '@/lib/supabase/types';

const base: InterviewSession = {
  id: 's1',
  slug: 'houston',
  company: 'Houston Robotics',
  role: 'Senior FE',
  round: 'Onsite',
  scheduled_at: null,
  status: 'upcoming',
  product: 'A fleet-ops dashboard.',
  interviewers: [{ name: 'Dana', role: 'EM', focus: 'System design' }],
  likely_topics: [
    { topic: 'Rendering perf', whereToDrill: 'Study deck: Performance' },
  ],
  your_numbers: [{ label: 'Users', value: '2.1M' }],
  bottom_line: 'Lead with impact.',
  stack_map: [{ theirTech: 'Next.js', yourStanding: 'Expert' }],
  focus_category_ids: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('BriefingView', () => {
  it('renders every populated briefing section', () => {
    render(<BriefingView session={base} />);
    expect(screen.getByText('A fleet-ops dashboard.')).toBeInTheDocument();
    expect(screen.getByText('Lead with impact.')).toBeInTheDocument();
    expect(screen.getByText('Dana')).toBeInTheDocument();
    expect(screen.getByText('Rendering perf')).toBeInTheDocument();
    expect(screen.getByText('2.1M')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('omits sections with no data', () => {
    render(
      <BriefingView
        session={{
          ...base,
          product: null,
          bottom_line: null,
          interviewers: [],
          likely_topics: [],
          your_numbers: [],
          stack_map: [],
        }}
      />
    );
    expect(screen.queryByText('Product')).not.toBeInTheDocument();
    expect(screen.queryByText('Interviewers')).not.toBeInTheDocument();
    expect(screen.getByText('No briefing details yet.')).toBeInTheDocument();
  });
});
