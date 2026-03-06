# Design System Compliance Audit — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace 9 raw HTML elements with design system components (Button, Card, Textarea) and add 2 new CVA variants to bring design system adoption from ~85% to ~95%+.

**Architecture:** Extend existing CVA variant objects in Button.tsx and Card.tsx, then swap raw elements in 5 consumer files. Motion-wrapped cards use `cardVariants()` via className rather than nesting Card inside motion.div.

**Tech Stack:** React 19, CVA (class-variance-authority), Framer Motion, Vitest + Testing Library

---

## Task 1: Add `code` variant to Button

**Files:**

- Modify: `src/components/ui/Button.tsx:16-49` (buttonVariants)
- Test: `src/components/ui/Button.test.tsx`

**Step 1: Write the failing test**

Add to the end of `src/components/ui/Button.test.tsx`, inside the `describe('Button', ...)` block:

```tsx
it('applies code variant classes', () => {
  render(<Button variant="code">Copy</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-gray-700');
  expect(button).toHaveClass('text-gray-300');
  expect(button).toHaveClass('border-gray-600');
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/Button.test.tsx`
Expected: FAIL — `code` is not a valid variant yet.

**Step 3: Add the variant**

In `src/components/ui/Button.tsx`, add inside the `variant` object of `buttonVariants` (after the `glow` entry):

```tsx
code: 'border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200',
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/Button.test.tsx`
Expected: PASS (all 16 tests)

