# Interview Prep — Smart Study Design

**Date:** 2026-07-03
**Status:** Approved (design) — ready for implementation plan
**Area:** `/interview-prep/[slug]/study` (admin-only, single learner)

## Problem

The Study tab opens on a blank slate: the learner must pick category / "only unsure" / shuffle before every sitting, faces an undifferentiated wall of 83 questions with no boundary, and rates each card with a separate click from advancing. The stored signals that could make studying easier — `confidence`, `last_reviewed_at`, `times_seen` — are persisted but ignored by the deck and the scoring. Net effect: studying takes decisions and clicks it shouldn't, and doesn't feel like it converges.

**Goal:** make studying _easier_ — remove the pre-study decision, right-size each sitting, and cut the click count — while letting the same "what to show next" logic quietly resurface the right cards.

## Approach

**Smart Start.** A single primary action builds a right-sized, weakest-and-oldest-first session; a fast one-key flow rates-and-advances; a finish screen shows felt progress and a one-tap path into whatever is still shaky.

Deliberately **not** a spaced-repetition scheduler. The "intelligence" is a deterministic sort (`buildSmartSession`); the "progress you feel" is a diff (`summarizeSession`). No interval model, no `due_at`, no migration, no server changes.

### Alternatives considered

- **Due Queue (full spaced repetition, SM-2-lite).** Most powerful for long-horizon retention, but needs an interval/`due_at` concept and more logic — and its "due today" framing fights cramming before an imminent real interview. Deferred as a natural Phase B.
- **Playlists (curated mini-decks).** Easy to grasp, but the learner still chooses; only a "weak spots" list is adaptive. Its best idea (a weak-spots quick-start) is folded into Smart Start as a preset.

## Architecture

Two pure functions carry the logic; the component orchestrates a phase machine that mirrors the existing `MockRunner` (`setup → running → summary`). No new routes, no new stores, no schema change.

```
src/lib/interview-prep/deck.ts        (+ buildSmartSession, summarizeSession)  [pure, unit-tested]
src/components/interview-prep/StudyDeck.tsx   (reworked into a phase machine)
```

The loop closes through existing plumbing: `markSeen` (on first flip) and `setConfidence` (on rate) already mark entries dirty; the existing debounced sync (`useInterviewSync`) upserts them to `interview_progress`; the next hydrate reflects them — so each session shapes the next session's order with no new persistence code.

## Detailed design

### 1. `buildSmartSession` (pure)

```ts
buildSmartSession(
  questions: InterviewQuestion[],
  entries: Record<string, ProgressEntry>,
  options: { size: number; categoryId?: string | null; weakOnly?: boolean }
): string[]   // ordered questionId[], length ≤ size
```

**Filtering (before sort):**
- `categoryId` set → keep only `q.category_id === categoryId`.
- `weakOnly` → keep only effective `confidence ≤ 1` (unseen counts as 0). Reuses the same threshold as `weakSpots`.

**Ordering — weakest-and-oldest first**, one deterministic comparator over the filtered pool:
1. `confidence` ascending (missing entry → 0, so never-touched + shaky rise; `Solid`/3 sinks).
2. tie → `lastReviewedAt` ascending, `null` treated as oldest (never-reviewed = most urgent).
3. tie → `timesSeen` ascending (least-practiced first).
4. tie → original array order (stable).

**Cap:** take the first `size`. `size` may exceed the pool (returns the whole pool) or be `Infinity`/pool length for "All".

**Semantics that fall out:** because it sorts the _whole_ pool and slices N, `Solid` cards surface only after everything weaker is exhausted — the felt behavior of spaced repetition from a sort, with no interval math. Pure, no mutation of inputs.

**Edge cases (each a test):** empty pool → `[]`; `size` 0 → `[]`; all-unseen pool → stable original order (all confidence 0, all `lastReviewedAt` null); `weakOnly` with no weak cards → `[]`.

### 2. `summarizeSession` (pure)

