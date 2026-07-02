import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReadinessRing } from './ReadinessRing';

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => false }));
vi.mock('framer-motion', () => ({
  motion: {
    circle: ({
      initial, // eslint-disable-line @typescript-eslint/no-unused-vars
      animate, // eslint-disable-line @typescript-eslint/no-unused-vars
      transition, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    }: Record<string, unknown>) => <circle {...rest} />,
  },
}));

describe('ReadinessRing', () => {
  it('renders the value as a rounded percentage', () => {
    render(<ReadinessRing value={0.75} label="Readiness" />);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Readiness')).toBeInTheDocument();
  });

  it('clamps out-of-range values to 0–100', () => {
    const { rerender } = render(<ReadinessRing value={1.5} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    rerender(<ReadinessRing value={-0.5} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('exposes an accessible label', () => {
    render(<ReadinessRing value={0.4} label="Overall" />);
    expect(
      screen.getByRole('img', { name: 'Overall: 40 percent' })
    ).toBeInTheDocument();
  });
});
