# Interview Prep — Phase 3: Admin CRUD (Design Spec)

**Status:** Approved (design) — authored while the owner was away; every open
decision is resolved by mirroring the existing admin house style and is called
out in §4 for review. Everything lands on branch
`feat/interview-prep-phase-3-admin-crud` (discardable).

**Parent spec:** `docs/superpowers/specs/2026-07-02-interview-prep-platform-design.md` §9
("Admin CRUD"), the fourth and final phase of that roadmap. Phases 1–3 of the
parent roadmap (data foundation, read-only platform, interactivity+progress)
already shipped.

## 1. Goal

Give the admin a full create/read/update/delete surface for the four
interview-prep content entities — **sessions, questions, categories, stories** —
under `/admin/interview-prep`, so the tool's content is editable from the UI
instead of only via SQL seed migrations. Mirror the existing
blog/projects/skills/experience admin pattern exactly; add nothing the other
admin sections do not already have except the one genuinely new primitive the
data shape forces (a repeatable JSONB-row editor).

## 2. Scope

**In scope**

- A hub page at `/admin/interview-prep` linking to the four entity managers with
  live row counts.
- **Categories** — inline-edit table (name / slug / weight / sort_order),
  mirroring `src/app/admin/skills/categories/page.tsx`.
- **Stories** — list + create + edit + delete (STAR fields).
- **Questions** — list + create + edit + delete (category/story selects,
  difficulty, tags, repeatable `tips`).
- **Sessions** — list + create + edit + delete (briefing editor: scalar fields +
  four repeatable JSONB row editors + a category multiselect for
  `focus_category_ids`).
- One reusable `RepeatableFieldset` component for all JSONB object-arrays.
- Server actions per entity (`requireAdmin` → `safeParse` → Supabase → revalidate).
- Zod admin schemas per entity, reusing the JSONB sub-schemas already in
  `src/lib/interview-prep/schemas.ts`.
- One `AdminSidebar` nav link.
- Unit tests (schemas, `RepeatableFieldset`, server actions) + one E2E
  access-gate + round-trip.

**Out of scope (deferred)**

- Editing `interview_progress` rows from admin (progress is user-generated; a
  per-session reset action already exists from Phase 2).
- Drag-and-drop reordering (numeric `sort_order` inputs instead).
- Bulk import / CSV.
- Per-user question ownership (a pre-existing Phase-2 deferral, unchanged here).
- An "Export to Site" flow — interview-prep reads live from Supabase (SSR), so
  there is no static export step to mirror (see §4, decision D6).

## 3. Architecture

Route tree (mirrors the projects/blog CRUD shape; **categories** is the one
inline-table exception with no `new`/`[id]` routes):

```
src/app/admin/interview-prep/
  page.tsx                      # hub: 4 cards + counts + links
  sessions/
    page.tsx                    # list (Server Component)
    new/page.tsx                # <SessionForm mode="create" categories={...} />
    [id]/page.tsx               # fetch by id, <SessionForm mode="edit" ... />
    actions.ts                  # create/update/deleteSession
    schema.ts                   # sessionAdminSchema (Zod)
    components/
      SessionForm.tsx           # client form
      DeleteSessionButton.tsx   # delete trigger + DeleteConfirmDialog
  questions/
    page.tsx  new/page.tsx  [id]/page.tsx  actions.ts  schema.ts
    components/QuestionForm.tsx  DeleteQuestionButton.tsx
  stories/
    page.tsx  new/page.tsx  [id]/page.tsx  actions.ts  schema.ts
    components/StoryForm.tsx  DeleteStoryButton.tsx
  categories/
    page.tsx                    # client inline-edit table (mirror skills/categories)
    actions.ts                  # create/update/deleteCategory
    schema.ts                   # categoryAdminSchema

src/app/admin/interview-prep/components/
  RepeatableFieldset.tsx        # reusable JSONB-row editor (new primitive)
```

**Data flow.** List pages and `[id]` edit pages are Server Components that read
through the server Supabase client (`createClient` from `@/lib/supabase/server`),
exactly like `projects/page.tsx`/`projects/[id]/page.tsx`; the admin `layout.tsx`
already enforces the admin gate, so list pages do not re-guard. Forms are
`'use client'`, hold one `useState` per field, run `schema.safeParse` on submit,
call the server action, and on success `router.push` back to the list +
`router.refresh()`. The **categories** table is a single client component that
reads via the browser client and mutates through its own server actions, exactly
like `skills/categories`.

**Access control.** Three existing gates already cover every route and action —
middleware (`/admin` prefix) → `admin/layout.tsx` `getUser()` redirect →
per-action `requireAdmin()` + admin-email RLS on all five interview tables
(migration 002/003). Phase 3 adds **no** new auth code; it inherits all three.

## 4. Design decisions (resolved while owner away — review these)

