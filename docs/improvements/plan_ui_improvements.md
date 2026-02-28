# Implementation Plan: UI Improvements

**Created:** 2026-02-28  
**Based on:** `docs/improvements/analysis_ui_ux.md`

---

## UI-1: Reading Progress Bar on Blog Posts

**File:** `src/components/sections/BlogPostContent.tsx`  
**Effort:** ~30 min

### Steps

1. Import `useScroll` and `useTransform` from `framer-motion` (already imported in the file).
2. Add `const { scrollYProgress } = useScroll();` at the top of `BlogPostContent`.
3. Render a **fixed position** `<motion.div>` as the very first child of the return:
   ```tsx
   <motion.div
     className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left bg-gradient-to-r from-mocha-500 to-accent-green"
     style={{ scaleX: scrollYProgress }}
     aria-hidden="true"
   />
   ```
4. Verify it doesn't conflict with the `Navigation` bar (both are `fixed top-0`; set the progress bar to `z-[60]` since nav is `z-50`).
5. Add `@media (prefers-reduced-motion: reduce)` guard: skip the animation, show a static filled bar instead.

---

## UI-2: Re-enable Hero Primary CTA

**File:** `src/components/sections/HeroSection.tsx`  
**Effort:** ~30 min

### Steps

1. Locate the commented-out CTA block at line ~146:
   ```tsx
   {
     /* <Button size="lg" className="group" asChild>
     <TrackedLink href="/projects" ctaName="hero_view_work">
       View My Work
       <ArrowRight ... />
     </TrackedLink>
   </Button> */
   }
   ```
2. Uncomment it but change `href` from `/projects` to `/case-studies` (since the Projects page is not in primary nav). Remove its dependency on `TrackedLink` and use a plain `<Link>` to avoid the commented-out import.
3. Make it the **primary** button (full fill) and demote `<ResumeDownloadButton>` to `variant="outline"` (secondary).
4. Arrange them side-by-side: `<div className="flex flex-wrap gap-4">`.
5. Test on mobile — ensure the button row wraps gracefully at 375px.

---

## UI-3: Replace Percentage Skill Bars with Tier Indicators

**File:** `src/components/sections/SkillsGrid.tsx`  
**Effort:** ~2h

### Steps

1. Change the `Skill` interface from `level: number` to `level: 'Expert' | 'Advanced' | 'Intermediate' | 'Learning'`.
2. Update all skill entries in `skillCategories` to use the four-tier labels. Mapping:
   - `≥ 90%` → `Expert`
   - `75–89%` → `Advanced`
   - `60–74%` → `Intermediate`
   - `< 60%` → `Learning`
3. Create a `SkillTierIndicator` component that renders 4 dots:
   ```tsx
   // ●●●○ Advanced
   const TIER_FILL = { Expert: 4, Advanced: 3, Intermediate: 2, Learning: 1 };
   ```
4. Replace the `<motion.div>` progress bar with the dot indicator + tier label.
5. Add a `<Tooltip>` (use Radix, already installed) that explains each tier on hover.
6. Remove the `hoveredSkill` shimmer animation — it no longer applies.

---

## UI-4: Fix Dark Mode Flash on Initial Load

**File:** `src/stores/useThemeStore.ts`  
**Effort:** ~1h

### Steps

1. In the `onRehydrateStorage` callback, **before** calling `applyTheme()`, check whether the DOM already has the correct class applied by the inline script:
   ```ts
   const domIsDark = document.documentElement.classList.contains('dark');
   const shouldBeDark = resolvedTheme === 'dark';
   if (domIsDark !== shouldBeDark) {
     applyTheme(resolvedTheme, state.accent);
   } else {
     // Only apply accent class without triggering theme-transition
     document.documentElement.classList.add(`theme-${state.accent}`);
   }
   ```
2. Also, the inline script in `layout.tsx` currently doesn't apply the accent class — update it to also read `state.accent` from localStorage and apply `theme-accent` to avoid a second paint.
3. Write a Jest/Vitest test that mocks `localStorage` and `document.documentElement.classList` to verify no double-apply.

---

## UI-5: Navigation Overflow at 1024px

**File:** `src/components/ui/Navigation.tsx`  
**Effort:** ~1h

### Steps

1. Import `DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem` from `@radix-ui/react-dropdown-menu` (already in `package.json`).
2. Define a `primaryNav` (first 5 items) and `overflowNav` (remaining items — currently Guestbook) that changes based on a breakpoint hook.
3. Alternatively — simpler approach — reduce the nav font size for mid viewports:
   ```tsx
   className = 'text-sm xl:text-base';
   ```
   And use `gap-4 xl:gap-6` instead of fixed gap. Test at 1024px viewport.
