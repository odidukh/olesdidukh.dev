import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { render, screen } from '@/test/test-utils';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with default variant and size', () => {
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('min-h-[80px]'); // md size
  });

  it('handles change events', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Textarea placeholder="Type here" onChange={handleChange} />
    );

    await user.type(screen.getByPlaceholderText('Type here'), 'hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Textarea disabled placeholder="Disabled" />);

    const textarea = screen.getByPlaceholderText('Disabled');
    expect(textarea).toBeDisabled();
  });

  it('can be required', () => {
    render(<Textarea required placeholder="Required" />);

    const textarea = screen.getByPlaceholderText('Required');
    expect(textarea).toBeRequired();
  });

  it('applies error variant when error prop is true', () => {
    render(<Textarea error placeholder="Error textarea" />);

    const textarea = screen.getByPlaceholderText('Error textarea');
    expect(textarea).toHaveClass('border-destructive');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies success variant when success prop is true', () => {
    render(<Textarea success placeholder="Success textarea" />);

    const textarea = screen.getByPlaceholderText('Success textarea');
    expect(textarea).toHaveClass('border-success');
  });

  it('applies warning variant', () => {
    render(<Textarea variant="warning" placeholder="Warning textarea" />);

    const textarea = screen.getByPlaceholderText('Warning textarea');
    expect(textarea).toHaveClass('border-warning');
  });

  it('error prop takes precedence over variant', () => {
    render(
      <Textarea error variant="success" placeholder="Error over success" />
    );

    const textarea = screen.getByPlaceholderText('Error over success');
    expect(textarea).toHaveClass('border-destructive');
    expect(textarea).not.toHaveClass('border-success');
  });

  it('applies small size', () => {
    render(<Textarea size="sm" placeholder="Small textarea" />);

    const textarea = screen.getByPlaceholderText('Small textarea');
    expect(textarea).toHaveClass('min-h-[60px]');
    expect(textarea).toHaveClass('text-xs');
  });

  it('applies large size', () => {
    render(<Textarea size="lg" placeholder="Large textarea" />);

    const textarea = screen.getByPlaceholderText('Large textarea');
    expect(textarea).toHaveClass('min-h-[120px]');
  });

  it('applies xl size', () => {
    render(<Textarea size="xl" placeholder="XL textarea" />);

    const textarea = screen.getByPlaceholderText('XL textarea');
    expect(textarea).toHaveClass('min-h-[160px]');
  });

  it('accepts additional className', () => {
    render(<Textarea className="custom-class" placeholder="Custom class" />);

    expect(screen.getByPlaceholderText('Custom class')).toHaveClass(
      'custom-class'
    );
  });

  it('forwards ref to textarea element', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} placeholder="Ref textarea" />);

    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0]?.[0]).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('handles value prop', () => {
    const handleChange = vi.fn();
    render(
      <Textarea value="controlled" onChange={handleChange} placeholder="test" />
    );

    const textarea = screen.getByPlaceholderText('test');
    expect(textarea).toHaveValue('controlled');
  });

  it('handles defaultValue prop', () => {
    render(<Textarea defaultValue="default" placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveValue('default');
  });

  it('supports name attribute', () => {
    render(<Textarea name="message" placeholder="Message" />);

    expect(screen.getByPlaceholderText('Message')).toHaveAttribute(
      'name',
      'message'
    );
  });

  it('supports id attribute', () => {
    render(<Textarea id="my-textarea" placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveAttribute(
      'id',
      'my-textarea'
    );
  });

  it('supports rows attribute', () => {
    render(<Textarea rows={5} placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveAttribute('rows', '5');
  });

  it('supports cols attribute', () => {
    render(<Textarea cols={40} placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveAttribute('cols', '40');
  });

  it('supports maxLength attribute', () => {
    render(<Textarea maxLength={500} placeholder="test" />);

    expect(screen.getByPlaceholderText('test')).toHaveAttribute(
      'maxLength',
      '500'
    );
  });

  it('applies resize-none class when autoResize is true', () => {
    render(<Textarea autoResize placeholder="Auto resize" />);

    const textarea = screen.getByPlaceholderText('Auto resize');
    expect(textarea).toHaveClass('resize-none');
  });

  it('passes accessibility audit', async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-textarea">Message</label>
        <Textarea id="test-textarea" placeholder="Enter message" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes accessibility audit with error state', async () => {
    const { container } = render(
      <div>
        <label htmlFor="error-textarea">Message</label>
        <Textarea id="error-textarea" error placeholder="Invalid message" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles multiline text', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Textarea placeholder="test" onChange={handleChange} />
    );

    await user.type(screen.getByPlaceholderText('test'), 'line1\nline2\nline3');

    expect(screen.getByPlaceholderText('test')).toHaveValue(
      'line1\nline2\nline3'
    );
  });
});
