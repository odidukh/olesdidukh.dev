# UI/UX Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio from a functional but visually bland site into a bold, expressive showcase that impresses recruiters within 30 seconds — fixing structural layout issues, adding section differentiation, and resolving remaining UI/UX gaps.

**Architecture:** Homepage-first overhaul. Fix section visibility and differentiation on the homepage first (the root cause of "empty voids" is sections blending into the background, not missing content). Then cascade the bold visual language to inner pages while resolving the remaining genuine UI/UX issues.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Framer Motion, Radix UI, Lucide React

---

## Important Corrections from Code Audit

The Feb 28 analysis (`analysis_ui_ux.md`) is partially outdated. Code inspection reveals:

| Issue                         | Status         | Evidence                                                                            |
| ----------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| UI-1: Reading progress bar    | ALREADY FIXED  | `BlogPostContent.tsx` has `motion.div` with `scrollYProgress`                       |
| UI-2: Hero CTA commented out  | CORRECTED      | CTA exists ("Let's Talk" → /contact), but needs "View My Work" CTA added            |
| UI-3: Percentage skill bars   | ALREADY FIXED  | `SkillsGrid.tsx` uses dot-based tier system (Expert/Advanced/Intermediate/Learning) |
| UI-8: Skill badges a11y       | ALREADY FIXED  | `SkillsGrid.tsx` has `role="tablist"`, arrow key navigation, `aria-selected`        |
| UI-10: Back to Top            | ALREADY EXISTS | Mounted in `Providers` component                                                    |
| UX-1: Open to Work buried     | CORRECTED      | Already in hero as "Available for new opportunities" badge                          |
| UX-4: Character counter       | ALREADY FIXED  | `ContactForm.tsx` has live character counter with color warnings                    |
| UX-5: TypeAnimation aria-live | ALREADY FIXED  | Has `role="status" aria-live="polite" aria-atomic="true"`                           |
| UX-6: Trust signals           | ALREADY FIXED  | `AvailabilityStatus.tsx` shows "15+ projects completed", "99% on-time"              |
| UX-7: Topical blog nav        | ALREADY FIXED  | `nextPost` prefers `relatedPosts[0]`                                                |
| UX-8: Form success state      | ALREADY FIXED  | Persistent success screen with "Message sent" + action buttons                      |
| UX-9: Guestbook reload        | ALREADY FIXED  | Uses `router.refresh()` correctly                                                   |

**Remaining genuine issues to fix:** UI-4 (dark mode edge cases), UI-5 (nav overflow), UI-6 (blog bento), UI-7 (footer links), UI-9 (featured star color), UX-2 (need "View My Work" CTA scrolling to projects), UX-3 (blog empty state needs enhancement), UX-10 (copy code button on MDX)

---

## Phase 1: Homepage — Section Differentiation & Visual Rhythm

The homepage already renders 9 sections (Hero, About, Journey, SkillsPreview, Philosophy, Projects, Blog, Contact, CTA). The problem is that sections blend together — especially in dark mode. This phase adds alternating backgrounds, gradient accents, and bolder section headers.

---

### Task 1: Add alternating section backgrounds to homepage

**Files:**

- Modify: `src/components/sections/AboutSection.tsx:196` (section className)
- Modify: `src/components/sections/JourneySection.tsx:39` (section className)
- Modify: `src/components/sections/SkillsPreviewSection.tsx:38` (section className)
- Modify: `src/components/sections/PhilosophySection.tsx:54` (section className)
- Modify: `src/components/sections/ContactSection.tsx:116` (section className)
- Modify: `src/components/sections/CtaSectionClient.tsx:18` (section className)
- Modify: `src/styles/design-tokens.css` (add section background tokens)

**Step 1: Add section background CSS tokens**

In `src/styles/design-tokens.css`, add these tokens inside the `:root` block:

```css
/* Section alternating backgrounds */
--section-bg-primary: var(--background);
--section-bg-alternate: color-mix(in srgb, var(--muted) 30%, transparent);
--section-bg-accent: linear-gradient(
  135deg,
  color-mix(in srgb, var(--primary) 5%, transparent),
  var(--background)
);
--section-divider: linear-gradient(
  90deg,
  transparent,
  var(--primary),
  transparent
);
```