- **D1 — Form convention: match the admin house style, not React Hook Form.**
  All four existing admin forms use plain `useState` + `schema.safeParse` + a
  single top-level inline error banner + `alert()` on delete failure. Phase 1's
  `AddQuestionModal` is the repo's only RHF form. Decision: use the **admin
  house style** for consistency with the four sibling sections. Trade-off: RHF
  `useFieldArray` would make the JSONB row editors terser, but diverging the one
  new admin area from the other four costs more than it saves. The reusable
  `RepeatableFieldset` (D3) recovers most of that terseness.

- **D2 — Route layout: a hub + four sub-areas under one sidebar link**, rather
  than four top-level sidebar links. Keeps the sidebar uncluttered and groups
  the tool's admin surface. The hub shows counts so the admin sees state at a
  glance.

- **D3 — One reusable `RepeatableFieldset` for every JSONB object-array.** The
  four session arrays (`interviewers`, `likely_topics`, `your_numbers`,
  `stack_map`) and question `tips` are all "array of small flat objects." A
  single generic controlled component renders them from a field-definition
  descriptor (see §6). Avoids five near-identical hand-rolled editors.

- **D4 — Nullable FK selects include an explicit "none" option.** `category_id`
  and `story_id` are nullable FKs (`ON DELETE SET NULL`). Their `<select>`s
  include a leading `<option value="">` ("General" for category, "None" for
  story), and the form maps `'' → null` before validation — matching
  `AddQuestionModal`'s existing `emptyToNull` behavior.

- **D5 — Admin delete is unrestricted.** Phase-2's `deleteCustomQuestion` blocks
  non-custom rows (`if (!data.is_custom) …`). The admin question delete drops
  that guard — an admin manages all content. Deletes cascade to
  `interview_progress` (session/question FKs are `ON DELETE CASCADE`); the
  `DeleteConfirmDialog` copy will note this for sessions/questions.

- **D6 — Live revalidation, no exporter.** blog/projects defer public updates to
  a separate "Export to Site" JSON step. Interview-prep instead reads live from
  Supabase on every SSR render, so admin actions `revalidatePath` **both** the
  admin path **and** `('/interview-prep', 'layout')` so the public tool reflects
  edits immediately. No exporter is built.

- **D7 — `scheduled_at` uses a `datetime-local` input.** DB column is nullable
  `timestamptz`. The form uses `<input type="datetime-local">`; empty → `null`;
  a value → ISO string. Stored/displayed in UTC to match the seed
  (`'2026-07-03T07:00:00Z'`); no timezone picker (YAGNI).

- **D8 — `is_custom` / `source` are editable on the question form.** Admin-seeded
  questions default `is_custom=false`, `source=null`; admin may set them. Not
  hidden, not auto-forced.

## 5. Per-entity design

### 5.1 Categories (inline table)

Client component mirroring `skills/categories/page.tsx`: a table with an
"Add category" row and per-row edit/delete. Columns: **name**, **slug**,
**weight** (numeric, default 1), **sort_order** (int, default 0). `editingId`
holds the row being edited; `showNewForm` toggles the add row; `deleteTarget`
drives a `DeleteConfirmDialog`. Reads categories via the browser client on mount;
each mutation calls a server action then re-reads/refreshes. Deleting a category
null-outs `interview_questions.category_id` (FK `ON DELETE SET NULL`) — the
delete dialog states this.

### 5.2 Stories (form + list)

STAR content. Fields: `title` (required), `slug` (required, slug regex),
`company` (nullable), `situation` / `task` / `action` / `result` (required
textareas), `metrics` (nullable), `tags` (string array — badge-chip editor, the
existing `technologies` pattern), `sort_order` (int). List shows title, company,
tag count, sort_order, edit + delete.

### 5.3 Questions (form + list)

Fields: `question` (required textarea), `model_answer` (nullable textarea),
`category_id` (nullable select → "General"), `story_id` (nullable select →
"None"), `difficulty` (select easy/medium/hard), `time_estimate_sec` (nullable
int), `tags` (string-array chip editor), `tips` (**`RepeatableFieldset`**:
rows of `point` (required) + `detail` (nullable textarea)), `is_custom`
(checkbox), `source` (nullable text). `new`/`[id]` pages fetch categories +
stories server-side and pass them to the form for the selects. List shows a
truncated question, its category name, difficulty badge, custom flag, edit +
delete (unrestricted, cascade-warns).

### 5.4 Sessions (form + list)

Scalar fields: `slug` (required, regex), `company` / `role` / `round`
(required), `scheduled_at` (datetime-local, nullable), `status` (select
upcoming/done/archived), `product` (nullable textarea), `bottom_line` (nullable
textarea). Repeatable JSONB editors (each a `RepeatableFieldset`):

