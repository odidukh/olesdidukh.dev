# Portfolio Website Improvements Tracker

This document tracks all suggested improvements for the portfolio website (olesdidukh.dev). Each item includes priority, effort estimation, and implementation status.

---

## 📊 Overview

- **Total Improvements**: 36
- **Completed**: 0
- **In Progress**: 0
- **Pending**: 36

---

## 🎯 Critical Priority (P0)

### 0. Content Management System (Backoffice)

**Status**: ⬜ Pending  
**Effort**: Very High (1-2 weeks)  
**Business Impact**: Transformative  
**Architecture Change**: Major

#### Overview:

Create a full-featured admin panel for managing all portfolio content without code changes. This would transform the portfolio from a static site to a dynamic, database-driven application.

#### Tasks:

- [ ] **Database Setup**
  - [ ] Choose database solution (PostgreSQL with Prisma or Supabase)
  - [ ] Design schema for projects, blog posts, skills, experience
  - [ ] Set up database migrations
  - [ ] Create seed data from existing static files

- [ ] **Authentication System**
  - [ ] Implement NextAuth.js or Clerk
  - [ ] Create secure admin login
  - [ ] Add role-based access control
  - [ ] Implement session management

- [ ] **Admin Dashboard**
  - [ ] Create `/admin` route with auth protection
  - [ ] Design dashboard UI with statistics
  - [ ] Add navigation for all content types
  - [ ] Implement responsive admin layout

- [ ] **Content Editors**
  - [ ] Projects CRUD with image upload
  - [ ] Blog post editor with MDX support
  - [ ] Skills management with categories
  - [ ] Experience timeline editor
  - [ ] Contact form submissions viewer

- [ ] **Media Management**
  - [ ] Implement file upload (Cloudinary/Uploadthing)
  - [ ] Create media library UI
  - [ ] Add image optimization pipeline
  - [ ] Support for video uploads

- [ ] **API Layer**
  - [ ] Create REST/tRPC API endpoints
  - [ ] Implement data validation
  - [ ] Add API authentication
  - [ ] Create webhook system for deployments

- [ ] **Preview System**
  - [ ] Live preview for content changes
  - [ ] Draft/publish workflow
  - [ ] Version history tracking
  - [ ] Rollback functionality

**Technology Stack Options**:

```typescript
// Option 1: Full-Stack with Database
- Database: PostgreSQL/MySQL with Prisma ORM
- Auth: NextAuth.js with GitHub/Google providers
- File Storage: Cloudinary or AWS S3
- UI: Shadcn/ui Admin components

// Option 2: Headless CMS Integration
- CMS: Sanity, Contentful, or Strapi
- Benefits: Faster setup, built-in features
- Drawbacks: Vendor lock-in, monthly costs

// Option 3: Hybrid Approach
- Use Supabase (Database + Auth + Storage)
- Build custom admin UI
- Best of both worlds
```

**Implementation Phases**:

1. **Phase 1**: Database setup and authentication
2. **Phase 2**: Basic CRUD for projects and blog posts
3. **Phase 3**: Media management and file uploads
4. **Phase 4**: Advanced features (preview, versioning)
5. **Phase 5**: Analytics and insights dashboard

**Benefits**:

- No code changes needed for content updates
- Non-technical users can manage content
- Version control for content
- Scheduled publishing
- SEO optimization tools
- Content analytics
- Multi-language support ready

**Considerations**:

- Significant architecture change
- Requires database hosting
- Increases complexity
- Need backup strategies
- Security implications
- Performance considerations with dynamic content

**Quick Start Example (Supabase)**:

```typescript
// 1. Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

// 2. Create database schema (migrations/001_initial.sql)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB,
  images JSONB,
  technologies TEXT[],
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT, -- MDX content
  excerpt TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

// 3. Create admin layout (app/admin/layout.tsx)
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/login');
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}

// 4. Create project editor (app/admin/projects/[id]/page.tsx)
export default function ProjectEditor({ params }) {
  // Full CRUD implementation with form
}
```

---

## 🎯 Critical Priority (P0)

### 1. Test Coverage Expansion

**Status**: ⬜ Pending  
**Effort**: High (2-3 days)  
**Current Coverage**: ~5%  
**Target Coverage**: >80%