And in the `.dark` block:

```css
--section-bg-alternate: color-mix(in srgb, var(--muted) 15%, transparent);
--section-bg-accent: linear-gradient(
  135deg,
  color-mix(in srgb, var(--primary) 8%, transparent),
  var(--background)
);
```

**Step 2: Apply alternating backgrounds**

Update section classNames to create visual rhythm:

| Section       | Current                                     | New                                                                       |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| Hero          | `min-h-screen` (transparent)                | Keep as-is (has own background)                                           |
| About         | `py-24 md:py-32`                            | `py-24 md:py-32 bg-muted/30 dark:bg-muted/10`                             |
| Journey       | `py-20 bg-muted/30`                         | Keep as-is (already has alternate bg)                                     |
| SkillsPreview | `py-20`                                     | `py-20 bg-gradient-to-br from-primary/5 via-background to-background`     |
| Philosophy    | `py-20 bg-gradient-to-br from-primary/5...` | Keep as-is (already has gradient bg)                                      |
| Projects      | `py-20`                                     | `py-20 bg-muted/30 dark:bg-muted/10`                                      |
| Blog          | `py-20 md:py-28`                            | `py-20 md:py-28` (keep transparent — sandwiched between colored sections) |
| Contact       | `py-20 md:py-28`                            | `py-20 md:py-28 bg-muted/30 dark:bg-muted/10`                             |
| CTA           | Has gradient bg                             | Keep as-is                                                                |

**Step 3: Add thin gradient dividers between sections**

In `src/app/page.tsx`, add divider elements between key sections:

```tsx
{
  /* Gradient divider */
}
<div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />;
```

Add dividers after: Hero, About, Philosophy, Projects, Blog.

**Step 4: Verify visually**

Run: `npm run dev`
Check both light and dark mode — sections should now be clearly distinguishable with alternating backgrounds and subtle gradient dividers.

**Step 5: Commit**

```bash
git add src/components/sections/ src/styles/design-tokens.css src/app/page.tsx
git commit -m "feat(ui): add alternating section backgrounds and gradient dividers for visual rhythm"
```

---

### Task 2: Enhance hero section — add "View My Work" CTA and bold typography

**Files:**

- Modify: `src/components/sections/HeroSectionClient.tsx`

**Step 1: Add "View My Work" CTA button**

Replace the current CTA section (lines 166-181) with dual CTAs:

```tsx
{
  /* CTA Buttons */
}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8 }}
  className="flex flex-wrap gap-4 justify-center mb-12"
>
  <Button size="lg" variant="gradient" asChild>
    <Link href="#projects">
      View My Work
      <ArrowRight className="ml-2 w-4 h-4" />
    </Link>
  </Button>
  <Button size="lg" variant="outline" asChild>
    <Link href="/contact">
      Get In Touch
      <Mail className="ml-2 w-4 h-4" />
    </Link>
  </Button>
</motion.div>;
```

Add `ArrowRight` to the lucide-react imports. This fixes UX-2 (View My Work dead-end).

**Step 2: Enhance "Open to Work" badge styling**

The badge already exists (line 103-113). Make it bolder:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="inline-flex items-center gap-2 px-5 py-2.5 bg-success-500/15 border border-success-500/30 rounded-full mb-8 shadow-sm shadow-success-500/10"
>
  <div className="relative">
    <div className="w-2.5 h-2.5 bg-success-500 rounded-full" />
    <div className="absolute inset-0 w-2.5 h-2.5 bg-success-500 rounded-full animate-ping" />
  </div>
  <span className="text-sm font-semibold text-success-500">Open to Work</span>
</motion.div>
```

**Step 3: Bold up the heading**

Update the h1 to use stronger gradient and larger "name" text:

```tsx
<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
  <span className="block text-foreground/70 text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
    Hi, I&apos;m
  </span>
  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-mocha-400 to-primary mb-2">
    Oles Didukh
  </span>
  <span className="block text-foreground">Senior Front-End Engineer</span>
