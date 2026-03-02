# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

A modern, high-performance personal portfolio website for **Oles Didukh**, Senior Front-End Engineer. Built to showcase 7+ years of front-end expertise, demonstrate mastery of modern web development, and achieve top-tier Core Web Vitals performance.

**Live Site:** https://olesdidukh.dev (planned domain)

## Tech Stack

| Category      | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | Next.js 16 (App Router) with Turbopack  |
| React         | v19.2.0 with React Compiler             |
| Language      | TypeScript 5 (strict mode)              |
| Styling       | Tailwind CSS v4 + CSS custom properties |
| Animation     | Framer Motion                           |
| UI Primitives | Radix UI                                |
| Content       | Velite (MDX compilation)                |
| Forms         | React Hook Form + Zod                   |
| State         | Zustand (with persist middleware)       |
| Icons         | Lucide React                            |
| Analytics     | Vercel Analytics & Speed Insights       |

## Development Commands

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build (runs clean first)
npm start            # Start production server
npm run type-check   # TypeScript compilation check
npm run lint         # Standard linting
npm run lint:fix     # Auto-fix lint issues
npm run lint:strict  # Strict mode (no warnings)
npm run format       # Format all files
npm run format:check # Check formatting
npm run check        # Full quality check (type-check + lint:strict + format:check)
npm run fix          # Auto-fix (lint:fix + format)
npm run analyze      # Bundle analysis (ANALYZE=true)
npm run clean        # Remove build artifacts
```

**Always run `npm run check` before committing.**

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Geist fonts + FOUC prevention script
│   ├── page.tsx            # Homepage (recruiter-optimized section flow)
│   ├── about/              # About + sub-routes (journey, philosophy)
│   ├── blog/               # Blog listing + [slug] dynamic routes
│   ├── contact/            # Contact page
│   ├── experience/         # Professional experience
│   ├── guestbook/          # Visitor guestbook
│   ├── projects/           # Projects showcase
│   ├── skills/             # Skills page
│   ├── case-studies/       # Case studies
│   ├── admin/              # Admin panel
│   └── api/                # API routes (contact, og, etc.)
├── components/
│   ├── sections/           # Large feature sections (~30 components)
│   └── ui/                 # Reusable UI primitives (~40 components)
│       └── backgrounds/    # Decorative background components (9 variants)
├── content/
│   ├── blog/               # 9 blog posts (MDX via Velite)
│   └── projects/           # 7 projects (MDX via Velite)
├── config/                 # App configuration (animations, filters, UI)
├── hooks/                  # Custom React hooks (13 hooks)
├── lib/                    # Utilities (utils, sanitize, csp, env, etc.)
├── stores/                 # Zustand state management (5 stores)
└── styles/
    └── design-tokens.css   # CSS custom properties
```

## Path Aliases

```typescript
@/*            → src/
@/components/* → src/components/
@/lib/*        → src/lib/
@/styles/*     → src/styles/
@/data/*       → src/data/
@/stores       → src/stores/
```

## Design System

### Color Palette

**Primary Brand:** Mocha Mousse (2025 Pantone Color of the Year)

- `mocha-50` through `mocha-900`

**Secondary:** Navy

- `navy-50` through `navy-950`

**Semantic Colors:** success, warning, error, info (each with 50-900 shades)

**Gradients:** primary, warm, cool, accent, glow, hero

### Fonts

- **Geist Sans** (`--font-geist-sans`): Primary display font
- **Geist Mono** (`--font-geist-mono`): Code/monospace font

### Dark Mode

Uses `class` strategy with `dark:` variants. Toggle available in navigation. Inline script in `layout.tsx` prevents FOUC. Theme toggle icon uses a hydration guard (`useThemeHydrated`) to avoid icon flash.

### Section Visual Rhythm

Homepage sections use alternating backgrounds for differentiation:

- Odd sections: transparent (`bg-background`)
- Even sections: `bg-muted/30 dark:bg-muted/10`
- Accent sections: gradient backgrounds (`bg-gradient-to-br from-primary/5...`)
- Thin gradient dividers (`h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent`) between sections

## Component Patterns

### Section Components (`components/sections/`)

Large, page-level feature components:

- `HeroSectionClient` - Landing hero with typing animation, "Open to Work" badge, magnetic CTAs
- `SocialProofBar` - Animated counter stats (Years, Users, Companies, Technologies)
- `AboutSection` - Professional overview with dot grid background
- `ProjectsSection` / `ProjectsSectionClient` - Filterable project grid with modal
- `SkillsPreviewSection` - Skills cloud with topographic background
- `JourneySection` / `Timeline` - Career progression timeline
- `BlogSection` / `BlogSectionClient` - Blog preview with filters and enhanced empty state
- `ContactSection` - Contact CTA with availability status
- `FAQ` - 5 recruiter-relevant FAQs with keyboard accessibility
- `CtaSectionClient` - Final call-to-action
- `AvailabilityStatus` - Availability card with load meter and project count

### UI Components (`components/ui/`)

Atomic, reusable primitives following composition pattern:

