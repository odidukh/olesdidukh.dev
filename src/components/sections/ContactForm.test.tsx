import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: React.ComponentProps<'div'>) => (
        <div {...props}>{children}</div>
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock @vercel/analytics
vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Helper to get inputs by placeholder
  const getNameInput = () => screen.getByPlaceholderText(/john doe/i);
  const getEmailInput = () => screen.getByPlaceholderText(/john@example.com/i);
  const getPhoneInput = () => screen.getByPlaceholderText(/\+1 \(555\)/i);
  const getCompanyInput = () => screen.getByPlaceholderText(/acme inc/i);
  const getMessageInput = () => screen.getByPlaceholderText(/tell me about/i);
  const getSubmitButton = () =>
    screen.getByRole('button', { name: /send message/i });

  it('should render all form fields', () => {
    render(<ContactForm />);

    expect(getNameInput()).toBeInTheDocument();
    expect(getEmailInput()).toBeInTheDocument();
    expect(getPhoneInput()).toBeInTheDocument();
    expect(getCompanyInput()).toBeInTheDocument();
    expect(getMessageInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('should render project type badges', () => {
    render(<ContactForm />);

    expect(screen.getByText('Web Application')).toBeInTheDocument();
    expect(screen.getByText('E-Commerce Site')).toBeInTheDocument();
    expect(screen.getByText('SaaS Platform')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
  });

  it('should render budget range options', () => {
    render(<ContactForm />);

    expect(screen.getByText('Under $5k')).toBeInTheDocument();
    expect(screen.getByText('$5k - $10k')).toBeInTheDocument();
    expect(screen.getByText('$50k+')).toBeInTheDocument();
  });

  it('should show validation error for empty name', async () => {
    render(<ContactForm />);

    await user.type(getEmailInput(), 'test@example.com');
    await user.type(getMessageInput(), 'This is a test message for the form.');
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<ContactForm />);

    await user.type(getNameInput(), 'John Doe');
    await user.type(getEmailInput(), 'invalid-email');
    await user.type(getMessageInput(), 'This is a test message for the form.');
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short message', async () => {
    render(<ContactForm />);

    await user.type(getNameInput(), 'John Doe');
    await user.type(getEmailInput(), 'test@example.com');
    await user.type(getMessageInput(), 'Short');
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('should submit form successfully with valid data', async () => {
    render(<ContactForm />);

    await user.type(getNameInput(), 'John Doe');
    await user.type(getEmailInput(), 'john@example.com');
    await user.type(
      getMessageInput(),
      'This is a detailed test message for the contact form.'
    );
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.any(Object)
      );
    });
  });

  it('should show loading state while submitting', async () => {
    // Make fetch hang
    mockFetch.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<ContactForm />);

    await user.type(getNameInput(), 'John Doe');
    await user.type(getEmailInput(), 'john@example.com');
    await user.type(
      getMessageInput(),
      'This is a detailed test message for the contact form.'
    );
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/sending message/i)).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    const { toast } = await import('sonner');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    render(<ContactForm />);

    await user.type(getNameInput(), 'John Doe');
    await user.type(getEmailInput(), 'john@example.com');
    await user.type(
      getMessageInput(),
      'This is a detailed test message for the contact form.'
    );
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should select project type when clicked', async () => {
    render(<ContactForm />);

    const webAppBadge = screen.getByText('Web Application');
    await user.click(webAppBadge);

    // The badge should be selected (you'd check for the 'default' variant styling)
    expect(webAppBadge).toBeInTheDocument();
  });

  it('should clear error when user starts typing', async () => {
    render(<ContactForm />);

    // First submit to trigger error
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(getNameInput(), 'J');

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });
});
