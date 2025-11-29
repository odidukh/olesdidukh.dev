# Portfolio Website - Improvement Backlog

This document tracks actionable improvements for the portfolio website (olesdidukh.dev).

---

## Overview

| Priority      | Count  | Status          |
| ------------- | ------ | --------------- |
| P0 - Critical | 2      | 2 Complete      |
| P1 - High     | 9      | 8 Complete      |
| P2 - Medium   | 15     | 2 Complete      |
| P3 - Low      | 7      | Pending         |
| **Total**     | **33** | **12 Complete** |

---

## P0 - Critical Priority

### 1. Sanitize HTML in BlogPostContent

**Status**: [x] Complete
**Effort**: Medium (2-3 hours)
**Impact**: Security - XSS Prevention

**Issue**: Blog post content rendered via `dangerouslySetInnerHTML` without sanitization.

**File**: `/src/components/sections/BlogPostContent.tsx`

**Implementation** (Completed):

- Installed `isomorphic-dompurify` for SSR-compatible sanitization
- Created `/src/lib/sanitize.ts` with comprehensive sanitization utilities:
  - `sanitizeHtml()` - Main sanitization function with configurable allowed tags/attributes
  - `sanitizeHtmlWithReport()` - Returns sanitized HTML + list of removed elements
  - `stripHtml()` - Removes all HTML, returns plain text
  - `sanitizeUrl()` - Validates URLs against dangerous protocols
- Updated `BlogPostContent.tsx` to use `sanitizeHtml()` before rendering

---

### 2. Replace Console Statements with Sentry

**Status**: [x] Complete
**Effort**: Low (1-2 hours)
**Impact**: Security & Code Quality

**Issue**: Multiple `console.error()` calls expose error details in production.

**Implementation** (Completed):

Replaced all production `console.error()` calls with `captureException()` from `@/lib/sentry`:

- `/src/app/api/newsletter/route.ts` - Removed console.error, kept existing captureException
- `/src/app/admin/skills/components/DeleteSkillButton.tsx` - Added captureException with context
- `/src/app/admin/skills/components/SkillForm.tsx` - Added captureException with context
- `/src/app/admin/blog/page.tsx` - Added captureException for fetch errors
- `/src/app/admin/blog/components/DeleteBlogButton.tsx` - Added captureException with context
- `/src/app/admin/blog/components/BlogForm.tsx` - Added captureException with context
- `/src/app/admin/projects/page.tsx` - Added captureException for fetch errors
- `/src/app/admin/projects/components/DeleteProjectButton.tsx` - Added captureException with context
- `/src/app/admin/projects/components/ProjectForm.tsx` - Added captureException with context
- `/src/app/admin/experience/page.tsx` - Added captureException for fetch errors
- `/src/app/admin/experience/components/DeleteExperienceButton.tsx` - Added captureException with context
- `/src/app/admin/experience/components/ExperienceForm.tsx` - Added captureException with context
- `/src/components/sections/ContactForm.tsx` - Added captureException with context
- `/src/stores/useThemeStore.ts` - Added captureException for hydration errors

**Note**: Console.error statements in ErrorBoundary are kept for development-only logging (wrapped in `process.env.NODE_ENV === 'development'`)

---

## P1 - High Priority

### 3. Add Memoization to List Components

**Status**: [x] Complete
**Effort**: Medium (3-4 hours)
**Impact**: Performance

**Issue**: Components with expensive calculations lack memoization.

**Implementation** (Completed):

Wrapped list card components with `React.memo()` to prevent unnecessary re-renders:

- `/src/components/sections/ProjectCard.tsx` - Wrapped with `React.memo()` and added `displayName`
- `/src/components/sections/BlogCard.tsx` - Wrapped with `React.memo()` and added `displayName`

**Note**: Admin form callbacks were not memoized as they use simple controlled inputs where the performance benefit would be negligible. Memoization is most beneficial for list items that get re-rendered when parent state changes.

---

### 4. Fix SSR Hydration Risk in HomePage

**Status**: [x] Complete (Already Implemented)
**Effort**: Medium (2-3 hours)
**Impact**: Stability

**Issue**: Particle initialization with random values causes hydration mismatch.

**Implementation** (Already in place):

The codebase already correctly handles this issue in `/src/app/page.tsx` (lines 178-190):

```tsx
// Generate particles on client side to avoid hydration mismatch
const [particles, setParticles] = useState<Particle[]>([]);

useEffect(() => {
  const newParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 5,
  }));
  setParticles(newParticles);
}, []);
```

