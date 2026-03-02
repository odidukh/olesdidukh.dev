# UI/UX Improvements Design — Homepage-First Overhaul

**Date:** 2026-03-02
**Approach:** B — Homepage-First Overhaul
**Style Direction:** Bold & Expressive
**Primary Goals:** Job hunting polish, overall design quality, fix 20 existing issues

---

## Goals & Constraints

- **Audience:** Recruiters and hiring managers (30-60 second evaluation window)
- **Visual Style:** Bold & expressive — strong colors, dynamic animations, creative layouts
- **Page Scope:** Keep all 8 pages, improve each one
- **Existing Issues:** Incorporate all 20 UI/UX gaps from `analysis_ui_ux.md`
- **Performance:** Maintain Lighthouse > 95, respect `prefers-reduced-motion`

---

## Phase 1: Homepage Redesign

### Current Problems

1. Massive empty voids between sections (Hero -> code preview -> Projects)
2. Only 3 visible content areas on an extremely long page
3. Missing sections: About preview, Skills preview, Experience timeline, Blog posts
4. "Open to Work" signal buried in Contact page
5. Primary CTA commented out in hero
6. Dark mode: sections blend into one continuous dark canvas
7. Light mode: very washed out, low contrast

### New Homepage Section Flow

```
1. Hero Section
   - "Open to Work" pulsing badge (moved from Contact — UX-1)
   - Bold name with gradient text
   - Typing animation for specialties
   - Dual CTAs: "View My Work" (primary gradient) + "Get In Touch" (outline)
   - Re-enable primary CTA (UI-2, UX-2)
   - Scroll indicator chevron at bottom
   - Keep SunsetCodeRainBackground + ParticleSystem

2. Social Proof Bar
   - Compact horizontal strip: "7+ Years · 60K+ Users · 4 Companies · 25+ Technologies"
   - Counter animations (numbers count up from 0 on scroll into view)
   - No dead space — tight, impactful

3. About Preview
   - Avatar/photo + 2-3 sentence professional intro
   - Location badge (Vinnytsia, Ukraine)
   - "Full Story →" link to /about

4. Featured Projects (3 cards)
   - 1 large hero card (top project, full-width)
   - 2 smaller cards below
   - Glassmorphism hover effects, gradient border glow
   - "View All Projects →" link to /projects

5. Skills Preview
   - Top 6-8 skills with visual indicators
   - Grouped by category (Frontend, Backend, Tools)
   - "All Skills →" link to /skills

6. Experience Timeline
   - Compact 3-4 milestone horizontal strip
   - Company names + roles + dates
   - "Full Experience →" link to /experience

7. Latest Blog Posts (2-3 cards)
   - Recent articles with thumbnails
   - "Read More →" link to /blog

8. CTA / Contact Section
   - "Let's work together" heading
   - Availability status badge
   - Contact button + Resume download
   - Brief social proof reinforcement

9. Footer (existing, with fixes)
```

### Section Spacing

- Consistent 80-120px vertical spacing between sections (remove current massive gaps)
- Alternating section backgrounds for visual rhythm

---

## Phase 2: Visual Language & Design System

### Color Usage

- Bolder gradients — full Mocha-to-Navy gradient range for headers, CTAs, accents
- Alternating section backgrounds: `bg-background`, `bg-muted/30`, subtle gradient washes
- Dark mode: add `bg-muted/10` separators and faint gradient overlays (fix section blending)
- Light mode: increase contrast, warmer tones

### Typography

- Larger section headings with gradient text on key words
- Clearer visual hierarchy: badge → heading → subtitle size jumps

### Cards & Surfaces

- Glassmorphism on featured cards: `backdrop-blur` + semi-transparent backgrounds
- Stronger hover states: `-translate-y-2`, glow shadows with brand colors, image scale
- Subtle gradient borders on interactive cards

### Animations

- Staggered reveal on scroll (more pronounced `whileInView` stagger)
- Counter animations on social proof numbers
- Magnetic cursor effects on CTAs and featured cards (use existing `MagneticEffect`)
- Keep existing page transitions in `template.tsx`

### Section Differentiation

- Thin gradient accent lines between sections
- Background pattern variety per section (dots, grid, topographic — use existing components)

---

## Phase 3: Inner Page Improvements

### Navigation (All Pages)

- Compact social icons into dropdown/popover (fix UI-5: nav overflow at 1024px)
- Bolder active state indicator with gradient animation

### Projects Page

- Featured project hero card (full-width for top project)
- Better card hover effects: glassmorphism hover, gradient border glow
- Fix featured star color to design system token (UI-9)

### Blog Page

- Reading progress bar on individual posts (UI-1)
- Empty state for filtered results with illustration (UX-3)
- Bento grid layout — featured post gets larger card (UI-6)
- Copy code button on MDX code blocks (UX-10)
- Topical prev/next navigation on posts (UX-7)

### Skills Page

- Keyboard-accessible filter badges (UI-8)
- Replace percentage bars with visual tier system (UI-3)

### Contact Page

- Reduce FAQ from 10 to 5 most important questions
- Character counter on message textarea (UX-4)
- Persistent success state after form submission (UX-8)
- Trust signals near form (UX-6)
- Fix guestbook reload: `router.refresh()` instead of `window.reload()` (UX-9)

### Accessibility

- `aria-live` on TypeAnimation (UX-5)
- Skill filter keyboard navigation (UI-8)

### Global

- Fix dark mode flash on initial load (UI-4)
- Verify Back to Top button visibility (UI-10)
- Add Guestbook + Case Studies to footer links (UI-7)

---

## Issue Resolution Mapping

| Issue                         | Fix Location    | Phase |
| ----------------------------- | --------------- | ----- |
| UI-1: Reading progress bar    | Blog posts      | 3     |
| UI-2: Hero CTA commented out  | Homepage hero   | 1     |
| UI-3: Percentage skill bars   | Skills page     | 3     |
| UI-4: Dark mode flash         | Global layout   | 3     |
| UI-5: Nav overflow 1024px     | Navigation      | 3     |
| UI-6: Uniform blog grid       | Blog page       | 3     |
| UI-7: Footer missing links    | Footer          | 3     |
| UI-8: Skill badges a11y       | Skills page     | 3     |
| UI-9: Featured star color     | ProjectCard     | 3     |
| UI-10: Back to Top            | Global (verify) | 3     |
| UX-1: Open to Work buried     | Homepage hero   | 1     |
| UX-2: View My Work dead-end   | Homepage hero   | 1     |
| UX-3: Blog empty state        | Blog page       | 3     |
| UX-4: Character counter       | Contact form    | 3     |
| UX-5: TypeAnimation aria-live | TypeAnimation   | 3     |
| UX-6: Trust signals           | Contact form    | 3     |
| UX-7: Topical blog nav        | Blog posts      | 3     |
| UX-8: Form success state      | Contact form    | 3     |
| UX-9: Guestbook reload        | GuestbookForm   | 3     |
| UX-10: Copy code button       | MDXContent      | 3     |

---

## Success Criteria

- Homepage loads with no empty voids — continuous visual flow
- "Open to Work" visible within first viewport
- Recruiter can see: who you are, what you do, your best work, and how to contact you within 2 scrolls
- All 20 existing UI/UX issues resolved
- Lighthouse Performance > 95
- Dark mode and light mode both have clear section differentiation
- All animations respect `prefers-reduced-motion`
- Bold visual impact that showcases front-end mastery
