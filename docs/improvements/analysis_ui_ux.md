# UI & UX Improvement Analysis

**Date:** 2026-02-28  
**Analyst:** Antigravity AI (code-grounded analysis)  
**Status:** Plans created — see `plan_ui_improvements.md` and `plan_ux_improvements.md`

---

## Summary

A code-level audit of all major sections, components, and pages surfaced **10 UI and 10 UX gaps** that currently prevent this portfolio from being a first-place citizen of the internet. Each finding is tied to a specific file and line number. Implementation plans with step-by-step instructions are in the linked plan files.

---

## UI Findings

| #     | Title                                             | Severity | File                     | Status         |
| ----- | ------------------------------------------------- | -------- | ------------------------ | -------------- |
| UI-1  | No reading-progress bar on blog posts             | Medium   | `BlogPostContent.tsx`    | 🔲 Not started |
| UI-2  | Primary CTA commented out in hero                 | **High** | `HeroSection.tsx:146`    | 🔲 Not started |
| UI-3  | Percentage-based skill bars look arbitrary        | Medium   | `SkillsGrid.tsx`         | 🔲 Not started |
| UI-4  | Dark mode flash on initial load                   | Medium   | `useThemeStore.ts`       | 🔲 Not started |
| UI-5  | Nav overflows at 1024px with 7 items              | Medium   | `Navigation.tsx`         | 🔲 Not started |
| UI-6  | Uniform blog card grid — no editorial weight      | Low      | `BlogSectionClient.tsx`  | 🔲 Not started |
| UI-7  | Footer missing Guestbook + Case Studies links     | Low      | `Footer.tsx`             | 🔲 Not started |
| UI-8  | Skill filter badges not keyboard-accessible       | **High** | `SkillsGrid.tsx:109-124` | 🔲 Not started |
| UI-9  | Featured star uses non-design-system `yellow-500` | Low      | `ProjectCard.tsx:78`     | 🔲 Not started |
| UI-10 | No "Back to Top" button on long pages             | Medium   | (missing globally)       | 🔲 Not started |

---

## UX Findings

| #     | Title                                             | Severity | File                    | Status         |
| ----- | ------------------------------------------------- | -------- | ----------------------- | -------------- |
| UX-1  | "Open to Work" signal buried in Contact section   | **High** | `ContactSection.tsx`    | 🔲 Not started |
| UX-2  | "View My Work" CTA links to commented-out section | **High** | `page.tsx:43-48`        | 🔲 Not started |
| UX-3  | No empty state for filtered blog results          | Medium   | `BlogSectionClient.tsx` | 🔲 Not started |
| UX-4  | No character counter on Contact message field     | Medium   | `ContactForm.tsx`       | 🔲 Not started |
| UX-5  | TypeAnimation has no `aria-live` region           | **High** | `TypeAnimation.tsx`     | 🔲 Not started |
| UX-6  | Trust signals absent from `/contact` route        | Medium   | `ContactForm.tsx`       | 🔲 Not started |
| UX-7  | Prev/Next blog nav is positional, not topical     | Low      | `BlogPostContent.tsx`   | 🔲 Not started |
| UX-8  | No persistent success state after form submit     | Medium   | `ContactForm.tsx`       | 🔲 Not started |
| UX-9  | Guestbook hard-reloads page after posting         | Medium   | `GuestbookForm.tsx:76`  | 🔲 Not started |
| UX-10 | No "Copy Code" button on MDX code blocks          | Medium   | `MDXContent.tsx`        | 🔲 Not started |

---

## Priority Matrix

```
High Impact + Low Effort (Do First):
  → UI-7  Add Guestbook/Case Studies to Footer (5 min)
  → UI-9  Fix ProjectCard Featured color token (5 min)
  → UX-9  Use router.refresh() instead of window.reload() (5 min)
  → UX-5  Add aria-live to TypeAnimation (10 min)
  → UI-8  Make skill filter badges keyboard accessible (15 min)

High Impact + Medium Effort (Do Next):
  → UI-2  Re-enable hero CTA (30 min)
  → UX-1  Surface availability status in hero (30 min)
  → UI-1  Add reading progress bar (30 min)
  → UX-4  Contact form character counter (30 min)
  → UX-8  Form success confirmation screen (45 min)
  → UX-10 Copy code button on code blocks (1h)

Medium Impact + Higher Effort (Later):
  → UI-3  Replace % bars with tier system (2h)
  → UI-4  Fix dark mode double-apply flash (1h)
  → UI-5  Nav overflow handling (1h)
  → UI-6  Bento blog grid layout (2h)
  → UI-10 Back to Top button (1h)
  → UX-2  Fix View My Work dead-end (30 min)
  → UX-3  Blog empty state (30 min)
  → UX-6  Trust signal in contact form (20 min)
  → UX-7  Topical prev/next blog nav (1h)
```