| Field | Row shape (reuses schema from `src/lib/interview-prep/schemas.ts`) |
|---|---|
| `interviewers` | `{ name, role, focus }` (`interviewerSchema`) |
| `likely_topics` | `{ topic, whereToDrill }` (`likelyTopicSchema`) |
| `your_numbers` | `{ label, value }` (`yourNumberSchema`) |
| `stack_map` | `{ theirTech, yourStanding }` (`stackMapEntrySchema`) |

`focus_category_ids` (`UUID[]`): a checkbox list of all categories; stores the
checked category ids as `string[]`. `new`/`[id]` pages fetch categories
server-side for this list. List shows company · role · round, status badge,
scheduled_at, edit + delete (cascade-warns to progress).

## 6. `RepeatableFieldset` component

A generic, controlled, immutable-update editor for an array of flat objects.

```ts
type FieldType = 'input' | 'textarea';

interface RepeatableField<T> {
  key: keyof T & string;
  label: string;
  type?: FieldType;        // default 'input'
  placeholder?: string;
}

interface RepeatableFieldsetProps<T> {
  legend: string;                       // fieldset caption
  rows: T[];
  fields: RepeatableField<T>[];
  emptyRow: T;                          // appended on "Add"
  onChange: (rows: T[]) => void;
  addLabel?: string;                    // default `Add ${legend}`
}
```

Behavior: renders a `<fieldset>` with one row block per element; each block
renders `fields` as labeled `Input`/`Textarea` controls bound to
`row[field.key]`, plus a remove (`X`) button. A footer "Add" button appends a
`{ ...emptyRow }`. **All updates are immutable** — edit maps to a new array with
a spread-copied row; add concatenates; remove filters by index. No internal
state; parent owns `rows` (so it composes into each form's `useState`).

## 7. Server actions & validation

One `actions.ts` per entity, following the projects/interview-prep contract
verbatim:

```ts
'use server';
export async function createX(data: XInsert) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError || !supabase) return { error: authError || 'Unauthorized' };
  const validation = xAdminSchema.safeParse(data);
  if (!validation.success) return { error: validation.error.issues.map(i => i.message).join(', ') };
  const { error } = await supabase.from('interview_x').insert([data]);
  if (error) return { error: error.message };
  revalidatePath('/admin/interview-prep/x');
  revalidatePath('/interview-prep', 'layout');   // D6: public tool reads live
  return { success: true };
}
// updateX(id, data) — .update(data).eq('id', id); deleteX(id) — .delete().eq('id', id), no schema
```

Return contract: `{ error: string }` | `{ success: true }`. No `redirect()` in
actions — the form navigates client-side. Admin Zod schemas live in each entity
`schema.ts`, built from `InterviewXInsert` field-by-field, reusing the JSONB
sub-schemas (`interviewerSchema` etc.) and following house conventions
(required = `.min(1, '… is required')`, nullable = `.nullable()`, slug regex,
enums, `z.array(z.string())` for tags, numbers `.int()`).

## 8. Testing strategy

- **Schemas** (`*.test.ts` per `schema.ts`): valid payload passes; each required
  field missing fails with its message; slug regex rejects a bad slug; JSONB
  arrays validate row shape (e.g. an interviewer missing `name` fails).
- **`RepeatableFieldset`**: renders N rows for N elements; "Add" appends
  `emptyRow`; remove deletes the right index; editing a field emits a **new**
  array (immutability) with only that row/field changed.
- **Server actions** (mirror `src/app/interview-prep/actions.test.ts`): unauth →
  `{ error: 'Not authenticated' }`; invalid payload → validation error, no
  Supabase write; valid → insert/update/delete called with the right args +
  `revalidatePath` for both paths; the question delete has **no** `is_custom`
  guard (deletes a non-custom row).
- **E2E** (`e2e/`): a non-admin hitting `/admin/interview-prep` is redirected
  (reuses the Phase-2 access-gate assertion); one create→edit→delete round-trip
  for a single entity (categories, the simplest) as a smoke test. Heavier
  per-entity E2E is out of scope.

## 9. File-count / size guardrails

Each form is one focused file; `RepeatableFieldset` keeps them from ballooning.
Session form is the largest (scalars + 4 fieldsets + multiselect) — target < 400
lines; if it exceeds, extract the JSONB block into a `SessionBriefingFields`
sub-component. All other files well under 300 lines.

## 10. Risks

- **Categories browser-client RLS**: the inline table reads via the browser
  client under admin-email RLS. This is the exact proven pattern from
  `skills/categories`; if the interview-tables RLS differs, the plan's first
  categories task verifies a read returns rows before building mutations.
- **JSONB round-trip**: Supabase stores/returns JSONB as parsed objects; the
  form binds them directly. The schema validates row shape before write, so a
  malformed row is rejected server-side even though the client editor is
  permissive.
