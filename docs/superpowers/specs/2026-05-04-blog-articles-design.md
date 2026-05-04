# Blog Articles Batch — Design Spec

- **Date**: 2026-05-04
- **Author**: Oles Didukh
- **Status**: Approved 2026-05-04
- **Source projects**: `etappi/` and `life-activity-hub/` (sibling repos under `~/development/`)
- **Target repo**: `olesdidukh.dev` (this repo)
- **Output location**: `src/content/blog/*.mdx`

## 1. Goal

Add five new MDX articles to the blog, drawing topical content from the author's two production personal projects (Etappi and Life Activity Hub). Posts must match the existing blog's voice, frontmatter schema, and visual style established by the nine current posts in `src/content/blog/`.

## 2. Constraints

- **Schema**: Frontmatter must follow the schema used by existing posts (`id`, `slug`, `title`, `excerpt`, `coverImage`, `author`, `publishedAt`, `readingTime`, `category`, `tags`, `featured`, `views`, `likes`).
- **Voice**: First-person, "battle-tested from production" tone. Code-first in deep-dives; visual-first in case studies.
- **Reading time**: 11–16 minutes per post (range matches existing 12–13 min average).
- **Locale**: English only this batch. Project supports `messages/` i18n; translations are out of scope.
- **No new MDX components** unless an article truly needs one — write around it first.
- **No retroactive edits** to the existing 9 posts.

## 3. Scope

### 3.1 Article slate (5 posts)

| #   | Slug                                         | Type       | Audience lean          | Source | Reading time | Featured |
| --- | -------------------------------------------- | ---------- | ---------------------- | ------ | ------------ | -------- |
| 1   | `rrule-rfc-5545-typescript-edge-cases`       | Deep-dive  | Senior peers           | LAH    | 14 min       | false    |
| 2   | `offline-first-pwa-nextjs-mutation-queue`    | Deep-dive  | SEO traffic            | LAH    | 16 min       | true     |
| 3   | `typescript-monorepo-web-mobile-desktop`     | Deep-dive  | Recruiters / portfolio | Etappi | 15 min       | true     |
| 4   | `inside-etappi-multi-platform-task-manager`  | Case study | Portfolio              | Etappi | 11 min       | false    |
| 5   | `building-life-activity-hub-ai-productivity` | Case study | Portfolio + AI cred    | LAH    | 12 min       | false    |

Mix: 60% deep-dives + 40% case studies (3:2). One case study per project.

### 3.2 Working titles

1. _Implementing RFC 5545 RRULE in TypeScript: Edge Cases Nobody Warns You About_
2. _Offline-First PWAs in Next.js 16: Mutation Queues, Background Sync, and Conflict Resolution_
3. _One TypeScript Monorepo, Three Platforms: Shipping Web, Mobile, and Desktop from a Single Codebase_
4. _Inside Etappi: Building a Multi-Platform Task Manager Solo with Turborepo, tRPC, and Tauri_
5. _Building Life Activity Hub: An AI-Powered Productivity Platform That Plans Your Day_

### 3.3 Categories and tags

**Categories** (one per post):

