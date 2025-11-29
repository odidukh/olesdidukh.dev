# ADR-0003: Use Zustand for State Management

**Date**: 2024-10-15
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio application needs global state management for:

- Theme preference (dark/light/system mode)
- Filter states (projects, blog)
- UI preferences (reduced motion, compact layout)
- PWA install prompt state

Requirements:

- Minimal bundle size
- TypeScript support
- localStorage persistence
- Simple API without boilerplate
- React Server Components compatibility

## Decision

Use Zustand with the persist middleware for state management.

Stores created:

- `useThemeStore` - Theme mode with system preference sync
- `useProjectsFilterStore` - Project filtering and view mode
- `useBlogFilterStore` - Blog filtering and sort preferences
- `useUIPreferencesStore` - Global UI preferences

## Consequences

### Positive

- Tiny bundle size (~2.1KB)
- Simple API with hooks
- Built-in persist middleware
- No providers needed at root
- Excellent TypeScript support
- Works well with Server Components

### Negative

- Less opinionated than Redux (needs conventions)
- Middleware composition can be complex
- Devtools less featured than Redux DevTools

### Neutral

- State exists outside React (can be good or bad)
- No action types or reducers (different paradigm)

## Alternatives Considered

### Option A: Redux Toolkit

Industry-standard state management.

**Pros**: Powerful devtools, time-travel debugging, large ecosystem
**Cons**: More boilerplate, larger bundle, complex setup

### Option B: Jotai

Atomic state management.

**Pros**: Fine-grained updates, simple atoms, small bundle
**Cons**: Different mental model, persistence setup

### Option C: React Context

Built-in React state management.

**Pros**: No dependencies, native to React
**Cons**: Performance issues at scale, no persistence

## Implementation Notes

```typescript
// Example store pattern
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolvedTheme: 'light',
      setMode: mode => {
        /* ... */
      },
      toggleTheme: () => {
        /* ... */
      },
    }),
    {
      name: 'theme-storage',
      partialize: state => ({ mode: state.mode }),
    }
  )
);
```

## References

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
