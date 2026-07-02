# Interview Prep — Phase 2: Interactive Platform — Design Spec

- **Date:** 2026-07-02
- **Status:** Approved (design), pending implementation plan
- **Owner:** Oles Didukh
- **Parent spec:** `docs/superpowers/specs/2026-07-02-interview-prep-platform-design.md`
- **Builds on:** Phase 1 (data foundation) — merged to `main` at `ee2c80c`

## 1. Summary

Turn the seeded interview-prep data foundation into a fully working,
interactive platform on the site's design system. This phase **merges the
parent spec's Phase 2 (read-only platform) and Phase 3 (interactivity +
progress persistence)** into one shippable deliverable: every route renders
real Supabase data **and** every interaction that the legacy SPA supported
works and persists — flashcard flip, study deck controls, timed mock runner,
confidence/star marking, readiness recompute, custom-question add/delete, and
reset.

Admin CRUD (parent spec Phase 4) remains a separate later phase. This phase
achieves **feature parity** with the legacy `content.html` SPA, rebuilt as
React components.

## 2. Scope

**In scope**

- Route group replacing the static `route.ts` + `content.html`.
- Sessions hub + six per-session tabs: Briefing, Dashboard, Study, Mock,
  Browse, Stories.
- SSR reads via the Phase-1 data layer; server-computed initial readiness.
- Full interactivity: flip, deck nav/shuffle/filter, mock timer/stepper/reveal.
- Progress persistence: confidence (0–3), star, times-seen, last-reviewed,
  optimistic client updates + debounced Supabase upserts.
- Custom-question add/delete via Server Actions.
- Per-session progress reset.
- Legacy-file cleanup (§9).

**Out of scope (deferred)**

- Admin CRUD for sessions/questions/categories/stories (parent Phase 4).
- A separate `interview_mock_runs` history table (parent §3 non-goal). The mock
  runner writes confidence into `interview_progress`; per-run history is a
  future extension.
- Public/unauthenticated access — the area stays admin-gated.
- Multi-user support beyond the single admin.

## 3. Confidence scale (decision)

The legacy SPA rated confidence 1–5★. The Phase-1 schema
(`interview_progress.confidence`) and the scoring util use **0–3**. This phase
**follows the schema (0–3)** — legacy 1–5★ is not carried over. The scoring
util (`categoryReadiness`, `overallReadiness`, `weakSpots`) already assumes
`MAX_CONFIDENCE = 3`.

## 4. Architecture & routing

The static `src/app/interview-prep/route.ts` + `content.html` are removed.
`/interview-prep` becomes an App Router route group. The auth gate moves into
the group layout via `requireAdmin()` (from `@/app/admin/lib/auth`);
middleware still gates the path (defense in depth).

```
src/app/interview-prep/
  layout.tsx              # requireAdmin() gate + platform chrome (Container, header)
  page.tsx                # Sessions hub: SessionCard per session + overall stats
  [slug]/
    layout.tsx            # getSessionBySlug() -> notFound(); session header + SessionTabs
    page.tsx              # redirect -> ./briefing (default tab)
    briefing/page.tsx     # product, interviewers, likely topics, your numbers, bottom line, stack map
    dashboard/page.tsx    # overall readiness ring, per-category bars, weak spots
    study/page.tsx        # flashcards: flip / next / prev / shuffle / category chips / "only unsure" / rate
    mock/page.tsx         # timed mock: pick category + length, timer, stepper, reveal, self-rate, summary
    browse/page.tsx       # full question list + star + add / delete custom
    stories/page.tsx      # STAR story cards
```

Tabs are nested route segments with a shared tab-bar (`SessionTabs`) rendered
in `[slug]/layout.tsx` — deep-linkable and tabbed, active tab via
`usePathname()`.

**Reconciliation with parent spec:** parent §5's route list omitted a
`stories/` segment, but parent §7 lists a `StoriesView` component and the
legacy SPA has a dedicated Stories tab. For feature parity this phase includes
`stories/` as the sixth tab.

## 5. Components

Feature components live in `src/components/interview-prep/`. They reuse
existing design-system primitives: `Container`, `Card` (compound), `Button`
(incl. `gradient`), `Badge`, `Input`/`Textarea`/`Label`, `StatusIndicator`,
Radix `Dialog`, `sonner` toasts, Framer Motion, dark-mode tokens.

| Component                      | Responsibility                                                              | Client? |
| ------------------------------ | --------------------------------------------------------------------------- | ------- |
| `SessionCard`                  | Hub tile: company/role/round/date/status + readiness ring                   | server  |
| `SessionTabs`                  | Tab-bar; highlights active tab via `usePathname`; links to nested routes    | client  |
| `ReadinessRing`                | Overall readiness gauge                                                     | client  |
| `CategoryReadinessList`        | Per-category readiness bars                                                 | client  |
| `WeakSpots`                    | Lowest-confidence questions with "practice this" jump into Study            | client  |
| `Flashcard`                    | 3D flip card, reduced-motion aware (static when reduced)                     | client  |
| `StudyDeck`                    | Deck controls: next/prev/shuffle, category chips, "only unsure", dots, rate  | client  |
| `MockRunner`                   | Count-up timer, question stepper, reveal, self-rate -> writes confidence     | client  |
| `QuestionList` / `QuestionRow` | Browse; star; delete (custom only)                                          | client  |
| `AddQuestionModal`             | RHF + Zod form in a Radix Dialog -> Server Action                            | client  |
| `BriefingView`                 | Render briefing sections (product, interviewers, topics, numbers, stack map)| server  |
| `StoriesView`                  | STAR story cards                                                            | server  |