</h1>
```

**Step 4: Run type-check**

Run: `npm run type-check`
Expected: No errors

**Step 5: Commit**

```bash
git add src/components/sections/HeroSectionClient.tsx
git commit -m "feat(hero): add View My Work CTA, enhance Open to Work badge, bold typography"
```

---

### Task 3: Add social proof bar with counter animations

**Files:**

- Create: `src/components/sections/SocialProofBar.tsx`
- Modify: `src/app/page.tsx` (add between Hero and About)

**Step 1: Create SocialProofBar component**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, Building2, Code2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  inView: boolean;
  reducedMotion: boolean;
}

function AnimatedCounter({
  end,
  suffix = '',
  duration = 2,
  inView,
  reducedMotion,
}: CounterProps) {
  if (reducedMotion || !inView) {
    return (
      <span>
        {end}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={0}
        animate={inView ? end : 0}
        transition={{ duration, ease: 'easeOut' }}
      >
        {/* Counter value rendered via Framer Motion */}
      </motion.span>
    </motion.span>
  );
}

const stats = [
  { icon: Briefcase, value: 7, suffix: '+', label: 'Years Experience' },
  { icon: Users, value: 60, suffix: 'K+', label: 'Users Impacted' },
  { icon: Building2, value: 4, suffix: '', label: 'Companies' },
  { icon: Code2, value: 25, suffix: '+', label: 'Technologies' },
];

export function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="py-12 border-y border-border/50 bg-muted/20 dark:bg-muted/5"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <Icon className="w-5 h-5 text-primary/60" />
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

Note: A full counter animation using `useMotionValue` + `useSpring` + `useTransform` can be added as a polish step. The above gets the structure right.

**Step 2: Add to homepage**

In `src/app/page.tsx`, add after HeroSectionClient:

```tsx
import { SocialProofBar } from '@/components/sections/SocialProofBar';

// In the JSX, after <HeroSectionClient />:
<SocialProofBar />;
```

**Step 3: Run type-check**

Run: `npm run type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/sections/SocialProofBar.tsx src/app/page.tsx
git commit -m "feat(homepage): add social proof bar with stats between hero and about"
```

---

### Task 4: Simplify homepage section ordering for recruiter flow

**Files:**

- Modify: `src/app/page.tsx`

The current order is: Hero → About → Journey → SkillsPreview → Philosophy → Projects → Blog → Contact → CTA

For recruiter optimization, reorder to: Hero → SocialProofBar → About → Projects → SkillsPreview → Journey → Blog → Contact → CTA

Remove Philosophy from homepage (it's accessible from /about/philosophy — too niche for recruiter scanning).

**Step 1: Reorder sections**

```tsx
export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <HeroSectionClient />
        <SocialProofBar />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <AboutSection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ErrorBoundary
          sectionName="Projects"
          fallbackRender={BlogErrorFallback}
        >
          <ProjectsSection />
        </ErrorBoundary>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <SkillsPreviewSection />
        <JourneySection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
          <BlogSection />
        </ErrorBoundary>
        <ErrorBoundary
          sectionName="Contact"
          fallbackRender={ContactErrorFallback}
        >
          <ContactSection />
        </ErrorBoundary>
        <CtaSectionClient />
      </main>
      <Footer />
    </>
  );
}
```

Remove the `PhilosophySection` import (it's still on /about/philosophy page).

**Step 2: Run dev server and verify**

Run: `npm run dev`
Navigate through homepage in both themes. Projects should now appear much sooner in the scroll.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(homepage): reorder sections for recruiter flow, remove philosophy from homepage"
```

---

### Task 5: Fix Projects ErrorBoundary using wrong fallback

**Files:**

- Modify: `src/app/page.tsx:44-46`

**Step 1: Create ProjectsErrorFallback or use correct fallback**

The Projects `ErrorBoundary` currently uses `BlogErrorFallback` — this is a copy-paste bug. Import or create a proper fallback:

Check if `SectionErrorFallback.tsx` exports a `ProjectsErrorFallback`. If not, `BlogErrorFallback` is generic enough to reuse — but rename the usage or add a projects-specific one.