**Step 5: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Button.test.tsx
git commit -m "feat: add code variant to Button component"
```

---

## Task 2: Add `dashed` variant to Card

**Files:**

- Modify: `src/components/ui/Card.tsx:12-34` (cardVariants)
- Test: `src/components/ui/Card.test.tsx`

**Step 1: Write the failing test**

Add to `src/components/ui/Card.test.tsx`, inside the `describe('Card component', ...)` block:

```tsx
it('applies dashed variant', () => {
  render(
    <Card variant="dashed" data-testid="card">
      Content
    </Card>
  );
  const card = screen.getByTestId('card');
  expect(card).toHaveClass('border-dashed', 'shadow-none');
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/Card.test.tsx`
Expected: FAIL — `dashed` is not a valid variant yet.

**Step 3: Add the variant**

In `src/components/ui/Card.tsx`, add inside the `variant` object of `cardVariants` (after `interactive`):

```tsx
dashed: 'border-dashed shadow-none',
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/Card.test.tsx`
Expected: PASS (all 28 tests)

**Step 5: Commit**

```bash
git add src/components/ui/Card.tsx src/components/ui/Card.test.tsx
git commit -m "feat: add dashed variant to Card component"
```

---

## Task 3: Replace raw elements in GuestbookForm

**Files:**

- Modify: `src/components/sections/GuestbookForm.tsx`

**Context:** This file uses `motion.div` for animations. We apply Card styling via `cardVariants()` classNames. The file already imports `Button` from `@/components/ui/Button`.

**Step 1: Add imports**

Add to imports in `GuestbookForm.tsx`:

```tsx
import { cn } from '@/lib/utils';
import { cardVariants } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
```

**Step 2: Replace sign-in card (line 112)**

Change:

```tsx
className =
  'rounded-2xl border border-border bg-card p-8 text-center shadow-sm';
```

To:

```tsx
className={cn(cardVariants({ padding: 'lg' }), 'text-center')}
```

**Step 3: Replace authenticated card (line 155)**

Change:

```tsx
className = 'rounded-2xl border border-border bg-card p-6 shadow-sm';
```

To:

```tsx
className={cn(cardVariants())}
```

**Step 4: Replace sign-out button (lines 180-187)**

Change:

```tsx
<button
  onClick={handleSignOut}
  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
  aria-label="Sign out"
>
  <LogOut className="h-3.5 w-3.5" />
  Sign out
</button>
```

To:

```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={handleSignOut}
  className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground gap-1.5"
  aria-label="Sign out"
>
  <LogOut className="h-3.5 w-3.5" />
  Sign out
</Button>
```

**Step 5: Replace textarea (lines 192-202)**

Change:

```tsx
<textarea
  id="guestbook-message"
  value={message}
  onChange={e => setMessage(e.target.value)}
  placeholder="Share a thought, kind word, or just say hi…"
  maxLength={500}
  rows={3}
  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
  disabled={submitting || success}
  required
/>
```

To:

```tsx
<Textarea
  id="guestbook-message"
  value={message}
  onChange={e => setMessage(e.target.value)}
  placeholder="Share a thought, kind word, or just say hi…"
  maxLength={500}
  rows={3}
  size="sm"
  className="resize-none px-4 py-3"
  disabled={submitting || success}
  required
/>
```

**Step 6: Run type-check**

Run: `npm run type-check`
Expected: Only pre-existing GuestbookList.tsx error, no new errors.

**Step 7: Commit**

```bash
git add src/components/sections/GuestbookForm.tsx
git commit -m "refactor: replace raw HTML elements with design system components in GuestbookForm"
```

---

## Task 4: Replace raw elements in GuestbookList

**Files:**

- Modify: `src/components/sections/GuestbookList.tsx`

**Step 1: Add import**

```tsx
import { Card } from '@/components/ui/Card';
```

**Step 2: Replace entry card (line 28)**

Change:

```tsx
<div className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
```

To:

```tsx
<Card padding="none" className="group p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
```

And change the corresponding closing `</div>` to `</Card>`.

**Step 3: Replace empty state card (line 64)**

Change:

```tsx
<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
```

To:

```tsx
<Card variant="dashed" padding="none" className="flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
```

And change the corresponding closing `</div>` to `</Card>`.

**Step 4: Run type-check**

Run: `npm run type-check`
Expected: Only pre-existing error, no new errors.

**Step 5: Commit**

```bash
git add src/components/sections/GuestbookList.tsx
git commit -m "refactor: replace card-like divs with Card component in GuestbookList"
```

---

## Task 5: Replace raw button in CopyCodeBlock

**Files:**

- Modify: `src/components/ui/CopyCodeBlock.tsx`

**Step 1: Add import**

```tsx
import { Button } from '@/components/ui/Button';
```

**Step 2: Replace button (lines 42-66)**

Change the entire `<button>...</button>` block to:

```tsx
<Button
  type="button"
  variant="code"
  size="sm"
  onClick={handleCopy}
  aria-label={copied ? 'Copied!' : 'Copy code'}
  className={cn(
    'absolute top-3 right-3 gap-1.5 opacity-0 group-hover/codeblock:opacity-100 focus:opacity-100',
    copied &&
      'border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/20 hover:text-green-400'
  )}
>
  <span className="sr-only" aria-live="polite">
    {copied ? 'Code copied to clipboard' : ''}
  </span>
  {copied ? (
    <>
      <Check className="h-3 w-3" aria-hidden="true" />
      Copied
    </>
  ) : (
    <>
      <Copy className="h-3 w-3" aria-hidden="true" />
      Copy
    </>
  )}
</Button>
```

**Step 3: Add `cn` import**

```tsx
import { cn } from '@/lib/utils';
```

**Step 4: Run type-check**

Run: `npm run type-check`
Expected: No new errors.

**Step 5: Commit**

```bash
git add src/components/ui/CopyCodeBlock.tsx
git commit -m "refactor: replace raw button with Button component in CopyCodeBlock"
```

---

## Task 6: Replace raw button in ErrorBoundary

**Files:**

- Modify: `src/components/ui/ErrorBoundary.tsx`
- Test: `src/components/ui/ErrorBoundary.test.tsx` (existing — must still pass)

**Step 1: Add import**

Add to existing imports in `ErrorBoundary.tsx`:

```tsx
import { Button } from '@/components/ui/Button';
```

**Step 2: Replace button (lines 146-151)**

Change:

```tsx
<button
  onClick={resetErrorBoundary}
  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
>
  Try Again
</button>
```

To:

```tsx
<Button onClick={resetErrorBoundary}>Try Again</Button>
```

**Step 3: Run tests**

Run: `npx vitest run src/components/ui/ErrorBoundary.test.tsx`
Expected: PASS (all 17 tests)

**Step 4: Commit**

```bash
git add src/components/ui/ErrorBoundary.tsx
git commit -m "refactor: replace raw button with Button component in ErrorBoundary"
```

---

## Task 7: Replace card-like div in CommandMenu

**Files:**

- Modify: `src/components/ui/CommandMenu.tsx`

**Step 1: Add import**

```tsx
import { Card } from '@/components/ui/Card';
```

**Step 2: Replace container div (line 82)**

Change:

```tsx
<div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 direction-alternate duration-200 p-2 mx-4 sm:mx-0">
```

To:

```tsx
<Card padding="none" className="relative z-50 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 direction-alternate duration-200 p-2 mx-4 sm:mx-0">
```

And change the corresponding closing `</div>` (before `</Command.Dialog>`) to `</Card>`.

**Step 3: Run type-check**

Run: `npm run type-check`
Expected: No new errors.

**Step 4: Commit**

```bash
git add src/components/ui/CommandMenu.tsx
git commit -m "refactor: replace card-like div with Card component in CommandMenu"
```

---

## Task 8: Final Verification

**Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (551+ pass, 6 pre-existing locale API failures only)

**Step 2: Run quality checks**

Run: `npm run check`
Expected: Type-check + lint + format all clean (pre-existing GuestbookList error only)

**Step 3: Verify no remaining raw elements in consumer files**

Run: `grep -rn '<button' src/components/sections/ src/components/ui/ --include='*.tsx' | grep -v 'Button\.' | grep -v 'test\.' | grep -v 'Button.tsx' | grep -v 'type="button"'`

Expected: No results from our modified files. Any remaining raw `<button>` elements should only be inside component definition files (Button.tsx itself) or third-party library wrappers.

Run: `grep -rn '<textarea' src/ --include='*.tsx' | grep -v 'Textarea.tsx' | grep -v 'test\.'`

Expected: No results — all raw textareas replaced.

**Step 4: Commit verification notes (optional)**

If all checks pass, the audit is complete.
