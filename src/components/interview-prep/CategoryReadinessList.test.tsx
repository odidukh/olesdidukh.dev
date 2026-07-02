import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CategoryReadinessList } from './CategoryReadinessList';

describe('CategoryReadinessList', () => {
  it('renders a labelled bar per category with a rounded percent', () => {
    render(
      <CategoryReadinessList
        items={[
          { id: 'c1', name: 'System Design', readiness: 0.5 },
          { id: 'c2', name: 'Behavioral', readiness: 1 },
        ]}
      />
    );
    expect(screen.getByText('System Design')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Behavioral')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
