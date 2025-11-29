# ADR-0006: Testing Strategy with Vitest and Playwright

**Date**: 2024-09-01
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio needs comprehensive testing to ensure:

- Component behavior correctness
- API endpoint reliability
- Form validation accuracy
- Visual consistency across browsers
- Performance metrics targets
- Accessibility compliance

## Decision

Implement a multi-layer testing strategy:

1. **Unit/Component Tests**: Vitest + React Testing Library
2. **E2E Tests**: Playwright
3. **Visual Regression**: Playwright screenshots
4. **Performance Tests**: Playwright + Web Vitals

### Test Categories

- `/src/**/*.test.tsx` - Component tests
- `/src/app/api/**/*.test.ts` - API route tests
- `/e2e/*.spec.ts` - End-to-end tests

## Consequences

### Positive

- Fast unit tests with Vitest (native ESM)
- Cross-browser E2E with Playwright
- Visual regression catches UI changes
- Performance budgets enforced in CI
- Good TypeScript support

### Negative

- Multiple testing tools to maintain
- Screenshot tests require baseline updates
- E2E tests slower than unit tests

### Neutral

- Tests require mocking for external services
- Different assertion APIs between Vitest and Playwright

## Test Coverage

| Type              | Coverage | Location             |
| ----------------- | -------- | -------------------- |
| Unit/Component    | 141+     | `/src/**/*.test.tsx` |
| API Routes        | 15+      | `/src/app/api/`      |
| E2E               | 25+      | `/e2e/`              |
| Visual Regression | 20+      | `/e2e/`              |
| Performance       | 6        | `/e2e/`              |

## Performance Targets

```typescript
const WEB_VITALS_TARGETS = {
  LCP: 2500, // ms
  FCP: 1800, // ms
  CLS: 0.1,
  TTFB: 800, // ms
  INP: 200, // ms
};
```

## Alternatives Considered

### Option A: Jest + Cypress

Traditional testing stack.

**Pros**: Well-established, extensive documentation
**Cons**: Jest slower than Vitest, Cypress paid features

### Option B: Testing Library Only

Minimal testing approach.

**Pros**: Simple, lightweight
**Cons**: No E2E, no visual regression

## References

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
