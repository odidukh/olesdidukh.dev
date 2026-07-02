import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReadinessRing } from './ReadinessRing';
import { useReducedMotion } from '@/hooks/useReducedMotion';

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

const motionCircleSpy = vi.fn();

vi.mock('framer-motion', () => ({
  motion: {
    circle: ({
      initial, // eslint-disable-line @typescript-eslint/no-unused-vars
      animate, // eslint-disable-line @typescript-eslint/no-unused-vars
      transition, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    }: Record<string, unknown>) => {
      motionCircleSpy();
      return <circle {...rest} />;
    },
  },
}));

describe('ReadinessRing', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    motionCircleSpy.mockClear();
  });

  afterEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

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

  it('treats non-finite values as 0', () => {
    render(<ReadinessRing value={NaN} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('exposes an accessible label', () => {
    render(<ReadinessRing value={0.4} label="Overall" />);
    expect(
      screen.getByRole('img', { name: 'Overall: 40 percent' })
    ).toBeInTheDocument();
  });

  it('renders an animated motion.circle when motion is not reduced', () => {
    render(<ReadinessRing value={0.5} />);
    expect(motionCircleSpy).toHaveBeenCalled();
  });

  it('renders a static circle (no motion.circle) when motion is reduced', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<ReadinessRing value={0.5} />);
    expect(motionCircleSpy).not.toHaveBeenCalled();
  });
});
