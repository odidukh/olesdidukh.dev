# Interview Prep Platform — Design Spec

- **Date:** 2026-07-02
- **Status:** Approved (design), pending implementation plan
- **Owner:** Oles Didukh

## 1. Summary

Convert the existing `/interview-prep` tool — currently a single 103 KB static
HTML file (`src/app/interview-prep/content.html`) served through a route
handler — into a fully working, React-component-based platform built on the
main website's design system.

The current tool is a client-side SPA (vanilla JS, `localStorage`) with ~83
built-in questions, STAR stories, a readiness dashboard, flashcard study mode,
a timed mock-interview runner, and add/delete of custom questions. The new
platform preserves this functionality and generalizes it into a multi-session,
Supabase-backed, admin-editable platform.

## 2. Goals

- Faithful feature parity with the current tool: dashboard/readiness, study
  flashcards, timed mock interview, browse + custom questions, STAR stories,
  progress tracking, reset.
- Rebuild entirely as React components on the site's design system (Geist
  fonts, mocha/navy tokens, `Button`/`Card`/`Badge` primitives, Framer Motion,
  dark mode).
- Generalize to a **multi-session platform**: one prep "session" per
  company/role, each with its own briefing, over a shared question bank and
  STAR story library.
- All content and progress **Supabase-backed** and editable through the
  existing `/admin` panel.

## 3. Non-goals (YAGNI)

- A separate `interview_mock_runs` history table. The mock runner writes
  confidence into `interview_progress`; per-run history is a future extension.
- Multi-user support beyond the single admin. The area is gated to
  `ADMIN_EMAIL`; schema is single-user (`user_id` + RLS) but not built out for
  collaboration.
- Public (unauthenticated) access. The platform stays admin-gated.

## 4. Key decisions

| Decision   | Choice                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Storage    | **Fully Supabase-backed**, admin-editable                                                                           |
| Scope      | **Multi-session platform** (session per company/role; shared bank + stories)                                        |
| Navigation | **Nested routes + in-session tabs** (deep-linkable)                                                                 |
| Data flow  | **SSR reads + optimistic client writes** (Zustand + debounced supabase-js); structural mutations via Server Actions |

## 5. Architecture & routing

The static `route.ts` + `content.html` are removed; `/interview-prep` becomes a
proper App Router route group. The auth gate moves into the group layout via
`requireAdmin()`, with middleware still gating the path (defense in depth).

```
src/app/interview-prep/
  layout.tsx              # requireAdmin() gate + platform chrome (Container, header)
  page.tsx                # Sessions hub: a card per prep session + overall stats
  [slug]/
    layout.tsx            # loads session, renders session header + SessionTabs
    page.tsx              # redirect -> ./briefing (default tab)
    briefing/page.tsx     # product, interviewers, likely topics, your numbers, bottom line, stack map
    dashboard/page.tsx    # overall readiness, readiness by category, weak spots
    study/page.tsx        # flashcards (flip / next / prev / shuffle / study sets)
    mock/page.tsx         # timed mock interview
    browse/page.tsx       # full question list + add / delete custom
```

Tabs are nested route segments with a shared tab-bar rendered in
`[slug]/layout.tsx` — deep-linkable and tabbed.

## 6. Data model (Supabase)

All tables are `interview_`-prefixed and single-user: every row carries
`user_id`, with RLS `auth.uid() = user_id` for all operations. RLS is enabled
on every table. Timestamps (`created_at`, `updated_at`) on all tables.

### 6.1 `interview_categories`

- `id` uuid pk, `user_id` uuid
- `name` text, `slug` text, `sort_order` int
- `weight` numeric (default 1) — weighting for overall readiness

### 6.2 `interview_questions`

- `id` uuid pk, `user_id` uuid
- `category_id` uuid fk -> `interview_categories` (nullable)
- `question` text, `model_answer` text
- `tips` text[]
- `difficulty` enum (`easy` | `medium` | `hard`)
- `time_estimate_sec` int
- `tags` text[]
- `is_custom` bool default false
- `source` text (nullable)
- Index: `(category_id)`

### 6.3 `interview_stories` (STAR)

- `id` uuid pk, `user_id` uuid
- `title` text
- `situation` text, `task` text, `action` text, `result` text
- `metrics` text (nullable)
- `tags` text[], `sort_order` int

