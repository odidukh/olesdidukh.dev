import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField, FormInput, FormTextarea } from './FormField';
import { Input } from './Input';

describe('FormField', () => {
  describe('basic rendering', () => {
    it('renders children', () => {
      render(
        <FormField>
          <Input placeholder="Enter text" />
        </FormField>
      );
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(
        <FormField label="Email">
          <Input id="email" />
        </FormField>
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('associates label with input by id', () => {
      render(
        <FormField label="Username">
          <Input id="username" />
        </FormField>
      );
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username');
    });
  });

  describe('validation states', () => {
    it('displays error message', () => {
      render(
        <FormField label="Email" error="Invalid email address">
          <Input id="email" />
        </FormField>
      );
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toHaveClass(
        'text-destructive'
      );
    });

    it('displays success message', () => {
      render(
        <FormField label="Email" success="Email is valid">
          <Input id="email" />
        </FormField>
      );
      expect(screen.getByText('Email is valid')).toBeInTheDocument();
      expect(screen.getByText('Email is valid')).toHaveClass('text-success');
    });

    it('displays hint text', () => {
      render(
        <FormField label="Password" hint="Must be at least 8 characters">
          <Input id="password" type="password" />
        </FormField>
      );
      expect(
        screen.getByText('Must be at least 8 characters')
      ).toBeInTheDocument();
      expect(screen.getByText('Must be at least 8 characters')).toHaveClass(
        'text-muted-foreground'
      );
    });

    it('prioritizes error over success and hint', () => {
      render(
        <FormField
          label="Email"
          error="Error message"
          success="Success message"
          hint="Hint message"
        >
          <Input id="email" />
        </FormField>
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.queryByText('Hint message')).not.toBeInTheDocument();
    });

    it('shows success when no error', () => {
      render(
        <FormField label="Email" success="Success message" hint="Hint message">
          <Input id="email" />
        </FormField>
      );
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.queryByText('Hint message')).not.toBeInTheDocument();
    });
  });

  describe('required and optional indicators', () => {
    it('shows required indicator on label via CSS', () => {
      render(
        <FormField label="Name" required>
          <Input id="name" />
        </FormField>
      );
      const label = screen.getByText('Name');
      // Required indicator is rendered via CSS after:content-["*"]
      expect(label).toHaveClass('after:content-["*"]');
    });

    it('shows optional indicator on label', () => {
      render(
        <FormField label="Phone" optional>
          <Input id="phone" />
        </FormField>
      );
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <FormField label="Test" className="my-custom-class">
          <Input id="test" />
        </FormField>
      );
      const field = container.querySelector('.my-custom-class');
      expect(field).toBeInTheDocument();
    });
  });
});

describe('FormInput', () => {
  it('renders input with label', () => {
    render(<FormInput label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error state on input', () => {
    render(<FormInput label="Email" error="Invalid email" id="email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows success state on input', () => {
    render(<FormInput label="Email" success="Looks good!" id="email" />);
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
  });

  it('forwards input props', async () => {
    const user = userEvent.setup();
    render(<FormInput label="Email" placeholder="Enter email" id="email" />);

    const input = screen.getByPlaceholderText('Enter email');
    await user.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');
  });

  it('applies fieldClassName to FormField', () => {
    render(
      <FormInput
        label="Email"
        fieldClassName="custom-field"
        data-testid="input"
        id="email"
      />
    );
    const field = screen.getByTestId('input').closest('.custom-field');
    expect(field).toBeInTheDocument();
  });

  it('shows required indicator via CSS', () => {
    render(<FormInput label="Email" required id="email" />);
    const label = screen.getByText('Email');
    expect(label).toHaveClass('after:content-["*"]');
  });
});

describe('FormTextarea', () => {
  it('renders textarea with label', () => {
    render(<FormTextarea label="Message" id="message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('shows error state on textarea', () => {
    render(<FormTextarea label="Message" error="Too short" id="message" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards textarea props', async () => {
    const user = userEvent.setup();
    render(
      <FormTextarea label="Message" placeholder="Enter message" id="message" />
    );

    const textarea = screen.getByPlaceholderText('Enter message');
    await user.type(textarea, 'Hello world');
    expect(textarea).toHaveValue('Hello world');
  });

  it('shows hint text', () => {
    render(<FormTextarea label="Bio" hint="Max 500 characters" id="bio" />);
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });
});
