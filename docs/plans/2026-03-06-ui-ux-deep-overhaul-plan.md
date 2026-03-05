# UI/UX Deep Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 20 visual polish and recruiter-persuasion issues across spacing, content architecture, broken interactions, and functional enhancements.

**Architecture:** Surgical edits to existing components — no new files except minor additions to `BlogFilters` props interface. All changes are in the `src/` directory, primarily in `components/sections/`, `app/`, and `stores/`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Zustand, Fuse.js, cmdk

**Design doc:** `docs/plans/2026-03-06-ui-ux-deep-overhaul-design.md`

---

## Phase 1: First Impression Fixes

### Task 1: Fix Double-Padding on Skills Page Hero

**Files:**

- Modify: `src/app/skills/page.tsx:391`

**Step 1: Fix the padding**

Change the Container's `py-20` to `pb-16` (the `pt-20` on the parent section at line 365 already handles navbar clearance):

```tsx
// Before (line 391):
<Container size="lg" className="relative z-10 text-center py-20">

// After:
<Container size="lg" className="relative z-10 text-center pb-16">
```

**Step 2: Verify visually**

Run: `npm run dev`
Navigate to `http://localhost:3000/skills`. Confirm the blank gap between navbar and "Skills" badge is ~80px (from the section's `pt-20`), not ~160px.

**Step 3: Run type check**

Run: `npm run type-check`
Expected: PASS (no TypeScript changes)

**Step 4: Commit**

```bash
git add src/app/skills/page.tsx
git commit -m "fix: remove double top padding on skills page hero"
```

---

### Task 2: Fix Double-Padding on Experience Page Hero

**Files:**

- Modify: `src/app/experience/page.tsx:241`

**Step 1: Fix the padding**

```tsx
// Before (line 241):
<Container size="lg" className="relative z-10 text-center py-20">

// After:
<Container size="lg" className="relative z-10 text-center pb-16">
```

**Step 2: Verify visually**

Navigate to `http://localhost:3000/experience`. Same verification as Task 1.

**Step 3: Commit**

```bash
git add src/app/experience/page.tsx
git commit -m "fix: remove double top padding on experience page hero"
```

---

### Task 3: Fix Double-Padding on About Page

**Files:**

- Modify: `src/components/sections/AboutSection.tsx:197`

The AboutSection renders inside `<main className="pt-20">` (from `about/page.tsx:43`). The section itself has `py-24 md:py-32` at line 197. Since `<main>` provides 80px top padding, reduce the section's top to match:

**Step 1: Fix the padding**

```tsx
// Before (line 197):
className =
  'relative py-24 md:py-32 overflow-hidden bg-muted/30 dark:bg-muted/10';

// After:
className =
  'relative pt-8 pb-24 md:pt-12 md:pb-32 overflow-hidden bg-muted/30 dark:bg-muted/10';
```

**Step 2: Verify visually**

Navigate to `http://localhost:3000/about`. Confirm the gap between navbar and "About Me" badge is reasonable (~100px total from main's pt-20 + section's pt-8).

**Step 3: Commit**

```bash
git add src/components/sections/AboutSection.tsx
git commit -m "fix: reduce top padding on about section to prevent double-stacking"
```

---

### Task 4: Mobile Hero — Keep Both CTAs Above Fold

**Files:**

- Modify: `src/components/sections/HeroSectionClient.tsx:159-171`

The `featuredSkills` array has 10 items. On 375px mobile, these wrap to 3+ lines, pushing CTAs below fold. Limit to 5 visible on mobile.

**Step 1: Add responsive visibility to overflow badges**

```tsx
// Before (lines 159-171):
{
  featuredSkills.map((skill, index) => (
    <motion.div
      key={skill}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.05 }}
      whileHover={{ scale: 1.1, y: -2 }}
    >
      <Badge variant="outline" className="px-3 py-1">
        {skill}
      </Badge>
    </motion.div>
  ));
}

// After:
{
  featuredSkills.map((skill, index) => (
    <motion.div
      key={skill}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.05 }}
      whileHover={{ scale: 1.1, y: -2 }}
      className={index >= 5 ? 'hidden sm:block' : undefined}
    >
      <Badge variant="outline" className="px-3 py-1">
        {skill}
      </Badge>
    </motion.div>
  ));
}
```

**Step 2: Verify at 375px**

Open DevTools, set viewport to 375px. Both "View My Work" and "Get In Touch" buttons should be visible without scrolling.

**Step 3: Commit**

```bash
git add src/components/sections/HeroSectionClient.tsx
git commit -m "fix: limit hero tech badges to 5 on mobile to keep CTAs above fold"
```

---

### Task 5: Fix "Loading..." Flash on ObfuscatedEmail and ObfuscatedPhone

**Files:**

- Modify: `src/components/ObfuscatedEmail.tsx:35-40`
- Modify: `src/components/ObfuscatedPhone.tsx:40-46`

**Step 1: Replace Loading text with skeleton shimmer in ObfuscatedEmail**

```tsx
// Before (lines 34-41 in ObfuscatedEmail.tsx):
if (!email) {
  return (
    <span className={className}>
      {showIcon && <Mail className={iconClassName} />}
      <span className="opacity-50">Loading...</span>
    </span>
  );
}

// After:
if (!email) {
  return (
    <span className={className}>
      {showIcon && <Mail className={iconClassName} />}
      <span className="inline-block w-36 h-4 bg-muted animate-pulse rounded align-middle" />
    </span>
  );
}
```

**Step 2: Same fix for ObfuscatedPhone**

```tsx
// Before (lines 40-46 in ObfuscatedPhone.tsx):
if (!phone || !phoneDisplay) {
  return (
    <span className={className}>
      {showIcon && <Phone className={iconClassName} />}
      <span className="opacity-50">Loading...</span>
    </span>
  );
}

// After:
if (!phone || !phoneDisplay) {
  return (
    <span className={className}>
      {showIcon && <Phone className={iconClassName} />}
      <span className="inline-block w-32 h-4 bg-muted animate-pulse rounded align-middle" />
    </span>
  );
}
```

**Step 3: Verify**

Hard refresh the page. The footer email/phone should show a subtle gray shimmer bar instead of "Loading..." text. Check both light and dark mode.

**Step 4: Run checks**

Run: `npm run type-check`

**Step 5: Commit**

```bash
git add src/components/ObfuscatedEmail.tsx src/components/ObfuscatedPhone.tsx
git commit -m "fix: replace 'Loading...' text with skeleton shimmer on obfuscated contact"
```

---

### Task 6: Fix AvailabilityStatus Ping Animation

**Files:**

- Modify: `src/components/sections/AvailabilityStatus.tsx:74-80`

**Step 1: Replace full-icon ping with small dot**

```tsx
// Before (lines 74-80):
<div className="relative">
  <Icon className={`h-6 w-6 ${config.color}`} />
  {config.pulse && (
    <div className="absolute inset-0">
      <Icon className={`h-6 w-6 ${config.color} animate-ping`} />
    </div>
  )}
</div>

// After:
<div className="relative">
  <Icon className={`h-6 w-6 ${config.color}`} />
  {config.pulse && (
    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-500" />
    </span>
  )}
</div>
```

This matches the proven "online" dot pattern from `HeroSectionClient.tsx` lines 102-103.

**Step 2: Verify**

Navigate to `/contact`. The availability icon should have a subtle pulsing green dot in the top-right corner, not a jarring full-icon flash.

**Step 3: Commit**

```bash
git add src/components/sections/AvailabilityStatus.tsx
git commit -m "fix: replace jarring icon ping with subtle dot pulse on availability status"
```

---

### Task 7: Fix Card Title Truncation

**Files:**

- Modify: `src/components/sections/ProjectCard.tsx:282`

**Step 1: Fix inverted line-clamp breakpoints**

```tsx
// Before (line 282):
<h3 className="font-semibold text-lg line-clamp-2 sm:line-clamp-1">

// After:
<h3 className="font-semibold text-lg line-clamp-1 sm:line-clamp-2">
```

On mobile (narrow): 1 line with ellipsis. On sm+: 2 lines to show full titles.

**Step 2: Verify**

Check project cards at various widths. Titles like "ISP Customer Self-Service Portal" should show fully on desktop.

**Step 3: Commit**

```bash
git add src/components/sections/ProjectCard.tsx
git commit -m "fix: correct inverted line-clamp breakpoints on project card titles"
```

---

## Phase 2: Broken Interactions

### Task 8: Fix "Load More Articles" Button

**Files:**

- Modify: `src/components/sections/BlogSectionClient.tsx:308-315`

**Step 1: Add state and pagination logic**

At the top of the `BlogSectionClient` component (after the existing store hooks), add:

```tsx
const [visibleCount, setVisibleCount] = React.useState(6);

// Reset visible count when filters change
React.useEffect(() => {
  setVisibleCount(6);
}, [selectedCategory, searchQuery, sortBy]);
```

**Step 2: Slice displayed posts**

Wrap the `filteredPosts` usage in the JSX. Replace all references to `filteredPosts` in the grid rendering (lines 252-277) with `filteredPosts.slice(0, visibleCount)`:

```tsx
// Before (line 252-268):
filteredPosts.length >= 3 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredPosts.map((post: BlogPost, index: number) =>

// After:
filteredPosts.slice(0, visibleCount).length >= 3 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredPosts.slice(0, visibleCount).map((post: BlogPost, index: number) =>
```

Apply the same `.slice(0, visibleCount)` to the uniform grid fallback (line 272-276).

**Step 3: Wire the Load More button**

```tsx
// Before (lines 308-315):
{
  filteredPosts.length > 6 && (
    <motion.div variants={itemVariants} className="text-center">
      <Button variant="outline" size="lg">
        Load More Articles
      </Button>
    </motion.div>
  );
}

// After:
{
  filteredPosts.length > visibleCount && (
    <motion.div variants={itemVariants} className="text-center">
      <Button
        variant="outline"
        size="lg"
        onClick={() => setVisibleCount(prev => prev + 6)}
      >
        Load More Articles ({filteredPosts.length - visibleCount} remaining)
      </Button>
    </motion.div>
  );
}
```

**Step 4: Verify**

Navigate to blog. With all posts visible, confirm the "Load More" button appears and works. Click it, confirm remaining posts appear with animation.

**Step 5: Run checks**

Run: `npm run type-check`

**Step 6: Commit**

```bash
git add src/components/sections/BlogSectionClient.tsx
git commit -m "feat: implement working pagination for Load More Articles button"
```

---

### Task 9: Fix Non-Functional Blog Tags and Year Archive

**Files:**

- Modify: `src/components/sections/BlogFilters.tsx:11-14,87-95,105-115`
- Modify: `src/components/sections/BlogSectionClient.tsx` (pass new props)

**Step 1: Add tag and year filter props to BlogFilters**

```tsx
// Before (lines 11-14):
interface BlogFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: readonly string[];
}

// After:
interface BlogFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: readonly string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

**Step 2: Wire tag onClick to search**

```tsx
// Before (lines 87-95):
{
  popularTags.map(([tag, count]) => (
    <Badge
      key={tag}
      variant="secondary"
      className="cursor-pointer transition-all hover:scale-105"
    >
      {tag}
      <span className="ml-1 text-xs opacity-60">({count})</span>
    </Badge>
  ));
}

// After:
{
  popularTags.map(([tag, count]) => (
    <Badge
      key={tag}
      variant={searchQuery === tag ? 'default' : 'secondary'}
      className="cursor-pointer transition-all hover:scale-105"
      onClick={() => onSearchChange(searchQuery === tag ? '' : tag)}
    >
      {tag}
      <span className="ml-1 text-xs opacity-60">({count})</span>
    </Badge>
  ));
}
```

**Step 3: Wire year archive buttons**

```tsx
// Before (lines 106-114):
<Button variant="outline" size="sm">
  2024
</Button>
<Button variant="outline" size="sm">
  2023
</Button>
<Button variant="outline" size="sm">
  All Time
</Button>

// After:
{['2024', '2023'].map(year => (
  <Button
    key={year}
    variant={searchQuery === `year:${year}` ? 'default' : 'outline'}
    size="sm"
    onClick={() => onSearchChange(searchQuery === `year:${year}` ? '' : `year:${year}`)}
  >
    {year}
  </Button>
))}
<Button
  variant={!searchQuery.startsWith('year:') ? 'default' : 'outline'}
  size="sm"
  onClick={() => onSearchChange('')}
>
  All Time
</Button>
```

**Step 4: Update BlogSectionClient to pass new props**

In `BlogSectionClient.tsx`, update the `<BlogFilters>` call (around line 242):

```tsx
// Before:
<BlogFilters
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  categories={blogCategories}
/>

// After:
<BlogFilters
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  categories={blogCategories}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
/>
```

**Step 5: Update the search/filter logic in BlogSectionClient**

In the `filteredPosts` memo (around line 76), add year filtering:

```tsx
const filteredPosts = React.useMemo(() => {
  const yearMatch = searchQuery.match(/^year:(\d{4})$/);
  let posts: BlogPost[];

  if (yearMatch) {
    const year = yearMatch[1];
    posts = getPostsByCategory(selectedCategory).filter(
      p => new Date(p.publishedAt).getFullYear().toString() === year
    );
  } else if (searchQuery) {
    posts = searchPosts(searchQuery);
  } else {
    posts = getPostsByCategory(selectedCategory);
  }
  // ... rest of sorting logic unchanged
```

**Step 6: Destructure the new prop in BlogFilters function signature**

Update the destructured props:

```tsx
export const BlogFilters = React.memo(function BlogFilters({
  selectedCategory,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
}: BlogFiltersProps) {
```

**Step 7: Verify**

Click a popular tag — blog should filter to posts matching that tag. Click "2024" — should show only 2024 posts. Click "All Time" — should reset.

**Step 8: Run checks**

Run: `npm run type-check`

**Step 9: Commit**

```bash
git add src/components/sections/BlogFilters.tsx src/components/sections/BlogSectionClient.tsx
git commit -m "feat: wire blog tag and year archive buttons to actual filtering"
```

---

### Task 10: Remove Hardcoded Email in ContactSection Final CTA

**Files:**

- Modify: `src/components/sections/ContactSection.tsx:251-272`

Per design doc section 2.3, remove the redundant Final CTA entirely (the contact form and Calendly button above it are sufficient).

**Step 1: Remove the Final CTA block**

Delete the entire block from line 251 (`{/* Final CTA */}`) through line 272 (`</motion.div>`).

**Step 2: Verify**

Navigate to `/contact`. The section should end after the Response Time card. No orphaned "Ready to Start Your Project?" + mailto button.

**Step 3: Commit**

```bash
git add src/components/sections/ContactSection.tsx
git commit -m "fix: remove redundant Final CTA with hardcoded email from contact section"
```

---

## Phase 3: Information Architecture & Persuasion

### Task 11: Remove Duplicate Stats from AboutSection

**Files:**

- Modify: `src/components/sections/AboutSection.tsx:68-93,261-287`

**Step 1: Remove the stats data array**

Delete the `stats` array (lines 68-93) from the component.

**Step 2: Remove the Stats Grid JSX**

Delete the `{/* Stats Grid */}` block (lines 261-287). This is the `motion.div` containing the `grid grid-cols-2 md:grid-cols-4` with the 4 stat cards.

**Step 3: Remove unused imports**

Remove `Calendar`, `Users`, `Briefcase`, `Code2` from the lucide-react imports if they are no longer used (check each — some may be used elsewhere in the component).

**Step 4: Verify**

Navigate to `/` (homepage). The SocialProofBar still shows animated counters below the hero. The AboutSection should go straight from the header to the tab navigation (story/skills/values) with no stat cards in between.

**Step 5: Run checks**

Run: `npm run type-check`

**Step 6: Commit**

```bash
git add src/components/sections/AboutSection.tsx
git commit -m "refactor: remove duplicate stats grid from AboutSection (kept in SocialProofBar)"
```

---

### Task 12: Fix Duplicate "From Atoms to Pixels" Headline

**Files:**

- Modify: `src/components/sections/JourneySection.tsx:53-55`

**Step 1: Rename the heading**

```tsx
// Before (lines 53-55):
<h2 className="text-3xl md:text-4xl font-bold mb-4">
  From <span className="text-primary">Atoms</span> to{' '}
  <span className="text-primary">Pixels</span>
</h2>

// After:
<h2 className="text-3xl md:text-4xl font-bold mb-4">
  The <span className="text-primary">Road</span> So{' '}
  <span className="text-primary">Far</span>
</h2>
```

**Step 2: Verify**

Scroll through the homepage. About section's story tab still says "From Atoms to Pixels". Journey section now says "The Road So Far".

**Step 3: Commit**

```bash
git add src/components/sections/JourneySection.tsx
git commit -m "fix: rename JourneySection heading to avoid duplicate with AboutSection"
```

---

### Task 13: Standardize Container Widths + SocialProofBar

**Files:**

- Modify: `src/components/sections/SocialProofBar.tsx:94`

**Step 1: Replace raw classes with Container component**

First, add the import at the top of the file:

```tsx
import { Container } from '@/components/ui/Container';
```

Then replace the raw div:

```tsx
// Before (line 94):
<div className="max-w-5xl mx-auto px-4">

// After:
<Container size="lg">
```

And close the Container:

```tsx
// Before (line 106):
</div>

// After:
</Container>
```

**Step 2: Verify**

Homepage SocialProofBar should look identical (both `max-w-5xl` and `Container size="lg"` resolve to 1024px), but now uses the shared Container component.

**Step 3: Run checks**

Run: `npm run type-check`

**Step 4: Commit**

```bash
git add src/components/sections/SocialProofBar.tsx
git commit -m "refactor: use Container component in SocialProofBar for consistency"
```

---

### Task 14: Experience Page Vertical Compression

**Files:**

- Modify: `src/app/experience/page.tsx:311,321-329`

**Step 1: Reduce section padding**

```tsx
// Before (line 311):
<section className="py-20">

// After:
<section className="py-16">
```

**Step 2: Reduce timeline item spacing**

Find the timeline item wrapper `className` that contains `mb-16` (in the map callback for `experiences`) and change it:

```tsx
// Before:
className = 'relative mb-16';

// After:
className = 'relative mb-10';
```

**Step 3: Verify**

Navigate to `/experience`. Page should be noticeably more compact. Timeline items should still have clear separation but not excessive whitespace.

**Step 4: Commit**

```bash
git add src/app/experience/page.tsx
git commit -m "fix: reduce excessive vertical spacing on experience page timeline"
```

---

### Task 15: Fix Skills Filter Bar Wrapping

**Files:**

- Modify: `src/app/skills/page.tsx:434,436`

**Step 1: Fix alignment**

```tsx
// Before (line 434):
<div className="flex flex-col md:flex-row justify-between items-center gap-4">

// After:
<div className="flex flex-col md:flex-row justify-between items-start gap-4">
```

**Step 2: Left-align filter buttons**

```tsx
// Before (line 436):
<div className="flex gap-2 flex-wrap justify-center">

// After:
<div className="flex gap-2 flex-wrap">
```

**Step 3: Verify at 1440px**

The filter bar should still wrap if needed, but the view toggle stays top-right and buttons are left-aligned.

**Step 4: Commit**

```bash
git add src/app/skills/page.tsx
git commit -m "fix: align skills filter bar to prevent visual break at 1440px"
```

---

## Phase 4: Functional Enhancements

### Task 16: Replace Raw Tailwind Colors with Brand Palette

**Files:**

- Modify: `src/components/sections/JourneySection.tsx:15,21,27,33`
- Modify: `src/components/sections/AboutSection.tsx` (search for `from-blue-500`, `from-green-500`, `from-purple-500`, `from-orange-500`)

**Step 1: Fix JourneySection milestone colors**

```tsx
// Before (lines 15, 21, 27, 33):
color: 'from-blue-500/20 to-cyan-500/20',
color: 'from-green-500/20 to-emerald-500/20',
color: 'from-purple-500/20 to-pink-500/20',
color: 'from-orange-500/20 to-red-500/20',

// After:
color: 'from-navy-400/20 to-navy-300/20',
color: 'from-success-400/20 to-success-300/20',
color: 'from-mocha-400/20 to-mocha-300/20',
color: 'from-warning-400/20 to-warning-300/20',
```

**Step 2: Fix same pattern in AboutSection**

Search for the skill category color definitions (around lines 116-130 in AboutSection.tsx) and apply the same color mapping.

**Step 3: Verify in dark mode**

Toggle dark mode. The milestone and skill category cards should use brand-consistent colors that work well in both themes.

**Step 4: Commit**

```bash
git add src/components/sections/JourneySection.tsx src/components/sections/AboutSection.tsx
git commit -m "fix: replace raw Tailwind colors with brand palette in Journey and About"
```

---

### Task 17: Connect useSearch to CommandMenu

**Files:**

- Modify: `src/components/ui/CommandMenu.tsx`

**Step 1: Import useSearch**

Add to imports:

```tsx
import { useSearch } from '@/hooks/useSearch';
```

**Step 2: Add search state inside the component**

After the existing hooks (around line 35):

```tsx
const {
  query,
  setQuery,
  groupedResults,
  hasResults,
  isSearching,
  recentItems,
} = useSearch({ limit: 8 });
```

**Step 3: Wire the search input to useSearch**

Replace the `Command.Input` (line 82-85) to use the search state:

```tsx
<Command.Input
  placeholder="Type a command or search..."
  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
  value={query}
  onValueChange={setQuery}
/>
```

**Step 4: Add dynamic search results group**

After the Navigation `Command.Group` (after line 168), add a dynamic search results section:

```tsx
{
  query && hasResults && (
    <>
      <Command.Separator className="-mx-1 h-px bg-border my-1" />
      {groupedResults.blog && groupedResults.blog.length > 0 && (
        <Command.Group
          heading="Blog Posts"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
        >
          {groupedResults.blog.map(result => (
            <Command.Item
              key={result.id}
              onSelect={() => runCommand(() => router.push(result.url))}
              className={cmdItemClass}
              value={`${result.title} ${result.description}`}
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>{result.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {result.description}
                </span>
              </div>
            </Command.Item>
          ))}
        </Command.Group>
      )}
      {groupedResults.project && groupedResults.project.length > 0 && (
        <Command.Group
          heading="Projects"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
        >
          {groupedResults.project.map(result => (
            <Command.Item
              key={result.id}
              onSelect={() => runCommand(() => router.push(result.url))}
              className={cmdItemClass}
              value={`${result.title} ${result.description}`}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>{result.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {result.description}
                </span>
              </div>
            </Command.Item>
          ))}
        </Command.Group>
      )}
    </>
  );
}
```

**Step 5: Disable cmdk's built-in filter when searching dynamically**

Change the `shouldFilter` prop to be dynamic:

```tsx
// Before (line 78):
shouldFilter={true}

// After:
shouldFilter={!query}
```

When the user is typing a search query, we want Fuse.js to handle filtering (via `useSearch`). When no query is typed, cmdk's built-in filter handles the static navigation items.

**Step 6: Clear search on close**

In the `onOpenChange` callback (line 63-65):

```tsx
// Before:
onOpenChange={open => {
  if (!open) close();
}}

// After:
onOpenChange={open => {
  if (!open) {
    close();
    setQuery('');
  }
}}
```

**Step 7: Verify**

Press `Cmd+K`. Type "performance" — should see matching blog posts and projects. Type "react" — should see React-related content. Clear the search — static navigation should reappear.

**Step 8: Run checks**

Run: `npm run type-check`

**Step 9: Commit**

```bash
git add src/components/ui/CommandMenu.tsx
git commit -m "feat: connect Fuse.js search to CommandMenu for site-wide search"
```

---

### Task 18: Replace Skills Proficiency Bars with Honest Badges

**Files:**

- Modify: `src/app/skills/page.tsx:296-303,551-570`

**Step 1: Remove the percentage mapping**

Delete or comment out the `proficiencyPercentages` object:

```tsx
// Delete lines 296-303:
const proficiencyPercentages: Record<ProficiencyLevel, number> = {
  Expert: 90,
  Advanced: 75,
  Intermediate: 50,
  Learning: 25,
};
```

**Step 2: Replace the progress bar JSX with a visual badge**

```tsx
// Before (lines 551-570 — the Progress Bar block):
{
  /* Progress Bar */
}
<div className="mb-4">
  <div className="flex justify-between text-xs text-muted-foreground mb-1">
    <span>Proficiency</span>
    <span>{proficiencyPercentages[skill.level]}%</span>
  </div>
  <div className="h-2 bg-muted rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{
        width: `${proficiencyPercentages[skill.level]}%`,
      }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.2 }}
      className="h-full bg-gradient-to-r from-primary to-primary/50"
    />
  </div>
</div>;

// After:
{
  /* Proficiency Level */
}
<div className="mb-4">
  <Badge
    variant={
      skill.level === 'Expert'
        ? 'default'
        : skill.level === 'Advanced'
          ? 'secondary'
          : 'outline'
    }
    className="text-xs"
  >
    {skill.level}
  </Badge>
</div>;
```

Make sure `Badge` is imported at the top of the file:

```tsx
import { Badge } from '@/components/ui/Badge';
```

**Step 3: Verify**

Navigate to `/skills`. Each skill card should show a badge (Expert = solid, Advanced = muted, Intermediate/Learning = outline) instead of a progress bar.

**Step 4: Run checks**

Run: `npm run type-check`

**Step 5: Commit**

```bash
git add src/app/skills/page.tsx
git commit -m "refactor: replace misleading proficiency bars with honest level badges"
```

---

### Task 19: Stop Persisting Search Queries Across Sessions

**Files:**

- Modify: `src/stores/useBlogFilterStore.ts:144-148`
- Modify: `src/stores/useProjectsFilterStore.ts:166-171`

**Step 1: Remove searchQuery from blog store partialize**

```tsx
// Before (lines 144-148 in useBlogFilterStore.ts):
partialize: state => ({
  selectedCategory: state.selectedCategory,
  searchQuery: state.searchQuery,
  sortBy: state.sortBy,
}),

// After:
partialize: state => ({
  selectedCategory: state.selectedCategory,
  sortBy: state.sortBy,
}),
```

**Step 2: Remove searchQuery from projects store partialize**

```tsx
// Before (lines 166-171 in useProjectsFilterStore.ts):
partialize: state => ({
  selectedCategory: state.selectedCategory,
  selectedTechnologies: state.selectedTechnologies,
  searchQuery: state.searchQuery,
  viewMode: state.viewMode,
}),

// After:
partialize: state => ({
  selectedCategory: state.selectedCategory,
  selectedTechnologies: state.selectedTechnologies,
  viewMode: state.viewMode,
}),
```

**Step 3: Verify**

Navigate to `/blog`, search for "typescript", navigate away, navigate back. The search field should be empty (not persisted from the previous visit).

**Step 4: Run existing store tests**

Run: `npx vitest run src/stores/useBlogFilterStore.test.tsx src/stores/useProjectsFilterStore.test.tsx`

If tests reference persisted `searchQuery`, update them accordingly.

**Step 5: Commit**

```bash
git add src/stores/useBlogFilterStore.ts src/stores/useProjectsFilterStore.ts
git commit -m "fix: stop persisting search queries across sessions in filter stores"
```

---

### Task 20: Differentiate Newsletter Forms

**Files:**

- Modify: `src/components/sections/NewsletterSignup.tsx:40,22-27`

**Step 1: Update heading and benefits for blog context**

```tsx
// Before (line 40):
<h3 className="text-2xl font-bold">Stay Updated</h3>

// After:
<h3 className="text-2xl font-bold">Never Miss a Post</h3>
```

```tsx
// Before (lines 22-27):
const benefits = [
  'Weekly insights on React & TypeScript',
  'Exclusive tutorials and code examples',
  'Career advice and industry trends',
  'Early access to new content',
];

// After:
const benefits = [
  'Get notified when I publish new articles',
  'Deep dives on React, TypeScript & architecture',
  'Real-world case studies from production apps',
  'No spam — unsubscribe anytime',
];
```

**Step 2: Verify**

Compare the blog section newsletter with the footer newsletter. They should feel like complementary placements, not duplicate UIs.

**Step 3: Commit**

```bash
git add src/components/sections/NewsletterSignup.tsx
git commit -m "fix: differentiate blog newsletter from footer with contextual copy"
```

---

## Final Verification

### Task 21: Full Visual Regression Check

**Step 1: Run full quality checks**

```bash
npm run check
```

**Step 2: Visual check every page**

At 1440px and 375px, in both light and dark mode, verify:

- `/` — SocialProofBar stats (no duplicate in About section), Journey heading says "The Road So Far"
- `/about` — Reduced top gap, no stat cards
- `/skills` — Filter bar aligned, badges instead of progress bars, reduced hero padding
- `/experience` — Compact timeline, reduced padding
- `/blog` — Load More works, tags filter, year archive works
- `/contact` — No Final CTA, subtle dot pulse on availability
- Footer — Skeleton shimmer instead of "Loading..."

**Step 3: Run tests**

```bash
npm test
```

Fix any failing tests caused by the changes.

**Step 4: Final commit (if any test fixes needed)**

```bash
git commit -m "fix: update tests for UI/UX overhaul changes"
```
