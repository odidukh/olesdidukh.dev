# Portfolio Website - Improvement Backlog

This document tracks actionable improvements for the portfolio website (olesdidukh.dev).

---

## Overview

| Priority      | Count  | Status         |
| ------------- | ------ | -------------- |
| P0 - Critical | 2      | 2 Complete     |
| P1 - High     | 9      | Pending        |
| P2 - Medium   | 15     | Pending        |
| P3 - Low      | 7      | Pending        |
| **Total**     | **33** | **2 Complete** |

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

**Status**: [ ] Pending
**Effort**: Medium (3-4 hours)
**Impact**: Performance

**Issue**: Components with expensive calculations lack memoization.

**Files**:

- `/src/components/sections/ProjectCard.tsx` - Wrap with `React.memo()`
- `/src/components/sections/BlogCard.tsx` - Wrap with `React.memo()`
- `/src/app/admin/**/*Form.tsx` - Wrap callbacks with `useCallback()`

**Solution**:

```tsx
// ProjectCard.tsx
export const ProjectCard = React.memo(function ProjectCard({ project }: Props) {
  // ... component code
});

// Admin forms
const handleInputChange = useCallback(
  e => {
    // ... handler code
  },
  [dependencies]
);
```

---

### 4. Fix SSR Hydration Risk in HomePage

**Status**: [ ] Pending
**Effort**: Medium (2-3 hours)
**Impact**: Stability

**Issue**: Particle initialization with random values causes hydration mismatch.

**File**: `/src/app/page.tsx` (lines 178-190)

**Solution**:

```tsx
// Use useId() for deterministic IDs
import { useId } from 'react';

// Or initialize particles only on client
const [particles, setParticles] = useState<Particle[]>([]);

useEffect(() => {
  // Move random initialization here
  setParticles(generateParticles());
}, []);
```

---

### 5. Split HomePage Component

**Status**: [ ] Pending
**Effort**: High (4-6 hours)
**Impact**: Maintainability

**Issue**: HomePage exceeds 800 lines, violates ESLint max-lines rule.

**File**: `/src/app/page.tsx` (810 lines)

**Solution**: Extract into separate components:

- `/src/components/sections/JourneySection.tsx`
- `/src/components/sections/SkillsPreviewSection.tsx`
- `/src/components/sections/PhilosophySection.tsx`
- `/src/components/sections/ParticleBackground.tsx`

---

### 6. Validate Environment Variables

**Status**: [ ] Pending
**Effort**: Medium (2-3 hours)
**Impact**: DX & Reliability

**Issue**: No runtime validation of required environment variables.

**Solution**:

```tsx
// /src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

---

### 7. Complete Sentry Configuration

**Status**: [ ] Pending
**Effort**: Low (1 hour)
**Impact**: Monitoring

**Issue**: Sentry org/project are placeholders in next.config.ts.

**File**: `/next.config.ts` (lines 215-216)

**Solution**:

1. Create Sentry project at sentry.io
2. Update `next.config.ts`:

```ts
org: process.env.SENTRY_ORG,
project: process.env.SENTRY_PROJECT,
```

3. Add to `.env.local`:

```env
SENTRY_ORG=your-actual-org
SENTRY_PROJECT=personal-website-v2
SENTRY_AUTH_TOKEN=your-auth-token
```

---

### 8. Enforce Path Aliases Consistently

**Status**: [ ] Pending
**Effort**: Medium (2-3 hours)
**Impact**: DX & Maintainability

**Issue**: 70+ instances of relative imports instead of path aliases.

**Files**: Various components use `../` instead of `@/`

**Solution**:

1. Add ESLint rule:

```js
// eslint.config.mjs
'no-restricted-imports': ['error', {
  patterns: ['../*']
}]
```

2. Run codemod to fix existing:

```bash
npx jscodeshift -t ./scripts/fix-imports.ts src/
```

---

### 9. Add Keyboard Support to Interactive Badges

**Status**: [ ] Pending
**Effort**: Medium (2-3 hours)
**Impact**: Accessibility

**Issue**: Badge click handlers lack keyboard support.

**File**: `/src/components/sections/ContactForm.tsx` (lines 298-347)

**Solution**:

```tsx
<Badge
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  {label}
</Badge>
```

---

### 10. Create JsonLd Component

**Status**: [ ] Pending
**Effort**: Low (1-2 hours)
**Impact**: Code Quality

**Issue**: Multiple files use `dangerouslySetInnerHTML` for JSON-LD.

**Files**:

- `/src/app/layout.tsx`
- `/src/app/blog/[slug]/page.tsx`
- `/src/app/projects/[slug]/page.tsx`
- `/src/components/BreadcrumbSchema.tsx`

**Solution**:

```tsx
// /src/components/JsonLd.tsx
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

---

## P2 - Medium Priority

### 11. Add Admin Authentication Middleware

**Status**: [ ] Pending
**Effort**: High (4-6 hours)
**Impact**: Security

**Issue**: Admin routes lack visible authentication guards.

**Files**: `/src/app/admin/**/*.tsx`

**Solution**:

```tsx
// /src/middleware.ts - Add admin route protection
if (pathname.startsWith('/admin')) {
  const session = await getSession(request);
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

### 12. Add Canonical Tags to Dynamic Routes

**Status**: [ ] Pending
**Effort**: Low (1 hour)
**Impact**: SEO

**Issue**: Missing canonical tags for blog/project pages.

**Files**:

- `/src/app/blog/[slug]/page.tsx`
- `/src/app/projects/[slug]/page.tsx`

**Solution**:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    // ... existing metadata
    alternates: {
      canonical: `https://olesdidukh.dev/blog/${params.slug}`,
    },
  };
}
```

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
