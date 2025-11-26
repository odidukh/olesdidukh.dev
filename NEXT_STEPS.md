# Next Steps - Personal Website Improvements

This document tracks recommended improvements and remaining work for the portfolio website.

---

## Priority 1: Backend Integrations (High Impact)

### Contact Form Backend

**Status:** Completed

**Implementation:** Vercel serverless function with Resend API

- [x] API route at `src/app/api/contact/route.ts`
- [x] Zod validation for all form fields
- [x] HTML and plain text email formatting
- [x] Environment variables in `.env.example`

**Setup Required:**

Create `.env.local` with:

```bash
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

**Production Note:** Update the `from` address in the API route after verifying your domain in Resend.

### Newsletter Signup

**Status:** Form UI exists but needs backend

**Options:**

- [ ] ConvertKit API integration
- [ ] Mailchimp API integration
- [ ] Buttondown (developer-friendly)
- [ ] Store in database for manual management

---

## Priority 2: SEO & Discoverability

### Structured Data (JSON-LD)

- [x] Add Person schema to layout
- [x] Add Article schema to blog posts
- [ ] Add BreadcrumbList schema for navigation

**Implementation:**

```typescript
// src/app/layout.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Oles Didukh',
  jobTitle: 'Senior Front-End Engineer',
  url: 'https://olesdidukh.dev',
  sameAs: ['https://linkedin.com/in/oles-didukh', 'https://github.com/odidukh'],
};
```

### Sitemap & Robots

- [x] Add `src/app/sitemap.ts` for auto-generated sitemap
- [x] Add `src/app/robots.ts` for crawler instructions

### Open Graph Images

- [ ] Create `/og-image.png` (1200x630)
- [ ] Create page-specific OG images for blog posts
- [ ] Consider dynamic OG image generation with `@vercel/og`

### Page-specific Meta

- [ ] Review all page metadata
- [ ] Add unique descriptions to each route
- [ ] Ensure proper canonical URLs

---

## Priority 3: Content Enhancements

### Case Study Detail Pages

**Current:** Projects shown in modal only
**Goal:** Full `/projects/[slug]` pages for SEO and detailed content

- [ ] Create `src/app/projects/[slug]/page.tsx`
- [ ] Add rich project detail template with:
  - Problem/Challenge section
  - Solution walkthrough
  - Technical architecture diagrams
  - Before/after comparisons
  - Results with metrics
  - Testimonials
  - Related projects

### MDX for Blog Posts

**Current:** Blog content stored as strings in TypeScript
**Goal:** MDX files for richer formatting

- [ ] Install `@next/mdx` and configure
- [ ] Create `src/content/blog/` directory
- [ ] Migrate blog posts to `.mdx` files
- [ ] Add syntax highlighting with `rehype-pretty-code`
- [ ] Support custom components in posts

### Resume PDF

- [ ] Create/update resume PDF
- [ ] Add to `/public/resume.pdf`
- [ ] Verify download link works
- [ ] Track downloads in analytics

---

## Priority 4: Visual Enhancements

### 3D Hero Element

**Spec mentions:** Three.js scene for hero section

- [ ] Install Three.js and @react-three/fiber
- [ ] Create abstract geometric scene
- [ ] Add mouse-follow interaction
- [ ] Implement performance fallback for low-end devices
- [ ] Respect `prefers-reduced-motion`

### Testimonials Section

**Current:** Testimonials exist in project data but not prominently featured

- [ ] Create dedicated testimonials carousel/section
- [ ] Add to homepage or about page
- [ ] Include client photos (with permission)

### Video Content

- [ ] Record short project demo videos
- [ ] Add video thumbnails with play overlay
- [ ] Implement lazy loading for videos

---

## Priority 5: Performance & Analytics

### Vercel Analytics Setup

- [ ] Verify Vercel Analytics is tracking
- [ ] Set up custom events:
  - Resume downloads
  - Contact form submissions
  - Project modal opens
  - External link clicks
- [ ] Create dashboard for monitoring

### Lighthouse CI

- [ ] Add Lighthouse CI to GitHub Actions
- [ ] Set performance budgets
- [ ] Block PRs that regress performance

**GitHub Action:**

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://olesdidukh.dev
      https://olesdidukh.dev/projects
      https://olesdidukh.dev/blog
    budgetPath: ./lighthouse-budget.json
```

### Bundle Analysis

- [ ] Run `npm run analyze`
- [ ] Identify large dependencies
- [ ] Implement code splitting if needed
- [ ] Set bundle size budgets

---

## Priority 6: Testing Infrastructure

### Unit Tests

- [ ] Install Vitest or Jest
- [ ] Add tests for utility functions
- [ ] Test form validation logic
- [ ] Test data helper functions

### Component Tests

- [ ] Install React Testing Library
- [ ] Test critical UI components
- [ ] Test form interactions
- [ ] Test modal open/close

### E2E Tests

- [ ] Install Playwright
- [ ] Test contact form flow
- [ ] Test navigation
- [ ] Test dark mode toggle
- [ ] Test project filtering

---

## Priority 7: Accessibility Audit

### WCAG 2.2 Compliance

- [ ] Run axe-core audit
- [ ] Fix any critical issues
- [ ] Test keyboard navigation end-to-end
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify color contrast ratios
- [ ] Test focus indicators

### Improvements

- [ ] Add skip links
- [ ] Improve focus trap in modals
- [ ] Add aria-live regions for dynamic content
- [ ] Test reduced motion preferences

---

## Priority 8: DevOps & Maintenance

### GitHub Actions CI/CD

- [ ] Add workflow for quality checks on PR
- [ ] Add Dependabot configuration
- [ ] Add automated dependency updates

**Dependabot config:**

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
```

### Error Monitoring

- [ ] Set up Sentry for error tracking
- [ ] Configure source maps upload
- [ ] Set up alerts for critical errors

---

## Quick Wins (Can Do Today)

These can be implemented quickly with minimal effort:

1. ~~**Sitemap**~~ - ✅ Completed

2. ~~**Robots.txt**~~ - ✅ Completed

3. ~~**Toast notifications**~~ - ✅ Completed (using Sonner library)

4. **Run quality check** - `npm run check` to ensure everything passes

5. **Verify all links** - Check social links, navigation, footer links work

---

## Implementation Order Recommendation

| Phase       | Tasks                                            | Impact                               |
| ----------- | ------------------------------------------------ | ------------------------------------ |
| **Phase 1** | ~~Contact backend~~, ~~Sitemap~~, ~~Robots.txt~~ | High - Enables core functionality    |
| **Phase 2** | SEO metadata, Structured data, OG images         | High - Improves discoverability      |
| **Phase 3** | Project detail pages, MDX blog                   | Medium - Better content presentation |
| **Phase 4** | Analytics events, Lighthouse CI                  | Medium - Data-driven improvements    |
| **Phase 5** | Testing infrastructure                           | Medium - Code confidence             |
| **Phase 6** | 3D hero, Visual polish                           | Low - Nice to have                   |

---

## Success Metrics

Track these after implementing improvements:

**Technical:**

- [ ] Lighthouse scores > 95 (all categories)
- [ ] Core Web Vitals all "Good"
- [ ] Zero accessibility violations
- [ ] < 200KB initial bundle

**Business:**

- [ ] Contact form submissions per month
- [ ] Resume downloads per month
- [ ] Average session duration > 2 min
- [ ] Bounce rate < 40%

---

_Last updated: November 2025_
