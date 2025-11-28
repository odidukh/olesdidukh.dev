import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { render, screen } from '@/test/test-utils';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders with default text', () => {
    render(<SkipLink />);

    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<SkipLink>Skip to navigation</SkipLink>);

    expect(screen.getByText('Skip to navigation')).toBeInTheDocument();
  });

  it('has default href to #main-content', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('accepts custom href', () => {
    render(<SkipLink href="#nav">Skip</SkipLink>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#nav');
  });

  it('is visually hidden by default', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
  });

  it('becomes visible on focus', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:not-sr-only');
  });

  it('passes accessibility audit', async () => {
    const { container } = render(<SkipLink />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