This pattern ensures:

- Server renders with an empty particle array
- Client hydrates with the same empty array (no mismatch)
- `useEffect` then populates particles client-side only

---

### 5. Split HomePage Component

**Status**: [x] Complete
**Effort**: High (4-6 hours)
**Impact**: Maintainability

**Issue**: HomePage exceeds 800 lines, violates ESLint max-lines rule.

**Implementation** (Completed):

Reduced `/src/app/page.tsx` from **810 lines to 442 lines** (45% reduction) by extracting:

- `/src/components/sections/JourneySection.tsx` - Career journey timeline preview (103 lines)
- `/src/components/sections/SkillsPreviewSection.tsx` - Skills and expertise teaser (134 lines)
- `/src/components/sections/PhilosophySection.tsx` - Development philosophy cards (102 lines)
- `/src/components/sections/HeroBackground.tsx` - Particle effects and animated background (98 lines)

All extracted components are wrapped with `React.memo()` for performance optimization.

---

### 6. Validate Environment Variables

**Status**: [x] Complete
**Effort**: Medium (2-3 hours)
**Impact**: DX & Reliability

**Issue**: No runtime validation of required environment variables.

**Implementation** (Completed):

Created `/src/lib/env.ts` with comprehensive Zod validation:

- Server-side variables: `RESEND_API_KEY`, `CONTACT_EMAIL`, `BUTTONDOWN_API_KEY`, `UPSTASH_REDIS_*`, `ADMIN_EMAIL`, `SENTRY_*`
- Client-side variables: `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`, `NEXT_PUBLIC_SENTRY_DSN`

Updated files to use validated env:

- `/src/app/api/contact/route.ts` - Uses `env.RESEND_API_KEY` and `env.CONTACT_EMAIL`
- `/src/app/api/newsletter/route.ts` - Uses `env.BUTTONDOWN_API_KEY`
- `/src/app/admin/layout.tsx` - Uses `env.ADMIN_EMAIL`
- `/src/lib/supabase/client.ts` - Uses `clientEnv` for Supabase config
- `/src/lib/supabase/server.ts` - Uses `clientEnv` for Supabase config
- `/src/lib/supabase/middleware.ts` - Uses `clientEnv` for Supabase config

Exports `env` for server-side and `clientEnv` for client-safe variables.

---

### 7. Complete Sentry Configuration

**Status**: [x] Complete
**Effort**: Low (1 hour)
**Impact**: Monitoring

**Issue**: Sentry org/project are placeholders in next.config.ts.

**Implementation** (Completed):

Updated `/next.config.ts` to use environment variables with sensible defaults:

```ts
org: process.env['SENTRY_ORG'] ?? 'personal-website',
project: process.env['SENTRY_PROJECT'] ?? 'personal-website-v2',
```

