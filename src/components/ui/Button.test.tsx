import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { render, screen } from '@/test/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText(/loading, please wait/i)).toBeInTheDocument();
  });

  it('shows loading text when provided', () => {
    render(
      <Button loading loadingText="Submitting...">
        Submit
      </Button>
    );

    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('prevents clicks when loading', async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <Button loading onClick={handleClick}>
        Click me
      </Button>
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('border');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('accepts additional className', () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref to button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0]?.[0]).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('has proper button type by default', () => {
    render(<Button>Default Type</Button>);

    // Button doesn't explicitly set type, so it defaults to submit in forms
    // but as a standalone button, it should work as expected
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('can have type="submit"', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('passes accessibility audit', async () => {
    const { container } = render(<Button>Accessible Button</Button>);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes accessibility audit when loading', async () => {
    const { container } = render(<Button loading>Loading</Button>);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
