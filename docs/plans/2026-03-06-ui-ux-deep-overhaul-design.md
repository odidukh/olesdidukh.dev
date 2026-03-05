# UI/UX Deep Overhaul Design

**Date:** 2026-03-06
**Focus:** Visual polish + recruiter persuasion (no accessibility scope)
**Approach:** Deep Overhaul — 20 targeted changes across 4 categories

---

## Audit Summary

Three parallel analyses (static code analysis, UX flow tracing, live visual testing across 8 pages at desktop/mobile/dark/light) identified 50+ issues. Filtered to visual polish and recruiter persuasion, 20 actionable items remain across 4 categories.

---

## Section 1: Spacing & Layout Fixes

### 1.1 Fix Double-Padding on Interior Pages

**Problem:** Every interior page has ~130px blank gap below navbar. `<main className="pt-20">` (80px navbar clearance) compounds with `py-20` on the first section's inner Container.

**Fix:** On each page's hero section, change inner Container from `py-20` to `pb-16` (remove top padding since `<main>` already provides it).

**Files:**

- `src/app/skills/page.tsx` — Container `py-20` -> `pb-16`
- `src/app/experience/page.tsx` — same
- `src/components/sections/AboutSection.tsx` — first section padding
- All other interior page hero sections

### 1.2 Container Width Consistency

**Problem:** Sections jump between `size="md"` (768px), `size="lg"` (1024px), and `size="wide"` (1280px) with no system. `SocialProofBar` uses raw `max-w-5xl mx-auto px-4`.

**Fix:** Establish a clear hierarchy:

- Full-width content (grids, cards): `size="wide"` — Projects, Blog, Skills
- Narrative content (text-heavy): `size="lg"` — About, Journey, Contact
- Focused CTAs: `size="md"` — CtaSection, SocialProofBar
- Replace SocialProofBar raw classes with `<Container size="lg">`

### 1.3 Experience Page Vertical Compression

**Problem:** 3622px for 4 job entries. Timeline items use `mb-16` (64px) gaps + `py-20` on sections.

**Fix:** Reduce `mb-16` -> `mb-10`, section `py-20` -> `py-16`. Target: ~2800px.

### 1.4 Skills Filter Bar Wrapping

**Problem:** At 1440px, "Performance & DevOps" wraps to a second row.

**Fix:** Outer flex `items-center` -> `items-start`, shorten label to "Perf & DevOps" at `lg` breakpoint.

---

## Section 2: Recruiter Persuasion — Content & IA

### 2.1 Consolidate Stats: 3 Instances -> 1 Impact

**Problem:** Same credibility numbers appear in SocialProofBar, AboutSection, and CtaSectionClient.

**Fix:**

- Keep SocialProofBar (highest impact, animated)
- Remove 4-stat card grid from AboutSection; replace with value props or professional summary
- Keep CtaSectionClient stats (already different: rating, success rate, clients)

### 2.2 Fix Duplicate "From Atoms to Pixels" Headline

**Problem:** Same heading in AboutSection (story tab) and JourneySection (section heading).

**Fix:** Rename JourneySection heading to "The Road So Far" or "Career Milestones".

### 2.3 Redesign Contact Section CTA Hierarchy

**Problem:** 5 overlapping contact paths, no clear primary action.

**Fix:**

1. Primary: Contact form (prominent)
2. Secondary: "Schedule a Call" Calendly link (alongside form submit)
3. Tertiary: Email/phone in sidebar (de-emphasized)
4. Remove: Final CTA mailto button (redundant)

### 2.4 Fix Card Title Truncation

**Problem:** Project titles clipped ("ISP Customer Self-Servic...").

**Fix:**

- Project cards: Consistent `line-clamp-2`, remove fixed card heights
- Blog cards: Use `line-clamp-2` on titles
- Fix `ProjectCard.tsx` inverted breakpoints: `line-clamp-2 sm:line-clamp-1` -> `line-clamp-1 sm:line-clamp-2`

### 2.5 Mobile Hero: Keep Both CTAs Above Fold

**Problem:** Tech badges wrap to 3+ lines on 375px, pushing "Get In Touch" below fold.