#### Tasks:

- [ ] Add API route tests for `/api/contact` and `/api/newsletter`
- [ ] Create component tests for `ContactForm`, `ProjectModal`, `HeroSection`
- [ ] Add integration tests for form submissions
- [ ] Expand E2E tests (project filtering, blog search, dark mode)
- [ ] Implement performance tests for Core Web Vitals
- [ ] Add visual regression tests with Playwright

**Implementation Notes**:

```typescript
// Example test structure needed:
// src/app/api/contact/route.test.ts
// src/components/sections/ContactForm.test.tsx
// src/components/sections/ProjectModal.test.tsx
```

### 2. API Rate Limiting

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**Security Impact**: High

#### Tasks:

- [ ] Install rate limiting packages (`@upstash/ratelimit`, `@upstash/redis`)
- [ ] Implement rate limiting on `/api/contact`
- [ ] Implement rate limiting on `/api/newsletter`
- [ ] Add rate limit headers to responses
- [ ] Create custom rate limit error messages

**Implementation Notes**:

```typescript
// Target implementation:
// - 5 requests per 15 minutes for contact form
// - 3 requests per hour for newsletter signup
```

### 3. Three.js Lazy Loading

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**Performance Impact**: High (~500KB reduction in initial load)

#### Tasks:

- [ ] Convert `HeroBackground3D` to dynamic import
- [ ] Add loading skeleton for 3D scene
- [ ] Implement intersection observer for lazy loading
- [ ] Add performance metrics tracking

---

## 🔧 High Priority (P1)

### 4. Security Headers Enhancement

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**Security Impact**: Medium

#### Tasks:

- [ ] Implement comprehensive Content-Security-Policy
- [ ] Add Strict-Transport-Security header
- [ ] Configure Permissions-Policy
- [ ] Add X-XSS-Protection header
- [ ] Implement CSRF protection for forms

### 5. Missing Directory Structure

**Status**: ⬜ Pending  
**Effort**: Low (1 hour)  
**Impact**: Developer Experience

#### Tasks:

- [ ] Create `/src/types` directory with shared interfaces
- [ ] Create `/src/hooks` directory for custom hooks
- [ ] Create `/src/services` directory for API abstractions
- [ ] Migrate existing types to new structure
- [ ] Update path aliases in tsconfig.json

### 6. Error Boundaries Per Section

**Status**: ⬜ Pending  
**Effort**: Medium (3-4 hours)  
**Reliability Impact**: High

#### Tasks:

- [ ] Create `ErrorBoundary` wrapper component
- [ ] Add error boundaries to `ProjectsSection`
- [ ] Add error boundaries to `BlogSection`
- [ ] Add error boundaries to `ContactSection`
- [ ] Create fallback UI components
- [ ] Add error reporting to Sentry

### 7. Custom Hooks Implementation

**Status**: ⬜ Pending  
**Effort**: Medium (4-5 hours)  
**Code Quality Impact**: High

#### Tasks:

- [ ] Create `useIntersectionObserver` hook
- [ ] Create `useLocalStorage` hook
- [ ] Create `useDebounce` hook
- [ ] Create `useAnalytics` hook
- [ ] Create `useMediaQuery` hook
- [ ] Refactor components to use new hooks

---

## 📈 Medium Priority (P2)

### 8. Service Worker & PWA

**Status**: ⬜ Pending  
**Effort**: High (1-2 days)  
**User Experience Impact**: High

#### Tasks:

- [ ] Create service worker with workbox
- [ ] Implement offline page
- [ ] Add manifest.json
- [ ] Configure caching strategies
- [ ] Add install prompt UI
- [ ] Test offline functionality

### 9. Storybook Integration

**Status**: ⬜ Pending  
**Effort**: High (1-2 days)  
**Documentation Impact**: High

#### Tasks:

- [ ] Install and configure Storybook
- [ ] Create stories for all UI components
- [ ] Document component props and usage
- [ ] Add accessibility addon
- [ ] Configure deployment to Chromatic
- [ ] Add to CI pipeline

### 10. Performance Monitoring

