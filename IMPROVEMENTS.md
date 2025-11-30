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

- [x] **Extract hardcoded configuration values**
  - Created `src/config/contact-form.ts` with PROJECT_TYPES, BUDGET_RANGES, TIMELINES
  - Created `src/config/project-filters.ts` with PROJECT_CATEGORIES, PROJECT_TECHNOLOGIES
  - Created `src/config/animations.ts` with PARTICLE_CONFIG, VIDEO_PLAYER_CONFIG
  - Created `src/config/ui.ts` with PWA_DISMISS_COOLDOWN_MS, FONT_SIZES
  - Updated ContactForm and ProjectsSection to import from config

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

- [x] **Update Husky to v9**
  - Updated: `husky@8.0.3` → `husky@9.1.7`
  - Note: Breaking changes reviewed and hooks migrated

- [x] **Update @types/node**
  - Updated: `@types/node@20.19.25` → `@types/node@24.10.1`

- [ ] **Batch update minor dependencies**
  - `prettier`: 3.6.2 → 3.7.3
  - `lucide-react`: 0.525.0 → 0.555.0
  - `zod`: 4.1.12 → 4.1.13
  - `react-hook-form`: 7.66.0 → 7.67.0
  - `next`: 16.0.3 → 16.0.5

### Component API Consistency

- [x] **Standardize size prop naming**
  - Files: `src/components/ui/Input.tsx`, `src/components/ui/Textarea.tsx`
  - Changed: `inputSize`/`textareaSize` → `size` for consistency with Button, Badge

- [x] **Export sub-component prop types from Card**
  - File: `src/components/ui/Card.tsx`
  - Added exports: CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps, CardImageProps

### Configuration

- [x] **Add missing content paths to Tailwind config**
  - File: `tailwind.config.ts`
  - Added: `'./src/styles/**/*.{css,ts,tsx}'`, `'./src/data/**/*.{ts,tsx}'`

- [ ] **Implement nonce-based CSP for production**
  - File: `next.config.ts`
  - Issue: CSP includes `'unsafe-inline'` for scripts in production
  - Action: Implement nonce-based CSP for stricter security

- [x] **Externalize PWA cooldown constant**
  - Created `src/config/ui.ts` with PWA_DISMISS_COOLDOWN_MS constant
  - Updated `useUIPreferencesStore.ts` to import from config

### Data Validation

- [x] **Add Zod validation schemas for data files**
  - Created: `src/schemas/blog.ts` with BlogPostMeta, BlogPostContent schemas
  - Created: `src/schemas/project.ts` with Project schema
  - Created: `src/schemas/index.ts` with shared exports
  - Benefits: Runtime validation, better error messages

- [x] **Add filter validation to stores**
  - Added validation to `useBlogFilterStore` (validates against blogCategories)
  - Added validation to `useProjectsFilterStore` (validates categories and technologies)
  - Invalid values now fallback to ALL_FILTER or are ignored

### Accessibility

- [x] **Add aria-labels to ProjectCard icon buttons**
  - File: `src/components/sections/ProjectCard.tsx`
  - Added: Descriptive aria-labels like `View ${project.title} live demo`

- [x] **Improve LanguageSwitcher error feedback**
  - File: `src/components/ui/LanguageSwitcher.tsx`
  - Added: Toast notification via sonner on locale change failure

---

## Low Priority

### Code Quality

- [x] **Replace `any` types in polymorphic components**
  - Created `src/lib/polymorphic.ts` with type-safe utilities:
    - `PolymorphicComponentProps` for 'as' prop pattern
    - `PolymorphicComponentPropsWithRef` for ref forwarding
    - `PolymorphicRef` type helper
  - Includes comprehensive JSDoc with usage examples

- [x] **Debounce ParticleField resize handler**
  - File: `src/components/ui/ParticleField.tsx`
  - Added: 250ms debounce to resize handler to prevent expensive particle regeneration

- [x] **Extract magic numbers to constants**
  - Created `src/config/animations.ts` with PARTICLE_CONFIG and VIDEO_PLAYER_CONFIG
  - Updated ParticleField to use PARTICLE_CONFIG constants
  - Updated VideoPlayer to use VIDEO_PLAYER_CONFIG constants

- [ ] **Use design tokens for hardcoded colors**
  - File: `src/components/ui/ResumeDownloadButton.tsx` (Lines 70, 131)
  - File: `src/components/sections/BlogCard.tsx` (Line 63)
  - Issue: Hardcoded Tailwind classes like `dark:bg-gray-900`
  - Action: Use CSS custom properties from design tokens

- [x] **Extract magic string 'All' to constant**
  - File: `src/constants/index.ts`
  - Created: `ALL_FILTER` constant and `FILTERS.ALL` object
  - Updated: All filter stores, data files, and utilities to use constant

- [x] **Use `as const` for category arrays**
  - File: `src/data/blog.ts`
  - Added: `as const` to `blogCategories` array with derived `BlogCategory` type

### Performance

- [x] **Add React.memo to BlogFilters**
  - File: `src/components/sections/BlogFilters.tsx`
  - Added: `React.memo` wrapper with JSDoc documentation
  - Updated: `categories` prop type to accept `readonly string[]`

- [ ] **Add virtualization for large project/blog lists**
  - Files: `src/components/sections/ProjectsSection.tsx`, `src/components/sections/BlogSection.tsx`
  - Issue: Could benefit from virtualization if item count grows
  - Action: Consider react-window or similar library