### 6.4 `interview_sessions`

- `id` uuid pk, `user_id` uuid
- `slug` text — unique per user
- `company` text, `role` text, `round` text
- `scheduled_at` timestamptz (nullable)
- `status` enum (`upcoming` | `done` | `archived`)
- Briefing fields:
  - `product` text
  - `interviewers` jsonb — `[{ name, role, focus }]`
  - `likely_topics` jsonb — `[{ topic, where_to_drill }]`
  - `your_numbers` jsonb — `[{ label, value }]`
  - `bottom_line` text
  - `stack_map` jsonb — `[{ their_tech, your_standing }]`
  - `focus_category_ids` uuid[] — categories emphasized for this session
- Index: `(slug)`

### 6.5 `interview_progress` (per session × question)

- `id` uuid pk, `user_id` uuid
- `session_id` uuid fk -> `interview_sessions`
- `question_id` uuid fk -> `interview_questions`
- `status` enum (`new` | `learning` | `known`)
- `confidence` int (0–3)
- `starred` bool default false
- `times_seen` int default 0
- `last_reviewed_at` timestamptz (nullable)
- Constraint: `UNIQUE(session_id, question_id)`
- Indexes: `(session_id)`, `(question_id)`

### 6.6 Readiness scoring (pure util)

- Per-category readiness = `mean(confidence) / 3` over that category's
  questions (for the session).
- Overall readiness = category-weighted mean of category readiness (weights
  from `interview_categories.weight`).
- Weak spots = questions with `confidence <= 1`, ascending by confidence then
  `times_seen`, limited to the top 10.

### 6.7 Seed / migration (Phase 1)

A one-time TypeScript seed parses `content.html` to extract:

- the ~83 built-in questions (into `interview_questions`, `is_custom = false`),
- the categories they map to (`interview_categories`),
- the STAR stories (`interview_stories`),
- one `interview_sessions` row = **Houston Systems · Round 2** with its briefing
  content (product, interviewers, likely topics, your numbers, bottom line,
  stack map) extracted from the HTML.

Run against a local/branch Supabase only (never production) per DB safety
rules. Delivered as SQL migration(s) + a seed script.

## 7. Component design

Feature components live in `src/components/interview-prep/`. They reuse the
existing design-system primitives: `Container`, `Card` (compound), `Button`
(incl. `gradient`), `Badge`, `Input`/`Textarea`/`Label`, `StatusIndicator`,
Radix `Dialog`, `sonner` toasts, Framer Motion, dark-mode tokens.

| Component                      | Responsibility                                                                  | Depends on                                  |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------- |
| `SessionCard`                  | Hub tile: company/role/round/date/status + readiness ring                       | `Card`, `Badge`, `ReadinessRing`            |
| `SessionTabs`                  | Client tab-bar; highlights active tab via `usePathname`; links to nested routes | `usePathname`, `Link`                       |
| `ReadinessRing`                | Overall readiness gauge                                                         | scoring util                                |
| `CategoryReadinessList`        | Per-category readiness bars                                                     | scoring util                                |
| `WeakSpots`                    | Lowest-confidence questions with "practice this" jump into Study                | progress store                              |
| `Flashcard`                    | 3D flip card, reduced-motion aware                                              | `useReducedMotion`, Framer Motion           |
| `StudyDeck`                    | Deck controls (next/prev/shuffle, study-set chips, progress dots)               | `Flashcard`, deck state                     |
| `MockRunner`                   | Timer, question stepper, reveal, self-rate -> writes confidence                 | progress store                              |
| `QuestionList` / `QuestionRow` | Browse, star, delete (custom only)                                              | progress store, Server Action               |
| `AddQuestionModal`             | RHF + Zod form in a Radix Dialog                                                | `Dialog`, `Input`/`Textarea`, Server Action |
| `BriefingView`                 | Render briefing sections                                                        | `Card`, `Badge`                             |
| `StoriesView`                  | STAR story cards                                                                | `Card`                                      |

### Token mapping (current tool -> design system)

`--accent` -> `primary` (mocha) · `--good` -> `success` · `--warn` -> `warning`
· `--bad` -> `error` · `--panel` -> `card` · `--muted` -> `muted-foreground`
· `--border` -> `border`.