**Fix:** Limit tech badge row to 4-5 items on mobile with `hidden sm:inline-flex` on overflow badges.

---

## Section 3: Broken Interactions & Visual Bugs

### 3.1 Fix "Load More Articles" Button

**Problem:** Renders with no `onClick`. Non-functional.

**Fix:** Implement actual pagination — show first 6, "Load More" reveals the rest with animation.

### 3.2 Fix Non-Functional Blog Tags & Year Archive

**Problem:** "Popular Tags" badges and year buttons ("2024", "2023") have cursor-pointer but no handlers.

**Fix:** Wire tag clicks to filter by tag, year buttons to filter by year.

### 3.3 Fix "Loading..." Flash on Email/Phone

**Problem:** `ObfuscatedEmail` shows "Loading..." during hydration.

**Fix:** Replace with skeleton shimmer: `<span className="inline-block w-40 h-4 bg-muted animate-pulse rounded" />`

### 3.4 Fix AvailabilityStatus Ping Animation

**Problem:** `animate-ping` on full LucideIcon creates oversized flash.

**Fix:** Small `w-2.5 h-2.5 rounded-full` dot with `animate-ping`, matching HeroSectionClient pattern.

### 3.5 Replace Raw Tailwind Colors with Brand Palette

**Problem:** 23+ occurrences of `blue-500`, `green-500`, etc. bypass Mocha/Navy brand system.

**Fix:**

- `blue-500/cyan-500` -> `navy-400/navy-300`
- `green-500/emerald-500` -> `success-400/success-300`
- `purple-500/pink-500` -> `primary/accent-mocha`
- `orange-500/red-500` -> `warning-400/warning-300`

**Files:** JourneySection.tsx, AboutSection.tsx, skills/page.tsx, experience/page.tsx

### 3.6 Fix Hardcoded Email in ContactSection

**Problem:** `mailto:oles.didukh@gmail.com` in plaintext at line 266.

**Fix:** Resolved by removing the Final CTA per Section 2.3.

---

## Section 4: Functional Enhancements

### 4.1 Connect useSearch to CommandMenu

**Problem:** Full Fuse.js search system exists but CommandMenu only has static links.

**Fix:** Wire search input to `useSearch`. Show fuzzy results grouped by type (Pages, Blog, Projects). Each result navigates to matching route.

### 4.2 Rethink Skills Proficiency Bars

**Problem:** All skills at same level show identical bars (Expert=90%, Advanced=75%). False precision.

**Fix:** Replace progress bars with visual badges/tags communicating skill hierarchy without fake percentages.

### 4.3 Add Debounce to Project Search

**Problem:** `useProjectsFilterStore` sets searchQuery synchronously per keystroke.

**Fix:** Add `useDebounce(150)` matching blog pattern.

### 4.4 Stop Persisting Search Queries Across Sessions

**Problem:** Both filter stores persist `searchQuery` to localStorage.

**Fix:** Exclude `searchQuery` from `partialize` in both stores. Persist only `viewMode` and `sortBy`.

### 4.5 Differentiate Newsletter Forms

**Problem:** Footer and BlogSection newsletter forms look different but do the same thing on the same page.

**Fix:** Make BlogSection newsletter contextual: "Get notified when I publish new articles" with blog-specific benefits. Footer stays generic.

---

## Priority Order

**Phase 1 — First Impression Fixes (highest impact):**
1.1, 2.5, 3.3, 3.4, 2.4 — spacing, mobile hero, loading flash, ping, titles

**Phase 2 — Broken Interactions:**
3.1, 3.2, 3.6 — load more, blog filters, hardcoded email

**Phase 3 — IA & Persuasion:**
2.1, 2.2, 2.3, 1.2, 1.3, 1.4 — stats, headlines, contact, containers, experience, skills bar

**Phase 4 — Enhancements:**
3.5, 4.1, 4.2, 4.3, 4.4, 4.5 — brand colors, search, proficiency, debounce, persistence, newsletter

---

## Out of Scope

- Accessibility improvements (WCAG compliance, reduced motion, ARIA)
- Performance optimization (mousemove throttling, intersection observers)
- Architecture changes (error boundary nesting, state management refactoring)
