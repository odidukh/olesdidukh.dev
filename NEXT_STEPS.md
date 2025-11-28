# Next Steps - Portfolio Website

Remaining improvements and enhancements for olesdidukh.dev

---

## ✅ Completed (December 2025)

**Backend & Infrastructure:**

- ✅ Contact form with Resend API integration
- ✅ Form validation with Zod
- ✅ Toast notifications (Sonner)
- ✅ Sitemap & Robots.txt

**SEO & Structured Data:**

- ✅ Person schema (homepage)
- ✅ Article schema (blog posts)
- ✅ BreadcrumbList schema (navigation)
- ✅ Page-specific metadata (all main routes)
- ✅ Canonical URLs
- ✅ Open Graph & Twitter Card tags

---

## 🎯 Current Priorities

### Priority 1: Content & Visual Polish

#### ~~Newsletter Signup Backend~~ ✅

- [x] Choose provider (Buttondown)
- [x] Implement API integration (`/api/newsletter`)
- [x] Add to footer and blog sections
- [ ] Test subscription flow (requires `BUTTONDOWN_API_KEY`)

#### Resume PDF

- [ ] Create professional PDF resume (compact version - 1 page)
- [ ] Create professional PDF resume (extended version - 2+ pages)
- [ ] Add to `/public/Oles_Didukh_Resume_Compact.pdf`
- [ ] Add to `/public/Oles_Didukh_Resume_Extended.pdf`
- [x] Created dropdown UI for choosing between compact/extended versions
- [x] Added Vercel Analytics integration (`@vercel/analytics`)
- [x] Created `ResumeDownloadButton` component with version selection
- [x] All downloads tracked with `resume_download` event + version info

#### ~~Open Graph Images~~ ✅

- [x] Installed `@vercel/og` package
- [x] Created dynamic OG image API route (`/api/og`)
- [x] Default OG image with branded design (1200x630)
- [x] Page-specific OG images for: Homepage, About, Blog, Contact
- [x] Blog post OG images with dynamic title/description
- [x] Supports `title`, `subtitle`, `description`, and `type` parameters

### Priority 2: Enhanced Content Presentation

#### ~~Project Detail Pages~~ ✅

**Goal:** Full `/projects/[slug]` pages instead of modals

- [x] Create `src/app/projects/[slug]/page.tsx`
- [x] Design rich project template:
  - Challenge/Problem statement
  - Solution architecture
  - Tech stack deep-dive
  - Before/after metrics
  - Testimonials & outcomes
  - Related projects
- [x] Add project schema structured data
- [x] Implement navigation between projects

#### ~~MDX Blog Migration~~ ✅

**Goal:** Richer content formatting with code highlighting

- [x] Install `next-mdx-remote`, `rehype-pretty-code`, `shiki`, `gray-matter`
- [x] Create `src/content/blog/` directory
- [x] Migrate existing blog posts to `.mdx` (8 posts)
- [x] Add custom MDX components (`src/mdx-components.tsx`)
- [x] Implement syntax highlighting themes (github-dark/github-light)

### Priority 3: Analytics & Performance

#### ~~Vercel Analytics Enhancement~~ ✅

- [x] Verify analytics tracking is active (via `@vercel/analytics` in Providers)
- [x] Add custom events:
  - Resume downloads (`resume_download`)
  - Contact form submissions (`contact_form_submission`)
  - Project page views (`project_view`)
  - External link clicks (`external_link_click`, `social_link_click`)
  - Newsletter signups (`newsletter_signup`)
- [x] Created reusable analytics components (`TrackPageView`, `TrackedExternalLink`)

#### ~~Performance Optimization~~ ✅

- [x] Run `npm run analyze` and review bundle size (1.6MB total chunks)
- [x] Implement code splitting for large components (dynamic imports for ProjectsSection, BlogSection, ContactSection)
- [x] Optimize images (Next.js Image with AVIF/WebP, proper deviceSizes)
- [x] Added more packages to `optimizePackageImports` (@radix-ui, sonner)
- [ ] Set up Lighthouse CI in GitHub Actions (optional - future)
- [ ] Define performance budgets (optional - future)

### Priority 4: Visual Enhancements (Optional)

#### ~~3D Hero Element~~ ✅

- [x] Install Three.js / @react-three/fiber / @react-three/drei
- [x] Create subtle 3D background scene (`HeroBackground3D` component)
- [x] Add mouse interaction (mouse-following light)
- [x] Performance fallback for mobile (skips 3D on mobile devices)
- [x] Respect `prefers-reduced-motion` (static shapes when enabled)

#### ~~Testimonials Showcase~~ ✅

