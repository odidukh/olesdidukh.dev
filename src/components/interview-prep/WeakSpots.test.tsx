import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeakSpots } from './WeakSpots';

describe('WeakSpots', () => {
  it('lists weak questions linking to the study tab', () => {
    render(
      <WeakSpots
        slug="houston"
        items={[{ questionId: 'q1', question: 'Explain hydration' }]}
      />
    );
    expect(screen.getByText('Explain hydration')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /practice/i })).toHaveAttribute(
      'href',
      '/interview-prep/houston/study'
    );
  });

  it('shows an encouraging empty state when there are none', () => {
    render(<WeakSpots slug="houston" items={[]} />);
    expect(screen.getByText('No weak spots — great work!')).toBeInTheDocument();
  });
});