- `Architecture` (#1, #3)
- `PWA` (#2)
- `Case Study` (#4, #5)

**Tags** (multi-select per post):

| #   | Tags                                                                     |
| --- | ------------------------------------------------------------------------ |
| 1   | `RFC 5545`, `RRULE`, `Calendar`, `TypeScript`, `Edge Cases`              |
| 2   | `PWA`, `Next.js`, `Offline-First`, `Service Worker`, `Background Sync`   |
| 3   | `Monorepo`, `Turborepo`, `React Native`, `Tauri`, `TypeScript`           |
| 4   | `Case Study`, `Etappi`, `Turborepo`, `tRPC`, `Tauri`, `Hono`             |
| 5   | `Case Study`, `Life Activity Hub`, `AI`, `Claude`, `PWA`, `Productivity` |

Reused existing tags: `TypeScript`, `Next.js`, `React Native`, `AI`, `Claude`. New tags introduced this batch are listed in §6.

### 3.4 Publishing schedule

Weekly cadence starting Monday 2026-05-11.

| #   | publishedAt |
| --- | ----------- |
| 1   | 2026-05-11  |
| 2   | 2026-05-18  |
| 3   | 2026-05-25  |
| 4   | 2026-06-01  |
| 5   | 2026-06-08  |

`featured: true` set on #2 (SEO leader) and #3 (portfolio leader). Combined with the existing featured Claude Code post, the featured rail will surface 3 posts.

## 4. Per-article outlines

### 4.1 Article 1 — RRULE in TypeScript

**Hook**: "Calendar sync sounds easy until your unit tests pass and production users see ghost events on Halloween."

**H2 outline**:

1. Why RRULE? — the 60-line ICS string that runs your calendar
2. The library landscape — `rrule.js` vs `ical.js` vs roll-your-own
3. Edge case 1 — DST transitions (events that exist twice or not at all)
4. Edge case 2 — `BYSETPOS` + `BYDAY` interaction (the "last weekday of the month" trap)
5. Edge case 3 — `EXDATE` with timezone mismatches
6. Edge case 4 — `COUNT` vs `UNTIL` and floating dates
7. Testing strategy — generating 10k recurrences and diffing against a reference parser
8. What I'd do differently next time

**Code**: `expandRecurrence(rule, range)` evolved across 3 iterations; DST-flip test fixture. ~6 code blocks.

**Takeaway**: 4 rules ("never trust local time," "test against `rrule.js` reference," etc.).

**Internal link out**: from §"Multi-calendar sync" of Article 5 → this post.

### 4.2 Article 2 — Offline-first PWA in Next.js 16

**Hook**: "Most 'offline support' tutorials stop at caching GETs. Real offline means writes survive a flight and merge cleanly when they land."

**H2 outline**:

1. The four levels of offline (cache → read replicas → writable → conflict-aware)
2. Service worker strategy in Next.js 16 — App Router constraints
3. The mutation queue — IndexedDB schema, retry policy, idempotency keys
4. Background sync API — Chrome Android vs. iOS Safari fallback
5. Conflict resolution — last-write-wins vs CRDTs vs domain-specific merge
6. Storage management — quota, eviction, persistent storage prompt
7. Telemetry — knowing it works in the wild
8. Production results from Life Activity Hub

**Code**: IDB queue interface + replay function; service worker `sync` handler; activity-edit conflict merge. ~7 code blocks.

**Internal link out**: from §"Architecture overview" of Article 5 → this post.

### 4.3 Article 3 — TypeScript monorepo across web/mobile/desktop

**Hook**: "Six months in, web, iOS, Android, and macOS all ship from one `pnpm install`. Here's what's shared, what isn't, and where the seams hurt."

**H2 outline**:

1. The repo layout — Turborepo + pnpm workspaces, packages vs apps
2. Shared core — types, validation (Zod), tRPC contracts
3. Web (Next.js + React Native Web) — when sharing components actually works
4. Mobile (Expo) — what RN Web won't carry
5. Desktop (Tauri) — wrapping the web app, native menus, file system
6. The three places I tried to share too much
7. CI — caching, parallel pipelines, EAS + Vercel + Tauri builds
8. Total LoC saved vs. complexity added — honest scorecard

**Code/visuals**: workspace layout tree; shared `Button` with platform forks; `turbo.json` task graph. ~5 code blocks + 1 diagram.

**Takeaway**: "share types and validation, fork UI; never share routing."

**Internal link out**: from §"The repo layout" of Article 4 → this post.

### 4.4 Article 4 — Inside Etappi (case study)

**Hook**: "Etappi is a task manager I built solo across web, mobile, and desktop. Here's the tour: stack, decisions, what I'd change."

**H2 outline**:

1. The product in 60 seconds (screenshot grid)
2. Stack at a glance (table)
3. Decision 1 — tRPC over REST/GraphQL (and where it strained)
4. Decision 2 — Drizzle + Neon vs Prisma + Postgres
5. Decision 3 — Tauri over Electron
6. Decision 4 — Clerk over rolling auth
7. What's hard about solo cross-platform
8. Roadmap + open-sourceable bits

**Visuals**: 4 screenshots (web/mobile/desktop/auth) + 1 architecture diagram. ~2 code blocks.

**Internal link in**: ← Article 3 §"Total LoC saved vs. complexity added".

### 4.5 Article 5 — Building Life Activity Hub (case study)

**Hook**: "Life Activity Hub is a productivity platform with an AI that plans your day. Here's how it's built."

**H2 outline**:

1. The problem (energy ≠ time; calendar ≠ priorities)
2. Architecture overview (Next 16 PWA + Expo + shared package)
3. The autonomous AI planner — confidence levels, replanning triggers
4. Multi-calendar sync — 5 providers, one engine
5. Energy analytics — feedback loop into scheduling
6. Habits, focus mode, geofencing — feature unlocking strategy
7. Privacy-first AI — what goes to Claude, what stays local
8. What I learned shipping a 16-feature PWA solo

**Visuals**: 5 screenshots + 1 architecture diagram. ~3 code blocks (planner prompt sketch, RRULE bridge, PWA queue stub).

**Internal links in**: ← Articles 1 + 2 hooks.

## 5. SEO + meta

| #   | Primary keyword                        | Secondary keywords                                             |
| --- | -------------------------------------- | -------------------------------------------------------------- |
| 1   | `rrule typescript`                     | `rfc 5545 implementation`, `recurring events typescript`       |
| 2   | `offline first nextjs`                 | `pwa mutation queue`, `background sync ios`                    |
| 3   | `typescript monorepo react native web` | `turborepo expo tauri`, `cross platform typescript`            |
| 4   | `multi platform task manager`          | `turborepo tauri trpc`, `solo developer monorepo`              |
| 5   | `ai daily planner claude`              | `productivity pwa offline`, `autonomous ai agent productivity` |

Frontmatter `excerpt` doubles as meta description. Target ≤ 160 chars where possible.

## 6. Tag taxonomy changes

**Reused this batch** (already present in existing posts): `TypeScript`, `Next.js`, `React Native`, `AI`, `Claude`. (Existing posts also use `Performance`, `Best Practices`, etc. — not reused this batch but noted for taxonomy continuity.)

**New tags introduced this batch**: `RFC 5545`, `RRULE`, `Calendar`, `Edge Cases`, `PWA`, `Offline-First`, `Service Worker`, `Background Sync`, `Monorepo`, `Turborepo`, `Tauri`, `Hono`, `tRPC`, `Case Study`, `Etappi`, `Life Activity Hub`, `Productivity`.

`Case Study` is the load-bearing new tag — future case studies join this cluster.

## 7. Assets

### 7.1 Cover images

Reuse existing Unsplash CDN convention (`?w=1200&q=80`). Image direction per post:

| #   | Direction                                                 |
| --- | --------------------------------------------------------- |
| 1   | Calendar / clockwork mechanical (abstract recurring time) |
| 2   | Network nodes / signal abstraction (sync)                 |
| 3   | Multiple devices on a desk (multi-platform)               |
| 4   | Dark UI dashboard mockup or productivity workspace        |
| 5   | AI / automation visual or planner dashboard               |

URLs picked at write time. Fallback: project screenshot as cover.

### 7.2 Screenshots and diagrams

Stored under `public/images/blog/<project>/` (namespaced). Existing posts use flat `public/images/blog/`; namespacing this batch is intentional.

| #   | Asset                                             | Source                 | Path                                                                                                      |
| --- | ------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | None                                              | —                      | —                                                                                                         |
| 2   | 1 architecture diagram (queue lifecycle)          | New, Excalidraw        | `public/images/blog/pwa-queue.png`                                                                        |
| 3   | 1 ASCII repo tree (inline) + 1 task graph diagram | Excalidraw             | `public/images/blog/monorepo-graph.png`                                                                   |
| 4   | 4 product screenshots + 1 architecture diagram    | Etappi running locally | `public/images/blog/etappi/{web,mobile,desktop,auth}.png`, `public/images/blog/etappi/arch.png`           |
| 5   | 5 product screenshots + 1 architecture diagram    | LAH running locally    | `public/images/blog/lah/{planner,calendar,habits,focus,analytics}.png`, `public/images/blog/lah/arch.png` |

Total new assets: ~13 (9 screenshots + 4 diagrams).

## 8. Internal linking strategy

Contextual prose links inside H2 sections, not "see also" footers.

| From      | To        | Anchor location                         |
| --------- | --------- | --------------------------------------- |
| Article 4 | Article 3 | §"The repo layout"                      |
| Article 5 | Article 1 | §"Multi-calendar sync"                  |
| Article 5 | Article 2 | §"Architecture overview"                |
| Article 3 | Article 4 | §"Total LoC saved vs. complexity added" |
| Article 1 | Article 5 | Hook paragraph                          |
| Article 2 | Article 5 | Hook paragraph                          |

External links: each article cites 1–2 source-of-truth references (e.g. RFC 5545, MDN background sync, Turborepo docs).

## 9. Drafting order vs. publish order

**Publish order** (chronological by `publishedAt`): #1 → #2 → #3 → #4 → #5.

**Drafting order** (by dependency, to keep cross-links resolving):

1. Article 4 (Etappi case study) — simplest, sets stack glossary
2. Article 3 (monorepo deep-dive) — extends #4
3. Article 5 (LAH case study) — second case study, references #1 + #2 (placeholders)
4. Article 1 (RRULE) — narrowest scope, easiest to fact-check
5. Article 2 (PWA mutation queue) — biggest deep-dive, last; benefits from #5 being written

## 10. Definition of done (per article)

Each post ships only when:

- Frontmatter complete: `id`, `slug`, `title`, `excerpt` (target ≤ 160 chars, hard cap 180), `coverImage`, `author`, `publishedAt`, `readingTime`, `category`, `tags`, `featured`, `views: 0`, `likes: 0`
- All H2 sections from the outline are present
- Code blocks compile (TypeScript) or are explicitly marked illustrative
- All internal links resolve to actual slugs (no 404s on publish)
- Screenshots and diagrams committed to `public/images/blog/...`
- Reading time matches estimate ±2 min
- Excerpt reads cleanly out of context (it is the meta description)
- Spell/grammar pass complete
- Local render verified at `/blog/<slug>`

## 11. Out of scope (YAGNI)

- Comments, newsletter signup, analytics changes
- New MDX components (callouts, tabs) unless unavoidable
- Edits to existing 9 posts
- Translations to other locales
- "Ultimate guide" expansions beyond 16 min reading time
- New SEO schema beyond what current posts emit
- Promotion plan (LinkedIn / HN / Twitter copy)
- Cover image URLs (deferred to write time)
- Screenshot capture commands (project-side, not blog-side)

## 12. Risks and mitigations

| Risk                                                                                                                      | Mitigation                                                                                |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Etappi/LAH READMEs evolve while writing → stale facts                                                                     | Snapshot relevant sections into this spec; cite "as of 2026-05-04"                        |
| Screenshots leak in-progress UI not yet shipped                                                                           | Capture from a stable git ref; note ref in image filename                                 |
| 5 posts in 5 weeks aggressive solo                                                                                        | Easiest pair (#4 + #3) first → momentum; biggest (#2) last                                |
| SEO feedback lag (6–8 weeks via Search Console)                                                                           | Set `publishedAt` correctly; resubmit sitemap to GSC after #1                             |
| Cover image picks block drafting                                                                                          | Defer to post-draft; placeholder URL during writing                                       |
| `olesdidukh.dev` has uncommitted changes on `main` (etappi.mdx, life-activity-hub.mdx project pages, blog/page.tsx, etc.) | Confirm intent before authoring; do not stack new work on dirty tree without user signoff |

## 13. Sources of content

- Etappi `README.md` — stack table, feature list, architecture pointers
- Etappi `docs/architecture.md`, `docs/development.md`, `docs/features/*` — deeper detail when drafting
- Life Activity Hub `README.md` — 16-feature inventory, architecture sketch
- Life Activity Hub `apps/web/`, `packages/shared/` — code-level facts during deep-dive drafting
- This spec, frozen at the dates above. Re-snapshot only on user request.

## 14. Next phase

After user review and approval of this spec, transition to the `superpowers:writing-plans` skill to produce a step-by-step implementation plan covering:

- Per-article drafting tasks
- Asset capture tasks (screenshots, diagrams)
- Cover image selection
- Cross-link verification
- Local rendering / DoD verification
- Commit + publish steps per article
