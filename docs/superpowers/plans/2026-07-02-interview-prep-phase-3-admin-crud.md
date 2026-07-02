# Interview Prep — Phase 3: Admin CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the admin full create/read/update/delete for the four interview-prep entities (categories, stories, questions, sessions) under `/admin/interview-prep`, mirroring the existing blog/projects/skills admin pattern.

**Architecture:** A hub page links to four entity managers. Categories use an inline-edit table (mirroring `skills/categories`); stories/questions/sessions use list + `new` + `[id]` routes with a `useState`-based form, Zod `safeParse`, and server actions (`requireAdmin` → validate → Supabase → revalidate). One reusable `RepeatableFieldset` component edits all JSONB object-arrays.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 (strict), Tailwind v4, Supabase, Zod, Vitest + React Testing Library, Playwright.

**Design spec:** `docs/superpowers/specs/2026-07-02-interview-prep-phase-3-admin-crud-design.md`

## Global Constraints

- **Form convention (D1):** plain `useState` per field + `schema.safeParse` on submit + single top-level inline error banner (`bg-error/10 border border-error/20 … text-error`) + `alert(result.error)` on delete failure. **NO React Hook Form.**
- **Server action contract:** `'use server'`; `requireAdmin()` first, `if (authError || !supabase) return { error: authError || 'Unauthorized' }`; `schema.safeParse` → on failure `return { error: validation.error.issues.map(i => i.message).join(', ') }`; Supabase op; then **both** `revalidatePath('/admin/interview-prep/<entity>')` **and** `revalidatePath('/interview-prep', 'layout')` (D6); return `{ error: string }` | `{ success: true }`; **no `redirect()` in actions** (form navigates client-side).
- **Delete actions** take only an id, run **no** Zod validation, and are **unrestricted** — no `is_custom` guard (D5).
- **Reuse** JSONB sub-schemas from `src/lib/interview-prep/schemas.ts`: `interviewerSchema`, `likelyTopicSchema`, `yourNumberSchema`, `stackMapEntrySchema`, `tipSchema`, `difficultySchema`, `sessionStatusSchema`. Do NOT redefine them.
- **Nullable FK selects (D4):** leading `<option value="">` ("General" for category, "None" for story); map `'' → null` before validation.
- **Types:** use `InterviewCategoryInsert`, `InterviewStoryInsert`, `InterviewQuestionInsert`, `InterviewSessionInsert`, and the row types (`InterviewCategory` …) from `@/lib/supabase/types`.
- **Insert types:** each is `Omit<Row, 'id'|'created_at'|'updated_at'> & { id?: string }`.
- **Slug regex** (copy verbatim everywhere): `/^[a-z0-9]+(-[a-z0-9]+)*$/` with message `'Slug must be URL-friendly'`.
- **No new auth code.** Access is already gated by middleware (`/admin`), `admin/layout.tsx`, per-action `requireAdmin()`, and admin-email RLS on all five interview tables.
- **File size:** every new file < 400 lines; extract a sub-component if a form exceeds it.
- **Quality gate:** run `npm run check` (type-check + lint:strict + format:check) before every commit; run tests with `npx vitest run <path>`. Conventional-commit messages. No attribution trailers.
- **Strict TS:** `noUncheckedIndexedAccess` (guard array access), `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` (bracket notation for index signatures).

---

## File Structure

```
src/app/admin/interview-prep/
  page.tsx                                  # Task 2 — hub (4 cards + counts)
  components/RepeatableFieldset.tsx         # Task 1
  components/RepeatableFieldset.test.tsx    # Task 1
  categories/page.tsx                       # Task 3 — inline table
  categories/schema.ts  categories/schema.test.ts
  categories/actions.ts categories/actions.test.ts
  stories/page.tsx  stories/new/page.tsx  stories/[id]/page.tsx      # Task 4
  stories/schema.ts stories/schema.test.ts
  stories/actions.ts stories/actions.test.ts
  stories/components/StoryForm.tsx  stories/components/DeleteStoryButton.tsx
  questions/page.tsx questions/new/page.tsx questions/[id]/page.tsx  # Task 5
  questions/schema.ts questions/schema.test.ts
  questions/actions.ts questions/actions.test.ts
  questions/components/QuestionForm.tsx questions/components/DeleteQuestionButton.tsx
  sessions/page.tsx sessions/new/page.tsx sessions/[id]/page.tsx     # Task 6
  sessions/schema.ts sessions/schema.test.ts
  sessions/actions.ts sessions/actions.test.ts
  sessions/components/SessionForm.tsx sessions/components/DeleteSessionButton.tsx
src/app/admin/components/AdminSidebar.tsx   # Task 2 — add one nav item
e2e/interview-prep-admin.spec.ts            # Task 7
```

---

### Task 1: `RepeatableFieldset` reusable JSONB-row editor

**Files:**
- Create: `src/app/admin/interview-prep/components/RepeatableFieldset.tsx`
- Test: `src/app/admin/interview-prep/components/RepeatableFieldset.test.tsx`

**Interfaces:**
- Produces: `RepeatableFieldset<T>` (default export-less named export) and types `RepeatableField<T>`, consumed by QuestionForm (Task 5) and SessionForm (Task 6). `T extends Record<string, string>` — **all row fields are strings**; forms adapt nullable JSONB fields (only `tips.detail`) to `''`↔`null` at their own boundary.

- [ ] **Step 1: Write the failing test**

