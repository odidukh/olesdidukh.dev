import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResetProgressButton } from './ResetProgressButton';
import { resetSessionProgress } from '@/app/interview-prep/actions';
import {
  useInterviewProgressStore,
  defaultEntry,
} from '@/stores/useInterviewProgressStore';

vi.mock('@/app/interview-prep/actions', () => ({
  resetSessionProgress: vi.fn(() => Promise.resolve({ success: true })),
  addCustomQuestion: vi.fn(),
  deleteCustomQuestion: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  });
});

describe('ResetProgressButton', () => {
  it('resets the server and clears the store on confirm', async () => {
    useInterviewProgressStore
      .getState()
      .hydrate('s1', [{ ...defaultEntry('q1'), confidence: 3 }]);
    const user = userEvent.setup();
    render(<ResetProgressButton sessionId="s1" />);
    await user.click(screen.getByRole('button', { name: /reset progress/i }));
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() =>
      expect(resetSessionProgress).toHaveBeenCalledWith('s1')
    );
    expect(useInterviewProgressStore.getState().entries).toEqual({});
  });
});
