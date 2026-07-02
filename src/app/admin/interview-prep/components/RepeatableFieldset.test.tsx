import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepeatableFieldset, type RepeatableField } from './RepeatableFieldset';

interface Row extends Record<string, string> {
  name: string;
  role: string;
}
const fields: RepeatableField<Row>[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
];
const empty: Row = { name: '', role: '' };

function Harness({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  return (
    <>
      <RepeatableFieldset
        legend="People"
        rows={rows}
        fields={fields}
        emptyRow={empty}
        onChange={setRows}
      />
      <output data-testid="count">{rows.length}</output>
      <output data-testid="dump">{JSON.stringify(rows)}</output>
    </>
  );
}

describe('RepeatableFieldset', () => {
  it('renders one field block per row', () => {
    render(
      <Harness
        initial={[
          { name: 'A', role: 'r1' },
          { name: 'B', role: 'r2' },
        ]}
      />
    );
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getAllByLabelText('Name')).toHaveLength(2);
  });

  it('appends an empty row on Add', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[]} />);
    await user.click(screen.getByRole('button', { name: 'Add People' }));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('dump').textContent).toBe(
      '[{"name":"","role":""}]'
    );
  });

  it('removes the targeted row by index', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        initial={[
          { name: 'A', role: 'r1' },
          { name: 'B', role: 'r2' },
        ]}
      />
    );
    await user.click(
      screen.getByRole('button', { name: 'Remove People entry 1' })
    );
    expect(screen.getByTestId('dump').textContent).toBe(
      '[{"name":"B","role":"r2"}]'
    );
  });

  it('edits only the targeted cell, immutably', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[{ name: 'A', role: 'r1' }]} />);
    await user.type(screen.getByLabelText('Name'), 'X');
    expect(screen.getByTestId('dump').textContent).toBe(
      '[{"name":"AX","role":"r1"}]'
    );
  });
});