```tsx
// RepeatableFieldset.test.tsx
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepeatableFieldset, type RepeatableField } from './RepeatableFieldset';

interface Row {
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
    render(<Harness initial={[{ name: 'A', role: 'r1' }, { name: 'B', role: 'r2' }]} />);
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getAllByLabelText('Name')).toHaveLength(2);
  });

  it('appends an empty row on Add', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[]} />);
    await user.click(screen.getByRole('button', { name: 'Add People' }));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('dump').textContent).toBe('[{"name":"","role":""}]');
  });

  it('removes the targeted row by index', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[{ name: 'A', role: 'r1' }, { name: 'B', role: 'r2' }]} />);
    await user.click(screen.getByRole('button', { name: 'Remove People entry 1' }));
    expect(screen.getByTestId('dump').textContent).toBe('[{"name":"B","role":"r2"}]');
  });

  it('edits only the targeted cell, immutably', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[{ name: 'A', role: 'r1' }]} />);
    await user.type(screen.getByLabelText('Name'), 'X');
    expect(screen.getByTestId('dump').textContent).toBe('[{"name":"AX","role":"r1"}]');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/admin/interview-prep/components/RepeatableFieldset.test.tsx`
Expected: FAIL — cannot resolve `./RepeatableFieldset`.

- [ ] **Step 3: Write the component**

```tsx
// RepeatableFieldset.tsx
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
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };
  const removeRow = (index: number) => onChange(rows.filter((_, i) => i !== index));
  const addRow = () => onChange([...rows, { ...emptyRow }]);

  return (
    <fieldset className="space-y-4 border border-border rounded-xl p-4">
      <legend className="px-1 text-sm font-medium text-foreground">{legend}</legend>
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/admin/interview-prep/components/RepeatableFieldset.test.tsx`
Expected: PASS (4/4).

- [ ] **Step 5: Quality gate + commit**

```bash
npm run check
git add src/app/admin/interview-prep/components/RepeatableFieldset.tsx src/app/admin/interview-prep/components/RepeatableFieldset.test.tsx
git commit -m "feat(interview-prep): add RepeatableFieldset JSONB-row editor"
```

---

### Task 2: Sidebar link + hub page

**Files:**
- Modify: `src/app/admin/components/AdminSidebar.tsx` (add one `navItems` entry)
- Create: `src/app/admin/interview-prep/page.tsx`

**Interfaces:**
- Consumes: `getCategories`, `getStories`, `getQuestions`, `getSessions` from `@/lib/interview-prep/data` (existing).
- Produces: the `/admin/interview-prep` hub route linking to the four sub-areas.

- [ ] **Step 1: Add the sidebar nav item**

In `AdminSidebar.tsx`, import `GraduationCap` from `lucide-react` (add to the existing import list) and insert this object into `navItems` immediately after the `Skills` entry:

```tsx
  {
    title: 'Interview Prep',
    href: '/admin/interview-prep',
    icon: GraduationCap,
  },
```

(The existing `isActive` logic already matches nested routes via `pathname.startsWith(item.href)`.)

- [ ] **Step 2: Create the hub page**

```tsx
// src/app/admin/interview-prep/page.tsx
import Link from 'next/link';
import {
  getCategories,
  getStories,
  getQuestions,
  getSessions,
} from '@/lib/interview-prep/data';
import { CalendarClock, HelpCircle, FolderTree, BookText } from 'lucide-react';

export const metadata = { title: 'Interview Prep | Admin Dashboard' };

export default async function InterviewPrepAdminPage() {
  const [categories, stories, questions, sessions] = await Promise.all([
    getCategories(),
    getStories(),
    getQuestions(),
    getSessions(),
  ]);

  const cards = [
    { title: 'Sessions', href: '/admin/interview-prep/sessions', count: sessions.length, icon: CalendarClock, desc: 'Interview briefings' },
    { title: 'Questions', href: '/admin/interview-prep/questions', count: questions.length, icon: HelpCircle, desc: 'Prep questions & tips' },
    { title: 'Categories', href: '/admin/interview-prep/categories', count: categories.length, icon: FolderTree, desc: 'Question grouping & weight' },
    { title: 'Stories', href: '/admin/interview-prep/stories', count: stories.length, icon: BookText, desc: 'STAR behavioral stories' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">Manage interview content</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-card border border-border rounded-xl p-6 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <card.icon className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-foreground">{card.count}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{card.title}</h2>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + types**

Run: `npm run type-check`
Expected: PASS (no type errors). Manual: `npm run dev`, visit `/admin/interview-prep`, confirm four cards render with counts and the sidebar link highlights.

- [ ] **Step 4: Commit**

```bash
npm run check
git add src/app/admin/components/AdminSidebar.tsx src/app/admin/interview-prep/page.tsx
git commit -m "feat(interview-prep): add admin hub page and sidebar link"
```

---

### Task 3: Categories (inline-edit table + actions + schema)

**Files:**
- Create: `src/app/admin/interview-prep/categories/schema.ts` + `schema.test.ts`
- Create: `src/app/admin/interview-prep/categories/actions.ts` + `actions.test.ts`
- Create: `src/app/admin/interview-prep/categories/page.tsx`

**Interfaces:**
- Produces: `categoryAdminSchema`; `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)`.
- Consumes: `InterviewCategory`, `InterviewCategoryInsert` from `@/lib/supabase/types`.

- [ ] **Step 1: Write the schema**

```ts
// categories/schema.ts
import { z } from 'zod';

export const categoryAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  weight: z.number().min(0, 'Weight must be at least 0'),
  sort_order: z.number().int('Sort order must be a whole number'),
});
```

- [ ] **Step 2: Write the schema test + run (RED→GREEN)**

```ts
// categories/schema.test.ts
import { describe, it, expect } from 'vitest';
import { categoryAdminSchema } from './schema';

const valid = { name: 'Behavioral', slug: 'behavioral', weight: 1, sort_order: 0 };

