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
| Forms         | React Hook Form + Zod                   |
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
│   ├── layout.tsx          # Root layout with Geist fonts
│   ├── page.tsx            # Homepage
│   ├── about/              # About + sub-routes (journey, philosophy)
│   ├── blog/               # Blog listing + [slug] dynamic routes
│   ├── contact/            # Contact page
│   ├── experience/         # Professional experience
│   ├── projects/           # Projects showcase
│   └── skills/             # Skills page
├── components/
│   ├── sections/           # Large feature sections (HeroSection, BlogSection, etc.)
│   └── ui/                 # Reusable UI primitives (Button, Card, Input, etc.)
├── data/
│   ├── blog.ts             # Blog posts with metadata
│   └── projects.ts         # Project data with details
├── lib/
│   └── utils.ts            # cn() utility for class merging
├── stores/                 # Zustand state management stores
│   ├── useThemeStore.ts    # Theme (dark/light mode)
│   ├── useProjectsFilterStore.ts  # Project filters
│   ├── useBlogFilterStore.ts      # Blog filters
│   └── useUIPreferencesStore.ts   # UI preferences
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

Uses `class` strategy with `dark:` variants. Toggle available in navigation.

## Component Patterns

### Section Components (`components/sections/`)

Large, page-level feature components:

- `HeroSection` - Landing hero with animations
- `AboutSection` - Professional overview
- `ProjectsSection` - Filterable project grid with modal
- `BlogSection` - Blog preview with filters
- `ContactSection` - Contact CTA
- `SkillsGrid` - Skills visualization
- `Timeline` - Career progression

### UI Components (`components/ui/`)

Atomic, reusable primitives following composition pattern:

- `Button` - 6 variants, multiple sizes, loading states
- `Card` - Compound component (Header, Title, Content, Footer)
- `Badge` - 8 color variants
- `Input` / `Textarea` - Form inputs with validation states
- `Navigation` - Responsive header with mobile menu
- `Footer` - Multi-column layout

### Animation Principles

- Duration: 150ms (micro), 300ms (standard), 500ms (complex)
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- Respect `prefers-reduced-motion` media query
- Use Framer Motion `variants` and `layoutId` patterns

## TypeScript Configuration

Strict mode enabled with additional checks:

- `noUncheckedIndexedAccess` - Array access requires null checks
- `exactOptionalPropertyTypes` - Distinguish undefined from missing
- `noPropertyAccessFromIndexSignature` - Force bracket notation
- `noUnusedLocals` / `noUnusedParameters` - No dead code

## Data Management

Static content in TypeScript files:

- `src/data/blog.ts` - 9 blog posts with full metadata
- `src/data/projects.ts` - 9 projects with challenges, solutions, testimonials

Helper functions available:

- `getFeaturedPosts()`, `getPostsByCategory()`, `searchPosts()`

## Pre-commit Hooks

Husky runs on every commit:

1. **lint-staged**: Prettier + ESLint on staged files
2. **type-check**: Full TypeScript compilation

All checks must pass before commit succeeds.

## Performance Targets

| Metric                 | Target  |
| ---------------------- | ------- |
| Lighthouse Performance | > 95    |
| LCP                    | < 1.5s  |
| INP                    | < 100ms |
| CLS                    | < 0.05  |
| Bundle Size (initial)  | < 200KB |

## Content Guidelines

### Voice & Tone

- **Confident but approachable**: "I build exceptional web applications"
- **Technical but accessible**: Explain complex concepts simply
- **Results-focused**: Emphasize quantified achievements

### Project Documentation

Each project should include:

- Challenge (problem statement)
- Solution (technical approach)
- Technologies used
- Metrics/results
- Key learnings

## Key Implementation Notes

1. **React 19 Features** - Components use latest React patterns
2. **Server Components** - Use where appropriate for performance
3. **Image Optimization** - Always use Next.js `<Image>` with proper sizing
4. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
5. **Form Validation** - React Hook Form + Zod schemas
6. **Animations** - Framer Motion with scroll-based triggers

## Current Implementation Status

**Completed (~90%):**

- All major pages (Home, About, Experience, Projects, Skills, Blog, Contact)
- 16 UI components + 23 section components
- Design system with tokens
- Dark mode
- Responsive design
- Form validation
- Project/blog filtering and search
- Scroll animations

**See NEXT_STEPS.md for remaining work and improvements.**
