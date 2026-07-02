import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteQuestionButton } from './DeleteQuestionButton';
import { deleteCustomQuestion } from '@/app/interview-prep/actions';

vi.mock('@/app/interview-prep/actions', () => ({
  deleteCustomQuestion: vi.fn(() => Promise.resolve({ success: true })),
  addCustomQuestion: vi.fn(),
  resetSessionProgress: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

describe('DeleteQuestionButton', () => {
  it('confirms then calls deleteCustomQuestion with the id', async () => {
    const user = userEvent.setup();
    render(<DeleteQuestionButton id="q1" />);
    await user.click(screen.getByRole('button', { name: /delete question/i }));
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() =>
      expect(deleteCustomQuestion).toHaveBeenCalledWith('q1')
    );
  });
});