describe('categoryAdminSchema', () => {
  it('accepts a valid category', () => {
    expect(categoryAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects an empty name', () => {
    const r = categoryAdminSchema.safeParse({ ...valid, name: '' });
    expect(r.success).toBe(false);
    expect(r.success === false && r.error.issues[0]?.message).toBe('Name is required');
  });
  it('rejects a non-URL-friendly slug', () => {
    expect(categoryAdminSchema.safeParse({ ...valid, slug: 'Not A Slug' }).success).toBe(false);
  });
  it('rejects a negative weight', () => {
    expect(categoryAdminSchema.safeParse({ ...valid, weight: -1 }).success).toBe(false);
  });
});
```

Run: `npx vitest run src/app/admin/interview-prep/categories/schema.test.ts` → PASS.

- [ ] **Step 3: Write the actions**

```ts
// categories/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/admin/lib/auth';
import { categoryAdminSchema } from './schema';
import type { InterviewCategoryInsert } from '@/lib/supabase/types';

function revalidate() {
  revalidatePath('/admin/interview-prep/categories');
  revalidatePath('/interview-prep', 'layout');
}

export async function createCategory(data: InterviewCategoryInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = categoryAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase.from('interview_categories').insert([data]);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function updateCategory(id: string, data: InterviewCategoryInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = categoryAdminSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues.map(i => i.message).join(', ') };
  }
  const { error } = await supabase.from('interview_categories').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const { error } = await supabase.from('interview_categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidate();
  return { success: true };
}
```

- [ ] **Step 4: Write the actions test + run (RED→GREEN)**

Reuse the thenable-builder mock from `src/app/interview-prep/actions.test.ts` (copy the `makeSupabase`/`authOk`/`AuthResult` helpers verbatim, dropping the `selectData`/`selectError`/`maybeSingle` parts not needed here — but keeping them is harmless; simplest is to copy the whole helper block).

```ts
// categories/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { requireAdmin } from '@/app/admin/lib/auth';
import { revalidatePath } from 'next/cache';

vi.mock('@/app/admin/lib/auth', () => ({ requireAdmin: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

function makeSupabase(opts: { insertError?: unknown; deleteError?: unknown; updateError?: unknown } = {}) {
  const builder = {
    insert: vi.fn<(rows: unknown[]) => Promise<{ error: unknown }>>(() =>
      Promise.resolve({ error: opts.insertError ?? null })
    ),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    then: (resolve: (v: { error: unknown }) => void) =>
      resolve({ error: opts.deleteError ?? opts.updateError ?? null }),
  };
  return { from: vi.fn(() => builder), builder };
}

type AuthResult = Awaited<ReturnType<typeof requireAdmin>>;
function authOk(sb: ReturnType<typeof makeSupabase>) {
  vi.mocked(requireAdmin).mockResolvedValue({
    error: null,
    supabase: sb,
    user: { email: 'a' },
  } as unknown as AuthResult);
}

const valid = { name: 'Behavioral', slug: 'behavioral', weight: 1, sort_order: 0 };

beforeEach(() => vi.clearAllMocks());

describe('createCategory', () => {
  it('errors when unauthorized', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({ error: 'Not authenticated', supabase: null, user: null } as unknown as AuthResult);
    expect(await createCategory(valid)).toEqual({ error: 'Not authenticated' });
  });
  it('rejects invalid input before the database', async () => {
    const sb = makeSupabase();
    authOk(sb);
    const r = await createCategory({ ...valid, name: '' });
    expect('error' in r).toBe(true);
    expect(sb.from).not.toHaveBeenCalled();
  });
  it('inserts and revalidates both paths', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await createCategory(valid)).toEqual({ success: true });
    expect(sb.from).toHaveBeenCalledWith('interview_categories');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/interview-prep/categories');
    expect(revalidatePath).toHaveBeenCalledWith('/interview-prep', 'layout');
  });
});

describe('updateCategory', () => {
  it('updates by id', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await updateCategory('c1', valid)).toEqual({ success: true });
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 'c1');
  });
});

describe('deleteCategory', () => {
  it('deletes by id without validation', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await deleteCategory('c1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 'c1');
  });
});
```

Run: `npx vitest run src/app/admin/interview-prep/categories/actions.test.ts` → PASS.

- [ ] **Step 5: Write the inline-table page**

Mirror `src/app/admin/skills/categories/page.tsx` exactly, with these adaptations:
- Reads `interview_categories` (not `skill_categories`) via the browser client, ordered by `sort_order`.
- State fields: `name`, `slug`, `weight` (number, default `1`), `sortOrder` (number, default `0`). Remove `description`, `icon`, `color` and their selects/options.
- `categoryData: InterviewCategoryInsert = { name, slug, weight, sort_order: sortOrder }`.
- On create/update, run `categoryAdminSchema.safeParse(categoryData)` first; on failure `alert(...)` and return (the inline table has no error banner — match `skills/categories` which `alert`s server errors; add a client-side `safeParse` alert for parity with the form convention).
- Import `createCategory`, `updateCategory`, `deleteCategory` from `../actions` is wrong — import from `./actions` (same `categories/` dir). Import `categoryAdminSchema` from `./schema`.
- Types: `import type { InterviewCategory, InterviewCategoryInsert } from '@/lib/supabase/types'`.
- The New/Edit form grid: two `Input`s for Name (auto-slug on create) + Slug, and two numeric `Input`s for Weight (`type="number"` `min={0}` `step="0.1"`) and Sort Order (`type="number"` `min={0}`).
- The list rows show `category.name` (title line) and `Weight ${category.weight} · Order ${category.sort_order}` (subtitle). Keep the `GripVertical` icon, edit (`Pencil`) and delete (`Trash2`) buttons, and the `DeleteConfirmDialog` with `description="Deleting a category unlinks it from its questions (their category becomes General)."` and `itemName={categories.find(c => c.id === deleteTarget)?.name || 'this category'}`.

Complete `handleSave` (replaces the skills version):

```tsx
  const handleSave = async () => {
    const categoryData: InterviewCategoryInsert = { name, slug, weight, sort_order: sortOrder };
    const validation = categoryAdminSchema.safeParse(categoryData);
    if (!validation.success) {
      alert(validation.error.issues.map(i => i.message).join(', '));
      return;
    }
    const result = editingId
      ? await updateCategory(editingId, categoryData)
      : await createCategory(categoryData);
    if ('error' in result) {
      alert(result.error);
      return;
    }
    resetForm();
    loadCategories();
  };