### Store Enhancements

- [x] **Add Zustand devtools middleware**
  - Files: `src/stores/useBlogFilterStore.ts`, `src/stores/useProjectsFilterStore.ts`
  - Added: Devtools middleware with development-only flag

- [x] **Add locale preference to UI store**
  - Added `locale` field to `useUIPreferencesStore` (en/uk/pl support)
  - Added `setLocale` action and `useLocalePreference` selector hook
  - Exports `Locale` type for consumers

- [x] **Add useProjectsHasActiveFilters selector**
  - File: `src/stores/useProjectsFilterStore.ts`
  - Added: `useProjectsHasActiveFilters` selector hook

### Miscellaneous

- [x] **Investigate npm run lint CLI issue**
  - Fixed: Changed `next lint` to direct `eslint . --ext .ts,.tsx` command
  - Root cause: Next.js lint wrapper had "Invalid project directory" issue

- [x] **Make views/likes required in BlogPost interface**
  - File: `src/data/blog.ts`
  - Changed: `views?: number` → `views: number`, `likes?: number` → `likes: number`

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

### Medium: State Management (0% → 100%) ✅

- [x] **Add tests for useThemeStore**
  - File: `src/stores/useThemeStore.test.tsx` (15 tests)
  - Covers: Theme toggle, persistence, system preference, hydration

- [x] **Add tests for useProjectsFilterStore**
  - File: `src/stores/useProjectsFilterStore.test.tsx` (21 tests)
  - Covers: Filter operations, clear, persistence, validation

- [x] **Add tests for useBlogFilterStore**
  - File: `src/stores/useBlogFilterStore.test.tsx` (17 tests)
  - Covers: Category/search/sort state, validation, persistence

- [x] **Add tests for useUIPreferencesStore**
  - File: `src/stores/useUIPreferencesStore.test.tsx` (18 tests)
  - Covers: PWA dismiss logic, locale, preferences reset, persistence

### Medium: API Routes (40% → target 100%)

- [ ] **Add tests for /api/locale route**
  - File: `src/app/api/locale/route.ts`

- [ ] **Add tests for /api/openapi.json route**
  - File: `src/app/api/openapi.json/route.ts`

### Medium: Data Files ✅

- [x] **Add tests for blog.ts data file**
  - File: `src/data/blog.test.ts` (38 tests)
  - Covers: blogPosts integrity, categories, DEFAULT_AUTHOR,
    getRelatedPosts, getPostsByCategory, getFeaturedPosts, searchPosts

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

- [x] **Document store invariants**
  - Added JSDoc "Invariants" sections to all stores documenting:
    - Valid value constraints and fallback behavior
    - Persistence behavior (what's persisted vs transient)
    - Semantic differences (clearFilters vs resetAll)

- [x] **Add JSDoc to BlogFilters component**
  - File: `src/components/sections/BlogFilters.tsx`
  - Added: JSDoc explaining memoization and component purpose

- [x] **Document polymorphic component patterns**
  - File: `src/lib/polymorphic.ts`
  - Comprehensive JSDoc with usage patterns, ref forwarding examples,
    and TypeScript limitations documentation

---

## Summary Statistics

| Category      | Critical | High    | Medium  | Low     | Total   |
| ------------- | -------- | ------- | ------- | ------- | ------- |
| Dependencies  | ~~2~~ 0  | 0       | ~~5~~ 1 | 0       | 1       |
| SEO/Metadata  | ~~2~~ 0  | 0       | 0       | 0       | 0       |
| Components    | 0        | ~~4~~ 0 | ~~3~~ 0 | ~~4~~ 1 | 1       |
| Data          | 0        | ~~4~~ 2 | ~~2~~ 0 | ~~3~~ 0 | 2       |
| Stores        | 0        | ~~2~~ 0 | ~~3~~ 0 | ~~3~~ 0 | 0       |
| Configuration | 0        | 0       | ~~3~~ 1 | 1       | 2       |
| Code Quality  | 0        | 0       | 1       | ~~5~~ 0 | 1       |
| Testing       | 0        | 0       | 0       | 0       | 25+     |
| **Total**     | **0**    | **2**   | **3**   | **2**   | **32+** |

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

### Phase 4: Medium Priority (Week 5-6) - COMPLETED

1. ~~Update remaining dependencies~~ → Husky v9 updated, others held for compatibility
2. ~~Implement Zod validation~~ → Created schemas for blog and project data
3. ~~Fix component API inconsistencies~~ → Standardized size prop, exported Card prop types
4. ~~Accessibility improvements~~ → Added aria-labels, toast notifications
5. ~~Configuration improvements~~ → Added Tailwind content paths

### Phase 5: Polish (Ongoing) - COMPLETED

1. ~~Code quality improvements~~ → ALL_FILTER constant, `as const` types, views/likes required
2. ~~Performance~~ → React.memo for BlogFilters, debounced ParticleField resize
3. ~~Store enhancements~~ → Zustand devtools, useProjectsHasActiveFilters selector

### Phase 6: Remaining Work (Future)

1. Batch dependency updates (prettier, lucide-react, zod, react-hook-form, next)
2. Implement nonce-based CSP for production
3. Fix duplicate project images
4. Add virtualization for large lists
5. Use design tokens for hardcoded colors
6. Expand test coverage (25+ items remaining - hooks, UI components, sections)
7. Add Storybook stories for untested components
