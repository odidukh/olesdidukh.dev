# Implementation Plan: UX Improvements

**Created:** 2026-02-28  
**Based on:** `docs/improvements/analysis_ui_ux.md`

---

## UX-1: Surface "Open to Work" Signal in Hero & Nav

**Files:** `src/components/sections/HeroSection.tsx`, `src/components/ui/Navigation.tsx`  
**Effort:** ~30 min

### Steps

1. Import `AvailabilityStatus` into `HeroSection.tsx` (it currently lives only in `ContactSection.tsx`).
2. Place `<AvailabilityStatus />` directly below the badge/greeting row, above the `<h1>`:
   ```tsx
   <motion.div variants={itemVariants}>
     <AvailabilityStatus />
   </motion.div>
   ```
3. In `Navigation.tsx`, add a small pulsing green dot next to the site name/logo:
   ```tsx
   <span className="relative flex h-2 w-2 ml-1.5">
     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75" />
     <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
   </span>
   ```
   Wrap this in a `<Tooltip>` that says "Available for new opportunities".
4. Make the dot click-navigate to `#contact` or `/contact`.

---

## UX-2: Fix "View My Work" Dead-End User Flow

**Files:** `src/app/page.tsx`, `src/components/sections/HeroSection.tsx`  
**Effort:** ~30 min

### Steps