```

`resetForm` sets `name=''`, `slug=''`, `weight=1`, `sortOrder=categories.length`, `editingId=null`, `showNewForm=false`. `handleEdit(category)` sets `name`, `slug`, `weight`, `sortOrder` from the row.

- [ ] **Step 6: Verify + commit**

Run: `npx vitest run src/app/admin/interview-prep/categories` then `npm run check`. Manual: `/admin/interview-prep/categories` — add, edit, delete a category.

```bash
git add src/app/admin/interview-prep/categories
git commit -m "feat(interview-prep): add admin categories inline CRUD"
```

---

### Task 4: Stories (list + form CRUD)

**Files:**
- Create: `stories/schema.ts` + `schema.test.ts`, `stories/actions.ts` + `actions.test.ts`
- Create: `stories/page.tsx`, `stories/new/page.tsx`, `stories/[id]/page.tsx`
- Create: `stories/components/StoryForm.tsx`, `stories/components/DeleteStoryButton.tsx`

**Interfaces:**
- Produces: `storyAdminSchema`; `createStory`, `updateStory`, `deleteStory`; `StoryForm`, `DeleteStoryButton`.
- Consumes: `InterviewStory`, `InterviewStoryInsert`.

- [ ] **Step 1: Schema**

```ts
// stories/schema.ts
import { z } from 'zod';

export const storyAdminSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  company: z.string().max(200).nullable(),
  situation: z.string().min(1, 'Situation is required'),
  task: z.string().min(1, 'Task is required'),
  action: z.string().min(1, 'Action is required'),
  result: z.string().min(1, 'Result is required'),
  metrics: z.string().nullable(),
  tags: z.array(z.string().max(50)),
  sort_order: z.number().int('Sort order must be a whole number'),
});
```

- [ ] **Step 2: Schema test (RED→GREEN)** — `npx vitest run …/stories/schema.test.ts`

```ts
// stories/schema.test.ts
import { describe, it, expect } from 'vitest';
import { storyAdminSchema } from './schema';

const valid = {
  title: 'Migration', slug: 'migration', company: null,
  situation: 's', task: 't', action: 'a', result: 'r',
  metrics: null, tags: ['react'], sort_order: 0,
};

describe('storyAdminSchema', () => {
  it('accepts a valid story', () => {
    expect(storyAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('requires all four STAR fields', () => {
    for (const key of ['situation', 'task', 'action', 'result'] as const) {
      expect(storyAdminSchema.safeParse({ ...valid, [key]: '' }).success).toBe(false);
    }
  });
  it('allows null company and metrics', () => {
    expect(storyAdminSchema.safeParse({ ...valid, company: null, metrics: null }).success).toBe(true);
  });
});
```

- [ ] **Step 3: Actions** — copy Task 3's `actions.ts` structure exactly, swapping: table `interview_stories`; schema `storyAdminSchema`; type `InterviewStoryInsert`; `revalidatePath('/admin/interview-prep/stories')` (+ the shared `/interview-prep` layout revalidate). Names: `createStory`, `updateStory`, `deleteStory`.

- [ ] **Step 4: Actions test** — copy Task 3's `actions.test.ts`, swapping names/table/`valid` payload (use the `valid` story above). Assert `revalidatePath` called with `'/admin/interview-prep/stories'` and `'/interview-prep', 'layout'`. Run → PASS.

- [ ] **Step 5: DeleteStoryButton** — copy `src/app/admin/projects/components/DeleteProjectButton.tsx` verbatim, renaming: props `{ storyId, storyTitle }`; import `deleteStory` from `../actions`; dialog `title="Delete Story"`, `description="This action cannot be undone."`, `itemName={storyTitle}`.

- [ ] **Step 6: StoryForm** — `'use client'`, mirror `ProjectForm`'s structure (header with back/Cancel/Save buttons, error banner, card sections, `useState` per field). Fields and submit:

```tsx
// stories/components/StoryForm.tsx — key logic (mirror ProjectForm JSX for layout)
// State:
//   title, slug (auto-slug from title on create via generateSlug, same helper as ProjectForm),
//   company, situation, task, action, result, metrics  (all string useState, '' default),
//   tags: string[] + newTag input (badge-chip editor — copy ProjectForm's technologies block),
//   sortOrder: number (default story?.sort_order ?? 0)
// Textareas for situation/task/action/result (rows={4}) and metrics (rows={2}).
// Inputs for title, slug, company. Number input for sortOrder.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data: InterviewStoryInsert = {
      title,
      slug,
      company: company || null,
      situation,
      task,
      action,
      result,
      metrics: metrics || null,
      tags,
      sort_order: sortOrder,
    };
    const validation = storyAdminSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues.map(i => i.message).join(', '));
      setLoading(false);
      return;
    }
    const result_ = mode === 'create'
      ? await createStory(data)
      : await updateStory(story!.id, data);
    if ('error' in result_) {
      setError(result_.error);
      setLoading(false);
      return;
    }
    router.push('/admin/interview-prep/stories');
    router.refresh();
  };