### Token mapping (legacy -> design system)

`--accent` -> `primary` (mocha) · `--good` -> `success` · `--warn` ->
`warning` · `--bad` -> `error` · `--panel` -> `card` · `--muted` ->
`muted-foreground` · `--border` -> `border`.

## 6. State & data flow

Follows parent spec §8.

1. **Reads (SSR).** The gated group layout / route Server Components fetch
   reference data (sessions, questions, categories, stories) **and** initial
   progress via the Phase-1 server data layer (`getSessions`, `getQuestions`,
   `getCategories`, `getStories`, `getSessionBySlug`, `getProgressForSession`),
   and pass them as props. Initial readiness is computed server-side (via the
   scoring util) so there is no flash.

2. **Progress writes (high-frequency).** `useInterviewProgressStore` (Zustand)
   hydrates from the SSR initial progress. Flip -> mark seen, rate confidence,
   toggle star update the store **optimistically**. A **debounced**
   `useInterviewSync` effect upserts changed rows to `interview_progress` via
   the **browser** Supabase client (RLS-protected), keyed on
   `UNIQUE(session_id, question_id)`, last-write-wins. On failure: `sonner`
   toast + revert.

3. **Readiness** recomputes client-side from the store for instant feedback
   (same scoring util as SSR).

4. **Structural mutations** (add/delete custom question) -> **Server Actions**
   + `revalidatePath`. Server Actions return a typed `{ success, error }`
   result; the client toasts on error.

5. **Reset** clears the session's `interview_progress` rows (Server Action) and
   the store.

6. **Ephemeral view state** (deck index, shuffle order, mock timer value,
   reveal flag) lives in local component state or a non-persisted store — never
   written to Supabase.

### Hooks

- Reuse `useReducedMotion`, `useDebounce`.
- New `useInterviewSync` — debounced upsert of dirty progress rows to
  `interview_progress` via the browser Supabase client.

### Study & Mock behavior (parity with legacy)

- **Study:** filter by category chip (default "All"); "only unsure" toggle
  (restricts the deck to questions with `confidence <= 1`, matching the
  weak-spot definition); shuffle; click card to flip/reveal; prev/next through
  the filtered set; rate confidence 0–3 on the current card.
- **Mock:** choose category + length; count-up timer; step through a random set
  of that length; reveal answer/tips; self-rate 0–3 (writes confidence);
  summary at the end with a "run another" reset of the runner.

## 7. Error handling

- **Auth:** not authenticated -> redirect `/login?redirect=/interview-prep`;
  authenticated non-admin -> redirect `/` (mirrors the legacy route handler and
  the `/admin` middleware gate).
- **Missing session:** unknown `[slug]` -> `notFound()`.
- **RLS-empty reads:** a non-admin (shouldn't reach here behind the gate) sees
  RLS-filtered `[]` -> render empty states, never crash.
- **Write failures:** progress upsert or Server-Action failure -> `sonner`
  toast + optimistic revert. Server Actions never throw to the client; they
  return `{ success: false, error }`.

## 8. Testing (target 80%+ coverage)

- **Unit (Vitest + RTL):** `Flashcard` flip (and reduced-motion static),
  `StudyDeck` nav/shuffle/filter, `MockRunner` timer/stepper, progress-store
  reducers (optimistic update + revert), readiness display components, Zod
  schema for the custom-question form.
- **Integration:** custom-question add/delete Server Actions, and reset — with
  a mocked Supabase client for unit-level; local Supabase for any live-write
  integration. **Never production.**
- **E2E (Playwright):** unauth -> `/login` gate; hub -> session -> study ->
  flip -> rate -> readiness updates; add a custom question; visual snapshots of
  hub + dashboard. **Write-heavy E2E runs against the local seeded Supabase
  stack** so tests never pollute the hosted project; read-only/snapshot flows
  may use either.

## 9. Prerequisites & cleanup

**Prerequisite (owner action):** apply migrations `003_interview_prep_schema`
and `004_interview_prep_seed` to the **hosted** Supabase project via the SQL
editor, **once** (`004` has no `ON CONFLICT` on questions — re-applying
duplicates all 83). The hosted DB already has the `app.admin_email` GUC
(migration `002`), so interview-table RLS resolves. Database safety rules bar
the assistant from writing to the hosted/production project, so this step is
performed by the owner.

**Cleanup (on completion, parent spec §12):**

- delete `src/app/interview-prep/route.ts`
- delete `src/app/interview-prep/content.html`
- remove its `.prettierignore` entry
- remove the `outputFileTracingIncludes` block for it in `next.config.ts`

## 10. Risks & mitigations

- **Route collision:** `page.tsx` and `route.ts` cannot both own
  `/interview-prep`. Mitigation: the foundation layer removes `route.ts` +
  `content.html` in the same change that introduces the route group.
- **Optimistic/debounced sync races** (rapid rating changes). Mitigation: keyed
  upserts on `(session_id, question_id)`, last-write-wins, revert on error.
- **Writing progress to hosted:** interactive flows persist to the hosted DB in
  normal use. Mitigation: interview tables are new (no existing data at risk);
  write-heavy **tests** target local Supabase; upserts are non-destructive.
- **Reduced motion:** flip and reveal animations must degrade to static per
  `useReducedMotion`.
- **Empty progress at launch:** the seed ships 0 progress rows, so readiness
  starts at 0% and every question is a weak spot until rated. Expected;
  components must render the zero state cleanly.
