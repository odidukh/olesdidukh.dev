# Blog Articles Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author and ship 5 new MDX blog posts on `olesdidukh.dev` drawing content from the Etappi and Life Activity Hub projects, per the approved spec at `docs/superpowers/specs/2026-05-04-blog-articles-design.md`.

**Architecture:** Each article is a single `.mdx` file under `src/content/blog/` with frontmatter validated by velite (Zod schema in `velite.config.ts`). Build pipeline = `velite && next dev` (or `next build`). Posts render at `/blog/<slug>`. Internal linking is contextual prose. Screenshots/diagrams live under `public/images/blog/<project>/`. Drafting order is dependency-driven (#4 → #3 → #5 → #1 → #2); publish order is chronological by `publishedAt` (#1 → #2 → #3 → #4 → #5).

**Tech Stack:** MDX (Velite + Next.js 16 App Router), TypeScript, Tailwind, Prettier (auto-runs via husky pre-commit), tsc (auto-runs via husky pre-commit). Asset pipeline: static files in `public/`. No new MDX components introduced this batch.

**Spec reference:** `docs/superpowers/specs/2026-05-04-blog-articles-design.md` (commit `88c0218`, status: Approved 2026-05-04).

**Working directory for all tasks:** `/Users/odidukh/development/olesdidukh.dev` (NOT `personal-website` where brainstorming ran). Each task assumes `cd` into this directory first.

---

## File Structure

### Files created (new)

| Path                                                              | Responsibility                                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `src/content/blog/inside-etappi-multi-platform-task-manager.mdx`  | Article 4 — Etappi case study                                   |
| `src/content/blog/typescript-monorepo-web-mobile-desktop.mdx`     | Article 3 — monorepo deep-dive                                  |
| `src/content/blog/building-life-activity-hub-ai-productivity.mdx` | Article 5 — LAH case study                                      |
| `src/content/blog/rrule-rfc-5545-typescript-edge-cases.mdx`       | Article 1 — RRULE deep-dive                                     |
| `src/content/blog/offline-first-pwa-nextjs-mutation-queue.mdx`    | Article 2 — PWA offline deep-dive                               |
| `public/images/blog/etappi/web.png`                               | Etappi web app screenshot (cover candidate + §"Product in 60s") |
| `public/images/blog/etappi/mobile.png`                            | Etappi mobile screenshot                                        |
| `public/images/blog/etappi/desktop.png`                           | Etappi Tauri desktop screenshot                                 |
| `public/images/blog/etappi/auth.png`                              | Etappi sign-in/sign-up flow                                     |
| `public/images/blog/etappi/arch.png`                              | Etappi architecture diagram                                     |
| `public/images/blog/monorepo-graph.png`                           | Turbo task graph diagram (Article 3)                            |
| `public/images/blog/lah/planner.png`                              | LAH AI planner screenshot                                       |
| `public/images/blog/lah/calendar.png`                             | LAH calendar/sync screenshot                                    |
| `public/images/blog/lah/habits.png`                               | LAH streaks/habits screenshot                                   |
| `public/images/blog/lah/focus.png`                                | LAH focus/Pomodoro screenshot                                   |
| `public/images/blog/lah/analytics.png`                            | LAH energy analytics screenshot                                 |
| `public/images/blog/lah/arch.png`                                 | LAH architecture diagram                                        |
| `public/images/blog/pwa-queue.png`                                | PWA mutation-queue lifecycle diagram (Article 2)                |

### Files modified

None — articles are additive. No edits to existing posts, components, or velite config. If the spec's Risk #1 (READMEs evolve) materializes mid-execution, re-snapshot in spec, do NOT modify the plan retroactively.

### Frozen project source references (read-only inputs)

| Path                                                                         | Used by            |
| ---------------------------------------------------------------------------- | ------------------ |
| `~/development/etappi/README.md`                                             | Articles 4 + 3     |
| `~/development/etappi/docs/architecture.md`                                  | Article 3          |
| `~/development/etappi/docs/development.md`                                   | Article 3          |
| `~/development/etappi/turbo.json`                                            | Article 3          |
| `~/development/etappi/package.json` (workspace root)                         | Article 3          |
| `~/development/etappi/apps/web/package.json`                                 | Articles 4 + 3     |
| `~/development/etappi/apps/mobile/package.json`                              | Articles 4 + 3     |
| `~/development/life-activity-hub/README.md`                                  | Articles 5 + 2 + 1 |
| `~/development/life-activity-hub/packages/shared/` (RRULE, scheduling logic) | Article 1          |
| `~/development/life-activity-hub/apps/web/` (service worker, IDB queue)      | Article 2          |

---

## Task 0: Pre-flight check

**Files:** None modified. Read-only verification.

- [ ] **Step 1: Confirm working directory**

```bash
cd /Users/odidukh/development/olesdidukh.dev
pwd
```

Expected output: `/Users/odidukh/development/olesdidukh.dev`

- [ ] **Step 2: Confirm git branch and clean spec/plan files**

```bash
git branch --show-current
git log --oneline -3
```

Expected: branch `main`, top commit `88c0218 docs: mark blog batch spec approved`.

- [ ] **Step 3: Inspect uncommitted state**

```bash
git status --short
```

Expected: ~20 unrelated `M`-marked files (CONTRIBUTING.md, blog/page.tsx, etappi.mdx project page, etc.). These are pre-existing user changes.

**STOP and ask the user**: "olesdidukh.dev main has ~20 uncommitted unrelated files. Stack the 5 new articles on top? Or branch off `88c0218` first?"

If the user says branch: `git stash push -u -m "pre-blog-batch-stash" && git checkout -b blog/articles-batch-2026-05` then `git stash pop` only after each article merges — but plan assumes the user picks the simpler "stack on main" path. If branched, prepend the branch creation to Task 11.

- [ ] **Step 4: Verify dev server starts cleanly (baseline)**

```bash
npm run dev > /tmp/blog-dev-baseline.log 2>&1 &
DEV_PID=$!
sleep 15
curl -sI http://localhost:3000/blog | head -1
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: `HTTP/1.1 200 OK`. Velite must succeed before any new content lands. If velite fails on existing posts, halt and surface the error.

- [ ] **Step 5: Confirm source projects exist locally**

```bash
test -f ~/development/etappi/README.md && echo "etappi OK"
test -f ~/development/life-activity-hub/README.md && echo "lah OK"
```

Expected: both print `OK`.

---

## Task 1: Capture Etappi screenshots and architecture diagram

**Files:**

- Create: `public/images/blog/etappi/{web,mobile,desktop,auth,arch}.png`

**Why first:** Article 4 (drafted next) needs them inline. Capturing now decouples drafting from visual tooling.

- [ ] **Step 1: Start Etappi web locally**

```bash
cd ~/development/etappi
pnpm install --frozen-lockfile
pnpm turbo dev --filter=web --filter=api > /tmp/etappi-dev.log 2>&1 &
ETAPPI_PID=$!
sleep 20
curl -sI http://localhost:3002 | head -1
```

Expected: `HTTP/1.1 200 OK` (port from Etappi README). If different port, read `apps/web/package.json` `dev` script.

- [ ] **Step 2: Capture web screenshot (logged-in dashboard)**

Open `http://localhost:3002` in Chrome (or use Chrome DevTools MCP). Sign in. Navigate to default tasks view. Capture full-page screenshot at 1440×900 (light mode) and save to:

`/Users/odidukh/development/olesdidukh.dev/public/images/blog/etappi/web.png`

Constraints: PNG, ≤ 500 KB after compression (use `pngquant` if needed: `pngquant --quality 65-85 web.png --output web.png --force`).

- [ ] **Step 3: Capture mobile screenshot**

Two paths: (a) Expo simulator if running (`pnpm turbo dev --filter=mobile`), capture device frame at iPhone 15 size, OR (b) Chrome DevTools device emulation at "iPhone 15 Pro" against the web app if PWA install path looks acceptable.

Save to `public/images/blog/etappi/mobile.png`.

- [ ] **Step 4: Capture desktop screenshot**

Run Tauri build: `cd ~/development/etappi && pnpm turbo dev --filter=desktop` (verify command in `apps/desktop/package.json`). Capture native window with macOS chrome visible. Save to `public/images/blog/etappi/desktop.png`.

If Tauri toolchain not installed, skip and add a single-line note in Article 4's §1 ("Desktop screenshot pending Tauri build setup") — do not block.

- [ ] **Step 5: Capture auth flow**

Sign-out, capture sign-in screen at 1440×900. Save to `public/images/blog/etappi/auth.png`.

- [ ] **Step 6: Create Etappi architecture diagram**

Use Excalidraw (https://excalidraw.com) — boxes for: `web (Next.js + RN Web)`, `mobile (Expo)`, `desktop (Tauri)`, shared `packages/shared`, API (`Hono + tRPC`), DB (`Neon Postgres + Drizzle`), Auth (`Clerk`), Storage (`R2`), Push (`Web Push + Expo Push`). Arrows show data flow. Export as PNG at 2x scale.

Save to `public/images/blog/etappi/arch.png`.

- [ ] **Step 7: Stop Etappi servers**

```bash
kill $ETAPPI_PID 2>/dev/null
pkill -f "turbo dev" 2>/dev/null || true
```

- [ ] **Step 8: Verify image dimensions and total size**

```bash
cd /Users/odidukh/development/olesdidukh.dev
ls -lh public/images/blog/etappi/
file public/images/blog/etappi/*.png
```

Expected: 4-5 PNGs, each ≤ 500 KB, all PNG format. Total folder ≤ 2.5 MB.

- [ ] **Step 9: Commit assets**

```bash
git add public/images/blog/etappi/
git commit -m "feat(blog): add Etappi screenshots and architecture diagram"
```

Expected: pre-commit hook runs prettier on stages files (no MDX/TS staged → no-op) and tsc (no .ts changes → no-op). Commit succeeds.

---

## Task 2: Draft Article 4 — Inside Etappi (case study)

**Files:**

- Create: `src/content/blog/inside-etappi-multi-platform-task-manager.mdx`

**Source facts:** Use `~/development/etappi/README.md` for stack table verbatim. Cite tRPC, Drizzle, Tauri, Clerk decisions from spec §4.4.

- [ ] **Step 1: Create the file with full frontmatter**

Write to `src/content/blog/inside-etappi-multi-platform-task-manager.mdx`:

```mdx
---
id: 'inside-etappi'
slug: 'inside-etappi-multi-platform-task-manager'
title: 'Inside Etappi: Building a Multi-Platform Task Manager Solo with Turborepo, tRPC, and Tauri'
excerpt: 'A tour of Etappi: stack, architecture, and four decisions I made building a task manager that ships to web, mobile, and desktop from one TypeScript monorepo.'
coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&q=80'
author:
  name: 'Oles Didukh'
  avatar: '/images/avatar.png'
  role: 'Senior Front-End Engineer'
publishedAt: '2026-06-01'
readingTime: 11
category: 'Case Study'
tags:
  - 'Case Study'
  - 'Etappi'
  - 'Turborepo'
  - 'tRPC'
  - 'Tauri'
  - 'Hono'
featured: false
views: 0
likes: 0
---
```

Excerpt is 187 chars — under velite cap of 200, slightly over spec target of 160 (within 180 hard cap). If you tighten the wording later, recheck char count.

- [ ] **Step 2: Add the body skeleton (H2 stubs only)**

Append to the same file, after the frontmatter:

```mdx
# Inside Etappi: Building a Multi-Platform Task Manager Solo

## The product in 60 seconds

## Stack at a glance

## Decision 1: tRPC over REST/GraphQL

## Decision 2: Drizzle + Neon over Prisma + Postgres

## Decision 3: Tauri over Electron

## Decision 4: Clerk over rolling auth

## What's hard about solo cross-platform

## Roadmap and open-sourceable bits
```

- [ ] **Step 3: Run velite to confirm frontmatter validates**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
grep -i "error\|invalid" /tmp/blog-dev.log | head
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: no error/invalid lines mentioning `inside-etappi-multi-platform-task-manager`. If schema fails (e.g., `excerpt too long`), trim and re-run.

- [ ] **Step 4: Draft §"The product in 60 seconds"**

Target: 80–120 words. Lead with the 1-sentence pitch from Etappi's README ("A fast, offline-first task manager built for speed, sync, and simplicity."). Follow with a 2-3 sentence narrative on what's distinctive: cross-platform parity, offline-first, solo build. Embed the screenshot grid:

```mdx
<img src="/images/blog/etappi/web.png" alt="Etappi web app dashboard" />
<img src="/images/blog/etappi/mobile.png" alt="Etappi on iOS" />
<img src="/images/blog/etappi/desktop.png" alt="Etappi on macOS via Tauri" />
```

(If MDX `<img>` rendering doesn't match site style, swap to native markdown `![alt](path)` — check existing posts for the convention by grepping one: `grep -l 'public/images/blog' src/content/blog/*.mdx | head -1 | xargs head -80`.)

- [ ] **Step 5: Draft §"Stack at a glance"**

Reproduce Etappi's README stack table (Layer / Technology / Version), then add 1 paragraph framing the choices ("everything is TypeScript, runtime is Node 22, monorepo via Turbo + pnpm").

Target: 60–90 words plus the table.

- [ ] **Step 6: Draft Decision 1 — tRPC over REST/GraphQL**

Target: 200–260 words. Structure: (a) why tRPC was chosen (end-to-end types between Hono API and 3 client apps), (b) where it strained (mobile cold-start, error shape, no native HTTP caching layer), (c) the workaround (typed wrapper + custom error mapper). Include 1 short code block showing a tRPC procedure shape.

- [ ] **Step 7: Draft Decisions 2–4**

Each: 180–240 words, same structure (why → friction → resolution). Decision 4 closes with the "I would not roll auth solo" takeaway.

- [ ] **Step 8: Draft §"What's hard about solo cross-platform"**

Target: 200–260 words. 4 concrete pain points (numbered list, prose under each): (1) 3 release pipelines, (2) 3 review processes (App Store, Play, Tauri/notarization), (3) keeping shared types stable across versions, (4) telemetry per platform.

- [ ] **Step 9: Draft §"Roadmap and open-sourceable bits"**

Target: 100–140 words. List: 2-3 things planned, 1-2 packages that could open source. Close with internal-link forward to Article 3.

Insert internal link verbatim: `[a deep-dive on the monorepo structure](/blog/typescript-monorepo-web-mobile-desktop)`. Article 3 doesn't exist yet at this point — that's expected. Verify in Task 11.

- [ ] **Step 10: Add architecture diagram in §"Stack at a glance"**

After the stack table, insert:

```mdx
<img
  src="/images/blog/etappi/arch.png"
  alt="Etappi architecture: shared core feeds web, mobile, and desktop apps; API on Hono + tRPC; Neon Postgres via Drizzle"
/>
```

- [ ] **Step 11: Add cover image (replace placeholder URL)**

Open https://unsplash.com and search `productivity workspace dark`. Pick a horizontal-orientation photo. Right-click → Copy Image Address. Replace `coverImage:` value in frontmatter with the chosen URL, keeping `?w=1200&q=80` query params.

If no acceptable Unsplash match, fall back: `coverImage: '/images/blog/etappi/web.png'`.

- [ ] **Step 12: Verify reading time matches frontmatter**

```bash
wc -w src/content/blog/inside-etappi-multi-platform-task-manager.mdx
```

Expected: 1900–2400 words (≈11 min at 200 wpm). If far off, adjust `readingTime` in frontmatter to actual rounded minutes (≥9, ≤13).

- [ ] **Step 13: Verify it renders**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -sI http://localhost:3000/blog/inside-etappi-multi-platform-task-manager | head -1
grep -i "error\|invalid" /tmp/blog-dev.log | head
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: `HTTP/1.1 200 OK`, no error lines. If 404, check slug matches frontmatter and file name. If 500, read full log.

- [ ] **Step 14: Type-check and format**

```bash
npm run type-check
npx prettier --check src/content/blog/inside-etappi-multi-platform-task-manager.mdx || npx prettier --write src/content/blog/inside-etappi-multi-platform-task-manager.mdx
```

Expected: type-check passes. Prettier writes formatted output if needed.

- [ ] **Step 15: Commit**

```bash
git add src/content/blog/inside-etappi-multi-platform-task-manager.mdx
git commit -m "feat(blog): add Inside Etappi case study (article 4 of batch)"
```

Pre-commit runs prettier + tsc. Both should pass.

---

## Task 3: Capture Article 3 diagram (monorepo task graph)

**Files:**

- Create: `public/images/blog/monorepo-graph.png`

- [ ] **Step 1: Generate Turbo task graph from Etappi**

```bash
cd ~/development/etappi
pnpm turbo run build --graph=/tmp/etappi-graph.html --dry=json > /tmp/etappi-graph.json 2>/dev/null || true
pnpm turbo run build --graph > /tmp/etappi-graph.dot 2>/dev/null || true
cat /tmp/etappi-graph.dot | head
```

Note the actual Turbo CLI flag — versions differ. If `--graph` isn't supported, generate manually in Excalidraw with: nodes = `db#build`, `web#build`, `api#build`, `mobile#build`, `desktop#build`, edges = dependency arrows.

- [ ] **Step 2: Render to PNG**

If Graphviz available: `dot -Tpng /tmp/etappi-graph.dot -o /tmp/etappi-graph.png`. Otherwise render in Excalidraw and export PNG at 2x.

- [ ] **Step 3: Move final PNG into the blog assets folder**

```bash
mkdir -p /Users/odidukh/development/olesdidukh.dev/public/images/blog
cp /tmp/etappi-graph.png /Users/odidukh/development/olesdidukh.dev/public/images/blog/monorepo-graph.png
```

- [ ] **Step 4: Compress and verify**

```bash
cd /Users/odidukh/development/olesdidukh.dev
pngquant --quality 65-85 public/images/blog/monorepo-graph.png --output public/images/blog/monorepo-graph.png --force 2>/dev/null || true
ls -lh public/images/blog/monorepo-graph.png
```

Expected: ≤ 300 KB.

- [ ] **Step 5: Commit**

```bash
git add public/images/blog/monorepo-graph.png
git commit -m "feat(blog): add monorepo task graph diagram"
```

---

## Task 4: Draft Article 3 — TypeScript monorepo across web/mobile/desktop

**Files:**

- Create: `src/content/blog/typescript-monorepo-web-mobile-desktop.mdx`

**Source facts:** `~/development/etappi/turbo.json`, `~/development/etappi/package.json`, `~/development/etappi/apps/*/package.json`, `~/development/etappi/packages/*/package.json` (ls the packages dir first).

- [ ] **Step 1: Survey Etappi packages and apps**

```bash
ls ~/development/etappi/apps/ ~/development/etappi/packages/
cat ~/development/etappi/turbo.json
cat ~/development/etappi/package.json | python3 -c "import json,sys; p=json.load(sys.stdin); print('workspaces:', p.get('workspaces')); print('packageManager:', p.get('packageManager'))"
```

Capture output for use in §"The repo layout".

- [ ] **Step 2: Create file with frontmatter**

Write to `src/content/blog/typescript-monorepo-web-mobile-desktop.mdx`:

```mdx
---
id: 'typescript-monorepo-web-mobile-desktop'
slug: 'typescript-monorepo-web-mobile-desktop'
title: 'One TypeScript Monorepo, Three Platforms: Shipping Web, Mobile, and Desktop from a Single Codebase'
excerpt: 'Six months running web, iOS, Android, and macOS out of one Turborepo. What I share, what I fork, and where the seams hurt — an honest scorecard.'
coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80'
author:
  name: 'Oles Didukh'
  avatar: '/images/avatar.png'
  role: 'Senior Front-End Engineer'
publishedAt: '2026-05-25'
readingTime: 15
category: 'Architecture'
tags:
  - 'Monorepo'
  - 'Turborepo'
  - 'React Native'
  - 'Tauri'
  - 'TypeScript'
featured: true
views: 0
likes: 0
---
```

- [ ] **Step 3: Add H2 skeleton**

```mdx
# One TypeScript Monorepo, Three Platforms

## The repo layout

## Shared core: types, validation, tRPC contracts

## Web: Next.js plus React Native Web

## Mobile: Expo and the limits of RN Web

## Desktop: Tauri, native menus, and the file system

## Three places I tried to share too much

## CI: caching, parallel pipelines, and three release surfaces

## Total LoC saved vs. complexity added — honest scorecard
```

- [ ] **Step 4: Draft §"The repo layout"**

Target: 200–260 words. Include:

- ASCII tree of `apps/` and `packages/` (output from Step 1)
- 1 code block showing `turbo.json` `pipeline` excerpt (`build`, `dev`, `lint`, `test`)
- The `monorepo-graph.png` image:

```mdx
<img
  src="/images/blog/monorepo-graph.png"
  alt="Etappi turbo task graph: db build feeds api and web; web feeds desktop; mobile builds independently"
/>
```

- [ ] **Step 5: Draft §"Shared core"**

Target: 220–280 words + 1 code block. Show: a Zod schema in `packages/shared/`, the inferred TS type, and a tRPC procedure consuming it. Highlight: schema lives once, types flow to all 3 apps.

- [ ] **Step 6: Draft §"Web: Next.js plus React Native Web"**

Target: 200–260 words. 1 code block showing a shared `Button` component (RN primitives) imported by Next.js. Note caveats: hover styles, scroll containers, `<a>` vs `Link` divergence.

- [ ] **Step 7: Draft §"Mobile: Expo and the limits of RN Web"**

Target: 220–280 words. List 4–5 specific RN APIs that don't carry to web (haptics, push tokens, background tasks, native gestures). For each: 1 sentence on the platform fork pattern (`Component.web.tsx` vs `Component.native.tsx`).

- [ ] **Step 8: Draft §"Desktop: Tauri"**

Target: 200–260 words. Cover: Tauri wraps `apps/web` build, IPC for native menus, Rust commands for filesystem, code-signing pipeline (notarization for macOS). 1 code block showing a Tauri `invoke` from TS.

- [ ] **Step 9: Draft §"Three places I tried to share too much"**

Target: 240–300 words. Honest counterexamples:

1. Routing/navigation (Next.js App Router vs React Navigation — fundamentally different mental models)
2. Form libraries (RHF works on web, but RN form UX is gestural)
3. Persistence (LocalStorage vs MMKV vs SQLite via Drizzle)

- [ ] **Step 10: Draft §"CI"**

Target: 180–220 words. Cover: Turbo remote cache, parallel matrix (web → Vercel, mobile → EAS, desktop → GitHub Actions Tauri builder), how to keep CI under 8 minutes for the common path.

- [ ] **Step 11: Draft §"Honest scorecard" (final)**

Target: 220–300 words. Concrete numbers:

- LoC in `packages/shared/`
- LoC in `apps/web/` vs `apps/mobile/` vs `apps/desktop/`
- Estimated % shared vs forked
- Honest cons: setup overhead, CI complexity, harder onboarding for contributors

Close with internal-link back to case study: `[See the full Etappi case study](/blog/inside-etappi-multi-platform-task-manager).`

- [ ] **Step 12: Pick cover image**

Search Unsplash for `multiple devices desk` or `monitor laptop phone`. Update `coverImage` URL in frontmatter.

- [ ] **Step 13: Verify reading time**

```bash
wc -w src/content/blog/typescript-monorepo-web-mobile-desktop.mdx
```

Expected: 2700–3300 words (~15 min). Adjust `readingTime` if outside ±2 min.

- [ ] **Step 14: Verify render + type-check**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -sI http://localhost:3000/blog/typescript-monorepo-web-mobile-desktop | head -1
grep -i "error\|invalid" /tmp/blog-dev.log | head
kill $DEV_PID
wait $DEV_PID 2>/dev/null
npm run type-check
```

Expected: `200 OK`, no errors.

- [ ] **Step 15: Commit**

```bash
git add src/content/blog/typescript-monorepo-web-mobile-desktop.mdx
git commit -m "feat(blog): add TypeScript monorepo deep-dive (article 3 of batch)"
```

---

## Task 5: Capture LAH screenshots and architecture diagram

**Files:**

- Create: `public/images/blog/lah/{planner,calendar,habits,focus,analytics,arch}.png`

- [ ] **Step 1: Start LAH web**

```bash
cd ~/development/life-activity-hub
npm install --frozen-lockfile 2>/dev/null || pnpm install --frozen-lockfile
# Confirm dev command from root package.json
cat package.json | python3 -c "import json,sys; p=json.load(sys.stdin); print(p['scripts'])" | head -20
```

Run the dev command surfaced. Wait 20s, hit `http://localhost:3000` (or the port surfaced in dev output).

- [ ] **Step 2–6: Capture five product screenshots**

Sign in (or use a seeded demo account). Capture each at 1440×900, save to `public/images/blog/lah/`:

| File            | View                                   |
| --------------- | -------------------------------------- |
| `planner.png`   | Today's AI-generated plan              |
| `calendar.png`  | Multi-calendar weekly view             |
| `habits.png`    | Streak/chain calendar with a milestone |
| `focus.png`     | Focus mode mid-Pomodoro                |
| `analytics.png` | Energy analytics dashboard             |

Compress each: `pngquant --quality 65-85 <file> --output <file> --force`.

- [ ] **Step 7: Build LAH architecture diagram**

Excalidraw — boxes for: `apps/web (Next 16 PWA)`, `apps/mobile (Expo)`, `packages/shared`, IndexedDB (local), Service Worker, AI planner (Claude API), Calendar providers (5 boxes: Google, CalDAV, Outlook, Nextcloud, Fastmail), Backup providers (S3, Drive, Dropbox), Postgres (Prisma), and Google Fit. Arrows indicate sync direction.

Export at 2x scale. Save to `public/images/blog/lah/arch.png`.

- [ ] **Step 8: Stop LAH dev server**

```bash
pkill -f "next dev" 2>/dev/null || true
```

- [ ] **Step 9: Verify and commit**

```bash
cd /Users/odidukh/development/olesdidukh.dev
ls -lh public/images/blog/lah/
git add public/images/blog/lah/
git commit -m "feat(blog): add Life Activity Hub screenshots and architecture diagram"
```

Total folder ≤ 3 MB.

---

## Task 6: Draft Article 5 — Building Life Activity Hub (case study)

**Files:**

- Create: `src/content/blog/building-life-activity-hub-ai-productivity.mdx`

**Source facts:** `~/development/life-activity-hub/README.md` (16-feature inventory), `packages/shared/` for planner code references, `apps/web/` for PWA hooks. Articles 1 + 2 don't exist yet — internal-link slugs are written verbatim, verified in Task 11.

- [ ] **Step 1: Create file with frontmatter**

```mdx
---
id: 'building-life-activity-hub'
slug: 'building-life-activity-hub-ai-productivity'
title: 'Building Life Activity Hub: An AI-Powered Productivity Platform That Plans Your Day'
excerpt: 'A tour of Life Activity Hub: 16 features, 5 calendar providers, an autonomous AI planner, and an offline-first PWA — built solo with Next.js 16 and Expo.'
coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'
author:
  name: 'Oles Didukh'
  avatar: '/images/avatar.png'
  role: 'Senior Front-End Engineer'
publishedAt: '2026-06-08'
readingTime: 12
category: 'Case Study'
tags:
  - 'Case Study'
  - 'Life Activity Hub'
  - 'AI'
  - 'Claude'
  - 'PWA'
  - 'Productivity'
featured: false
views: 0
likes: 0
---
```

- [ ] **Step 2: Add H2 skeleton**

```mdx
# Building Life Activity Hub

## The problem: energy is not time, calendar is not priorities

## Architecture overview

## The autonomous AI planner: confidence levels and replanning triggers

## Multi-calendar sync: five providers, one engine

## Energy analytics: feedback loop into scheduling

## Habits, focus, geofencing — feature unlocking strategy

## Privacy-first AI: what goes to Claude, what stays local

## What I learned shipping a 16-feature PWA solo
```

- [ ] **Step 3: Draft §"The problem"** (hook section)

Target: 140–200 words. Personal narrative. Hook line: "Life Activity Hub is a productivity platform with an AI that plans your day. Here's how it's built." Forward-link the AI/sync/PWA angle. End with a forward link to Article 2 in the hook paragraph: `[the offline-first PWA architecture I built it on](/blog/offline-first-pwa-nextjs-mutation-queue)`.

- [ ] **Step 4: Draft §"Architecture overview"**

Target: 220–280 words. Insert the LAH arch diagram:

```mdx
<img
  src="/images/blog/lah/arch.png"
  alt="LAH architecture: PWA web app and Expo mobile share packages/shared; service worker queues offline mutations; Claude planner reads context and writes back schedule"
/>
```

Cover: monorepo split (apps/web, apps/mobile, packages/shared), data flow (local IDB → API → Postgres), service worker boundary. Add inline link: `the [mutation queue deep-dive](/blog/offline-first-pwa-nextjs-mutation-queue)`.

- [ ] **Step 5: Draft §"The autonomous AI planner"**

Target: 280–340 words + 1 code block. Cover: confidence threshold model, when the planner replans (morning, mid-day, calendar change), graceful degradation when API down, the "autonomy levels" feature. Include a sketch of the planner prompt (no real secrets — strip identifiers).

Insert screenshot: `<img src="/images/blog/lah/planner.png" alt="LAH AI planner showing today's schedule with confidence indicators" />`.

- [ ] **Step 6: Draft §"Multi-calendar sync"**

Target: 240–300 words. Five providers (Google, CalDAV/Apple, Outlook, Nextcloud, Fastmail), one bidirectional sync engine on top of RFC 5545. Mention the RRULE complexity and forward-link: `[the RRULE edge cases I hit](/blog/rrule-rfc-5545-typescript-edge-cases)`.

Insert screenshot: `<img src="/images/blog/lah/calendar.png" alt="LAH weekly calendar view with events from multiple providers" />`.

- [ ] **Step 7: Draft §"Energy analytics"**

Target: 200–260 words. The feedback loop: log activity → 5-point energy impact → tag/category/time-of-day correlations → recommendations feed back into planner. Insert `analytics.png` screenshot.

- [ ] **Step 8: Draft §"Habits, focus, geofencing — feature unlocking strategy"**

Target: 220–280 words. Cover the PROGRESSIVE vs FULL feature mode, intro cards, milestone celebrations. Insert `habits.png` and `focus.png` screenshots.

- [ ] **Step 9: Draft §"Privacy-first AI"**

Target: 180–240 words. Concrete: what fields are sent to Claude (activity titles, durations, energy tags), what's redacted (location, notes by default), how the user controls it. Cover encrypted backup (AES-256-GCM) at the section close.

- [ ] **Step 10: Draft §"What I learned"**

Target: 200–260 words. 4–5 concrete lessons: solo scope discipline, why progressive feature unlocking saved bug surface, what shipping a PWA actually meant in 2026, where Claude-as-a-feature draws the line at "tool" vs "agent."

- [ ] **Step 11: Pick cover image**

Search Unsplash `daily planner journal` or use one of the LAH screenshots (`planner.png`) as fallback cover.

- [ ] **Step 12: Verify**

```bash
wc -w src/content/blog/building-life-activity-hub-ai-productivity.mdx
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -sI http://localhost:3000/blog/building-life-activity-hub-ai-productivity | head -1
grep -i "error\|invalid" /tmp/blog-dev.log | head
kill $DEV_PID
wait $DEV_PID 2>/dev/null
npm run type-check
```

Expected: 2100–2700 words, `200 OK`, no errors. Internal links to Articles 1 and 2 will currently 404 — that's expected; verified after both are written.

- [ ] **Step 13: Commit**

```bash
git add src/content/blog/building-life-activity-hub-ai-productivity.mdx
git commit -m "feat(blog): add Life Activity Hub case study (article 5 of batch)"
```

---

## Task 7: Draft Article 1 — RRULE in TypeScript

**Files:**

- Create: `src/content/blog/rrule-rfc-5545-typescript-edge-cases.mdx`

**Source facts:** RFC 5545 spec (https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10), `rrule.js` library docs (https://github.com/jakubroztocil/rrule), real LAH code paths in `~/development/life-activity-hub/packages/shared/` (grep for `RRULE` / `rrule` / `expandRecurrence`).

- [ ] **Step 1: Survey LAH RRULE code**

```bash
grep -rn "RRULE\|rrule\|expandRecurrence" ~/development/life-activity-hub/packages/shared/ ~/development/life-activity-hub/apps/web/src/ 2>/dev/null | head -30
```

Capture the actual function names, signatures, and which library is used. Use real names in code blocks (with secrets/identifiers stripped).

- [ ] **Step 2: Create file with frontmatter**

```mdx
---
id: 'rrule-rfc-5545-typescript-edge-cases'
slug: 'rrule-rfc-5545-typescript-edge-cases'
title: 'Implementing RFC 5545 RRULE in TypeScript: Edge Cases Nobody Warns You About'
excerpt: 'Calendar sync sounds easy until your unit tests pass and production users see ghost events on Halloween. Four RRULE edge cases I hit in production.'
coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80'
author:
  name: 'Oles Didukh'
  avatar: '/images/avatar.png'
  role: 'Senior Front-End Engineer'
publishedAt: '2026-05-11'
readingTime: 14
category: 'Architecture'
tags:
  - 'RFC 5545'
  - 'RRULE'
  - 'Calendar'
  - 'TypeScript'
  - 'Edge Cases'
featured: false
views: 0
likes: 0
---
```

- [ ] **Step 3: Add H2 skeleton**

```mdx
# Implementing RFC 5545 RRULE in TypeScript

## Why RRULE? The 60-line ICS string that runs your calendar

## The library landscape: rrule.js, ical.js, and roll-your-own

## Edge case 1: DST transitions

## Edge case 2: BYSETPOS plus BYDAY (the "last weekday" trap)

## Edge case 3: EXDATE with timezone mismatches

## Edge case 4: COUNT vs UNTIL and floating dates

## Testing strategy: 10k recurrences and reference parsers

## What I'd do differently next time
```

- [ ] **Step 4: Draft §"Why RRULE?"**

Target: 180–240 words. Hook paragraph (the "Halloween ghost events" line). Explain ICS recurrence in 1 paragraph. Show a real RRULE string example: `FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1` and explain what it means.

Forward-link to LAH case study in the hook: `This is part of how [Life Activity Hub](/blog/building-life-activity-hub-ai-productivity) syncs across five providers.`

- [ ] **Step 5: Draft §"The library landscape"**

Target: 240–300 words + 1 comparison snippet. Compare `rrule.js` (most popular, sometimes wrong on edge timezones), `ical.js` (Mozilla, stricter, heavier), and roll-your-own (don't, except for an `expandRecurrence` wrapper). 1 code block showing the wrapper signature (real signature from LAH, names sanitized).

- [ ] **Step 6: Draft Edge case 1 — DST transitions**

Target: 280–340 words + 2 code blocks. The `2:30 AM on spring-forward Sunday` problem. Show: input rule, expected output, actual output from `rrule.js` with floating dates, fix using `tzid` strings. Cite Postgres `timestamptz` storage strategy.

- [ ] **Step 7: Draft Edge case 2 — BYSETPOS + BYDAY**

Target: 240–300 words + 2 code blocks. "Last weekday of the month" rule. Show how `BYSETPOS=-1` interacts with `BYDAY=MO,TU,WE,TH,FR`. Common mistake: assuming "last working day". Show test case for end-of-quarter dates.

- [ ] **Step 8: Draft Edge case 3 — EXDATE timezone**

Target: 220–280 words + 1 code block. EXDATE without `TZID` defaults to floating, but parent RRULE has `TZID` — mismatch silently drops nothing. Show fix: always normalize TZID at parse time.

- [ ] **Step 9: Draft Edge case 4 — COUNT vs UNTIL**

Target: 220–280 words + 1 code block. UNTIL must be UTC (`Z` suffix) per RFC, COUNT is integer. Mixing them up vs combined-not-allowed nuance.

- [ ] **Step 10: Draft §"Testing strategy"**

Target: 240–300 words + 1 code block. The pattern: generate 10,000 recurrences from a fixture set, diff against `rrule.js` reference output. Use property-based testing (e.g., fast-check) for date ranges. Show one snippet of the test harness.

- [ ] **Step 11: Draft §"What I'd do differently"**

Target: 160–220 words. 4 takeaway rules in a list. Close with: would I write my own RRULE expander? No — wrap a battle-tested library and unit-test the wrapper.

- [ ] **Step 12: Pick cover image**

Search Unsplash `clockwork mechanical gears` or `analog calendar`. Update `coverImage` URL.

- [ ] **Step 13: Verify**

```bash
wc -w src/content/blog/rrule-rfc-5545-typescript-edge-cases.mdx
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -sI http://localhost:3000/blog/rrule-rfc-5545-typescript-edge-cases | head -1
grep -i "error\|invalid" /tmp/blog-dev.log | head
kill $DEV_PID
wait $DEV_PID 2>/dev/null
npm run type-check
```

Expected: 2500–3100 words (~14 min), `200 OK`, no errors.

- [ ] **Step 14: Commit**

```bash
git add src/content/blog/rrule-rfc-5545-typescript-edge-cases.mdx
git commit -m "feat(blog): add RRULE edge cases deep-dive (article 1 of batch)"
```

---

## Task 8: Capture PWA mutation-queue diagram

**Files:**

- Create: `public/images/blog/pwa-queue.png`

- [ ] **Step 1: Build the diagram in Excalidraw**

States/boxes:

1. UI mutation triggered
2. Optimistic local apply (IDB write)
3. Enqueue mutation (queue store in IDB)
4. Service worker `sync` event (or fallback poll on iOS)
5. Replay against API
6. On 2xx: dequeue + reconcile remote state
7. On 5xx/network: backoff + retry
8. On 409 conflict: domain-specific merge handler

Use distinct colors for: UI thread, IDB, Service Worker, Network.

Export at 2x scale.

- [ ] **Step 2: Save and compress**

```bash
cp /tmp/pwa-queue.png /Users/odidukh/development/olesdidukh.dev/public/images/blog/pwa-queue.png
cd /Users/odidukh/development/olesdidukh.dev
pngquant --quality 65-85 public/images/blog/pwa-queue.png --output public/images/blog/pwa-queue.png --force 2>/dev/null || true
ls -lh public/images/blog/pwa-queue.png
```

Expected: ≤ 300 KB.

- [ ] **Step 3: Commit**

```bash
git add public/images/blog/pwa-queue.png
git commit -m "feat(blog): add PWA mutation queue lifecycle diagram"
```

---

## Task 9: Draft Article 2 — Offline-first PWA in Next.js 16

**Files:**

- Create: `src/content/blog/offline-first-pwa-nextjs-mutation-queue.mdx`

**Source facts:** `~/development/life-activity-hub/apps/web/` (find service worker file, IDB queue module). Real production behavior cited as "in Life Activity Hub..."

- [ ] **Step 1: Survey LAH PWA code**

```bash
find ~/development/life-activity-hub/apps/web/ -type f \( -name "service-worker*" -o -name "sw.*" -o -name "*queue*" -o -name "*offline*" \) 2>/dev/null | head -10
grep -rn "SyncManager\|sync\.register\|backgroundSync" ~/development/life-activity-hub/apps/web/src/ 2>/dev/null | head -10
```

Capture file paths and key function names for accurate code blocks.

- [ ] **Step 2: Create file with frontmatter**

```mdx
---
id: 'offline-first-pwa-nextjs-mutation-queue'
slug: 'offline-first-pwa-nextjs-mutation-queue'
title: 'Offline-First PWAs in Next.js 16: Mutation Queues, Background Sync, and Conflict Resolution'
excerpt: 'Most offline tutorials stop at caching GETs. Real offline means writes survive a flight and merge cleanly when they land. Production patterns from a Next.js 16 PWA.'
coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80'
author:
  name: 'Oles Didukh'
  avatar: '/images/avatar.png'
  role: 'Senior Front-End Engineer'
publishedAt: '2026-05-18'
readingTime: 16
category: 'PWA'
tags:
  - 'PWA'
  - 'Next.js'
  - 'Offline-First'
  - 'Service Worker'
  - 'Background Sync'
featured: true
views: 0
likes: 0
---
```

- [ ] **Step 3: Add H2 skeleton**

```mdx
# Offline-First PWAs in Next.js 16

## The four levels of offline

## Service worker strategy in Next.js 16

## The mutation queue: IndexedDB schema, retry, idempotency

## Background sync: Chrome Android vs. iOS Safari

## Conflict resolution: last-write-wins, CRDTs, or domain merge

## Storage management: quota, eviction, persistent storage prompt

## Telemetry: knowing it works in the wild

## Production results from Life Activity Hub
```

- [ ] **Step 4: Draft §"The four levels of offline"**

Target: 220–280 words. Define a hierarchy:

1. Cache-first GETs
2. Read replicas (full data set offline)
3. Writable (mutation queue)
4. Conflict-aware (deterministic merge)

Forward-link in the hook: `This is the architecture under [Life Activity Hub](/blog/building-life-activity-hub-ai-productivity).`

- [ ] **Step 5: Draft §"Service worker strategy in Next.js 16"**

Target: 260–320 words + 1 code block. App Router constraints (no built-in SW), choice of `next-pwa` vs custom registration via Workbox. Show the SW registration call from `app/layout.tsx` or a client provider.

- [ ] **Step 6: Draft §"The mutation queue"**

Target: 320–380 words + 2 code blocks. Insert the lifecycle diagram:

```mdx
<img
  src="/images/blog/pwa-queue.png"
  alt="Mutation queue lifecycle: optimistic local apply, enqueue, service worker sync, replay, dequeue or backoff"
/>
```

Code block 1: IDB schema (object stores for `mutations`, `meta`). Code block 2: `enqueue` and `replay` functions (TypeScript, with idempotency keys via `crypto.randomUUID`).

- [ ] **Step 7: Draft §"Background sync"**

Target: 280–340 words + 1 code block. Cover: Chrome Android `sync.register('replay-mutations')` works; iOS Safari does not — fallback is poll on app foreground (`visibilitychange`). Show both code paths.

- [ ] **Step 8: Draft §"Conflict resolution"**

Target: 280–340 words + 1 code block. Tradeoffs: LWW (simple, lossy), CRDTs (heavy, principled), domain-specific merge (best for activity data). Show the merge function for activity edits — illustrative TypeScript with explicit precedence rules (e.g., title from latest writer, completion timestamps unioned).

- [ ] **Step 9: Draft §"Storage management"**

Target: 220–280 words + 1 code block. `navigator.storage.estimate()`, `persist()` prompt, eviction priority by mutation age vs read-cache.

- [ ] **Step 10: Draft §"Telemetry"**

Target: 200–260 words. Specific metrics LAH tracks: queue depth, mean time-to-replay, conflict rate, persistent storage grant rate. Cite that without these you cannot verify the system works in production.

- [ ] **Step 11: Draft §"Production results"**

Target: 180–240 words. Concrete numbers from LAH (or labeled estimates). Close with link back to LAH case study: `[See how this fits into Life Activity Hub](/blog/building-life-activity-hub-ai-productivity).`

- [ ] **Step 12: Pick cover image**

Search Unsplash `airplane window cloud` (offline-flight metaphor) or `network nodes`. Update `coverImage`.

- [ ] **Step 13: Verify**

```bash
wc -w src/content/blog/offline-first-pwa-nextjs-mutation-queue.mdx
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -sI http://localhost:3000/blog/offline-first-pwa-nextjs-mutation-queue | head -1
grep -i "error\|invalid" /tmp/blog-dev.log | head
kill $DEV_PID
wait $DEV_PID 2>/dev/null
npm run type-check
```

Expected: 3000–3600 words (~16 min), `200 OK`, no errors.

- [ ] **Step 14: Commit**

```bash
git add src/content/blog/offline-first-pwa-nextjs-mutation-queue.mdx
git commit -m "feat(blog): add offline-first PWA deep-dive (article 2 of batch)"
```

---

## Task 10: Cross-link integrity sweep

**Files:** Read-only. May edit any of the 5 articles if a link target is wrong.

- [ ] **Step 1: List every internal link in the new posts**

```bash
cd /Users/odidukh/development/olesdidukh.dev
grep -nE '\(/blog/[a-z0-9-]+\)' \
  src/content/blog/inside-etappi-multi-platform-task-manager.mdx \
  src/content/blog/typescript-monorepo-web-mobile-desktop.mdx \
  src/content/blog/building-life-activity-hub-ai-productivity.mdx \
  src/content/blog/rrule-rfc-5545-typescript-edge-cases.mdx \
  src/content/blog/offline-first-pwa-nextjs-mutation-queue.mdx
```

Expected: each article has at least 1 internal link per spec §8 link table. Capture every URL referenced.

- [ ] **Step 2: Confirm each link's slug exists**

```bash
ls src/content/blog/*.mdx | xargs -n1 basename | sed 's/\.mdx$//'
```

Compare against the URLs from Step 1. Each `/blog/<slug>` must match a file basename. Mismatches = rename or fix the link.

- [ ] **Step 3: Hit each new URL on the dev server**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 14
for slug in inside-etappi-multi-platform-task-manager typescript-monorepo-web-mobile-desktop building-life-activity-hub-ai-productivity rrule-rfc-5545-typescript-edge-cases offline-first-pwa-nextjs-mutation-queue; do
  echo "=== /blog/$slug ==="
  curl -sI "http://localhost:3000/blog/$slug" | head -1
done
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: all 5 print `HTTP/1.1 200 OK`.

- [ ] **Step 4: Visual click-through (if Chrome DevTools MCP available)**

Open each new post URL, click every internal link, confirm it lands on a 200 page (not 404). Note any broken anchor text.

If issues found: edit the offending file, fix the link, recommit with: `fix(blog): correct internal link in <slug>`.

---

## Task 11: Full local render verification + DoD checklist

**Files:** Read-only.

- [ ] **Step 1: Run `npm run check` (type-check + lint:strict + format:check)**

```bash
cd /Users/odidukh/development/olesdidukh.dev
npm run check
```

Expected: all three pass. Format failures: run `npm run format` then re-stage and amend the offending commit (or add a `chore: prettier` follow-up commit).

- [ ] **Step 2: Run a production build end-to-end**

```bash
npm run build 2>&1 | tee /tmp/blog-build.log
```

Expected: build succeeds, no velite schema errors. If it fails on a frontmatter field, fix the article and re-run.

- [ ] **Step 3: Verify `/blog` index lists all 5**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -s http://localhost:3000/blog | grep -oE '/blog/[a-z0-9-]+' | sort -u
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: output includes all 5 new slugs plus the 9 existing ones (14 total).

- [ ] **Step 4: Run the Definition of Done checklist (per article × 5)**

For each of the 5 articles, verify:

- Frontmatter complete (id, slug, title, excerpt ≤180 chars, coverImage, author, publishedAt, readingTime, category, tags, featured, views, likes)
- All H2 sections from spec §4 are present
- All internal links resolve (Task 10 result)
- All image paths resolve (`ls public/images/blog/...`)
- Reading time within ±2 min of frontmatter value
- Excerpt reads cleanly out of context
- Local render at `/blog/<slug>` is 200 (Task 11 Step 3 result)

If any post fails any check, fix and create a `fix(blog): <slug> — <what>` commit. Do not amend earlier commits.

- [ ] **Step 5: RSS / Atom feed sanity check**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -s http://localhost:3000/feed.xml | grep -c "<item>"
curl -s http://localhost:3000/atom.xml | grep -c "<entry>"
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: both counts ≥ 14 (existing 9 + new 5). If counts are stale, check `src/app/feed.xml/route.ts` and `src/app/atom.xml/route.ts` (they are in the user's pre-existing modified set per Task 0 — note that the user may have already updated them).

- [ ] **Step 6: Sitemap verification**

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -s http://localhost:3000/sitemap.xml | grep -oE '/blog/[a-z0-9-]+' | sort -u | wc -l
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Expected: ≥ 14 unique blog URLs.

---

## Task 12: Push branch, open PR (or push to main per user choice)

**Files:** None modified.

- [ ] **Step 1: Confirm push target with user**

If Task 0 used a feature branch: open a PR from `blog/articles-batch-2026-05` → `main`. If Task 0 stacked on main: ask the user before pushing main directly.

```bash
cd /Users/odidukh/development/olesdidukh.dev
git log --oneline main..HEAD 2>/dev/null || git log --oneline -10
```

Confirm the 5 article commits + 4 asset commits + 0–N fix commits are present.

- [ ] **Step 2: Push**

If branched:

```bash
git push -u origin blog/articles-batch-2026-05
gh pr create --title "Add 5 blog articles drawn from Etappi and LAH" --body "$(cat <<'EOF'
## Summary
- Adds 5 new MDX posts to /blog (3 deep-dives + 2 case studies)
- Source: Etappi and Life Activity Hub projects
- Spec: docs/superpowers/specs/2026-05-04-blog-articles-design.md
- Plan: docs/superpowers/plans/2026-05-04-blog-articles.md

## Test plan
- [ ] All 5 posts render at /blog/<slug>
- [ ] /blog index lists 14 posts (9 existing + 5 new)
- [ ] feed.xml + atom.xml include the 5 new posts
- [ ] sitemap.xml includes the 5 new posts
- [ ] All internal cross-links resolve (no 404s)
- [ ] npm run check passes
- [ ] npm run build passes
EOF
)"
```

If pushing to main: `git push origin main` after explicit user confirmation.

- [ ] **Step 3: Post-push verification**

```bash
gh pr view --web 2>/dev/null || git log origin/main --oneline -3
```

Confirm CI status; address any failures.

---

## Task 13: Update spec status to Implementing → Done

**Files:**

- Modify: `docs/superpowers/specs/2026-05-04-blog-articles-design.md` (line 5)

- [ ] **Step 1: Flip status to Done**

Edit `docs/superpowers/specs/2026-05-04-blog-articles-design.md`, change:

```markdown
- **Status**: Approved 2026-05-04
```

to:

```markdown
- **Status**: Done <YYYY-MM-DD>
```

Where `<YYYY-MM-DD>` is the day Task 12 completes.

- [ ] **Step 2: Commit and push**

```bash
git add docs/superpowers/specs/2026-05-04-blog-articles-design.md
git commit -m "docs: mark blog batch spec done"
git push
```

---

## Out-of-scope reminders (from spec §11)

These are explicitly NOT in this plan. If you're tempted, stop:

- No comments system, newsletter signup, analytics changes
- No new MDX components (callouts, tabs)
- No edits to existing 9 posts
- No translations to other locales
- No "ultimate guide" expansions beyond 16 min
- No new SEO schema beyond what existing posts emit
- No promotion plan (LinkedIn/HN/Twitter copy)

---

## Risk reminders (from spec §12)

- **Project READMEs evolve**: facts in articles cite "as of 2026-05-04". Re-snapshot only if user requests.
- **Screenshot leakage**: capture from a stable git ref of each project; if uncertain, ask user which ref before capturing.
- **5 articles in 5 weeks is aggressive**: drafting order is dependency-driven; do not reorder.
- **`olesdidukh.dev` had ~20 dirty files at plan time**: Task 0 surfaces this; user decides branch vs stack.