```

Props: `{ story?: InterviewStory; mode: 'create' | 'edit' }`. Import `createStory`, `updateStory` from `../actions`; `storyAdminSchema` from `../schema`; types from `@/lib/supabase/types`.

- [ ] **Step 7: Routes**
- `stories/new/page.tsx`: `export default function NewStoryPage() { return <StoryForm mode="create" />; }` + metadata (mirror `projects/new/page.tsx`).
- `stories/[id]/page.tsx`: mirror `projects/[id]/page.tsx` — fetch `interview_stories` by id via server client, `notFound()` on error, render `<StoryForm story={data as InterviewStory} mode="edit" />`.
- `stories/page.tsx`: mirror `projects/page.tsx` list — `getStories()` (import from `@/lib/interview-prep/data`) instead of an inline fetch; columns **Title**, **Company**, **Tags** (count), **Order**; the row's edit link → `/admin/interview-prep/stories/${story.id}`; `<DeleteStoryButton storyId={story.id} storyTitle={story.title} />`; header "Add Story" → `/admin/interview-prep/stories/new`; empty state "No stories yet". No `ExportButton` (interview-prep is DB-live).

- [ ] **Step 8: Verify + commit**

Run: `npx vitest run src/app/admin/interview-prep/stories` + `npm run check`. Manual round-trip on `/admin/interview-prep/stories`.

```bash
git add src/app/admin/interview-prep/stories
git commit -m "feat(interview-prep): add admin stories CRUD"
```

---

### Task 5: Questions (list + form CRUD with FK selects + tips editor)

**Files:**
- Create: `questions/schema.ts` + `schema.test.ts`, `questions/actions.ts` + `actions.test.ts`
- Create: `questions/page.tsx`, `questions/new/page.tsx`, `questions/[id]/page.tsx`
- Create: `questions/components/QuestionForm.tsx`, `questions/components/DeleteQuestionButton.tsx`

**Interfaces:**
- Produces: `questionAdminSchema`; `createQuestion`, `updateQuestion`, `deleteQuestion`; `QuestionForm`, `DeleteQuestionButton`.
- Consumes: `RepeatableFieldset` (Task 1); `InterviewQuestion`, `InterviewQuestionInsert`, `InterviewCategory`, `InterviewStory`, `InterviewTip`; `difficultySchema`, `tipSchema` from `@/lib/interview-prep/schemas`.

- [ ] **Step 1: Schema**

```ts
// questions/schema.ts
import { z } from 'zod';
import { difficultySchema, tipSchema } from '@/lib/interview-prep/schemas';

export const questionAdminSchema = z.object({
  question: z.string().min(1, 'Question is required').max(1000),
  model_answer: z.string().max(5000).nullable(),
  category_id: z.string().uuid('Invalid category').nullable(),
  story_id: z.string().uuid('Invalid story').nullable(),
  difficulty: difficultySchema,
  time_estimate_sec: z.number().int().min(0).nullable(),
  tags: z.array(z.string().max(50)),
  tips: z.array(tipSchema),
  is_custom: z.boolean(),
  source: z.string().max(100).nullable(),
});
```

- [ ] **Step 2: Schema test (RED→GREEN)**

```ts
// questions/schema.test.ts
import { describe, it, expect } from 'vitest';
import { questionAdminSchema } from './schema';

const valid = {
  question: 'Tell me about yourself.', model_answer: null,
  category_id: null, story_id: null, difficulty: 'medium' as const,
  time_estimate_sec: null, tags: [], tips: [{ point: 'Keep it 60-90s', detail: null }],
  is_custom: false, source: null,
};

describe('questionAdminSchema', () => {
  it('accepts a valid question', () => {
    expect(questionAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('requires a question body', () => {
    const r = questionAdminSchema.safeParse({ ...valid, question: '' });
    expect(r.success === false && r.error.issues[0]?.message).toBe('Question is required');
  });
  it('rejects an invalid difficulty', () => {
    expect(questionAdminSchema.safeParse({ ...valid, difficulty: 'trivial' }).success).toBe(false);
  });
  it('rejects a tip missing its point', () => {
    expect(questionAdminSchema.safeParse({ ...valid, tips: [{ point: '', detail: null }] }).success).toBe(false);
  });
  it('accepts a null category and story', () => {
    expect(questionAdminSchema.safeParse({ ...valid, category_id: null, story_id: null }).success).toBe(true);
  });
});
```

- [ ] **Step 3: Actions** — copy Task 3 `actions.ts` structure. Table `interview_questions`; schema `questionAdminSchema`; type `InterviewQuestionInsert`; revalidate `'/admin/interview-prep/questions'` + layout. Names `createQuestion`, `updateQuestion`, `deleteQuestion`. **`deleteQuestion` has NO `is_custom` guard** (D5) — it is the plain id-only delete from Task 3.

- [ ] **Step 4: Actions test** — copy Task 3 `actions.test.ts`, swap names/table/`valid` payload (Step 2's `valid`). Add one test asserting `deleteQuestion` deletes **without** a prior select/guard:

```ts
  it('deletes any question with no is_custom guard', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await deleteQuestion('q1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
    // no select() guard call — admin delete is unrestricted
    expect(sb.builder.select).toBeUndefined();
  });
```

(Since this `makeSupabase` has no `select`, `sb.builder.select` is `undefined` — the assertion documents that no guard read happens.) Run → PASS.

- [ ] **Step 5: DeleteQuestionButton** — copy `DeleteProjectButton`, props `{ questionId, questionLabel }`, import `deleteQuestion`, dialog `title="Delete Question"`, `description="Deleting a question also removes its saved progress across sessions."`, `itemName={questionLabel}`.

- [ ] **Step 6: QuestionForm** — `'use client'`. Props `{ question?: InterviewQuestion; categories: InterviewCategory[]; stories: InterviewStory[]; mode: 'create' | 'edit' }`. Mirror `ProjectForm` JSX layout. Key logic:

```tsx
// questions/components/QuestionForm.tsx — key logic
import { RepeatableFieldset, type RepeatableField } from '@/app/admin/interview-prep/components/RepeatableFieldset';
import { questionAdminSchema } from '../schema';
import { createQuestion, updateQuestion } from '../actions';
import type { InterviewQuestion, InterviewQuestionInsert, InterviewCategory, InterviewStory } from '@/lib/supabase/types';

// A tip is edited as all-strings; detail '' maps to null on submit.
interface TipRow { point: string; detail: string }
const tipFields: RepeatableField<TipRow>[] = [
  { key: 'point', label: 'Point', placeholder: 'Short guidance' },
  { key: 'detail', label: 'Detail', type: 'textarea', placeholder: 'Optional elaboration' },
];
const emptyTip: TipRow = { point: '', detail: '' };

// State:
//   questionText, modelAnswer, categoryId ('' = General), storyId ('' = None),
//   difficulty ('easy'|'medium'|'hard'; default question?.difficulty ?? 'medium'),
//   timeEstimate: string (number-as-string, '' = null),
//   tags: string[] + newTag (chip editor), isCustom: boolean, source: string,
//   tips: TipRow[]  (init from question?.tips.map(t => ({ point: t.point, detail: t.detail ?? '' })) ?? [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data: InterviewQuestionInsert = {
      question: questionText,
      model_answer: modelAnswer || null,
      category_id: categoryId || null,
      story_id: storyId || null,
      difficulty,
      time_estimate_sec: timeEstimate.trim() ? parseInt(timeEstimate, 10) : null,
      tags,
      tips: tips
        .filter(t => t.point.trim())
        .map(t => ({ point: t.point, detail: t.detail.trim() ? t.detail : null })),
      is_custom: isCustom,
      source: source || null,
    };
    const validation = questionAdminSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues.map(i => i.message).join(', '));
      setLoading(false);
      return;
    }
    const res = mode === 'create'
      ? await createQuestion(data)
      : await updateQuestion(question!.id, data);
    if ('error' in res) {
      setError(res.error);
      setLoading(false);
      return;
    }
    router.push('/admin/interview-prep/questions');
    router.refresh();
  };