4. Add `overflow-x-hidden` to the `<header>` to prevent horizontal scrollbar if items do overflow.
5. Update the Playwright nav visual regression snapshot after fixing.

---

## UI-6: Bento Grid for Blog Section

**File:** `src/components/sections/BlogSectionClient.tsx`  
**Effort:** ~2h

### Steps

1. Separate `filteredPosts` into `featuredPost` (first featured, or first post if none are featured) and `remainingPosts`.
2. Create a `FeaturedBlogCard` variant of `BlogCard` with:
   - Larger image (`h-64` instead of `h-48`)
   - 2-column text layout with an excerpt pullquote
   - Author avatar at full `40px` size
3. In the grid JSX:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {featuredPost && (
       <div className="md:col-span-2 lg:col-span-2">
         <FeaturedBlogCard post={featuredPost} />
       </div>
     )}
     {remainingPosts.map((post, i) => (
       <BlogCard key={post.slug} post={post} index={i} />
     ))}
   </div>
   ```
4. Ensure the bento layout only applies when there are ≥ 3 posts; fall back to uniform grid for fewer.

---

## UI-7: Add Guestbook + Case Studies to Footer

**File:** `src/components/ui/Footer.tsx`  
**Effort:** ~5 min

### Steps

1. Add to `navigationLinks`:
   ```ts
   { label: 'Guestbook', href: '/guestbook' },
   ```
2. Add to `resourceLinks`:
   ```ts
   { label: 'Case Studies', href: '/case-studies' },
   ```
3. Done. Verify rendering at all breakpoints.

---

## UI-8: Make Skill Filter Badges Keyboard-Accessible

**File:** `src/components/sections/SkillsGrid.tsx`  
**Effort:** ~15 min

### Steps

1. Replace every `<Badge onClick>` in the filter bar with `<button>` elements:
   ```tsx
   <button
     role="tab"
     aria-selected={selectedCategory === null}
     onClick={() => setSelectedCategory(null)}
     className={cn(
       'rounded-full px-3 py-1 text-sm font-medium transition-all',
       selectedCategory === null
         ? 'bg-primary text-primary-foreground'
         : 'border border-border text-muted-foreground hover:text-foreground'
     )}
   >
     All Skills
   </button>
   ```
2. Wrap the filter row in `<div role="tablist" aria-label="Filter skills by category">`.
3. Add `onKeyDown` support: Arrow Left/Right to navigate between filter buttons.
4. Run `vitest-axe` on the SkillsGrid component to verify zero a11y violations.

---

## UI-9: Fix Featured Star Color Token

**File:** `src/components/sections/ProjectCard.tsx`  
**Effort:** ~5 min

### Steps

1. Locate lines ~77–80:
   ```tsx
   <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 rounded-full p-1">
     <Star className="h-3 w-3 fill-current" />
   </div>
   ```
2. Replace with:
   ```tsx
   <Badge
     variant="secondary"
     className="absolute top-2 right-2 bg-warning-500 text-warning-900 text-xs px-1.5"
   >
     <Star className="h-3 w-3 fill-current mr-0.5" />
     Featured
   </Badge>
   ```
3. Apply the same fix in the list-view variant of `ProjectCard` (same file, different branch).

---

## UI-10: Global "Back to Top" Button

**File:** `src/components/Providers.tsx` (add globally)  
**Effort:** ~1h

### Steps

1. Create `src/components/ui/BackToTop.tsx`:

   ```tsx
   'use client';
   import { motion, useScroll, useTransform } from 'framer-motion';
   import { ArrowUp } from 'lucide-react';

   export function BackToTop() {
     const { scrollY } = useScroll();
     const opacity = useTransform(scrollY, [300, 400], [0, 1]);
     const scale = useTransform(scrollY, [300, 400], [0.8, 1]);

     return (
       <motion.button
         style={{ opacity, scale }}
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
         aria-label="Back to top"
       >
         <ArrowUp className="h-4 w-4" />
       </motion.button>
     );
   }
   ```

2. Import and render `<BackToTop />` inside `Providers.tsx` so it appears on all pages.
3. Respect `prefers-reduced-motion`: if reduced motion is preferred, skip the smooth scroll and use instant jump.
4. Ensure it doesn't overlap the mobile sticky navigation bar.
