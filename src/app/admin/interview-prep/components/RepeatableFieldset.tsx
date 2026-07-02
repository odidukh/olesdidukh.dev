'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

export type RepeatableFieldType = 'input' | 'textarea';

export interface RepeatableField<T> {
  key: keyof T & string;
  label: string;
  type?: RepeatableFieldType;
  placeholder?: string;
}

interface RepeatableFieldsetProps<T extends Record<string, string>> {
  legend: string;
  rows: T[];
  fields: RepeatableField<T>[];
  emptyRow: T;
  onChange: (rows: T[]) => void;
  addLabel?: string;
}

export function RepeatableFieldset<T extends Record<string, string>>({
  legend,
  rows,
  fields,
  emptyRow,
  onChange,
  addLabel,
}: RepeatableFieldsetProps<T>) {
  const updateCell = (index: number, key: keyof T & string, value: string) => {
    onChange(
      rows.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };
  const removeRow = (index: number) =>
    onChange(rows.filter((_, i) => i !== index));
  const addRow = () => onChange([...rows, { ...emptyRow }]);

  return (
    <fieldset className="space-y-4 border border-border rounded-xl p-4">
      <legend className="px-1 text-sm font-medium text-foreground">
        {legend}
      </legend>
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No entries yet.</p>
      )}
      {rows.map((row, index) => (
        <div key={index} className="space-y-3 rounded-lg bg-muted/30 p-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Remove ${legend} entry ${index + 1}`}
              className="p-1 rounded hover:bg-error/10 text-muted-foreground hover:text-error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {fields.map(field => {
            const id = `${legend}-${index}-${field.key}`;
            return (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={id}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={id}
                    value={row[field.key]}
                    onChange={e => updateCell(index, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                  />
                ) : (
                  <Input
                    id={id}
                    value={row[field.key]}
                    onChange={e => updateCell(index, field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addRow}>
        <Plus className="w-4 h-4 mr-2" />
        {addLabel || `Add ${legend}`}
      </Button>
    </fieldset>
  );
}
