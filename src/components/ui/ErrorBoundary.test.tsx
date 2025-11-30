import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// Mock Sentry
vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  setContext: vi.fn(),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Suppress console.error for expected errors in tests
const originalConsoleError = console.error;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    console.error = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('error catching', () => {
    it('renders children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('catches errors and shows default fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try Again' })
      ).toBeInTheDocument();
    });

    it('shows section name in error message', () => {
      render(
        <ErrorBoundary sectionName="Projects">
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Error loading Projects')).toBeInTheDocument();
    });
  });

  describe('custom fallback', () => {
    it('renders static fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('renders fallbackRender when provided', () => {
      render(
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <p>Error: {error?.message}</p>
              <button onClick={resetErrorBoundary}>Reset</button>
            </div>
          )}
        >
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });

    it('passes sectionName to fallbackRender', () => {
      render(
        <ErrorBoundary
          sectionName="Blog"
          fallbackRender={({ sectionName }) => (
            <div>Failed to load: {sectionName}</div>
          )}
        >
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Failed to load: Blog')).toBeInTheDocument();
    });
  });

  describe('error recovery', () => {
    it('resets error state on Try Again click', () => {
      let shouldThrow = true;
      const TestComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Recovered</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click reset
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      // Force rerender to show recovered state
      rerender(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });

    it('calls onReset when reset is triggered', () => {
      const onReset = vi.fn();
      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('error callbacks', () => {
    it('calls onError with error and errorInfo', () => {
      const onError = vi.fn();
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('reports error to Sentry', async () => {
      const { captureException } = await import('@/lib/sentry');

      render(
        <ErrorBoundary sectionName="Test Section">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(captureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          section: 'Test Section',
          componentStack: expect.any(String),
        })
      );
    });

    it('adds breadcrumb for error context', async () => {
      const { addBreadcrumb } = await import('@/lib/sentry');

      render(
        <ErrorBoundary sectionName="Projects">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error caught in Projects',
          category: 'error-boundary',
          level: 'error',
        })
      );
    });

    it('sets Sentry context with section name', async () => {
      const { setContext } = await import('@/lib/sentry');

      render(
        <ErrorBoundary sectionName="Skills">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(setContext).toHaveBeenCalledWith(
        'error_boundary',
        expect.objectContaining({
          section: 'Skills',
        })
      );
    });
  });
});

describe('withErrorBoundary HOC', () => {
  beforeEach(() => {
    console.error = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('wraps component with error boundary', () => {
    const MyComponent = () => <div>My Component</div>;
    const WrappedComponent = withErrorBoundary(MyComponent);

    render(<WrappedComponent />);
    expect(screen.getByText('My Component')).toBeInTheDocument();
  });

  it('catches errors in wrapped component', () => {
    const WrappedComponent = withErrorBoundary(ThrowError);

    render(<WrappedComponent />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('passes error boundary props', () => {
    const WrappedComponent = withErrorBoundary(ThrowError, {
      sectionName: 'Wrapped Section',
    });

    render(<WrappedComponent />);
    expect(
      screen.getByText('Error loading Wrapped Section')
    ).toBeInTheDocument();
  });

  it('sets correct displayName', () => {
    const MyNamedComponent = () => <div>Content</div>;
    MyNamedComponent.displayName = 'MyNamedComponent';

    const WrappedComponent = withErrorBoundary(MyNamedComponent);
    expect(WrappedComponent.displayName).toBe(
      'withErrorBoundary(MyNamedComponent)'
    );
  });

  it('passes props to wrapped component', () => {
    interface Props {
      message: string;
    }
    const MyComponent = ({ message }: Props) => <div>{message}</div>;
    const WrappedComponent = withErrorBoundary(MyComponent);

    render(<WrappedComponent message="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
