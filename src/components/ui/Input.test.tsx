import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { render, screen } from '@/test/test-utils';
import { Input } from './Input';

describe('Input', () => {
  it('renders with default variant and size', () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('h-10'); // md size
  });

  it('handles change events', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Input placeholder="Type here" onChange={handleChange} />
    );

    await user.type(screen.getByPlaceholderText('Type here'), 'hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />);

    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  it('can be required', () => {
    render(<Input required placeholder="Required" />);

    const input = screen.getByPlaceholderText('Required');
    expect(input).toBeRequired();
  });

  it('applies error variant when error prop is true', () => {
    render(<Input error placeholder="Error input" />);

    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass('border-destructive');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies success variant when success prop is true', () => {
    render(<Input success placeholder="Success input" />);

    const input = screen.getByPlaceholderText('Success input');
    expect(input).toHaveClass('border-success');
  });

  it('applies warning variant', () => {
    render(<Input variant="warning" placeholder="Warning input" />);

    const input = screen.getByPlaceholderText('Warning input');
    expect(input).toHaveClass('border-warning');
  });

  it('error prop takes precedence over variant', () => {
    render(<Input error variant="success" placeholder="Error over success" />);

    const input = screen.getByPlaceholderText('Error over success');
    expect(input).toHaveClass('border-destructive');
    expect(input).not.toHaveClass('border-success');
  });

  it('applies small size', () => {
    render(<Input inputSize="sm" placeholder="Small input" />);

    const input = screen.getByPlaceholderText('Small input');
    expect(input).toHaveClass('h-8');
    expect(input).toHaveClass('text-xs');
  });

  it('applies large size', () => {
    render(<Input inputSize="lg" placeholder="Large input" />);

    const input = screen.getByPlaceholderText('Large input');
    expect(input).toHaveClass('h-12');
  });

  it('applies xl size', () => {
    render(<Input inputSize="xl" placeholder="XL input" />);

    const input = screen.getByPlaceholderText('XL input');
    expect(input).toHaveClass('h-14');
  });

  it('renders with left icon', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">🔍</span>}
        placeholder="With left icon"
      />
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('With left icon')).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    render(
      <Input
        rightIcon={<span data-testid="right-icon">✓</span>}
        placeholder="With right icon"
      />
    );

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('With right icon')).toHaveClass('pr-10');
  });

  it('renders with both icons', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">✓</span>}
        placeholder="With both icons"
      />
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('With both icons');
    expect(input).toHaveClass('pl-10');
    expect(input).toHaveClass('pr-10');
  });

  it('accepts additional className', () => {
    render(<Input className="custom-class" placeholder="Custom class" />);

    expect(screen.getByPlaceholderText('Custom class')).toHaveClass(
      'custom-class'
    );
  });

  it('forwards ref to input element', () => {
    const ref = vi.fn();
    render(<Input ref={ref} placeholder="Ref input" />);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0]?.[0]).toBeInstanceOf(HTMLInputElement);
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
      'type',
      'email'
    );

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'type',
      'password'
    );

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute(
      'type',
      'number'
    );
  });

  it('supports file input', () => {
    render(<Input type="file" data-testid="file-input" />);

    expect(screen.getByTestId('file-input')).toHaveAttribute('type', 'file');
  });

  it('handles value prop', async () => {
    const handleChange = vi.fn();
    render(
      <Input value="controlled" onChange={handleChange} placeholder="test" />
    );

    const input = screen.getByPlaceholderText('test');
    expect(input).toHaveValue('controlled');
  });

  it('handles defaultValue prop', () => {
    render(<Input defaultValue="default" placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveValue('default');
  });

  it('supports name attribute', () => {
    render(<Input name="email" placeholder="Email" />);

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
      'name',
      'email'
    );
  });

  it('supports id attribute', () => {
    render(<Input id="my-input" placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveAttribute(
      'id',
      'my-input'
    );
  });

  it('supports autoComplete attribute', () => {
    render(<Input autoComplete="email" placeholder="Email" />);

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
      'autoComplete',
      'email'
    );
  });

  it('passes accessibility audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-input">Email</label>
        <Input id="test-input" placeholder="Enter email" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes accessibility audit with error state', async () => {
    const { container } = render(
      <div>
        <label htmlFor="error-input">Email</label>
        <Input id="error-input" error placeholder="Invalid email" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes accessibility audit with icons', async () => {
    const { container } = render(
      <div>
        <label htmlFor="icon-input">Search</label>
        <Input
          id="icon-input"
          leftIcon={<span aria-hidden="true">🔍</span>}
          placeholder="Search..."
        />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
