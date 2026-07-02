import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionTabs } from './SessionTabs';

vi.mock('next/navigation', () => ({
  usePathname: () => '/interview-prep/houston/dashboard',
}));

describe('SessionTabs', () => {
  it('renders all six tabs linking to the session sub-routes', () => {
    render(<SessionTabs slug="houston" />);
    const labels = [
      'Briefing',
      'Dashboard',
      'Study',
      'Mock',
      'Question Bank',
      'Stories',
    ];
    for (const label of labels) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Study' })).toHaveAttribute(
      'href',
      '/interview-prep/houston/study'
    );
  });

  it('marks the active tab with aria-current based on the pathname', () => {
    render(<SessionTabs slug="houston" />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Study' })).not.toHaveAttribute(
      'aria-current'
    );
  });
});
