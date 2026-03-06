# Design System Compliance Audit — Design

## Problem

The codebase has ~9 places where raw HTML elements (`<button>`, `<textarea>`, `<div>` with card-like styling) are used instead of the existing design system components (Button, Textarea, Card). This creates inconsistent styling, bypasses CVA variant systems, and makes future design changes harder to propagate.

Design system adoption is currently at ~85%. This audit brings it to ~95%+.

## Approach

**Approach B: Direct replacement + extend variants.** Replace all 9 violations with design system components, and add 2 new CVA variants to cover gaps.

## New Variants

### Button: `"code"` variant

For CopyCodeBlock's dark-themed copy button:

```
code: 'border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
```

The green "copied" success state is handled via conditional `className` (transient state, not a variant).

### Card: `"dashed"` variant

For GuestbookList's empty state with dashed border:

```
dashed: 'border-dashed shadow-none'
```

## Violations & Replacements

| #   | File                | Line(s) | Raw Element                      | Replacement                                    |
| --- | ------------------- | ------- | -------------------------------- | ---------------------------------------------- |
| 1   | `GuestbookForm.tsx` | 109-139 | `<motion.div>` with card classes | `cardVariants()` on motion.div                 |
| 2   | `GuestbookForm.tsx` | 152-258 | `<motion.div>` with card classes | `cardVariants()` on motion.div                 |
| 3   | `GuestbookForm.tsx` | 180-187 | `<button>` (Sign out)            | `<Button variant="ghost" size="sm">`           |
| 4   | `GuestbookForm.tsx` | 192-202 | `<textarea>`                     | `<Textarea size="sm" className="resize-none">` |
| 5   | `GuestbookList.tsx` | 28      | `<div>` with card classes        | `<Card>` with hover overrides                  |
| 6   | `GuestbookList.tsx` | 64      | `<div>` with dashed border       | `<Card variant="dashed">`                      |
| 7   | `CopyCodeBlock.tsx` | 42-51   | `<button>` (Copy)                | `<Button variant="code" size="sm">`            |
| 8   | `ErrorBoundary.tsx` | 147-151 | `<button>` (Try Again)           | `<Button>`                                     |
| 9   | `CommandMenu.tsx`   | 82      | `<div>` with card classes        | `<Card padding="none">`                        |

## Motion + Card Integration

GuestbookForm uses `<motion.div>` for entry animations. Two options:

- **Option A (chosen)**: Apply `cardVariants()` classes to the `motion.div` directly via `className={cn(cardVariants(), "...")}`. Avoids nesting and keeps animation props clean.
- Option B: Use `motion.create(Card)` — creates a motion-enabled Card. More idiomatic but adds Framer Motion coupling.

## Execution Order

### Batch 1: Variant Additions

- Add `code` variant to `Button.tsx`
- Add `dashed` variant to `Card.tsx`
- Add test cases for both new variants

### Batch 2: Replacements (5 files, 9 changes)

- GuestbookForm.tsx (4 changes)
- GuestbookList.tsx (2 changes)
- CopyCodeBlock.tsx (1 change)
- ErrorBoundary.tsx (1 change)
- CommandMenu.tsx (1 change)

### Batch 3: Verification

- `npx vitest run` — all tests pass
- `npm run check` — type-check + lint + format
- Grep for remaining raw elements to confirm no regressions

## Files Changed

| File                                        | Action                        |
| ------------------------------------------- | ----------------------------- |
| `src/components/ui/Button.tsx`              | Add `code` variant            |
| `src/components/ui/Button.test.tsx`         | Add test for `code` variant   |
| `src/components/ui/Card.tsx`                | Add `dashed` variant          |
| `src/components/ui/Card.test.tsx`           | Add test for `dashed` variant |
| `src/components/sections/GuestbookForm.tsx` | Replace 4 raw elements        |
| `src/components/sections/GuestbookList.tsx` | Replace 2 raw elements        |
| `src/components/ui/CopyCodeBlock.tsx`       | Replace raw button            |
| `src/components/ui/ErrorBoundary.tsx`       | Replace raw button            |
| `src/components/ui/CommandMenu.tsx`         | Replace card-like div         |

## Success Criteria

- All existing tests pass (494+ tests)
- New variant tests pass
- `npm run check` clean
- No raw `<button>` elements outside of design system component definitions
- No card-like div patterns (`rounded-* border border-border bg-card`) outside Card component
- No raw `<textarea>` outside Textarea component
