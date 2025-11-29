# ADR-0005: Use Framer Motion for Animations

**Date**: 2024-01-15
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio requires smooth, professional animations for:

- Page transitions
- Component entrance animations
- Interactive hover states
- Scroll-triggered reveals
- Modal and dropdown animations
- Staggered list animations

Requirements:

- Declarative animation API
- Spring physics for natural motion
- Gesture support
- Layout animations
- Respect `prefers-reduced-motion`

## Decision

Use Framer Motion as the primary animation library.

Key features utilized:

- `motion` components for animated elements
- `variants` for reusable animation states
- `AnimatePresence` for exit animations
- `useScroll` and `useTransform` for scroll effects
- `layout` prop for automatic layout transitions

## Consequences

### Positive

- Declarative, React-native API
- Excellent spring physics
- Built-in gesture handling
- Layout animations with `layoutId`
- Good TypeScript support
- Active development and community

### Negative

- Bundle size (~30KB minified)
- Client-side only (requires `'use client'`)
- Can impact performance if overused

### Neutral

- Need to wrap animated components
- Variants require planning

## Animation Standards

```typescript
// Standard transitions
const DURATION = {
  micro: 0.15,
  standard: 0.3,
  complex: 0.5,
  page: 0.6,
};

// Spring presets
const SPRING = {
  standard: { type: 'spring', stiffness: 300, damping: 30 },
  gentle: { type: 'spring', stiffness: 200, damping: 25 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
};
```

## Alternatives Considered

### Option A: CSS Animations

Native CSS transitions and keyframes.

**Pros**: No bundle size, performant, simple
**Cons**: Limited physics, no spring, harder to coordinate

### Option B: React Spring

Physics-based animation library.

**Pros**: Excellent physics, hooks-based, small bundle
**Cons**: Different API mental model, less features

### Option C: GSAP

Industry-standard animation library.

**Pros**: Powerful, extensive features, timeline support
**Cons**: Not React-native, imperative API, licensing for some features

## References

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Constants](/src/lib/animations.ts)