1. In `page.tsx`, uncomment the `<ProjectsSection />` block (lines 43–48), or alternatively ensure `/projects` has a proper page with content from `projectsData`.
2. If Projects page is not ready to be the primary destination, change the `href` in the HeroSection CTA (being re-enabled in UI-2) to `/case-studies`.
3. Add `/projects` back to the primary `navItems` in `Navigation.tsx` (it's currently commented out at line 33).
4. Verify the Projects page (`src/app/projects/`) renders correctly with all project data from Velite.

---

## UX-3: Blog Empty State for Filtered Results

**File:** `src/components/sections/BlogSectionClient.tsx`  
**Effort:** ~30 min

### Steps

1. After computing `filteredPosts`, add a conditional render:
   ```tsx
   {
     filteredPosts.length === 0 && (
       <div className="flex flex-col items-center justify-center py-20 text-center">
         <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
         <h3 className="text-lg font-semibold text-foreground mb-2">
           No posts found
         </h3>
         <p className="text-sm text-muted-foreground mb-6">
           {searchQuery
             ? `Nothing matched "${searchQuery}" in ${selectedCategory || 'all categories'}.`
             : `No posts in the "${selectedCategory}" category yet.`}
         </p>
         <Button
           variant="outline"
           onClick={() => {
             setSearchQuery('');
             setSelectedCategory('all');
           }}
         >
           Clear filters
         </Button>
       </div>
     );
   }
   ```
2. Import `BookOpen` from `lucide-react` (already installed).
3. Animate the empty state entrance with `<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>`.

---

## UX-4: Character Counter on Contact Message Field

**File:** `src/components/sections/ContactForm.tsx`  
**Effort:** ~30 min

### Steps

1. The form uses `react-hook-form`. Add `watch` to the destructured form methods:
   ```ts
   const { register, handleSubmit, watch, formState, reset } = useForm();
   const messageValue = watch('message', '');
   ```
2. Find the Zod schema validation for message — note the `maxLength` value (likely 2000 chars).
3. Below the `<Textarea>` for message, add:
   ```tsx
   <div className="flex justify-end mt-1">
     <span
       className={cn(
         'text-xs',
         messageValue.length > maxLength * 0.95
           ? 'text-error-600'
           : messageValue.length > maxLength * 0.8
             ? 'text-warning-600'
             : 'text-muted-foreground'
       )}
     >
       {messageValue.length} / {maxLength}
     </span>
   </div>
   ```
4. Make `maxLength` a named constant shared between the Zod schema and the UI component.

---

## UX-5: Add `aria-live` to TypeAnimation in Hero

**File:** `src/components/ui/TypeAnimation.tsx`  
**Effort:** ~10 min

### Steps

1. Open `TypeAnimation.tsx` and locate the rendered element (likely a `<span>` or `<Wrapper>` prop).
2. Add `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` to the outermost rendered element:
   ```tsx
   <Wrapper
     role="status"
     aria-live="polite"
     aria-atomic="true"
     className={className}
     {...rest}
   >
     {displayText}
     {showCursor && <span aria-hidden="true">|</span>}
   </Wrapper>
   ```
3. Ensure the cursor blink span has `aria-hidden="true"` so it's not read aloud.
4. Run `vitest-axe` against the `HeroSection` test to confirm zero violations (update `src/components/sections/HeroSection.test.tsx`).

---

## UX-6: Add Response-Time Trust Signal to Contact Form

**File:** `src/components/sections/ContactForm.tsx`  
**Effort:** ~20 min

### Steps

1. Add a small trust badge directly above the submit button in the form JSX:
   ```tsx
   <div className="flex items-center gap-2 text-sm text-muted-foreground">
     <Clock className="h-4 w-4 text-success-600" />
     <span>
       Average response:{' '}
       <strong className="text-foreground">under 24 hours</strong> on weekdays
     </span>
   </div>
   ```
2. Import `Clock` from `lucide-react`.
3. Place it in a `<div className="space-y-3">` alongside the Submit button for visual grouping.
4. Also add a `"No spam, unsubscribe anytime"` micro-copy line if a newsletter opt-in is added in future.

---

## UX-7: Topical Prev/Next Navigation in Blog Posts

**File:** `src/components/sections/BlogPostContent.tsx`  
**Effort:** ~1h

### Steps

1. The component already receives `relatedPosts` as a prop (computed by `getRelatedPosts()` based on shared tags).
2. Locate the Prev/Next navigation block — currently it finds adjacent posts in `blogPosts` by index:
   ```ts
   const currentIndex = blogPosts.findIndex(p => p.slug === post.slug);
   const prevPost = blogPosts[currentIndex - 1];
   const nextPost = blogPosts[currentIndex + 1];
   ```
3. Replace `nextPost` with `relatedPosts[0]` (most topically related post). Keep `prevPost` as chronological context.
4. Update the UI labels:
   - Left arrow: "← Previous" (chronological)
   - Right arrow: "Continue reading →" (topical) with the related post title below
5. If `relatedPosts` is empty, fall back to `blogPosts[currentIndex + 1]`.

---

## UX-8: Persistent Success Screen After Contact Form Submit

**File:** `src/components/sections/ContactForm.tsx`  
**Effort:** ~45 min

### Steps

1. Add a `submitted` state: `const [submitted, setSubmitted] = useState(false);`
2. Also capture the submitted name: `const [submittedName, setSubmittedName] = useState('');`
3. On successful API response in the submit handler, instead of just showing a toast:
   ```ts
   setSubmittedName(data.name);
   setSubmitted(true);
   ```
4. Conditionally render a success screen instead of the form:
   ```tsx
   if (submitted) {
     return (
       <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="text-center py-12 space-y-4"
       >
         <CheckCircle className="h-16 w-16 text-success-600 mx-auto" />
         <h3 className="text-2xl font-bold">Message sent, {submittedName}!</h3>
         <p className="text-muted-foreground">
           I'll get back to you within 24 hours.
         </p>
         <Button variant="outline" onClick={() => setSubmitted(false)}>
           Send another message
         </Button>
       </motion.div>
     );
   }
   ```
5. Remove the Sonner toast for the success case (keep it for error case only).

---

## UX-9: Use `router.refresh()` Instead of `window.location.reload()` in Guestbook

**File:** `src/components/sections/GuestbookForm.tsx`  
**Effort:** ~5 min

### Steps

1. Import `useRouter` from `next/navigation`:
   ```tsx
   import { useRouter } from 'next/navigation';
   ```
2. Initialize: `const router = useRouter();` inside the component.
3. Replace both `window.location.reload()` calls:

   ```ts
   // Before:
   window.location.reload();

   // After:
   router.refresh();
   ```

4. Remove the `setTimeout` delay wrapper (it was only there to let the user read the success message before the reload). With `router.refresh()` the component stays mounted, so the success message and form reset can remain visible.
5. Move the `setSuccess(false)` call to fire after 3 seconds using `setTimeout` without the reload.

---

## UX-10: "Copy Code" Button on MDX Code Blocks

**Files:** `src/components/MDXContent.tsx`, `velite.config.ts`  
**Effort:** ~1h

### Steps

1. In `velite.config.ts`, `rehype-pretty-code` is likely configured via MDX plugins. Add a `transformers` option to inject a copy button trigger attribute:

   ```ts
   import { transformerCopyButton } from '@rehype-pretty/transformers';

   rehypePrettyCode({
     theme: 'github-dark',
     transformers: [
       transformerCopyButton({
         visibility: 'hover',
         feedbackDuration: 2000,
       }),
     ],
   });
   ```

   > Note: `@rehype-pretty/transformers` needs to be installed: `npm install @rehype-pretty/transformers`

2. If the above package is not compatible, implement manually:
   - Configure `rehype-pretty-code` `onVisitLine` to add `data-line` attributes.
   - In `MDXContent.tsx` (or a global CSS file), add a CSS-based copy button using `::after` on `pre` elements.
   - Attach a global `click` listener in a `useEffect` that targets `pre[data-language]` elements and copies `textContent`.

3. Style the button using design tokens:

   ```css
   pre {
     position: relative;
   }
   pre > button.copy-btn {
     position: absolute;
     top: 0.5rem;
     right: 0.5rem;
     /* Use bg-card, border-border, text-muted-foreground tokens */
   }
   ```

4. Show a ✓ checkmark for 2 seconds after copying (swap the icon via JS class toggle).