```

JSX specifics:
- **Question** (Textarea rows={3}, required), **Model answer** (Textarea rows={6}).
- **Category** select: leading `<option value="">General</option>` then `categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)`. Same pattern for **Story**: leading `<option value="">None</option>` then `stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)`. Use the same `<select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground">` styling as ProjectForm's category select.
- **Difficulty** select: options `easy`/`medium`/`hard`.
- **Time estimate (seconds)**: `Input type="number" min={0}` bound to `timeEstimate` string.
- **Tags**: badge-chip editor (copy ProjectForm technologies block).
- **Tips**: `<RepeatableFieldset legend="Tips" rows={tips} fields={tipFields} emptyRow={emptyTip} onChange={setTips} />`.
- **Is custom**: checkbox (copy ProjectForm's `published` checkbox). **Source**: `Input`.

- [ ] **Step 7: Routes**
- `questions/new/page.tsx`: server component — `const [categories, stories] = await Promise.all([getCategories(), getStories()])` (from `@/lib/interview-prep/data`), render `<QuestionForm mode="create" categories={categories} stories={stories} />`.
- `questions/[id]/page.tsx`: fetch `interview_questions` by id (server client, `notFound()` on error) **and** `getCategories()`/`getStories()`; render `<QuestionForm question={data as InterviewQuestion} categories={categories} stories={stories} mode="edit" />`.
- `questions/page.tsx`: list via `getQuestions()` + `getCategories()` (to resolve category names for display — build `const catName = new Map(categories.map(c => [c.id, c.name]))`). Columns **Question** (truncated), **Category** (`catName.get(q.category_id ?? '') ?? 'General'`), **Difficulty** (Badge), **Custom** (Badge when `q.is_custom`). Edit link → `/admin/interview-prep/questions/${q.id}`; `<DeleteQuestionButton questionId={q.id} questionLabel={q.question.slice(0, 60)} />`. "Add Question" → `/questions/new`.

- [ ] **Step 8: Verify + commit**

Run: `npx vitest run src/app/admin/interview-prep/questions` + `npm run check`. Manual round-trip (create a question with a category, a tip row, verify it appears in `/interview-prep`).

```bash
git add src/app/admin/interview-prep/questions
git commit -m "feat(interview-prep): add admin questions CRUD with tips editor"
```

---

### Task 6: Sessions (briefing editor — scalars + 4 JSONB editors + focus multiselect)

**Files:**
- Create: `sessions/schema.ts` + `schema.test.ts`, `sessions/actions.ts` + `actions.test.ts`
- Create: `sessions/page.tsx`, `sessions/new/page.tsx`, `sessions/[id]/page.tsx`
- Create: `sessions/components/SessionForm.tsx`, `sessions/components/DeleteSessionButton.tsx`

**Interfaces:**
- Produces: `sessionAdminSchema`; `createSession`, `updateSession`, `deleteSession`; `SessionForm`, `DeleteSessionButton`.
- Consumes: `RepeatableFieldset`; `InterviewSession`, `InterviewSessionInsert`, `InterviewCategory`, and the JSONB sub-types + schemas (`interviewerSchema`, `likelyTopicSchema`, `yourNumberSchema`, `stackMapEntrySchema`, `sessionStatusSchema`).

- [ ] **Step 1: Schema**

```ts
// sessions/schema.ts
import { z } from 'zod';
import {
  sessionStatusSchema,
  interviewerSchema,
  likelyTopicSchema,
  yourNumberSchema,
  stackMapEntrySchema,
} from '@/lib/interview-prep/schemas';

export const sessionAdminSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  round: z.string().min(1, 'Round is required').max(200),
  scheduled_at: z.string().nullable(),
  status: sessionStatusSchema,
  product: z.string().nullable(),
  interviewers: z.array(interviewerSchema),
  likely_topics: z.array(likelyTopicSchema),
  your_numbers: z.array(yourNumberSchema),
  bottom_line: z.string().nullable(),
  stack_map: z.array(stackMapEntrySchema),
  focus_category_ids: z.array(z.string().uuid()),
});
```

- [ ] **Step 2: Schema test (RED→GREEN)**

```ts
// sessions/schema.test.ts
import { describe, it, expect } from 'vitest';
import { sessionAdminSchema } from './schema';

const valid = {
  slug: 'houston-round-2', company: 'Houston', role: 'Senior FE', round: 'Round 2',
  scheduled_at: null, status: 'upcoming' as const, product: null,
  interviewers: [{ name: 'Harry', role: 'Founder', focus: 'depth' }],
  likely_topics: [{ topic: 'Charts', whereToDrill: 'Technical' }],
  your_numbers: [{ label: 'LCP', value: '1.5s' }],
  bottom_line: null,
  stack_map: [{ theirTech: 'React', yourStanding: 'Expert' }],
  focus_category_ids: [],
};

describe('sessionAdminSchema', () => {
  it('accepts a valid session', () => {
    expect(sessionAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('requires company/role/round', () => {
    for (const key of ['company', 'role', 'round'] as const) {
      expect(sessionAdminSchema.safeParse({ ...valid, [key]: '' }).success).toBe(false);
    }
  });
  it('rejects an interviewer missing its name', () => {
    expect(sessionAdminSchema.safeParse({ ...valid, interviewers: [{ name: '', role: 'x', focus: 'y' }] }).success).toBe(false);
  });
  it('rejects an invalid status', () => {
    expect(sessionAdminSchema.safeParse({ ...valid, status: 'pending' }).success).toBe(false);
  });
});
```

- [ ] **Step 3: Actions** — copy Task 3 `actions.ts`; table `interview_sessions`; schema `sessionAdminSchema`; type `InterviewSessionInsert`; revalidate `'/admin/interview-prep/sessions'` + layout. Names `createSession`, `updateSession`, `deleteSession`.

- [ ] **Step 4: Actions test** — copy Task 3 `actions.test.ts`, swap names/table/`valid` (Step 2's). Assert revalidate paths `'/admin/interview-prep/sessions'` + `'/interview-prep', 'layout'`. Run → PASS.

- [ ] **Step 5: DeleteSessionButton** — copy `DeleteProjectButton`; props `{ sessionId, sessionLabel }`; import `deleteSession`; dialog `title="Delete Session"`, `description="Deleting a session also removes all saved progress for it."`, `itemName={sessionLabel}`.

- [ ] **Step 6: SessionForm** — `'use client'`. Props `{ session?: InterviewSession; categories: InterviewCategory[]; mode: 'create' | 'edit' }`. Mirror `ProjectForm` layout. Key logic:

```tsx
// sessions/components/SessionForm.tsx — key logic
import { RepeatableFieldset, type RepeatableField } from '@/app/admin/interview-prep/components/RepeatableFieldset';
import type {
  InterviewSession, InterviewSessionInsert, InterviewCategory,
  InterviewInterviewer, InterviewLikelyTopic, InterviewYourNumber, InterviewStackMapEntry,
} from '@/lib/supabase/types';

const interviewerFields: RepeatableField<InterviewInterviewer>[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'focus', label: 'Focus', type: 'textarea' },
];
const topicFields: RepeatableField<InterviewLikelyTopic>[] = [
  { key: 'topic', label: 'Topic' },
  { key: 'whereToDrill', label: 'Where to drill' },
];
const numberFields: RepeatableField<InterviewYourNumber>[] = [
  { key: 'label', label: 'Label' },
  { key: 'value', label: 'Value' },
];
const stackFields: RepeatableField<InterviewStackMapEntry>[] = [
  { key: 'theirTech', label: 'Their tech' },
  { key: 'yourStanding', label: 'Your standing', type: 'textarea' },
];

// scheduled_at <-> datetime-local, treated as UTC wall-clock (matches seed '…T07:00:00Z')
const toInput = (iso: string | null) => (iso ? iso.slice(0, 16) : '');
const fromInput = (v: string) => (v ? `${v}:00Z` : null);

// State: slug, company, role, round (Input, required); scheduledAt (datetime-local string, init toInput(session?.scheduled_at ?? null));
//   status ('upcoming'|'done'|'archived', default session?.status ?? 'upcoming');
//   product, bottomLine (Textarea, '' default);
//   interviewers/likelyTopics/yourNumbers/stackMap: the 4 JSONB arrays (init from session?.* ?? []);
//   focusIds: string[] (init session?.focus_category_ids ?? []).
// emptyRow constants: { name:'', role:'', focus:'' }, { topic:'', whereToDrill:'' }, { label:'', value:'' }, { theirTech:'', yourStanding:'' }.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data: InterviewSessionInsert = {
      slug,
      company,
      role,
      round,
      scheduled_at: fromInput(scheduledAt),
      status,
      product: product || null,
      interviewers,
      likely_topics: likelyTopics,
      your_numbers: yourNumbers,
      bottom_line: bottomLine || null,
      stack_map: stackMap,
      focus_category_ids: focusIds,
    };
    const validation = sessionAdminSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues.map(i => i.message).join(', '));
      setLoading(false);
      return;
    }
    const res = mode === 'create'
      ? await createSession(data)
      : await updateSession(session!.id, data);
    if ('error' in res) {
      setError(res.error);
      setLoading(false);
      return;
    }
    router.push('/admin/interview-prep/sessions');
    router.refresh();
  };
```

JSX specifics:
- Scalars: `slug` (auto-slug from company+round is optional; simplest: plain Input, required), `company`/`role`/`round` (Input, required), `scheduledAt` (`<Input type="datetime-local">`, label "Scheduled at (UTC)"), `status` (select upcoming/done/archived), `product` (Textarea rows={3}), `bottomLine` (Textarea rows={3}).
- Four `RepeatableFieldset`s: interviewers, likely topics, your numbers, stack map — each with its `*Fields` + matching `emptyRow`.
- **Focus categories** multiselect — a `<fieldset>` of checkboxes:

```tsx
<fieldset className="space-y-2 border border-border rounded-xl p-4">
  <legend className="px-1 text-sm font-medium text-foreground">Focus categories</legend>
  {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
  {categories.map(c => (
    <label key={c.id} className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={focusIds.includes(c.id)}
        onChange={e =>
          setFocusIds(
            e.target.checked ? [...focusIds, c.id] : focusIds.filter(id => id !== c.id)
          )
        }
        className="w-4 h-4 rounded border-border"
      />
      <span className="text-sm">{c.name}</span>
    </label>
  ))}
</fieldset>
```

> **Size note:** if `SessionForm.tsx` exceeds ~400 lines, extract the four `RepeatableFieldset`s + focus multiselect into a `SessionBriefingFields.tsx` sub-component taking the arrays + setters as props.

- [ ] **Step 7: Routes**
- `sessions/new/page.tsx`: `const categories = await getCategories()`, render `<SessionForm mode="create" categories={categories} />`.
- `sessions/[id]/page.tsx`: fetch `interview_sessions` by id (server client, `notFound()`), `getCategories()`, render `<SessionForm session={data as InterviewSession} categories={categories} mode="edit" />`.
- `sessions/page.tsx`: list via `getSessions()`. Columns **Company · Role**, **Round**, **Status** (Badge; color `upcoming`→primary, `done`→green, `archived`→secondary), **Scheduled** (`session.scheduled_at ? new Date(session.scheduled_at).toLocaleString() : '—'`). Edit link → `/admin/interview-prep/sessions/${s.id}`; `<DeleteSessionButton sessionId={s.id} sessionLabel={`${s.company} · ${s.round}`} />`. "Add Session" → `/sessions/new`.

- [ ] **Step 8: Verify + commit**

Run: `npx vitest run src/app/admin/interview-prep/sessions` + `npm run check`. Manual: create a session with interviewers/topics/numbers/stack rows + focus categories; verify it renders on `/interview-prep/<slug>`; edit round-trips the JSONB rows.

```bash
git add src/app/admin/interview-prep/sessions
git commit -m "feat(interview-prep): add admin sessions briefing CRUD"
```

---

### Task 7: E2E access gate + round-trip smoke

**Files:**
- Create: `e2e/interview-prep-admin.spec.ts`

**Interfaces:**
- Consumes: the existing Playwright setup and the Phase-2 access-gate pattern in `e2e/interview-prep.spec.ts` (read it for the auth-redirect assertion style + any test-admin login helper).

- [ ] **Step 1: Read the existing spec** — open `e2e/interview-prep.spec.ts` to reuse its base URL, redirect assertion, and (if present) admin-auth fixture. Match its style exactly.

- [ ] **Step 2: Write the access-gate test**

```ts
// e2e/interview-prep-admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('interview-prep admin access', () => {
  test('unauthenticated visit to the hub redirects away from admin', async ({ page }) => {
    await page.goto('/admin/interview-prep');
    await expect(page).toHaveURL(/\/login|\/$/);
  });
});
```

(If `e2e/interview-prep.spec.ts` has an admin-login fixture, add a second authenticated test that creates a category via `/admin/interview-prep/categories`, asserts the row appears, edits its weight, then deletes it — a full round-trip. If there is NO login fixture, keep only the access-gate test and note in the commit body that an authenticated round-trip is deferred to manual verification, since seeding an admin session is out of this plan's scope.)

- [ ] **Step 3: Run + commit**

Run: `npx playwright test e2e/interview-prep-admin.spec.ts` (Expected: PASS — redirect works via existing middleware). If Playwright needs a dev server not running in this environment, note that in the report and rely on the middleware/layout unit-level guarantee.

```bash
git add e2e/interview-prep-admin.spec.ts
git commit -m "test(interview-prep): add admin access-gate e2e"
```

---

## Self-Review

**Spec coverage:** §5.1 Categories → Task 3; §5.2 Stories → Task 4; §5.3 Questions → Task 5; §5.4 Sessions → Task 6; §6 `RepeatableFieldset` → Task 1; §3 hub + sidebar → Task 2; §7 actions/validation/revalidation → each entity task's actions + Global Constraints; §8 testing → schema/actions tests per entity + RepeatableFieldset test + Task 7 E2E. D1–D8 all encoded in Global Constraints / task steps. No spec section is unimplemented.

**Placeholder scan:** All code steps carry complete code or a precise "mirror file X, adapting fields A/B/C" instruction with the novel logic given in full. The three large forms give complete state-init/submit-mapping/novel-controls; only the repetitive scalar-field JSX is delegated to "mirror ProjectForm," which is a concrete existing file, not a vague placeholder.

**Type consistency:** Action names (`createX`/`updateX`/`deleteX`) consistent across tasks. Insert types match `@/lib/supabase/types` (`InterviewXInsert`). `RepeatableField<T>`/`RepeatableFieldset` signature in Task 1 matches usage in Tasks 5–6. JSONB row types (`InterviewInterviewer` etc.) used in Task 6 match the schema field names (`whereToDrill`, `theirTech`, `yourStanding`) from `src/lib/interview-prep/schemas.ts`. `tips` boundary: editor uses `{point,detail:string}`, submit maps `detail:''→null` to satisfy `tipSchema` (`detail: string|null`) — consistent.

**Dependency order:** Task 1 (RepeatableFieldset) precedes Tasks 5–6 that consume it. Task 2 (hub) is independent. Tasks 3→6 ascend in complexity; each is independently testable.
