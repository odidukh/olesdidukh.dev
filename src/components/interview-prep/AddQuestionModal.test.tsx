import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddQuestionModal } from './AddQuestionModal';
import { addCustomQuestion } from '@/app/interview-prep/actions';

vi.mock('@/app/interview-prep/actions', () => ({
  addCustomQuestion: vi.fn(() => Promise.resolve({ success: true })),
  deleteCustomQuestion: vi.fn(),
  resetSessionProgress: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

describe('AddQuestionModal', () => {
  it('opens the dialog and submits a valid custom question', async () => {
    const user = userEvent.setup();
    render(<AddQuestionModal categories={[]} />);
    await user.click(
      screen.getByRole('button', { name: /add custom question/i })
    );
    await user.type(
      screen.getByLabelText('Question'),
      'Explain the event loop'
    );
    await user.click(screen.getByRole('button', { name: /^add question$/i }));
    await waitFor(() =>
      expect(addCustomQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          question: 'Explain the event loop',
          difficulty: 'medium',
          category_id: null,
        })
      )
    );
  });
});