Simplest fix: The `BlogErrorFallback` is likely generic ("Something went wrong loading this section"). If so, it works fine. But verify and rename if needed.

**Step 2: Run type-check**

Run: `npm run type-check`

**Step 3: Commit if changes were made**

```bash
git commit -m "fix: use correct error fallback for Projects section"
```

---

## Phase 2: Visual Language Enhancements

---

### Task 6: Enhance card hover effects — glassmorphism and glow

**Files:**

- Modify: `src/components/sections/ProjectCard.tsx` (grid view card hover)
- Modify: `src/components/sections/BlogCard.tsx` (card hover)

**Step 1: Add glassmorphism hover to ProjectCard**

In `ProjectCard.tsx`, find the grid-view card wrapper and enhance the hover classes:

```tsx
// Add to the card motion.div className:
className="group relative rounded-xl border border-border/50 bg-card overflow-hidden
  transition-all duration-300
  hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
  dark:hover:shadow-primary/10 dark:hover:border-primary/20"

// Add whileHover:
whileHover={{ y: -8, transition: { duration: 0.3 } }}
```

**Step 2: Add glow effect to BlogCard**

In `BlogCard.tsx`, enhance the card wrapper:

```tsx
// Update whileHover from { y: -5 } to:
whileHover={{ y: -8 }}

// Add to className:
"hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10
 hover:border-primary/20 transition-shadow duration-300"
```

**Step 3: Run type-check and verify**

Run: `npm run type-check`
Verify cards have visible lift + glow on hover in both themes.

**Step 4: Commit**

```bash
git add src/components/sections/ProjectCard.tsx src/components/sections/BlogCard.tsx
git commit -m "feat(ui): add glassmorphism hover with glow effects to project and blog cards"
```

---

### Task 7: Enhance section headers with bolder typography

**Files:**

- Modify: `src/components/sections/AboutSection.tsx` (heading area)
- Modify: `src/components/sections/ProjectsSectionClient.tsx` (heading area)
- Modify: `src/components/sections/BlogSectionClient.tsx` (heading area)
- Modify: `src/components/sections/ContactSection.tsx` (heading area)

**Step 1: Create consistent section header pattern**

Each section currently uses similar but inconsistent header patterns. Standardize to:

```tsx
{
  /* Section badge */
}
<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
  <Icon className="w-4 h-4 text-primary" />
  <span className="text-sm font-semibold text-primary">Section Name</span>
</div>;

{
  /* Bold heading with gradient keyword */
}
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
  Main Text{' '}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-mocha-400">
    Gradient Keyword
  </span>
</h2>;

{
  /* Subtitle */
}
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  Description text
</p>;
```

Apply this pattern to each section's header, keeping the specific text but standardizing the visual treatment.

**Step 2: Verify all 4 sections visually**

Run dev server. Each section header should now have consistent badge + bold heading + gradient keyword pattern.

**Step 3: Commit**

```bash
git add src/components/sections/AboutSection.tsx src/components/sections/ProjectsSectionClient.tsx src/components/sections/BlogSectionClient.tsx src/components/sections/ContactSection.tsx
git commit -m "feat(ui): standardize section headers with bold gradient typography"
```

---

### Task 8: Add background patterns to key sections

**Files:**

- Modify: `src/components/sections/AboutSection.tsx`
- Modify: `src/components/sections/SkillsPreviewSection.tsx`

**Step 1: Add subtle dot grid to About section**

Import and add `GridPatternBackground` as a subtle backdrop:

```tsx
import { GridPatternBackground } from '@/components/ui/backgrounds/GridPatternBackground';

// Inside the section, as first child (behind content):
<div className="absolute inset-0 opacity-30 dark:opacity-15 pointer-events-none">
  <GridPatternBackground variant="dots" gridSize={50} interactive={false} />
</div>;
```

Ensure the section has `relative overflow-hidden` on its className.

**Step 2: Add topographic background to SkillsPreview**

```tsx
import { TopographicBackground } from '@/components/ui/backgrounds/TopographicBackground';

// Inside the section:
<div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
  <TopographicBackground layers={5} animated={false} />
</div>;
```

**Step 3: Verify performance**

