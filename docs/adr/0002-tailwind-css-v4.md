# ADR-0002: Use Tailwind CSS v4

**Date**: 2024-01-15
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio needs a styling solution that provides:

- Rapid UI development
- Consistent design system
- Dark mode support
- Small production bundle size
- TypeScript integration

## Decision

Use Tailwind CSS v4 with CSS custom properties for design tokens.

Key implementation details:

- Design tokens defined in `/src/styles/design-tokens.css`
- Custom color palette (Mocha Mousse, Navy)
- Gradient presets for consistent visual language
- Dark mode via `class` strategy with `dark:` variants

## Consequences

### Positive

- Rapid development with utility classes
- Consistent spacing, colors, typography
- Excellent dark mode support
- Small production CSS bundle (~30KB gzipped)
- Strong VS Code IntelliSense support
- CSS custom properties for runtime theming

### Negative

- HTML can become verbose with many classes
- Team members need Tailwind familiarity
- Custom designs may need @apply or custom utilities

### Neutral

- Design tokens live in CSS, not TypeScript
- Using CSS variables alongside Tailwind tokens

## Alternatives Considered

### Option A: CSS Modules

Scoped CSS with component co-location.

**Pros**: True CSS scoping, no learning curve
**Cons**: More boilerplate, no built-in design system

### Option B: Styled Components / Emotion

CSS-in-JS with runtime styling.

**Pros**: Dynamic styles, full TypeScript support
**Cons**: Runtime overhead, SSR complexity

### Option C: Vanilla Extract

Zero-runtime CSS-in-TypeScript.

**Pros**: Type-safe styles, no runtime
**Cons**: More setup, less flexible

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