```ts
summarizeSession(
  startConfidences: Record<string, number>,  // snapshot at session start
  entries: Record<string, ProgressEntry>      // current store state at finish
): { improved: number; unchanged: number; dropped: number; stillShaky: string[] }
```

For each questionId in `startConfidences`: compare start vs. current confidence → bucket into improved / unchanged / dropped. `stillShaky` = ids whose current confidence ≤ 1 (feeds the "Study those" button). Pure; snapshot is captured when the running phase begins.

### 3. `StudyDeck` phase machine

Reworked from the current filter+shuffle deck into `setup → running → summary` (same shape as `MockRunner`).

- **setup** — primary CTA **Start studying** (= Smart N). Secondary controls below: **Weak spots** preset (`weakOnly`), the existing category chip row (retained), size selector **10 / 20 / All** (default **10**). No filter choice is _required_ — the button alone is a complete answer.
- **running** — deck order snapshotted at start (order fixed for the sitting so live ratings don't reshuffle — same guard the current deck uses via `buildDeck`). Shows the `Flashcard`, a `3 / 10` progress indicator, and the on-screen key legend.
- **summary** — the finish screen (§5). If `StudyDeck` grows past ~250 lines, extract `StudySummary` (and `StudySetup` if needed) to keep files focused.

### 4. Keyboard / tap flow

A single keydown handler at the deck level (so the card need not be tab-focused first):

| Key | Action |
| --- | --- |
| `Space` / `Enter` | Flip / reveal answer |
| `0` `1` `2` `3` | (once revealed) rate **and auto-advance** to next card |
| `←` / `→` | Prev / next without rating |
| `S` | Toggle star |

**The click-count win:** today rating and advancing are two actions; here one key rates the card and moves on (auto-flipping the next card face-up-question). Rating the last card → summary.

Mobile: tap card to flip; four large rating buttons that also advance; a visible compact key legend for desktop. All motion stays behind `useReducedMotion` (Flashcard already handles this).

`markSeen` continues to fire on first flip → increments `timesSeen`, stamps `lastReviewedAt` → shapes the next session's order.

### 5. Finish screen

- "Reviewed **N** cards in **M:SS**." (reuse `MockRunner`'s elapsed-timer pattern)
- Delta line: "▲ {improved} improved · ▬ {unchanged} held · ▼ {dropped} dropped"
- "**{stillShaky.length} still shaky** → **Study those**" — starts a fresh session seeded from `stillShaky` ids.
- **Go again** (new Smart N) · **Done** (return to setup).

## Data & persistence

No schema change. No new DB fields. No server actions. Reads use existing `confidence` / `last_reviewed_at` / `times_seen`; writes go through existing `setConfidence` / `markSeen` + the existing debounced sync. Immutability preserved — both pure functions return new arrays/objects and never mutate inputs.

## Testing

- **`buildSmartSession`** (unit): weakest-first ordering; `null` `lastReviewedAt` sorts as oldest; `timesSeen` tiebreak; stable original order on full ties; `size` cap; `size` > pool; `categoryId` filter; `weakOnly` filter; empty/zero edge cases.
- **`summarizeSession`** (unit): improved / unchanged / dropped bucketing; `stillShaky` threshold at ≤ 1.
- **`StudyDeck`** (RTL): `Start studying` enters running with a capped deck; `Space` flips; a digit rates + advances; rating the last card → summary; "Study those" reseeds from still-shaky.
- Full existing interview-prep suite stays green.

## Success criteria

1. Landing on Study → **one action** starts a right-sized, weakest-first session with zero required filter decisions.
2. A card can be rated and advanced with **one keypress** (and one large tap on mobile).
3. Each session has a **clear end** with a felt-progress summary and a one-tap route into still-shaky cards.
4. No schema/server change; all existing tests pass.

## Out of scope (future)

- Spaced-repetition intervals / `due_at` scheduling (Phase B — the Due Queue alternative).
- Active-recall capture (type/speak your answer before reveal) and calibration tracking — separate levers, separate designs.
- Cross-session streaks / habit mechanics.
