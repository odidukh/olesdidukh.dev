# Contributing to Personal Website

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/odidukh/personal-website-v2.git
cd personal-website-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions/changes

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commits are validated by commitlint.

**Format:** `type(scope): description`

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD
- `chore` - Maintenance

**Examples:**

```bash
feat: add dark mode toggle
fix: resolve login redirect issue
docs: update API documentation
refactor(auth): simplify token validation
```

## Code Standards

### TypeScript

- Strict mode enabled
- No `any` types unless absolutely necessary
- Use interfaces for object shapes
- Export types from dedicated files in `src/types/`

### React

- Functional components only
- Use hooks for state and effects
- Prefer composition over inheritance
- Respect `prefers-reduced-motion` for animations

### Component Patterns

This project follows a consistent component architecture pattern:

#### UI Primitives (`src/components/ui/`)

Use `React.forwardRef()` for reusable UI primitives that may need ref forwarding:

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn('base-styles', className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

**Key requirements for UI primitives:**

- Use `React.forwardRef()` for ref forwarding support
- Set `displayName` for better debugging
- Extend appropriate HTML element attributes
- Support `className` prop with `cn()` utility
- Use `class-variance-authority` (cva) for variant styling

#### Section Components (`src/components/sections/`)

Use regular function components for page-level feature components:

```tsx
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function HeroSection() {
  // State and effects
  const [state, setState] = React.useState(false);

  return (
    <section id="hero" className="py-20">
      {/* Component content */}
    </section>
  );
}
```

**Key requirements for section components:**

- Use `'use client'` directive for client-side interactivity
- Regular function export (no forwardRef needed)
- Include semantic HTML (section, article, etc.)
- Add `id` attribute for navigation anchors

#### Memoization

Use `React.memo()` for list item components that receive props from parent:

```tsx
export const ProjectCard = React.memo(function ProjectCard({
  project,
  index,
}: ProjectCardProps) {
  // Component implementation
});

ProjectCard.displayName = 'ProjectCard';
```

### Styling

- Tailwind CSS for styling
- Use design tokens from `src/styles/design-tokens.css`
- Follow mobile-first approach
- Ensure dark mode compatibility

### File Organization

```
src/
├── app/           # Next.js App Router pages
├── components/
│   ├── sections/  # Page-level components
│   └── ui/        # Reusable UI primitives
├── data/          # Static data files
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── services/      # API abstractions
├── styles/        # Global styles
└── types/         # TypeScript types
```

## Quality Checks

Before submitting a PR, run:

```bash
# Full quality check (required)
npm run check

# Individual checks
npm run type-check    # TypeScript
npm run lint:strict   # ESLint
npm run format:check  # Prettier
npm run test:run      # Unit tests
```

### Pre-commit Hooks

Husky automatically runs:

1. `lint-staged` - Formats and lints staged files
2. `type-check` - Full TypeScript check
3. `commitlint` - Validates commit messages

## Pull Requests

### Before Submitting

- [ ] All checks pass (`npm run check`)
- [ ] Tests pass (`npm run test:run`)
- [ ] No console errors in browser
- [ ] Responsive design tested
- [ ] Dark mode tested
- [ ] Accessibility considered

### PR Template

```markdown
## Summary

Brief description of changes

## Changes

- Change 1
- Change 2

## Testing

How to test these changes

## Screenshots

If applicable
```

## Testing

### Unit Tests

```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # UI mode
```

### E2E Tests

```bash
npm run test:e2e    # Run Playwright tests
npm run test:e2e:ui # Interactive mode
```

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones

---

Thank you for contributing!