- [x] Extract testimonials from project data
- [x] Create carousel component (`TestimonialsCarousel`)
- [x] Add to homepage (after Projects section)
- [x] Added testimonials to 5 projects (Safebooks AI, E-Commerce, Healthcare, FinTech, CMS)
- [ ] Include client photos (future enhancement, requires permission)

#### ~~Video Content~~ ✅ (Infrastructure)

- [x] Add video player with lazy loading (`VideoPlayer` component)
- [x] Support for YouTube, Vimeo, and local videos
- [x] Add video section to project detail pages
- [x] Add `ProjectVideo` interface and `video` field to projects
- [x] Sample video added to Safebooks AI project
- [ ] Record actual project demo videos (content creation)
- [ ] Create custom video thumbnails (content creation)

### Priority 5: Testing Infrastructure

#### Unit & Integration Tests

- [ ] Install Vitest
- [ ] Test utility functions (`breadcrumbs.ts`, etc.)
- [ ] Test form validation logic
- [ ] Test data helpers

#### Component Tests

- [ ] Install React Testing Library
- [ ] Test critical UI components
- [ ] Test form interactions
- [ ] Test modal behavior

#### E2E Tests

- [ ] Install Playwright
- [ ] Test user flows:
  - Contact form submission
  - Navigation
  - Dark mode toggle
  - Project filtering
  - Blog search

### Priority 6: Accessibility & Quality

#### WCAG 2.2 Audit

- [ ] Run axe-core DevTools audit
- [ ] Fix critical accessibility issues
- [ ] Test keyboard navigation
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify color contrast ratios
- [ ] Add skip links

#### Accessibility Enhancements

- [ ] Improve focus trap in modals
- [ ] Add aria-live regions for dynamic content
- [ ] Test all interactive elements with keyboard
- [ ] Add focus indicators where missing

### Priority 7: DevOps

#### CI/CD Pipeline

- [ ] GitHub Actions for PR quality checks
- [ ] Automated type checking
- [ ] Lint and format checks
- [ ] Bundle size monitoring

#### Dependency Management

- [ ] Configure Dependabot
- [ ] Set up automated security updates
- [ ] Define update strategy

#### Error Monitoring

- [ ] Set up Sentry
- [ ] Configure source maps
- [ ] Define error alerts
- [ ] Create error dashboard

---

## 🚀 Quick Wins

**Can be done in < 30 minutes:**

1. **Run quality check**

   ```bash
   npm run check
   ```

2. **Verify all links**
   - Social media links
   - Navigation links
   - Footer links
   - External project links

3. **Bundle analysis**

   ```bash
   npm run analyze
   ```

4. **Test contact form**
   - Submit test message
   - Verify email delivery
   - Check toast notifications

5. **Accessibility quick scan**
   - Run axe DevTools
   - Fix critical issues

---

## 📊 Success Metrics

**Technical Targets:**

- Lighthouse Performance > 95
- Lighthouse Accessibility > 95
- LCP < 1.5s
- INP < 100ms
- CLS < 0.05
- Bundle size < 200KB (initial)

**Business Metrics:**

- Contact form submissions/month
- Resume downloads/month
- Average session duration > 2min
- Bounce rate < 40%
- Blog post engagement

---

## 🛠️ Implementation Order

| Priority | Focus Area                               | Impact | Effort     |
| -------- | ---------------------------------------- | ------ | ---------- |
| **P1**   | Newsletter signup, Resume PDF, OG images | High   | Low        |
| **P2**   | Project detail pages, MDX blog           | High   | Medium     |
| **P3**   | Analytics, Performance optimization      | Medium | Low        |
| **P4**   | 3D elements, Visual polish               | Low    | High       |
| **P5**   | Testing infrastructure                   | Medium | Medium     |
| **P6**   | Accessibility audit & fixes              | High   | Low-Medium |
| **P7**   | DevOps & monitoring                      | Medium | Low        |

---

## 📝 Notes

**Environment Setup:**

```bash
# Required environment variables
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=your-email@example.com
BUTTONDOWN_API_KEY=your_buttondown_api_key_here

# Optional (add when implementing)
# SENTRY_DSN=
# VERCEL_ANALYTICS_ID=
```

**Production Checklist:**

- [ ] Verify all API keys are in production env
- [ ] Test contact form end-to-end
- [ ] Test newsletter signup end-to-end
- [ ] Verify DNS and domain settings
- [ ] Test all page loads
- [ ] Run Lighthouse on production URL
- [ ] Set up monitoring alerts

---

_Last updated: December 2025_
_Portfolio: https://olesdidukh.dev_
