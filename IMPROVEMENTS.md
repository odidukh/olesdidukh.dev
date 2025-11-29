# Codebase Improvements Backlog

> Generated from comprehensive codebase audit on 2025-11-30

This document contains prioritized improvement suggestions organized by category. Each item includes severity, location, and actionable recommendations.

---

## Table of Contents

1. [Critical Priority](#critical-priority)
2. [High Priority](#high-priority)
3. [Medium Priority](#medium-priority)
4. [Low Priority](#low-priority)
5. [Testing Improvements](#testing-improvements)
6. [Documentation Improvements](#documentation-improvements)

---

## Critical Priority

### Dependencies

- [x] **Update React Compiler to latest RC version**
  - File: `package.json`
  - Updated: `babel-plugin-react-compiler@19.1.0-rc.2` → `19.1.0-rc.3`
  - Note: Stable v1.0.0 not yet available; using latest RC

- [x] **Update eslint-config-next to latest compatible version**
  - File: `package.json`
  - Updated: `eslint-config-next@15.4.3` → `15.5.6`
  - Note: v16 has compatibility issues with ESLint 9; using latest v15

### SEO & Metadata

- [x] **Add metadata exports to main public pages**
  - Created layout files with metadata for:
    - `src/app/projects/layout.tsx`
    - `src/app/experience/layout.tsx`
    - `src/app/skills/layout.tsx`
    - `src/app/about/journey/layout.tsx`
    - `src/app/about/philosophy/layout.tsx`
  - Note: Used layout.tsx approach since pages use `'use client'`

- [x] **Add loading states for dynamic routes**
  - Created loading files:
    - `src/app/blog/[slug]/loading.tsx`
    - `src/app/projects/[slug]/loading.tsx`
  - Both include comprehensive skeleton UI matching page structure

---

## High Priority

### Server/Client Component Optimization

- [x] **Convert home page to Server Component**
  - File: `src/app/page.tsx`
  - Note: Home page requires `'use client'` due to extensive interactivity (hooks, framer-motion, mouse tracking)
  - Already has error boundaries wrapping all major sections

- [x] **Remove redundant 'use client' from projects page**
  - File: `src/app/projects/page.tsx`
  - Removed `'use client'` directive - page is now a Server Component
  - Added `<ErrorBoundary>` wrapper for ProjectsSection

### Data Consistency

- [ ] **Fix duplicate project images**
  - File: `src/data/projects.ts`
  - Issue: Lines 59, 219 use same `safebooks.png` for different projects
  - Issue: Lines 269, 312, 355 use generic placeholder images
  - Action: Create unique images for each project

- [x] **Extract hardcoded author data to constant**
  - File: `src/data/blog.ts`
  - Created `BlogAuthor` interface and `DEFAULT_AUTHOR` constant
  - Replaced all 8 inline author objects with `DEFAULT_AUTHOR` reference

- [x] **Remove unused `relatedPosts` field**
  - File: `src/data/blog.ts`
  - Removed `relatedPosts` field from `BlogPost` interface
  - Removed the one usage from data (auto-calculation handles related posts)

- [ ] **Remove or populate unused `ProjectVideo` interface**
  - File: `src/data/projects.ts`
  - Issue: Interface defined (Lines 1-7) but only 1 of 9 projects has video
  - Action: Remove interface or add video content to projects

### Component Issues

- [x] **Add error boundaries to data grid sections**
  - Added `<ErrorBoundary>` to `src/app/projects/page.tsx` wrapping `ProjectsSection`
  - Added `<ErrorBoundary>` to `src/app/blog/page.tsx` wrapping `BlogSection`
  - Home page already had error boundaries

- [x] **Add image error handling to BlogCard**
  - File: `src/components/sections/BlogCard.tsx`
  - Added `imageError` state and `onError` handler
  - Shows fallback with `BookOpen` icon when image fails to load

- [ ] **Extract hardcoded configuration values**
  - File: `src/components/sections/ContactForm.tsx` (Lines 44-70)
    - Project types, budget ranges, timelines are hardcoded
    - Action: Move to `src/config/contact-form.ts`
  - File: `src/components/sections/ProjectsSection.tsx` (Lines 14-37)
    - Filter categories/technologies are hardcoded
    - Action: Move to `src/config/project-filters.ts`

### Store Consistency

- [x] **Align filter store semantics**
  - Added `resetAll()` method to `useProjectsFilterStore`
  - Now matches `useBlogFilterStore` API with both `clearFilters()` and `resetAll()`

- [x] **Add error handling to filter stores**
  - Added `onRehydrateStorage` error handler with Sentry to both stores:
    - `src/stores/useProjectsFilterStore.ts`
    - `src/stores/useBlogFilterStore.ts`
  - Now matches theme store pattern

---

## Medium Priority

### Dependencies Updates

- [ ] **Update Husky to v9**
  - Current: `husky@8.0.3`
  - Latest: `husky@9.1.7`
  - Action: Review breaking changes before upgrading

- [ ] **Update @types/node**
  - Current: `@types/node@20.19.25`
  - Latest: `@types/node@24.10.1`
  - Action: Consider upgrading for latest Node.js type support

- [ ] **Batch update minor dependencies**
  - `prettier`: 3.6.2 → 3.7.3
  - `lucide-react`: 0.525.0 → 0.555.0
  - `zod`: 4.1.12 → 4.1.13
  - `react-hook-form`: 7.66.0 → 7.67.0
  - `next`: 16.0.3 → 16.0.5

### Component API Consistency

- [ ] **Standardize size prop naming**
  - File: `src/components/ui/Input.tsx` (Line 86) uses `inputSize`
  - File: `src/components/ui/Textarea.tsx` (Line 39) uses `textareaSize`
  - Other components use `size` (Button, Badge)
  - Action: Rename to `size` for consistency

- [ ] **Export sub-component prop types from Card**
  - File: `src/components/ui/Card.tsx`
  - Issue: CardHeader, CardTitle, etc. don't export their prop types
  - Impact: Harder to extend components in consuming code

### Configuration

- [ ] **Add missing content paths to Tailwind config**
  - File: `tailwind.config.ts`
  - Add: `'./src/styles/**/*.{css,ts,tsx}'`
  - Add: `'./src/data/**/*.{ts,tsx}'` (if data files contain Tailwind classes)

- [ ] **Implement nonce-based CSP for production**
  - File: `next.config.ts`
  - Issue: CSP includes `'unsafe-inline'` for scripts in production
  - Action: Implement nonce-based CSP for stricter security

- [ ] **Externalize PWA cooldown constant**
  - File: `src/stores/useUIPreferencesStore.ts` (Line 53)
  - Issue: `7 * 24 * 60 * 60 * 1000` hardcoded
  - Action: Move to config file or environment variable

### Data Validation

- [ ] **Add Zod validation schemas for data files**
  - Create: `src/schemas/blog.ts` with BlogPost schema
  - Create: `src/schemas/project.ts` with Project schema
  - Benefits: Runtime validation, better error messages

- [ ] **Add filter validation to stores**
  - Issue: No checks for valid category/technology values in filter stores
  - Action: Validate against allowed values on state updates

### Accessibility

- [ ] **Add aria-labels to ProjectCard icon buttons**
  - File: `src/components/sections/ProjectCard.tsx` (Lines 147-165)
  - Issue: Icon buttons opening external links lack semantic meaning
  - Action: Add descriptive `aria-label` attributes

- [ ] **Improve LanguageSwitcher error feedback**
  - File: `src/components/ui/LanguageSwitcher.tsx` (Lines 22-37)
  - Issue: Errors only logged to console, no user feedback
  - Action: Show toast notification on failure

---

## Low Priority

### Code Quality

- [ ] **Replace `any` types in polymorphic components**
  - File: `src/components/ui/Container.tsx` (Line 65)
  - File: `src/components/ui/Grid.tsx` (Lines 80, 135)
  - Action: Create proper type-safe polymorphic component helper

- [ ] **Debounce ParticleField resize handler**
  - File: `src/components/ui/ParticleField.tsx` (Lines 47-48, 57-58)
  - Issue: Regenerating all particles on resize is expensive
  - Action: Add debounce to resize handler

- [ ] **Extract magic numbers to constants**
  - File: `src/components/ui/ParticleField.tsx` (Lines 24, 31-34)
    - Particle count, size, duration, opacity values hardcoded
  - File: `src/components/ui/VideoPlayer.tsx` (Line 337)
    - `rootMargin: '100px'` hardcoded

- [ ] **Use design tokens for hardcoded colors**
  - File: `src/components/ui/ResumeDownloadButton.tsx` (Lines 70, 131)
  - File: `src/components/sections/BlogCard.tsx` (Line 63)
  - Issue: Hardcoded Tailwind classes like `dark:bg-gray-900`
  - Action: Use CSS custom properties from design tokens

- [ ] **Extract magic string 'All' to constant**
  - Files: `src/data/blog.ts` (Line 851), `src/data/projects.ts` (Line 464), filter stores
  - Action: Create `const ALL_FILTER = 'All'` constant

- [ ] **Use `as const` for category arrays**
  - File: `src/data/blog.ts` (Line 29) - `blogCategories` array
  - Benefit: Better TypeScript type narrowing

### Performance

- [ ] **Add React.memo to BlogFilters**
  - File: `src/components/sections/BlogFilters.tsx`
  - Issue: Not using `React.memo` despite receiving props that could change frequently
  - Impact: Potential unnecessary re-renders

- [ ] **Add virtualization for large project/blog lists**
  - Files: `src/components/sections/ProjectsSection.tsx`, `src/components/sections/BlogSection.tsx`
  - Issue: Could benefit from virtualization if item count grows
  - Action: Consider react-window or similar library

### Store Enhancements

- [ ] **Add Zustand devtools middleware**
  - All store files in `src/stores/`
  - Action: Add devtools middleware for development debugging

- [ ] **Add locale preference to UI store**
  - File: `src/stores/useUIPreferencesStore.ts`
  - Issue: No language/locale setting despite i18n implementation
  - Action: Add `locale?: string` field

- [ ] **Add useProjectsHasActiveFilters selector**
  - File: `src/stores/useProjectsFilterStore.ts`
  - Issue: No selector hook for `hasActiveFilters()` (unlike blog store)

### Miscellaneous

- [ ] **Investigate npm run lint CLI issue**
  - Issue: `npm run lint` fails but `npm run lint:strict` works
  - Workaround exists, but root cause should be investigated

- [ ] **Make views/likes required in BlogPost interface**
  - File: `src/data/blog.ts`
  - Issue: Optional in interface but always populated in data
  - Action: Change `views?: number` to `views: number`

---

## Testing Improvements

### Critical: Custom Hooks (0% coverage → target 80%)

- [ ] **Add tests for useSearch hook**
  - File: `src/hooks/useSearch.ts`
  - Priority: High (core search functionality)

- [ ] **Add tests for useMediaQuery hook**
  - File: `src/hooks/useMediaQuery.ts`
  - Priority: High (responsive design)

- [ ] **Add tests for useLocalStorage hook**
  - File: `src/hooks/useLocalStorage.ts`
  - Priority: High (persistent state)

- [ ] **Add tests for useDebounce hook**
  - File: `src/hooks/useDebounce.ts`
  - Priority: High (input handling)

- [ ] **Add tests for remaining hooks**
  - `useIntersectionObserver.ts`
  - `usePerformance.ts`
  - `useAnalytics.ts`
  - `useWebVitals.ts`
  - `useIsMobile.ts`
  - `useReducedMotion.ts`
  - `usePWAInstall.ts`
  - `usePageEngagement.ts`

### High: UI Components (15% → target 60%)

- [ ] **Add tests for Input component**
  - File: `src/components/ui/Input.tsx`
  - Cover: Validation states, sizes, disabled, error messages

- [ ] **Add tests for Textarea component**
  - File: `src/components/ui/Textarea.tsx`

- [ ] **Add tests for Card compound component**
  - File: `src/components/ui/Card.tsx`
  - Cover: All sub-components (Header, Title, Content, Footer)

- [ ] **Add tests for FormField component**
  - File: `src/components/ui/FormField.tsx`

- [ ] **Add tests for ErrorBoundary component**
  - File: `src/components/ui/ErrorBoundary.tsx`
  - Cover: Error catching, fallback rendering, Sentry integration

- [ ] **Add tests for remaining UI components**
  - LanguageSwitcher, NewsletterForm, Breadcrumb, Tooltip
  - Container, Grid, Label, Skeleton
  - SearchDialog, VideoPlayer, ParticleField

### High: Section Components (14% → target 50%)

- [ ] **Add tests for AboutSection**
- [ ] **Add tests for SkillsGrid**
- [ ] **Add tests for Timeline**
- [ ] **Add tests for TestimonialsCarousel**
- [ ] **Add tests for BlogCard**
- [ ] **Add tests for BlogFilters**
- [ ] **Add tests for ContactSection**
- [ ] **Add tests for NewsletterSignup**

### Medium: State Management (0% → target 100%)

- [ ] **Add tests for useThemeStore**
  - File: `src/stores/useThemeStore.ts`
  - Cover: Theme toggle, persistence, system preference, hydration

- [ ] **Add tests for useProjectsFilterStore**
  - File: `src/stores/useProjectsFilterStore.ts`
  - Cover: Filter operations, clear, persistence

- [ ] **Add tests for useBlogFilterStore**
  - File: `src/stores/useBlogFilterStore.ts`

- [ ] **Add tests for useUIPreferencesStore**
  - File: `src/stores/useUIPreferencesStore.ts`
  - Cover: PWA dismiss logic, preferences reset

### Medium: API Routes (40% → target 100%)

- [ ] **Add tests for /api/locale route**
  - File: `src/app/api/locale/route.ts`

- [ ] **Add tests for /api/openapi.json route**
  - File: `src/app/api/openapi.json/route.ts`

### Medium: Data Files

- [ ] **Add tests for blog.ts data file**
  - Reference: `src/data/projects.test.ts` (comprehensive example)
  - Cover: Data integrity, helper functions, edge cases

### Low: Admin Panel

- [ ] **Add tests for admin CRUD forms**
- [ ] **Add tests for admin sidebar/header**

### Infrastructure

- [ ] **Enable coverage thresholds in CI**
  - File: `vitest.config.ts`
  - Action: Add coverage thresholds (e.g., 50% minimum)

- [ ] **Add coverage report to pre-commit hooks**
  - Action: Run `npm run test:coverage` as part of quality checks

---

## Documentation Improvements

- [ ] **Add Storybook stories for untested components**
  - Priority components: Input, Textarea, FormField, ErrorBoundary

- [ ] **Document store invariants**
  - Add JSDoc comments explaining expected state shapes and constraints

- [ ] **Add JSDoc to BlogFilters component**
  - File: `src/components/sections/BlogFilters.tsx`
  - Issue: No documentation

- [ ] **Document polymorphic component patterns**
  - Files: Container.tsx, Grid.tsx
  - Explain `as` prop usage and type safety considerations

---

## Summary Statistics

| Category      | Critical | High    | Medium | Low    | Total   |
| ------------- | -------- | ------- | ------ | ------ | ------- |
| Dependencies  | ~~2~~ 0  | 0       | 5      | 0      | 5       |
| SEO/Metadata  | ~~2~~ 0  | 0       | 0      | 0      | 0       |
| Components    | 0        | ~~4~~ 1 | 3      | 4      | 8       |
| Data          | 0        | ~~4~~ 2 | 2      | 3      | 7       |
| Stores        | 0        | ~~2~~ 0 | 3      | 3      | 6       |
| Configuration | 0        | 0       | 3      | 1      | 4       |
| Code Quality  | 0        | 0       | 1      | 5      | 6       |
| Testing       | 0        | 0       | 0      | 0      | 35+     |
| **Total**     | **0**    | **3**   | **17** | **16** | **71+** |

---

## Recommended Action Plan

### Phase 1: Critical Fixes (Week 1) - COMPLETED

1. ~~Update React Compiler to stable~~ → Updated to latest RC (19.1.0-rc.3)
2. ~~Update eslint-config-next~~ → Updated to 15.5.6 (v16 has compatibility issues)
3. ~~Add missing metadata exports~~ → Created layout.tsx files for 5 pages
4. ~~Add loading states for dynamic routes~~ → Created loading.tsx for blog/[slug] and projects/[slug]

### Phase 2: High Priority (Week 2-3) - COMPLETED

1. ~~Fix Server/Client component issues~~ → Removed 'use client' from projects page, added error boundaries
2. ~~Fix data consistency issues~~ → Extracted DEFAULT_AUTHOR, removed relatedPosts field
3. ~~Add error boundaries~~ → Added to projects and blog pages
4. ~~Align store semantics~~ → Added resetAll() and Sentry error handling to filter stores
5. ~~Add BlogCard image error handling~~ → Added imageError state with fallback UI

### Phase 3: Testing Foundation (Week 3-4) - COMPLETED

1. ~~Add hook tests~~ → Created tests for useDebounce, useMediaQuery, useLocalStorage, useSearch
2. ~~Add store tests~~ → Created tests for useThemeStore, useProjectsFilterStore
3. ~~Add Input/Textarea component tests~~ → Created comprehensive tests with accessibility checks
4. ~~Enable coverage thresholds~~ → Added 50%/40% thresholds in vitest.config.ts

### Phase 4: Medium Priority (Week 5-6)

1. Update remaining dependencies
2. Implement Zod validation
3. Fix component API inconsistencies
4. Security improvements (CSP)

### Phase 5: Polish (Ongoing)

1. Low priority code quality improvements
2. Expand test coverage
3. Documentation improvements