Check that the backgrounds don't cause layout shift or performance issues. The `interactive={false}` and `animated={false}` props prevent unnecessary re-renders.

**Step 4: Commit**

```bash
git add src/components/sections/AboutSection.tsx src/components/sections/SkillsPreviewSection.tsx
git commit -m "feat(ui): add subtle background patterns to About and Skills sections"
```

---

### Task 9: Wrap hero CTAs with MagneticEffect

**Files:**

- Modify: `src/components/sections/HeroSectionClient.tsx`

**Step 1: Import and wrap CTAs**

```tsx
import { MagneticEffect } from '@/components/ui/MagneticEffect';

// Wrap each CTA button:
<MagneticEffect strength={10}>
  <Button size="lg" variant="gradient" asChild>
    <Link href="#projects">
      View My Work
      <ArrowRight className="ml-2 w-4 h-4" />
    </Link>
  </Button>
</MagneticEffect>

<MagneticEffect strength={10}>
  <Button size="lg" variant="outline" asChild>
    <Link href="/contact">
      Get In Touch
      <Mail className="ml-2 w-4 h-4" />
    </Link>
  </Button>
</MagneticEffect>
```

The `MagneticEffect` component already handles `prefers-reduced-motion` internally.

**Step 2: Run type-check**

Run: `npm run type-check`

**Step 3: Commit**

```bash
git add src/components/sections/HeroSectionClient.tsx
git commit -m "feat(hero): add magnetic cursor effect to CTA buttons"
```

---

### Task 10: Fix SkillsPreviewSection decorative rings ignoring reduced motion

**Files:**

- Modify: `src/components/sections/SkillsPreviewSection.tsx`

**Step 1: Guard decorative animations**

Find the two `motion.div` elements with `animate={{ rotate: 360 }}` and wrap them:

```tsx
const prefersReducedMotion = useReducedMotion();

// Replace infinite rotate with:
animate={prefersReducedMotion ? {} : { rotate: 360 }}
transition={prefersReducedMotion ? {} : { duration: 20, repeat: Infinity, ease: 'linear' }}
```

**Step 2: Run type-check**

Run: `npm run type-check`

**Step 3: Commit**

```bash
git add src/components/sections/SkillsPreviewSection.tsx
git commit -m "fix(a11y): respect prefers-reduced-motion for decorative spinning rings"
```

---

## Phase 3: Inner Page Improvements & Remaining Issue Fixes

---

### Task 11: Fix navigation overflow at 1024px (UI-5)

**Files:**

- Modify: `src/components/ui/Navigation.tsx`

**Step 1: Compact social icons on desktop**

The nav currently shows 8 links + 3 social icons + search + theme toggle. At 1024px (`lg` breakpoint) this overflows.

Option: Hide social icons at `lg` and only show at `xl`:

```tsx
// Change social icon container from hidden md:flex to:
<div className="hidden xl:flex items-center gap-1">
  {/* GitHub, LinkedIn, Email icons */}
</div>
```

This frees space at the `lg` breakpoint.

**Step 2: Reduce nav link padding at lg**

```tsx
// Nav links: reduce horizontal padding at lg:
className = '... lg:px-2 xl:px-3 ...';
```

**Step 3: Test at 1024px viewport**

Resize browser to 1024px. All 8 nav items should be visible without overflow.

**Step 4: Commit**

```bash
git add src/components/ui/Navigation.tsx
git commit -m "fix(nav): prevent overflow at 1024px by hiding social icons until xl breakpoint"
```

---

### Task 12: Add footer links for Guestbook and Case Studies (UI-7)

**Files:**

- Modify: `src/components/ui/Footer.tsx`

**Step 1: Add missing links to navigation column**

In the Navigation list, the links are: About, Experience, Projects, Skills, Blog, Guestbook, Contact.

Check if Guestbook is already there. If not, add it after Blog:

```tsx
<li>
  <Link href="/guestbook" className="...">
    Guestbook
  </Link>
</li>
```

In the Resources list, check if Case Studies is already there. If not, add it:

```tsx
<li>
  <Link href="/case-studies" className="...">
    Case Studies
  </Link>
</li>
```