Environment variables are now validated in `/src/lib/env.ts` (added in item #6):

- `SENTRY_DSN` - DSN URL for error reporting
- `SENTRY_ORG` - Organization slug
- `SENTRY_PROJECT` - Project slug
- `SENTRY_AUTH_TOKEN` - Auth token for source map uploads

The configuration only enables Sentry when `SENTRY_DSN` is set, allowing graceful degradation in development.

---

### 8. Enforce Path Aliases Consistently

**Status**: [x] Complete
**Effort**: Medium (2-3 hours)
**Impact**: DX & Maintainability

**Issue**: 11 instances of relative imports instead of path aliases.

**Implementation** (Completed):

1. Fixed all relative imports in the following files:
   - `/src/app/admin/skills/[id]/page.tsx` - `@/app/admin/skills/components/SkillForm`
   - `/src/app/admin/skills/new/page.tsx` - `@/app/admin/skills/components/SkillForm`
   - `/src/app/admin/blog/[id]/page.tsx` - `@/app/admin/blog/components/BlogForm`
   - `/src/app/admin/blog/new/page.tsx` - `@/app/admin/blog/components/BlogForm`
   - `/src/app/admin/experience/[id]/page.tsx` - `@/app/admin/experience/components/ExperienceForm`
   - `/src/app/admin/experience/new/page.tsx` - `@/app/admin/experience/components/ExperienceForm`
   - `/src/app/admin/projects/[id]/page.tsx` - `@/app/admin/projects/components/ProjectForm`
   - `/src/app/admin/projects/new/page.tsx` - `@/app/admin/projects/components/ProjectForm`
   - `/src/components/sections/HeroSection.tsx` - `@/components/ui/*` for TypeAnimation, ParticleField, FloatingIcons

2. Added ESLint rule in `/eslint.config.mjs` to prevent future relative imports:

```js
{
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*'],
            message: 'Use path aliases (@/) instead of relative imports.',
          },
        ],
      },
    ],
  },
}
```

---

### 9. Add Keyboard Support to Interactive Badges

**Status**: [x] Complete
**Effort**: Medium (2-3 hours)
**Impact**: Accessibility

**Issue**: Badge click handlers lack keyboard support.

**Implementation** (Completed):

Updated `/src/components/sections/ContactForm.tsx` to add full keyboard and accessibility support for all interactive badges:

1. **Project Type badges** (lines 302-322):
   - Added `role="button"`, `tabIndex={0}`, `aria-pressed`
   - Added `onKeyDown` handler for Enter and Space keys
   - Added focus ring styles
   - Wrapped in container with `role="group"` and `aria-label`

2. **Budget Range badges** (lines 332-352):
   - Same accessibility enhancements as Project Type

3. **Timeline badges** (lines 360-380):
   - Same accessibility enhancements as Project Type

All badges now support:

- Keyboard navigation (Tab to focus)
- Keyboard activation (Enter or Space to select)
- Visual focus indicator (focus ring)
- Screen reader support (aria-pressed state, group labels)

---

### 10. Create JsonLd Component

**Status**: [x] Complete
**Effort**: Low (1-2 hours)
**Impact**: Code Quality

**Issue**: Multiple files use `dangerouslySetInnerHTML` for JSON-LD.

**Implementation** (Completed):

Created `/src/components/JsonLd.tsx`:

```tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Updated all files to use the new component:

- `/src/app/layout.tsx` - Uses `<JsonLd data={jsonLd} />`
- `/src/app/blog/[slug]/page.tsx` - Uses `<JsonLd />` for article and breadcrumb schemas (both MDX and legacy post branches)
- `/src/app/projects/[slug]/page.tsx` - Uses `<JsonLd data={projectSchema} />`
- `/src/components/BreadcrumbSchema.tsx` - Uses `<JsonLd data={schema} />`

All JSON-LD structured data is now rendered through a single, centralized component.

---

## P2 - Medium Priority

### 11. Add Admin Authentication Middleware

**Status**: [x] Complete (Already Implemented)
**Effort**: High (4-6 hours)
**Impact**: Security

**Issue**: Admin routes lack visible authentication guards.

**Implementation** (Already in place):

Admin route protection is implemented at two levels:

1. **Middleware level** (`/src/lib/supabase/middleware.ts` lines 38-54):

   ```tsx
   // Protect admin routes
   if (request.nextUrl.pathname.startsWith('/admin')) {
     if (!user) {
       const url = request.nextUrl.clone();
       url.pathname = '/login';
       url.searchParams.set('redirect', request.nextUrl.pathname);
       return NextResponse.redirect(url);
     }

     // Check if user is admin
     const adminEmail = process.env['ADMIN_EMAIL'];
     if (adminEmail && user.email !== adminEmail) {
       const url = request.nextUrl.clone();
       url.pathname = '/';
       return NextResponse.redirect(url);
     }
   }
   ```

2. **Layout level** (`/src/app/admin/layout.tsx` lines 26-34):
   - Double-checks authentication via Supabase `getUser()`
   - Verifies user email matches `env.ADMIN_EMAIL`
   - Redirects unauthenticated users to `/login?redirect=/admin`
   - Redirects non-admin users to home page

This dual-layer approach ensures robust protection even if middleware is bypassed.

---

### 12. Add Canonical Tags to Dynamic Routes

**Status**: [x] Complete
**Effort**: Low (1 hour)
**Impact**: SEO

**Issue**: Missing canonical tags for blog/project pages.

**Implementation** (Completed):

1. **Blog pages** (`/src/app/blog/[slug]/page.tsx`):
   - Added `alternates.canonical` to MDX post metadata (line 74-76)
   - Added `alternates.canonical` to legacy post metadata (line 116-118)
   - Both now point to `https://olesdidukh.dev/blog/${slug}`

2. **Project pages** (`/src/app/projects/[slug]/page.tsx`):
   - Already had canonical tags implemented (lines 82-84)
   - Points to `https://olesdidukh.dev/projects/${project.id}`

All dynamic routes now have proper canonical URLs for SEO.

---

### 13. Extract Magic Numbers to Constants

**Status**: [ ] Pending
**Effort**: Medium (2-3 hours)
**Impact**: Maintainability

**Issue**: Hardcoded values scattered throughout codebase.

**File**: `/src/app/page.tsx` and others

**Solution**:

```tsx
// /src/constants/config.ts
export const ANIMATION = {
  PARTICLE_COUNT: 50,
  STAGGER_DELAY: 0.3,
  TRANSITION_DURATION: 0.5,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;
```

---

### 14. Increase Test Coverage

**Status**: [ ] Pending
**Effort**: High (2-3 days)
**Impact**: Quality & Confidence

**Issue**: Only ~6% test coverage (11 test files for 193 TS files).

**Priority Components to Test**:

- [ ] `/src/components/ui/Navigation.tsx`
- [ ] `/src/components/ui/Footer.tsx`
- [ ] `/src/components/sections/BlogSection.tsx`
- [ ] `/src/components/sections/ProjectsSection.tsx`
- [ ] `/src/app/admin/**/*Form.tsx`

**Target**: 60%+ coverage

---

### 15. Add Missing Storybook Stories

**Status**: [ ] Pending
**Effort**: Medium (3-4 hours)
**Impact**: Documentation & DX

**Issue**: Only 5 components have Storybook stories.

**Components Needing Stories**:

- [ ] `/src/components/sections/ProjectCard.tsx`
- [ ] `/src/components/sections/BlogCard.tsx`
- [ ] `/src/components/sections/HeroSection.tsx`
- [ ] `/src/components/sections/ContactForm.tsx`
- [ ] `/src/components/ui/Navigation.tsx`

---

### 16. Add Alt Text Audit

**Status**: [ ] Pending
**Effort**: Low (1-2 hours)
**Impact**: Accessibility & SEO

**Issue**: Some dynamic images may lack descriptive alt text.

**Files**:

- `/src/components/sections/ProjectCard.tsx`
- `/src/components/sections/BlogCard.tsx`

**Solution**:

1. Ensure all Image components have meaningful alt text
2. Add ESLint jsx-a11y rule enforcement

---

### 17. Fix ESLint Disable Comments

**Status**: [ ] Pending
**Effort**: Low (30 min)
**Impact**: Code Quality

**Issue**: ESLint rules disabled instead of fixed.

**File**: `/src/lib/mdx.ts` (line 94)

**Solution**: Address the underlying unused variable issue properly.

---

### 18. Standardize Component Patterns

**Status**: [ ] Pending
**Effort**: Medium (3-4 hours)
**Impact**: Maintainability

**Issue**: Inconsistent use of `React.forwardRef()` across components.

**Solution**:

1. Document component pattern in CONTRIBUTING.md
2. Use forwardRef for all components that render DOM elements
3. Create component template/snippet

---

### 19. Export Hook Types

**Status**: [ ] Pending
**Effort**: Low (1 hour)
**Impact**: DX

**Issue**: Hook types not exported from index.

**File**: `/src/hooks/index.ts`

**Solution**:

```tsx
// Export hook return types
export type UseAnalyticsReturn = ReturnType<typeof useAnalytics>;
export type UseWebVitalsReturn = ReturnType<typeof useWebVitals>;
// ... etc
```

---

### 20. Add E2E Tests for Critical Paths

**Status**: [ ] Pending
**Effort**: High (4-6 hours)
**Impact**: Quality

**Issue**: E2E test coverage incomplete.

**Tests to Add**:

- [ ] Contact form submission flow
- [ ] Project filtering and modal
- [ ] Blog search and navigation
- [ ] Dark mode toggle persistence
- [ ] Admin CRUD operations

---

### 21. Audit Timer Cleanup

**Status**: [ ] Pending
**Effort**: Low (1-2 hours)
**Impact**: Stability

**Issue**: 22 setTimeout/setInterval instances - verify proper cleanup.

**Files**: `/src/app/page.tsx`, `/src/components/sections/ContactForm.tsx`

**Solution**: Ensure all timers are cleared in useEffect cleanup:

```tsx
useEffect(() => {
  const timer = setTimeout(() => {}, 3000);
  return () => clearTimeout(timer);
}, []);
```

---

### 22. Add lazy Loading for Below-Fold Images

**Status**: [ ] Pending
**Effort**: Low (1-2 hours)
**Impact**: Performance

**Issue**: Some images may not use lazy loading.

**Solution**: Audit all Image components and add `loading="lazy"` for below-fold content.

---

## P3 - Low Priority

### 23. Implement Global Search

**Status**: [ ] Pending
**Effort**: High (1-2 days)
**Impact**: UX

**Issue**: No site-wide search functionality.

**Solution**: Implement search with:

- Algolia (hosted)
- Fuse.js (client-side)
- Next.js API route with simple text search

---

### 24. Complete Analytics Event Coverage

**Status**: [ ] Pending
**Effort**: Low (2-3 hours)
**Impact**: Business Insights

**Issue**: Some user interactions not tracked.

**Events to Add**:

- [ ] CTA button clicks
- [ ] Form field focus (start tracking)
- [ ] Scroll depth milestones
- [ ] Time on page

---

### 25. Add Usage Examples to Hook JSDoc

**Status**: [ ] Pending
**Effort**: Low (2-3 hours)
**Impact**: Documentation

**Issue**: Hooks have JSDoc but limited examples.

**Files**: `/src/hooks/*.ts`

---

### 26. Create .env.example File

**Status**: [ ] Pending
**Effort**: Low (30 min)
**Impact**: DX

**Issue**: Required environment variables not documented.

**Solution**:

```env
# .env.example
RESEND_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
ADMIN_EMAIL=
```

---

### 27. Verify Dark Mode Persistence

**Status**: [ ] Pending
**Effort**: Low (1 hour)
**Impact**: UX

**Issue**: Verify theme preference persists across sessions.

**File**: `/src/stores/useThemeStore.ts`

**Solution**: Test localStorage persistence manually and add E2E test.

---

### 28. Rate Limit Header Security Review

**Status**: [ ] Pending
**Effort**: Low (1 hour)
**Impact**: Security (Minor)

**Issue**: Rate limit headers expose throttling behavior.

**File**: `/src/app/api/contact/route.ts`

**Solution**: Consider removing X-RateLimit-\* headers or keeping only standard headers.

---

### 29. Documentation Overhaul

**Status**: [ ] Pending
**Effort**: Medium (2-3 hours)
**Impact**: Developer Experience

**Issue**: Project documentation needs updating.

**Tasks**:

- [ ] Update `README.md` with project overview, setup instructions, tech stack, and deployment info
- [ ] Create `CONTRIBUTING.md` with guidelines for contributing
- [ ] Document custom hooks in `src/hooks/README.md` (optional)

---

### 30. Accessibility Enhancements

**Status**: [ ] Pending
**Effort**: Low (1-2 hours)
**Impact**: User Experience

**Tasks**:

- [ ] Update `src/components/ui/Input.tsx` to include `aria-invalid={error}`
- [ ] Audit color contrast for text overlays on gradients in `HomePage`
- [ ] Ensure all interactive elements in `HomePage` have visible focus states

---

### 31. Focus Trap Optimization

**Status**: [ ] Pending
**Effort**: Low (1-2 hours)
**Impact**: Code Quality

**Tasks**:

- [ ] Evaluate replacing custom `useFocusTrap` with `focus-trap-react` or Radix UI primitives
- [ ] If keeping custom implementation, add comprehensive unit tests

---

### 32. Internationalization (i18n)

**Status**: [ ] Pending
**Effort**: High (2-3 days)
**Impact**: Future Proofing

**Tasks**:

- [ ] Install and configure `next-intl`
- [ ] Extract hardcoded strings from `HomePage` and components into message files
- [ ] Add language switcher to `Navigation`

---

## Quick Wins (< 1 hour each)

- [x] #2 Replace console with Sentry
- [ ] #7 Complete Sentry configuration
- [ ] #12 Add canonical tags
- [ ] #17 Fix ESLint disable comments
- [ ] #26 Create .env.example

---

## Implementation Order Recommendation

**Phase 1 - Security & Stability (Week 1)**

1. #1 Sanitize HTML in BlogPostContent
2. #2 Replace console statements
3. #11 Add admin authentication
4. #6 Validate environment variables

**Phase 2 - Performance (Week 2)** 5. #3 Add memoization 6. #4 Fix hydration risk 7. #5 Split HomePage component 8. #10 Create JsonLd component

**Phase 3 - Quality & DX (Week 3)** 9. #8 Enforce path aliases 10. #14 Increase test coverage 11. #18 Standardize component patterns 12. #13 Extract magic numbers

**Phase 4 - Polish (Ongoing)**

13. Remaining P2 and P3 items
14. #29 Documentation Overhaul
15. #30 Accessibility Enhancements
16. #31 Focus Trap Optimization
17. #32 Internationalization (i18n)

---

_Last updated: November 29, 2025_
