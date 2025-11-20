import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { Input, type InputProps } from './Input';
import { Textarea, type TextareaProps } from './Textarea';

interface FormFieldProps {
  label?: string | undefined;
  error?: string | undefined;
  success?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  optional?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, error, success, hint, required, optional, className, children },
    ref
  ) => {
    const childId = React.isValidElement(children)
      ? (children.props as { id?: string }).id
      : undefined;

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={childId}
            required={required}
            optional={optional}
            variant={error ? 'error' : success ? 'success' : 'default'}
          >
            {label}
          </Label>
        )}
        {children}
        {(hint || error || success) && (
          <p
            className={cn(
              'text-xs',
              error && 'text-destructive',
              success && 'text-success',
              !error && !success && 'text-muted-foreground'
            )}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

// Convenience component for Input with FormField
interface FormInputProps extends Omit<InputProps, 'error' | 'success'> {
  label?: string | undefined;
  error?: string | undefined;
  success?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  optional?: boolean | undefined;
  fieldClassName?: string | undefined;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      required,
      optional,
      fieldClassName,
      ...inputProps
    },
    ref
  ) => {
    return (
      <FormField
        label={label}
        error={error}
        success={success}
        hint={hint}
        required={required}
        optional={optional}
        className={fieldClassName}
      >
        <Input ref={ref} error={!!error} success={!!success} {...inputProps} />
      </FormField>
    );
  }
);
FormInput.displayName = 'FormInput';

// Convenience component for Textarea with FormField
interface FormTextareaProps extends Omit<TextareaProps, 'error' | 'success'> {
  label?: string | undefined;
  error?: string | undefined;
  success?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  optional?: boolean | undefined;
  fieldClassName?: string | undefined;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      success,
      hint,
      required,
      optional,
      fieldClassName,
      ...textareaProps
    },
    ref
  ) => {
    return (
      <FormField
        label={label}
        error={error}
        success={success}
        hint={hint}
        required={required}
        optional={optional}
        className={fieldClassName}
      >
        <Textarea
          ref={ref}
          error={!!error}
          success={!!success}
          {...textareaProps}
        />
      </FormField>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';

export { FormField, FormInput, FormTextarea };