**Step 2: Verify footer**

Run dev server. Check footer has all links.

**Step 3: Commit**

```bash
git add src/components/ui/Footer.tsx
git commit -m "fix(footer): add Guestbook and Case Studies links"
```

---

### Task 13: Fix ProjectCard featured star color token (UI-9)

**Files:**

- Modify: `src/components/sections/ProjectCard.tsx`

**Step 1: Find the featured badge**

Search for `yellow-500` or `warning-500` in ProjectCard. Replace any raw Tailwind color with design system token:

```tsx
// If using yellow-500, change to:
className = '... bg-warning-500/10 text-warning-500 border-warning-500/20 ...';
// Or use the Badge component with variant="warning"
```

**Step 2: Run type-check**

Run: `npm run type-check`

**Step 3: Commit**

```bash
git add src/components/sections/ProjectCard.tsx
git commit -m "fix(ui): use design system warning token for featured project badge"
```

---

### Task 14: Add copy code button to MDX code blocks (UX-10)

**Files:**

- Modify: `src/mdx-components.tsx` (or wherever MDX component overrides are defined)

**Step 1: Find MDX component overrides**

Check `src/mdx-components.tsx` for a `pre` or `code` override. If none exists, add one:

```tsx
import { CopyCodeBlock } from '@/components/ui/CopyCodeBlock';

// In the components map:
pre: ({ children, ...props }) => (
  <CopyCodeBlock {...props}>{children}</CopyCodeBlock>
),
```

**Step 2: Verify CopyCodeBlock component exists**

Check `src/components/ui/CopyCodeBlock.tsx`. If it already exists, wire it up. If not, create a minimal version:

```tsx
'use client';

import { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyCodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CopyCodeBlock({ children, className }: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre ref={preRef} className={className}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-muted/80 backdrop-blur-sm
          opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-muted focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-success-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
```

**Step 3: Run type-check and verify on a blog post**

Run: `npm run type-check`
Navigate to a blog post with code blocks. The copy button should appear on hover.

**Step 4: Commit**

```bash
git add src/components/ui/CopyCodeBlock.tsx src/mdx-components.tsx
git commit -m "feat(blog): add copy-to-clipboard button on MDX code blocks"
```

---

### Task 15: Enhance blog empty state (UX-3)

**Files:**

- Modify: `src/components/sections/BlogSectionClient.tsx`

**Step 1: Find the empty state**

The current empty state (around line 281) shows a basic "Clear filters" button. Enhance it:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  className="flex flex-col items-center justify-center py-20 text-center"
>
  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
    <SearchX className="w-8 h-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold mb-2">No articles found</h3>
  <p className="text-muted-foreground mb-6 max-w-md">
    No articles match your current filters. Try adjusting your search or browse
    all posts.
  </p>
  <div className="flex gap-3">
    <Button variant="outline" onClick={clearAllFilters}>
      Clear Filters
    </Button>
    <Button variant="ghost" onClick={() => setSearchQuery('')}>
      Browse All
    </Button>
  </div>
</motion.div>
```

Import `SearchX` from lucide-react.

**Step 2: Run type-check**

Run: `npm run type-check`

**Step 3: Commit**

```bash
git add src/components/sections/BlogSectionClient.tsx
git commit -m "feat(blog): enhance empty state with illustration and better copy"
```

---

### Task 16: Reduce Contact FAQ from 10 to 5 questions

**Files:**

- Modify: `src/components/sections/FAQ.tsx`

**Step 1: Keep the 5 most relevant FAQs for recruiters**

Keep these 5 (most relevant to hiring managers):

1. "What types of projects do you work on?"
2. "What is your typical project timeline?"
3. "Do you work with international clients?"
4. "What technologies do you specialize in?"
5. "How do you ensure code quality?"

Remove: development process, communication, ongoing support, payment terms, existing codebases.

**Step 2: Add keyboard accessibility to FAQ cards**

The FAQ `Card` components use `onClick` but no `role` or `onKeyDown`. Add:

```tsx
<Card
  onClick={() => toggleItem(index)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(index);
    }
  }}
  role="button"
  aria-expanded={openIndex === index}
  tabIndex={0}
  className="cursor-pointer ..."