- `Button` - 6 variants (including `gradient`), multiple sizes, loading states
- `Card` - Compound component (Header, Title, Content, Footer)
- `Badge` - 8 color variants
- `Input` / `Textarea` - Form inputs with validation states
- `Navigation` - Responsive header with mobile menu (social icons at xl+)
- `Footer` - Multi-column layout
- `MagneticEffect` - Cursor attraction wrapper (respects reduced motion)
- `CopyCodeBlock` - Code block with copy-to-clipboard button
- `BackToTop` - Scroll-to-top button
- `CommandMenu` - Search command palette
- `StatusIndicator` - Status dot with optional pulse

### Background Components (`components/ui/backgrounds/`)

9 decorative background variants: `GridPattern`, `Topographic`, `SunsetCodeRain`, `WaveAurora`, `GradientMesh`, `NoiseTexture`, `Spotlight`, `GeometricShapes`, `CodeRain`

### Animation Principles

- Duration: 150ms (micro), 300ms (standard), 500ms (complex)
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- Respect `prefers-reduced-motion` via `useReducedMotion` hook
- Use Framer Motion `variants`, `whileInView`, and `layoutId` patterns
- Decorative animations conditionally rendered (not just `animate={}`)

## TypeScript Configuration

Strict mode enabled with additional checks:

- `noUncheckedIndexedAccess` - Array access requires null checks
- `exactOptionalPropertyTypes` - Distinguish undefined from missing
- `noPropertyAccessFromIndexSignature` - Force bracket notation
- `noUnusedLocals` / `noUnusedParameters` - No dead code

## Content Management

MDX content via Velite (compiles to `.velite/` JSON):

- `src/content/blog/` - 9 blog posts with full metadata
- `src/content/projects/` - 7 projects with challenges, solutions, results, testimonials

Data layer in `src/data/`:

- `blog.ts` - Blog post helpers: `getFeaturedPosts()`, `getPostsByCategory()`, `searchPosts()`
- `projects.ts` - Project helpers: `getFeaturedProjects()`, `getProjectBySlug()`, `getRelatedProjects()`

## Custom Hooks (`src/hooks/`)

- `useReducedMotion` - Detect `prefers-reduced-motion`
- `useDebounce` - Debounced value
- `useFocusTrap` - Focus trap for modals
- `useMediaQuery` / `useIsMobile` - Responsive breakpoints
- `useLocalStorage` - Persistent localStorage state
- `useSearch` - Search with debounce
- `useIntersectionObserver` - Scroll-triggered visibility
- `usePerformance` / `useWebVitals` - Performance monitoring

## Zustand Stores (`src/stores/`)

- `useThemeStore` - Theme mode (dark/light/system) with `persist` and `useThemeHydrated`
- `useProjectsFilterStore` - Project category, technology, search filters
- `useBlogFilterStore` - Blog category, search, sort filters with `resetAll`
- `useUIPreferencesStore` - UI preferences
- `useCommandMenuStore` - Command palette state

## Pre-commit Hooks

Husky runs on every commit:

1. **lint-staged**: Prettier + ESLint on staged files
2. **type-check**: Full TypeScript compilation
3. **commit-msg**: Conventional commits validation

All checks must pass before commit succeeds.

## Performance Targets

| Metric                 | Target  |
| ---------------------- | ------- |
| Lighthouse Performance | > 95    |
| LCP                    | < 1.5s  |
| INP                    | < 100ms |
| CLS                    | < 0.05  |
| Bundle Size (initial)  | < 200KB |

## Testing

- **Unit tests**: Vitest + React Testing Library (494 tests across 32 files)
- **E2E tests**: Playwright (visual regression, contact form, navigation, performance)
- **Visual snapshots**: Chromium-based screenshot comparison

```bash
npm test                    # Run unit tests
npx playwright test         # Run E2E tests
npx playwright test --update-snapshots  # Update visual snapshots
```

## Homepage Section Flow

Optimized for recruiter scanning (30-60 second evaluation):

1. Hero (Open to Work badge, dual CTAs with MagneticEffect)
2. Social Proof Bar (animated counters)
3. About (professional overview)
4. Projects (featured work with glassmorphism hover)
5. Skills Preview (tech stack cloud)
6. Journey (career timeline)
7. Blog (latest articles)
8. Contact (availability status + form)
9. CTA (final call-to-action)

## Content Guidelines

### Voice & Tone

- **Confident but approachable**: "I build exceptional web applications"
- **Technical but accessible**: Explain complex concepts simply
- **Results-focused**: Emphasize quantified achievements

### Project Documentation

Each project includes: Challenge, Solution, Technologies, Metrics/Results, Testimonial

## Key Implementation Notes

1. **React 19 Features** - Components use latest React patterns
2. **Server Components** - Use where appropriate for performance
3. **Image Optimization** - Always use Next.js `<Image>` with proper sizing
4. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation, reduced motion support
5. **Form Validation** - React Hook Form + Zod schemas
6. **Animations** - Framer Motion with scroll-based triggers
7. **Hydration Safety** - Theme toggle uses hydration guard to prevent icon flash
