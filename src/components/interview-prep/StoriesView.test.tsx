import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StoriesView } from './StoriesView';
import type { InterviewStory } from '@/lib/supabase/types';

const story: InterviewStory = {
  id: 'st1',
  slug: 'scaled-checkout',
  title: 'Scaled checkout to 2M users',
  company: 'Acme',
  situation: 'Checkout buckled under load.',
  task: 'Cut p95 latency in half.',
  action: 'Introduced edge caching and query batching.',
  result: 'p95 dropped 60%.',
  metrics: 'p95 −60%, conversion +4%',
  tags: ['performance', 'leadership'],
  sort_order: 0,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('StoriesView', () => {
  it('renders a STAR card with all four parts, metrics and tags', () => {
    render(<StoriesView stories={[story]} />);
    expect(screen.getByText('Scaled checkout to 2M users')).toBeInTheDocument();
    expect(
      screen.getByText('Checkout buckled under load.')
    ).toBeInTheDocument();
    expect(screen.getByText('Cut p95 latency in half.')).toBeInTheDocument();
    expect(
      screen.getByText('Introduced edge caching and query batching.')
    ).toBeInTheDocument();
    expect(screen.getByText('p95 dropped 60%.')).toBeInTheDocument();
    expect(screen.getByText('p95 −60%, conversion +4%')).toBeInTheDocument();
    expect(screen.getByText('performance')).toBeInTheDocument();
  });

  it('renders an empty state when there are no stories', () => {
    render(<StoriesView stories={[]} />);
    expect(screen.getByText('No stories yet.')).toBeInTheDocument();
  });
});