### State (Zustand)

- `useInterviewProgressStore` — per-session progress map; optimistic updates;
  debounced sync to Supabase; hydrated from server initial data.
- Ephemeral view state (deck index, shuffle order, mock timer/reveal) lives in
  local component state or a non-persisted store.

### Hooks

- Reuse `useReducedMotion`, `useDebounce`.
- New `useInterviewSync` — debounced upsert of dirty progress rows to
  `interview_progress` via the browser Supabase client.

## 8. Data flow

1. The gated group layout / route Server Components fetch reference data
   (sessions, questions, categories, stories) **and** initial progress via the
   server Supabase client, and pass them as props. Initial readiness is
   computed server-side so there is no flash.
2. `useInterviewProgressStore` hydrates from initial progress. User actions
   (flip -> mark seen, rate confidence, toggle star) update the store
   **optimistically**. A **debounced** effect upserts changed rows to
   `interview_progress` via supabase-js (RLS-protected). On failure: `sonner`
   toast + revert.
3. Readiness recomputes client-side from the store for instant feedback.
4. **Mutation split by frequency:**
   - High-frequency progress (flip/rate/star) -> client optimistic + debounced
     Supabase upsert.
   - Structural mutations (add/delete custom question, all admin CRUD) ->
     **Server Actions** + `revalidatePath`.

## 9. Admin CRUD (Phase 4)

Under `src/app/admin/interview-prep/`, mirroring the existing
`page.tsx` (list) + `actions.ts` (server actions) + `schema.ts` (Zod) +
`components/*Form.tsx` pattern used by blog/projects/skills/experience:

- **Sessions** — briefing editor with repeatable interviewer / number /
  stack-map rows.
- **Questions** — category, question, model answer, tips, difficulty, tags.
- **Categories** — inline manage (name, slug, weight, order).
- **Stories** — STAR fields.

Reuse `DeleteConfirmDialog`; add a nav link in `AdminSidebar`.

## 10. Implementation phases

1. **Data foundation** — schema + RLS + indexes, migration(s), seed (port 83
   questions + stories + Houston Systems session), TypeScript types, Zod
   schemas, data-access layer.
2. **Read-only platform** — nested routes + tabs on the design system: sessions
   hub -> per-session Briefing / Dashboard / Study / Mock / Browse rendering
   real data (readiness computed from progress). No mutations. Fully viewable
   and testable.
3. **Interactivity + progress** — flashcard flip, mock timer, confidence/star
   marking, progress persistence, readiness recompute, reset.
4. **Admin CRUD** — manage sessions/questions/categories/stories + custom
   questions via `/admin`.

Each phase is independently shippable and testable.

## 11. Testing (target 80%+ coverage)

- **Unit** (Vitest + RTL): readiness-scoring util, `Flashcard` flip,
  `StudyDeck` nav/shuffle, `MockRunner` timer, progress-store reducers, Zod
  schemas.
- **Integration**: Server Actions (custom Q + admin CRUD). Mocked Supabase for
  unit; local/branch Supabase for integration. **Never production.**
- **E2E** (Playwright): unauth -> `/login` gate; hub -> session -> study ->
  flip -> rate -> readiness updates; add a custom question; visual snapshots of
  hub + dashboard.

## 12. Migration & cleanup

Once the route group is live, delete:

- `src/app/interview-prep/route.ts`
- `src/app/interview-prep/content.html`
- its `.prettierignore` entry
- the `outputFileTracingIncludes` block in `next.config.ts`

## 13. Risks & mitigations

- **Parsing the legacy HTML for seed data** is brittle. Mitigation: parse once
  into a checked-in JSON/TS seed fixture, verify counts (83 questions), keep the
  original `content.html` in git history for reference.
- **Optimistic/debounced sync races** (rapid rating changes). Mitigation:
  keyed upserts on `(session_id, question_id)`; last-write-wins; revert on error.
- **RLS misconfiguration** could expose or block data. Mitigation: explicit
  per-table policies + an integration test asserting a non-owner cannot read.
- **Reduced motion**: the flip and reveal animations must degrade to static per
  `useReducedMotion`.

```

```
