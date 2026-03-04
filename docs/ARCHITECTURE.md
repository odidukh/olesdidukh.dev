# Architecture Overview

This document describes the system architecture of the portfolio website — how the major subsystems fit together, data flows through the application, and the rationale behind key design choices.

For individual technology decisions, see the [Architecture Decision Records](./adr/README.md).

## Table of Contents

- [System Diagram](#system-diagram)
- [Rendering Model](#rendering-model)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Routing](#routing)
- [Styling System](#styling-system)
- [Animation System](#animation-system)
- [Security](#security)
- [Performance Strategy](#performance-strategy)
- [Build Pipeline](#build-pipeline)
- [Observability](#observability)

---

## System Diagram

```
                          ┌─────────────────────────────────────┐
                          │           Vercel Edge               │
                          │                                     │
  Browser ───────────────►│  middleware.ts                       │
                          │  ├── Supabase session refresh       │
                          │  ├── CSP nonce generation           │
                          │  └── Security headers               │
                          └──────────────┬──────────────────────┘
                                         │
                          ┌──────────────▼──────────────────────┐
                          │         Next.js App Router          │
                          │                                     │
                          │  Server Components (layout.tsx)     │
                          │  ├── Font loading (Geist)           │
                          │  ├── Theme init script (nonced)     │
                          │  ├── JSON-LD structured data        │
                          │  └── Resource hints (preconnect)    │
                          │                                     │
                          │  Client Components (pages + sections)│
                          │  ├── Zustand stores (4)             │
                          │  ├── Framer Motion animations       │
                          │  └── Static data from src/data/     │
                          └──────────────┬──────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────┐
              │                          │                      │
     ┌────────▼────────┐    ┌───────────▼──────────┐  ┌───────▼────────┐
     │   Supabase      │    │   Vercel Analytics   │  │     Sentry     │
     │   ├── Auth      │    │   └── Speed Insights │  │   └── Errors   │
     │   ├── Database   │    └──────────────────────┘  └────────────────┘
     │   └── Storage    │
     └──────────────────┘
```

## Rendering Model

The application uses a **hybrid rendering** approach that maximizes performance while enabling rich interactivity.

### Server Components

The root `layout.tsx` is the only true server component. It handles:

- **Font initialization** — Geist Sans and Mono loaded via `next/font`, self-hosted with `display: swap` and `adjustFontFallback` to minimize CLS.
- **CSP nonce injection** — A per-request nonce is read from headers (set by middleware) and passed to inline scripts.
- **Theme initialization** — An inline `<script>` reads the persisted theme from `localStorage` before first paint, preventing flash of wrong theme (FOWT).
- **Structured data** — JSON-LD schema for Person, injected with nonce.
- **Resource hints** — `preconnect` for Vercel Analytics; `dns-prefetch` for newsletter API and Sentry.

### Client Components

All page components are client-side (`'use client'`). This is intentional — the portfolio is a single-page-style experience with scroll animations, mouse tracking, and interactive filtering that require browser APIs.

The homepage uses **dynamic imports** for below-fold sections:

```
Above fold (eagerly loaded):        Below fold (lazy loaded):
├── Navigation                      ├── ProjectsSection
├── HeroBackground                  ├── TestimonialsCarousel
├── AboutSection                    ├── BlogSection
├── JourneySection                  └── ContactSection
├── SkillsPreviewSection
└── PhilosophySection
```

Dynamic imports use `{ ssr: true }` — the sections are still server-rendered for SEO, but their JavaScript is split into separate chunks and loaded on demand.

## Data Flow

```
Static TypeScript files          Zustand stores              Components
─────────────────────           ──────────────             ────────────
src/data/blog.ts    ──import──►  useBlogFilterStore  ──selector──►  BlogSection
src/data/projects.ts ─import──►  useProjectsFilterStore ─selector──► ProjectsSection
                                 useThemeStore       ──selector──►  Navigation, layout
                                 useUIPreferencesStore ─selector──► Global UI
```

**Key design choice:** Content lives in TypeScript files rather than a CMS or database for this portfolio. This gives type safety, zero runtime API calls, and instant load times. Helper functions like `getFeaturedPosts()`, `getPostsByCategory()`, and `searchPosts()` provide pre-built data access patterns.

**Admin routes** (`/admin/*`) connect to Supabase for dynamic blog/project/experience management, but the public-facing site reads from static data files.

### Filtering Pipeline

Both ProjectsSection and BlogSection follow the same pattern:

1. Component imports full dataset from `src/data/`
2. User interactions dispatch actions to the Zustand store (e.g., `setSearchQuery`, `toggleTechnology`)
3. Store validates input against allowed values (guarding against invalid categories/technologies)
4. Component re-renders, recalculating filtered results via `useMemo()`
5. Filtered array passed to card components for rendering

## State Management

Four Zustand stores manage all client-side state. Each store uses the `persist` middleware to survive page reloads via `localStorage`.

| Store                    | Purpose           | Key State                                                               | Persistence               |
| ------------------------ | ----------------- | ----------------------------------------------------------------------- | ------------------------- |
| `useThemeStore`          | Dark/light mode   | `mode`, `resolvedTheme`                                                 | `theme-storage`           |
| `useProjectsFilterStore` | Project filtering | `selectedCategory`, `selectedTechnologies[]`, `searchQuery`, `viewMode` | `projects-filter-storage` |
| `useBlogFilterStore`     | Blog filtering    | `selectedCategory`, `searchQuery`, `sortBy`                             | `blog-filter-storage`     |
| `useUIPreferencesStore`  | UI preferences    | `reducedMotion`, `fontSize`, `compactLayout`, PWA dismiss state         | `ui-preferences-storage`  |

### Store Design Principles

- **Input validation** — Stores reject invalid categories/technologies rather than accepting any string. This prevents stale filter state from breaking the UI after data changes.
- **Transient vs. persistent state** — UI-only flags like `showFilters` are excluded from persistence. Users expect filter panels to start collapsed.
- **Selector hooks** — Each store exports focused selector hooks (e.g., `useResolvedTheme()`, `useIsDark()`) to minimize re-renders. Components subscribe to exactly the slice of state they need.
- **Hydration handling** — Stores expose `hasHydrated` to prevent flash of default state during SSR-to-client transition.

### Theme Initialization Flow

Theme has a special initialization path to prevent flash of wrong theme:

```
1. middleware.ts generates CSP nonce
2. layout.tsx reads nonce, injects inline <script>
3. Script reads localStorage('theme-storage') before paint
4. Applies 'dark' class to <html> if needed
5. React hydrates, Zustand store syncs with DOM state
6. CSS transitions (300ms) enabled after hydration
```

## Component Architecture

### Three-Layer Hierarchy

```
UI Components (src/components/ui/)
    Atomic, reusable primitives. No business logic.
    Examples: Button, Card, Badge, Input, Container

        ▼ composed into

Section Components (src/components/sections/)
    Feature-level components with animations, state, and data.
    Examples: HeroSection, ProjectsSection, BlogSection

        ▼ assembled into

Page Components (src/app/*/page.tsx)
    Route-level orchestrators. Wrap sections in ErrorBoundary.
    Handle layout, dynamic imports, scroll effects.
```

### UI Component Patterns

**Variant system (CVA)** — Components like Button and Card use `class-variance-authority` to define variant × size matrices. This provides type-safe prop combinations:

```tsx
<Button variant="gradient" size="lg">    // ✓ valid
<Button variant="invalid" size="lg">     // ✗ TypeScript error
```

**Compound components** — Card uses the compound pattern (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`, `CardImage`), giving consumers flexible composition without prop drilling.

**Error boundaries** — Section components are wrapped in `<ErrorBoundary>` with section-specific fallback UIs. A crash in `ProjectsSection` won't take down the blog or contact form.

## Routing

### Public Routes

| Route               | Component         | Notes                                                      |
| ------------------- | ----------------- | ---------------------------------------------------------- |
| `/`                 | `page.tsx`        | Homepage with all sections, dynamic imports for below-fold |
| `/about`            | AboutSection      | Professional overview                                      |
| `/about/journey`    | JourneySection    | Career progression                                         |
| `/about/philosophy` | PhilosophySection | Work philosophy                                            |
| `/blog`             | BlogSection       | Filterable blog listing                                    |
| `/blog/[slug]`      | Dynamic           | Individual blog post                                       |
| `/projects`         | ProjectsSection   | Filterable project grid                                    |
| `/projects/[slug]`  | Dynamic           | Individual project detail                                  |
| `/skills`           | SkillsGrid        | Skills visualization                                       |
| `/experience`       | Timeline          | Career timeline                                            |
| `/contact`          | ContactSection    | Contact form                                               |

### API Routes

| Route               | Method | Purpose                                |
| ------------------- | ------ | -------------------------------------- |
| `/api/contact`      | POST   | Contact form submission (rate limited) |
| `/api/newsletter`   | POST   | Email subscription                     |
| `/api/og`           | GET    | Dynamic Open Graph image generation    |
| `/api/openapi.json` | GET    | OpenAPI schema                         |
| `/api/locale`       | GET    | Locale preference                      |

### Admin Routes (Protected)

All routes under `/admin/*` require authentication. The middleware checks for a valid Supabase session and verifies the user's email matches `ADMIN_EMAIL`.

### Feed Routes

- `/feed.xml` — RSS feed
- `/atom.xml` — Atom feed

## Styling System

The styling architecture has three layers that build on each other:

```
Layer 1: Design Tokens (CSS custom properties)
    └── src/styles/design-tokens.css
        Colors, spacing, typography, shadows, gradients

Layer 2: Tailwind CSS v4 (utility framework)
    └── src/app/globals.css
        Imports tokens, maps them to @theme for utility generation

Layer 3: Component Variants (CVA)
    └── Individual component files
        Type-safe variant definitions using Tailwind classes
```

### Design Token System

The primary brand color is **Mocha Mousse** (2025 Pantone Color of the Year), with 10 shades (`mocha-50` through `mocha-900`). The secondary palette is **Navy** with 11 shades.

Semantic colors (success, warning, error, info) each have 8 shades for consistent status indication.

Typography uses **fluid scaling** via `clamp()`:

```css
--text-7xl: clamp(4.5rem, 3.5rem + 5vw, 6rem);
```

This prevents jumps at breakpoints while respecting both small and large screens.

### Dark Mode

Implemented via the `class` strategy (`<html class="dark">`). The theme initialization script in `layout.tsx` applies the class before first paint, and CSS `dark:` variants handle all visual differences. A 300ms CSS transition provides a smooth toggle experience.

## Animation System

All motion is centralized in `src/lib/animations.ts`, which exports reusable constants and Framer Motion presets.

### Timing

| Category | Duration | Use Case                        |
| -------- | -------- | ------------------------------- |
| Micro    | 150ms    | Hover, focus, button press      |
| Standard | 300ms    | Section reveals, filter changes |
| Complex  | 500ms    | Page transitions, modals        |
| Page     | 600ms    | Route transitions               |
| Slow     | 800ms    | Deliberate emphasis             |

### Animation Patterns

**Scroll-triggered reveals** — Sections use `whileInView` with `viewport={{ once: true }}` to animate in as they enter the viewport. Most use `slideUpVariants` (fade + 20px upward slide).

**Stagger** — Lists of items (skill badges, project cards, stats) use `staggerContainer` to animate children sequentially with configurable delay (`0.05s` fast, `0.1s` standard, `0.15s` slow).

**Parallax** — The hero section uses `useScroll()` + `useTransform()` to create depth:

```
scrollY [0, 500] → heroY     [0, 150]    // Background moves slower
scrollY [0, 300] → heroOpacity [1, 0]     // Content fades out
scrollY [0, 300] → heroScale  [1, 0.95]   // Slight scale-down
```

**Spring physics** — Interactive elements (hover, tap) use spring configs rather than tween animations for natural-feeling motion. Three presets: `standard` (stiffness 300), `gentle` (200), `bouncy` (400).

### Accessibility

The animation system respects `prefers-reduced-motion`:

- `useUIPreferencesStore` tracks the `reducedMotion` preference
- Components check this flag and either skip animations or use `duration: 0`
- CSS utilities (`cssTransition.*`) provide Tailwind transition classes that inherit system preferences

## Security

Security is implemented as defense in depth across four layers:

### Layer 1: Middleware (Edge)

Every request passes through `middleware.ts` which:

1. Refreshes the Supabase session (cookie management)
2. Generates a cryptographic nonce via `crypto.getRandomValues()`
3. Builds a Content Security Policy using that nonce
4. Sets the CSP and nonce headers on the response

### Layer 2: Content Security Policy

The CSP policy (`src/lib/csp.ts`) uses **strict-dynamic** with per-request nonces in production:

- `script-src 'nonce-{nonce}' 'strict-dynamic'` — Only scripts with the correct nonce execute
- `style-src 'unsafe-inline'` — Required for Tailwind's dynamic class generation
- `frame-ancestors 'none'` — Prevents clickjacking
- `upgrade-insecure-requests` — Forces HTTPS in production

In development, `unsafe-inline` and `unsafe-eval` are allowed for HMR compatibility.

### Layer 3: HTTP Security Headers

Set in `next.config.ts` for all routes:

- **HSTS** — 2-year max-age with preload, enforcing HTTPS
- **X-Content-Type-Options** — Prevents MIME sniffing
- **X-Frame-Options** — Legacy clickjacking prevention (backup for CSP)
- **Referrer-Policy** — Only sends origin for cross-origin requests
- **Permissions-Policy** — Restricts browser features (camera, microphone, geolocation, etc.)
- **Cross-Origin-Opener-Policy / Resource-Policy** — Isolates the browsing context

### Layer 4: Application Security

- **Authentication** — Supabase Auth with admin check (`user.email === ADMIN_EMAIL`)
- **Input sanitization** — `isomorphic-dompurify` for any user-generated HTML
- **Rate limiting** — `@upstash/ratelimit` on API routes (contact form)
- **CSRF validation** — Token-based protection for form submissions

## Performance Strategy

### Code Splitting

The homepage uses `next/dynamic` to split below-fold sections into separate chunks. This keeps the initial JavaScript payload small while maintaining SSR for SEO (`{ ssr: true }`).

### Image Optimization

- **Formats:** AVIF preferred, WebP fallback (configured in `next.config.ts`)
- **Responsive sizes:** 8 device sizes + 9 image sizes for optimal srcset generation
- **Cache:** 60-second minimum cache TTL
- **SVG support:** Enabled with sandboxed CSP for SVG content

### Font Strategy

Geist fonts are loaded via `next/font`:

- **Self-hosted** — No external requests to Google Fonts
- **display: swap** — Text visible immediately with fallback font
- **adjustFontFallback** — Size-adjusted fallback minimizes CLS during font swap
- **Preloaded** — Font files included in initial HTML

### Bundle Optimization

`optimizePackageImports` in `next.config.ts` enables tree-shaking for large libraries:

- UI: `lucide-react`, `framer-motion`, `@radix-ui/*`, `sonner`
- 3D: `three`, `@react-three/*`
- Data: `@supabase/supabase-js`, `zustand`, `zod`
- Forms: `react-hook-form`, `@hookform/resolvers`

### Resource Hints

The layout includes `preconnect` for high-priority third-party origins (Vercel Analytics) and `dns-prefetch` for lower-priority domains (newsletter API, Sentry).

## Build Pipeline

The Next.js configuration chains four wrappers:

```
nextConfig
  → bundleAnalyzer (when ANALYZE=true)
    → withNextIntl (i18n routing)
      → withSerwist (PWA service worker)
        → withSentryConfig (error tracking, when SENTRY_DSN set)
```

**Development:** Uses Turbopack for fast HMR. Service worker disabled.

**Production:** Uses Webpack (required for Serwist PWA support). Serwist compiles `src/app/sw.ts` to `public/sw.js`.

**Pre-commit hooks (Husky):**

1. `lint-staged` — Prettier + ESLint on staged files only
2. `type-check` — Full TypeScript compilation

## Observability

### Error Tracking (Sentry)

- Client and server errors captured automatically
- Source maps uploaded during build (hidden from client bundles)
- **Ad-blocker bypass** — Sentry requests tunneled through `/monitoring` route
- Automatic Vercel Cron Monitor instrumentation

### Analytics (Vercel)

- **Vercel Analytics** — Page views and custom events
- **Speed Insights** — Real-user Core Web Vitals monitoring (LCP, INP, CLS)
- Custom analytics hooks (`useAnalytics`) for tracking CTA clicks and engagement

### Performance Monitoring

A custom `PerformanceMonitor` component tracks client-side performance metrics and reports them alongside Vercel's built-in monitoring.
