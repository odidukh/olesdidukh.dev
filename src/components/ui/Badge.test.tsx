import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with default styles', () => {
    render(<Badge>Default</Badge>);

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-success');

    rerender(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-destructive');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('text-[10px]');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('text-sm');
  });

  it('applies rounded classes', () => {
    const { rerender } = render(<Badge rounded="full">Full</Badge>);
    expect(screen.getByText('Full')).toHaveClass('rounded-full');

    rerender(<Badge rounded="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toHaveClass('rounded-md');
  });

  it('renders with icon', () => {
    render(<Badge icon={<span data-testid="icon">★</span>}>With Icon</Badge>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders remove button when onRemove is provided', () => {
    const handleRemove = vi.fn();
    render(<Badge onRemove={handleRemove}>Removable</Badge>);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const handleRemove = vi.fn();
    const { user } = render(<Badge onRemove={handleRemove}>Removable</Badge>);

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('does not render remove button when onRemove is not provided', () => {
    render(<Badge>No Remove</Badge>);

    expect(
      screen.queryByRole('button', { name: /remove/i })
    ).not.toBeInTheDocument();
  });

  it('accepts additional className', () => {
    render(<Badge className="custom-class">Custom</Badge>);

    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('forwards ref to div element', () => {
    const ref = vi.fn();
    render(<Badge ref={ref}>Ref Badge</Badge>);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0]?.[0]).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional props to div', () => {
    render(<Badge data-testid="custom-badge">Props</Badge>);

    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });
});
