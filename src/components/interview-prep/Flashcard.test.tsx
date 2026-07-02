import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Flashcard } from './Flashcard';

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));

describe('Flashcard (reduced motion)', () => {
  it('shows the front when not flipped and the back when flipped', () => {
    const { rerender } = render(
      <Flashcard
        front={<span>the question</span>}
        back={<span>the answer</span>}
        flipped={false}
        onFlip={() => {}}
      />
    );
    expect(screen.getByText('the question')).toBeInTheDocument();
    expect(screen.queryByText('the answer')).not.toBeInTheDocument();
    rerender(
      <Flashcard
        front={<span>the question</span>}
        back={<span>the answer</span>}
        flipped
        onFlip={() => {}}
      />
    );
    expect(screen.getByText('the answer')).toBeInTheDocument();
  });

  it('calls onFlip when clicked', async () => {
    const onFlip = vi.fn();
    const user = userEvent.setup();
    render(
      <Flashcard
        front={<span>q</span>}
        back={<span>a</span>}
        flipped={false}
        onFlip={onFlip}
      />
    );
    await user.click(screen.getByRole('button'));
    expect(onFlip).toHaveBeenCalledTimes(1);
  });
});