**Status**: ⬜ Pending  
**Effort**: Medium (3-4 hours)  
**Monitoring Impact**: High

#### Tasks:

- [ ] Implement Web Vitals tracking
- [ ] Add custom performance marks
- [ ] Create performance dashboard
- [ ] Set up alerts for degradation
- [ ] Add RUM (Real User Monitoring)

### 11. State Management Solution

**Status**: ⬜ Pending  
**Effort**: Medium (4-5 hours)  
**Architecture Impact**: Medium

#### Tasks:

- [ ] Evaluate state management needs
- [ ] Install Zustand or Jotai
- [ ] Create global store for filters
- [ ] Create store for user preferences
- [ ] Migrate local state to global where needed

### 12. API Documentation

**Status**: ⬜ Pending  
**Effort**: Medium (3-4 hours)  
**Documentation Impact**: High

#### Tasks:

- [ ] Install OpenAPI/Swagger tools
- [ ] Document contact API endpoint
- [ ] Document newsletter API endpoint
- [ ] Document OG image API endpoint
- [ ] Create interactive API explorer
- [ ] Add to developer documentation

### 13. Enhanced Analytics

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**Business Impact**: High

#### Tasks:

- [ ] Add Google Analytics 4
- [ ] Implement custom events tracking
- [ ] Add conversion tracking
- [ ] Create analytics dashboard
- [ ] Add heatmap tracking (Hotjar/Clarity)

### 14. Accessibility Audit & Fixes

**Status**: ⬜ Pending  
**Effort**: Medium (1 day)  
**Accessibility Impact**: High

#### Tasks:

- [ ] Run comprehensive axe-core audit
- [ ] Fix color contrast issues
- [ ] Implement focus trap for modals
- [ ] Add skip navigation links
- [ ] Test with screen readers
- [ ] Add accessibility statement page

---

## 🚀 Low Priority (P3)

### 15. RSS Feed for Blog

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**Content Impact**: Medium

#### Tasks:

- [ ] Create RSS feed generator
- [ ] Add feed discovery tags
- [ ] Test in feed readers
- [ ] Add to sitemap

### 16. Related Posts Algorithm

**Status**: ⬜ Pending  
**Effort**: Medium (3-4 hours)  
**UX Impact**: Medium

#### Tasks:

- [ ] Implement tag-based matching
- [ ] Add category weight scoring
- [ ] Create UI component
- [ ] Add to blog post pages

### 17. Reading Time Estimates

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**UX Impact**: Low

#### Tasks:

- [ ] Add reading-time package
- [ ] Calculate for each blog post
- [ ] Display in blog cards
- [ ] Add to blog post headers

### 18. Resource Hints

**Status**: ⬜ Pending  
**Effort**: Low (1 hour)  
**Performance Impact**: Low

#### Tasks:

- [ ] Add preconnect for external domains
- [ ] Add dns-prefetch for API endpoints
- [ ] Implement route prefetching
- [ ] Add critical CSS preload

### 19. Animation Constants

**Status**: ⬜ Pending  
**Effort**: Low (2 hours)  
**Code Quality Impact**: Medium

#### Tasks:

- [ ] Create animation constants file
- [ ] Extract duplicate animations
- [ ] Create animation presets
- [ ] Update components to use constants

### 20. Form Enhancement

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**UX Impact**: Medium

#### Tasks:

- [ ] Add honeypot field
- [ ] Implement field validation feedback
- [ ] Add progress indicator
- [ ] Create success confirmation email

### 21. Bundle Size Optimization

**Status**: ⬜ Pending  
**Effort**: Medium (3-4 hours)  
**Performance Impact**: Medium

#### Tasks:

- [ ] Analyze bundle with webpack-bundle-analyzer
- [ ] Identify large dependencies
- [ ] Implement code splitting
- [ ] Optimize imports
- [ ] Remove unused dependencies

### 22. Uses/Stack Page

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**Content Impact**: Low

#### Tasks:

- [ ] Create /uses page
- [ ] Document development setup
- [ ] List tools and technologies
- [ ] Add to navigation

### 23. Commit Message Validation

**Status**: ⬜ Pending  
**Effort**: Low (1 hour)  
**DX Impact**: Low

#### Tasks:

- [ ] Install commitlint
- [ ] Configure conventional commits
- [ ] Add to husky hooks
- [ ] Document in contributing guide

### 24. Visual Regression Tests

**Status**: ⬜ Pending  
**Effort**: High (1-2 days)  
**Quality Impact**: Medium

#### Tasks:

- [ ] Configure Playwright for screenshots
- [ ] Create baseline images
- [ ] Add to CI pipeline
- [ ] Configure failure thresholds
- [ ] Document update process

### 25. Dark Mode Enhancements

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**UX Impact**: Low

#### Tasks:

- [ ] Improve color contrast
- [ ] Add transition animations
- [ ] Fix edge cases
- [ ] Add system preference sync

### 26. SEO Schema Expansion

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**SEO Impact**: Medium

#### Tasks:

- [ ] Add Article schema for blog posts
- [ ] Add BreadcrumbList schema
- [ ] Add SoftwareApplication schema for projects
- [ ] Add FAQ schema where applicable

### 27. Performance Budget

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**Performance Impact**: Medium

#### Tasks:

- [ ] Define performance budgets
- [ ] Add to build process
- [ ] Configure alerts
- [ ] Document in README

### 28. Monitoring Dashboard

**Status**: ⬜ Pending  
**Effort**: Medium (4-5 hours)  
**Operations Impact**: High

#### Tasks:

- [ ] Set up monitoring service
- [ ] Create custom dashboards
- [ ] Configure alerts
- [ ] Add status page
- [ ] Document runbooks

### 29. Contributing Guidelines

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**Community Impact**: Medium

#### Tasks:

- [ ] Create CONTRIBUTING.md
- [ ] Document code standards
- [ ] Add PR template
- [ ] Add issue templates

### 30. Deployment Documentation

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**Documentation Impact**: High

#### Tasks:

- [ ] Document Vercel setup
- [ ] Add environment variables guide
- [ ] Create deployment checklist
- [ ] Add rollback procedures

### 31. Architecture Decision Records

**Status**: ⬜ Pending  
**Effort**: Medium (3-4 hours)  
**Documentation Impact**: Medium

#### Tasks:

- [ ] Create ADR template
- [ ] Document key decisions
- [ ] Add to documentation
- [ ] Create decision log

### 32. Component Props Documentation

**Status**: ⬜ Pending  
**Effort**: Medium (4-5 hours)  
**DX Impact**: Medium

#### Tasks:

- [ ] Add JSDoc comments
- [ ] Document all props
- [ ] Add usage examples
- [ ] Generate documentation

### 33. Retry Logic for API Calls

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**Reliability Impact**: Medium

#### Tasks:

- [ ] Implement exponential backoff
- [ ] Add retry configuration
- [ ] Handle specific error codes
- [ ] Add to all API calls

### 34. Loading States Enhancement

**Status**: ⬜ Pending  
**Effort**: Low (2-3 hours)  
**UX Impact**: Medium

#### Tasks:

- [ ] Create skeleton components
- [ ] Add to async operations
- [ ] Implement progressive loading
- [ ] Add loading analytics

### 35. Font Loading Optimization

**Status**: ⬜ Pending  
**Effort**: Low (1-2 hours)  
**Performance Impact**: Low

#### Tasks:

- [ ] Implement font-display: swap
- [ ] Add font preloading
- [ ] Optimize font files
- [ ] Test loading performance

---

## 📋 Implementation Guidelines

### Priority Levels:

- **P0 (Critical)**: Security, major performance issues, critical bugs
- **P1 (High)**: Important features, significant UX improvements
- **P2 (Medium)**: Nice-to-have features, moderate improvements
- **P3 (Low)**: Minor enhancements, polish items

### Effort Estimates:

- **Low**: < 4 hours
- **Medium**: 4-8 hours
- **High**: > 8 hours

### Status Indicators:

- ⬜ Pending
- 🟡 In Progress
- ✅ Completed
- ❌ Blocked
- 🔄 In Review

---

## 🎯 Next Steps

1. Start with P0 items (Critical Priority)
2. Focus on high-impact, low-effort improvements
3. Update status as work progresses
4. Add new improvements as discovered

---

_Last updated: November 2025_