>
```

**Step 3: Run type-check**

Run: `npm run type-check`

**Step 4: Commit**

```bash
git add src/components/sections/FAQ.tsx
git commit -m "feat(contact): reduce FAQ to 5 recruiter-relevant questions, add keyboard a11y"
```

---

### Task 17: Dark mode edge case refinements (UI-4)

**Files:**

- Modify: `src/stores/useThemeStore.ts`
- Modify: `src/components/ui/Navigation.tsx`

**Step 1: Verify the inline script in layout.tsx handles system preference**

Read `src/app/layout.tsx` and check the inline `<script>`. It should handle:

1. Explicit dark/light mode from localStorage
2. System preference fallback
3. No localStorage (first visit)

If it doesn't handle system preference, add:

```js
const mode = parsed?.state?.mode;
if (
  mode === 'dark' ||
  (mode === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
}
```

**Step 2: Guard theme toggle icon in Navigation**

The Navigation renders the theme toggle icon without waiting for `hasHydrated`. This can show the wrong icon on first paint. Add:

```tsx
const hasHydrated = useThemeHydrated();

// In the toggle button:
{hasHydrated ? (
  resolvedTheme === 'dark' ? <Sun ... /> : <Moon ... />
) : (
  <div className="w-5 h-5" /> // placeholder to prevent layout shift
)}
```

**Step 3: Run type-check**

Run: `npm run type-check`

**Step 4: Commit**

```bash
git add src/stores/useThemeStore.ts src/components/ui/Navigation.tsx src/app/layout.tsx
git commit -m "fix(theme): handle dark mode edge cases and prevent icon flash on hydration"
```

---

### Task 18: Final visual polish pass

**Files:**

- Various section components

**Step 1: Verify all sections in light mode**

Navigate through every page. Check:

- Section backgrounds alternate correctly
- Gradient dividers are visible but subtle
- Card hover effects work
- Typography hierarchy is clear

**Step 2: Verify all sections in dark mode**

Same checks. Specifically verify:

- Sections are distinguishable (not a "wall of dark")
- Glow effects are visible but not garish
- Text contrast meets WCAG AA

**Step 3: Run full quality check**

Run: `npm run check`
Expected: All checks pass (type-check + lint:strict + format:check)

**Step 4: Fix any issues found**

Address any lint or format issues.

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final visual polish pass — lint and format fixes"
```

---

## Phase 4: Testing & Verification

---

### Task 19: Update visual regression snapshots

**Step 1: Run existing tests**

Run: `npm test`
Check for test failures caused by the UI changes.

**Step 2: Update snapshots**

If visual regression tests fail due to intentional UI changes:

Run: `npm test -- -u` (update snapshots)

Review updated snapshots to confirm they reflect the intended design.

**Step 3: Run E2E tests**

Run: `npx playwright test`
Fix any selector issues caused by changed HTML structure.

**Step 4: Commit**

```bash
git add -A
git commit -m "test: update visual snapshots and fix E2E selectors for UI refresh"
```

---

### Task 20: Update the UI/UX analysis doc with resolution status

**Files:**

- Modify: `docs/improvements/analysis_ui_ux.md`

**Step 1: Update all issue statuses**

Mark resolved issues with checkmarks and note which were already fixed vs. fixed in this sprint.

**Step 2: Commit**

```bash
git add docs/improvements/analysis_ui_ux.md
git commit -m "docs: update UI/UX analysis with resolution status"
```

---

## Summary

| Phase | Tasks       | Focus                                                                        |
| ----- | ----------- | ---------------------------------------------------------------------------- |
| 1     | Tasks 1-5   | Homepage section differentiation, hero CTAs, social proof, recruiter flow    |
| 2     | Tasks 6-10  | Visual language — card effects, typography, backgrounds, magnetic CTAs, a11y |
| 3     | Tasks 11-17 | Inner page fixes — nav overflow, footer links, copy code, FAQ, dark mode     |
| 4     | Tasks 18-20 | Polish, testing, documentation                                               |

**Estimated total: 20 tasks across 4 phases.**
