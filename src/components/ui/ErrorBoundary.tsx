'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { captureException, addBreadcrumb, setContext } from '@/lib/sentry';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackRender?: (props: FallbackProps) => React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface FallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
  sectionName?: string | undefined;
}

/**
 * Error Boundary component for catching and handling React errors
 * Integrates with Sentry for error reporting
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, sectionName } = this.props;

    // Add breadcrumb for context
    addBreadcrumb({
      message: `Error caught in ${sectionName || 'ErrorBoundary'}`,
      category: 'error-boundary',
      level: 'error',
      data: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Set context for the error
    if (sectionName) {
      setContext('error_boundary', {
        section: sectionName,
        componentStack: errorInfo.componentStack,
      });
    }

    // Report to Sentry
    captureException(error, {
      section: sectionName,
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler if provided
    onError?.(error, errorInfo);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${sectionName || 'component'}:`, error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, fallbackRender, sectionName } = this.props;

    if (hasError) {
      // Use custom fallback render function if provided
      if (fallbackRender) {
        return fallbackRender({
          error,
          resetErrorBoundary: this.resetErrorBoundary,
          sectionName,
        });
      }

      // Use static fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback
      return (
        <DefaultErrorFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          sectionName={sectionName}
        />
      );
    }

    return children;
  }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({
  error,
  resetErrorBoundary,
  sectionName,
}: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/5 border border-destructive/20 rounded-lg">
      <AlertTriangle className="w-12 h-12 mb-4 text-destructive" />

      <h3 className="text-lg font-semibold text-destructive mb-2">
        {sectionName ? `Error loading ${sectionName}` : 'Something went wrong'}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        We encountered an unexpected error. Please try again or refresh the
        page.
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <pre className="text-xs text-left bg-destructive/10 p-3 rounded mb-4 max-w-full overflow-auto">
          {error.message}
        </pre>
      )}

      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

/**
 * Higher-order component to wrap a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
