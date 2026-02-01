import { ALL_FILTER } from '@/constants';

export interface BlogAuthor {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // in minutes
  category: string;
  tags: string[];
  featured: boolean;
  series?: {
    name: string;
    part: number;
    total: number;
  };
  views: number;
  likes: number;
}

/**
 * Default author for all blog posts
 */
export const DEFAULT_AUTHOR: BlogAuthor = {
  name: 'Oles Didukh',
  avatar: '/images/avatar.png',
  role: 'Senior Front-End Engineer',
};

export const blogCategories = [
  ALL_FILTER,
  'React',
  'TypeScript',
  'Web Development',
  'Performance',
  'Career',
  'Tutorial',
  'Best Practices',
  'Tools',
] as const;

/** Type for valid blog categories */
export type BlogCategory = (typeof blogCategories)[number];

export const blogPosts: BlogPost[] = [
  {
    id: 'vibe-coding-guide',
    slug: 'vibe-coding-complete-guide-2025',
    title: 'Vibe Coding: The Complete Guide to AI-Assisted Development in 2025',
    excerpt:
      "Explore the vibe coding revolution that's transforming software development. Learn what it is, best practices, pitfalls to avoid, and how to leverage AI tools effectively.",
    content: `
# Vibe Coding: The Complete Guide to AI-Assisted Development in 2025

The term "vibe coding" was coined by Andrej Karpathy, co-founder of OpenAI, in February 2025. It's since become Collins Dictionary's Word of the Year and represents a fundamental shift in how we write software.

## What is Vibe Coding?

Vibe coding is an approach where you describe what you want in natural language, and AI transforms your intent into working code. Instead of writing every line manually, you collaborate with an AI assistant that understands context, patterns, and best practices.

\`\`\`
// Traditional coding
function calculateDiscount(price, percentage) {
  return price * (1 - percentage / 100);
}

// Vibe coding prompt
"Create a function that calculates discounted price
given original price and discount percentage"
\`\`\`

## The Numbers Don't Lie

The adoption has been staggering:
- **92%** of US developers use AI coding tools daily
- **41%** of global code is now AI-generated (256 billion lines in 2024)
- **25%** of Y Combinator Winter 2025 startups have 95% AI-generated codebases
- **26%** improvement in overall work completion speed

## Best Practices for Effective Vibe Coding

### 1. Be Specific with Context

\`\`\`
❌ "Make a button component"

✅ "Create a React button component with TypeScript that:
   - Has primary, secondary, and ghost variants
   - Supports disabled state with proper accessibility
   - Uses our existing Tailwind design tokens
   - Includes loading state with spinner"
\`\`\`

### 2. Review and Understand Generated Code

The biggest pitfall is accepting code you don't understand. A September 2025 Fast Company report warned of "development hell" when teams blindly merge AI-generated code.

\`\`\`typescript
// Always review for:
// 1. Security vulnerabilities
// 2. Performance implications
// 3. Edge cases
// 4. Alignment with your architecture
\`\`\`

### 3. Use AI for What It's Good At

**Great for:**
- Boilerplate and CRUD operations (81% time savings)
- API integrations
- Test generation
- Documentation
- Refactoring repetitive patterns

**Still needs human oversight:**
- Security-critical code
- Complex business logic
- Architecture decisions
- Performance optimization

## The Tools Landscape

### Cursor
Built on VS Code with Composer AI assistant. Best for IDE-integrated workflows and visual editing.

### Claude Code
Terminal-first, agentic coding. Excels at understanding full codebases and multi-file refactoring.

### GitHub Copilot
15 million developers strong. Best for inline suggestions and quick completions.

## Avoiding Common Pitfalls

### Security Concerns
In May 2025, Lovable (a vibe coding app) had 170 out of 1,645 generated apps with security vulnerabilities exposing personal data.

**Always:**
- Run security audits on generated code
- Never trust AI with secrets or credentials
- Validate input handling and sanitization

### Technical Debt

\`\`\`typescript
// AI might generate working but suboptimal code
// Before:
const data = items.filter(x => x.active).map(x => x.name).filter(x => x);

// Better:
const data = items
  .filter(item => item.active && item.name)
  .map(item => item.name);
\`\`\`

## The Future of Vibe Coding

Vibe coding isn't replacing developers—it's augmenting them. The 67% of developers who report spending more time debugging AI code than writing manually remind us that human expertise remains essential.

The developers who thrive will be those who:
1. Master prompting and context-setting
2. Maintain deep technical understanding
3. Use AI as a force multiplier, not a replacement

## Conclusion

Vibe coding is real, it's here, and it's changing our industry. Embrace it thoughtfully, stay vigilant about quality, and remember: the AI is your pair programmer, not your replacement.
    `,
    coverImage:
      'https://images.unsplash.com/photo-1677442135136-760c813028c0?w=1200&q=80',
    author: DEFAULT_AUTHOR,
    publishedAt: '2025-01-28',
    readingTime: 10,
    category: 'Tools',
    tags: ['AI', 'Vibe Coding', 'Productivity', 'Development Tools', 'Cursor'],
    featured: true,
    views: 2340,
    likes: 187,
  },
  {
    id: 'claude-code-workflow',
    slug: 'claude-code-workflow-senior-developer-guide',
    title: "Claude Code Workflow: A Senior Developer's Guide to Agentic Coding",
    excerpt:
      'Master Claude Code CLI with practical workflows for code exploration, refactoring, testing, and PR creation. Learn how to leverage CLAUDE.md and thinking modes effectively.',
    content: `
# Claude Code Workflow: A Senior Developer's Guide to Agentic Coding

Claude Code launched in February 2025 and reached $1B in annualized revenue by November. Here's how to make the most of this powerful agentic coding tool.

## Getting Started

\`\`\`bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Start in your project directory
cd your-project
claude
\`\`\`

You'll need a Claude Pro or Max subscription for authentication.

## The Power of CLAUDE.md

CLAUDE.md is your project's "memory"—a markdown file where you store context that persists across sessions.

\`\`\`markdown
# CLAUDE.md

## Project Overview
React 18 + TypeScript application for financial dashboards.

## Architecture
- /src/components - Reusable UI components
- /src/features - Feature-based modules
- /src/lib - Utilities and helpers

## Coding Standards
- Use functional components with hooks
- Prefer Zustand over Redux for new state
- All components must have TypeScript interfaces
- Tests required for business logic

## Common Commands
- npm run dev - Start development server
- npm run test - Run Jest tests
- npm run lint:fix - Auto-fix linting issues
\`\`\`

Claude reads this automatically, giving it context about your specific project.

## Essential Workflows

### 1. Exploring Unfamiliar Code

\`\`\`
"Explain how authentication works in this codebase.
Show me the flow from login to protected routes."

"Find all places where we make API calls and
explain the error handling pattern."
\`\`\`

### 2. Refactoring with Confidence

\`\`\`
"Refactor the UserProfile component to use React Query
instead of useEffect for data fetching. Maintain
the same behavior and add proper loading/error states."
\`\`\`

### 3. Test Generation

\`\`\`
"Write comprehensive tests for the checkout flow.
Include:
- Happy path with valid payment
- Invalid card handling
- Network error scenarios
- Empty cart edge case"
\`\`\`

### 4. PR Creation

\`\`\`
"Create a PR for the changes we just made.
Include a clear description of what changed,
why it changed, and how to test it."
\`\`\`

## Thinking Modes

Claude Code supports different thinking modes for complex tasks:

\`\`\`
"Think step by step about how to implement
real-time notifications using WebSockets.
Consider our existing architecture."
\`\`\`

For complex refactoring:
\`\`\`
"Plan the migration from class components to
functional components. Break it into phases
that can be merged independently."
\`\`\`

## Best Practices from 7+ Years Experience

### 1. Give Rich Context

\`\`\`
❌ "Fix the bug"

✅ "There's a race condition in useDataFetch
   when the component unmounts during a pending
   request. The error shows in console as
   'Cannot update unmounted component'.
   Fix it with proper cleanup."
\`\`\`

### 2. Iterate, Don't Retry

When Claude's first attempt isn't right:
\`\`\`
"Good start, but we need to handle the case
where user.preferences is undefined. Also,
use our existing ErrorBoundary component
instead of a try-catch."
\`\`\`

### 3. Leverage Multi-File Understanding

Claude Code's strength is understanding your entire codebase:
\`\`\`
"Look at how we handle forms in UserSettings
and apply the same pattern to the new
PaymentMethodForm component."
\`\`\`

### 4. Use for Code Review

\`\`\`
"Review my changes in the staged files.
Look for:
- Potential bugs
- Performance issues
- Accessibility problems
- Deviations from our coding standards"
\`\`\`

## Integrating with Your Workflow

### Git Hooks
\`\`\`bash
# In your pre-commit hook
claude "Review staged changes for obvious issues"
\`\`\`

### CI/CD Integration
\`\`\`
"Generate a GitHub Action workflow that runs
our tests, builds the app, and deploys to
Vercel on merge to main."
\`\`\`

## When NOT to Use Claude Code

1. **Security-sensitive operations** - Manual review essential
2. **Production deployments** - Keep human in the loop
3. **Database migrations** - Too risky for autonomous execution
4. **When you don't understand the output** - Never merge code you can't explain

## Conclusion

Claude Code isn't about replacing your expertise—it's about amplifying it. The developers getting the most value are those who provide clear context, iterate on outputs, and maintain their understanding of the codebase.

The future belongs to developers who can effectively collaborate with AI while maintaining the judgment that comes from experience.
    `,
    coverImage: '/images/blog/typescript.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2025-01-20',
    readingTime: 12,
    category: 'Tools',
    tags: ['Claude Code', 'AI', 'CLI', 'Productivity', 'Development Tools'],
    featured: true,
    views: 1856,
    likes: 142,
  },
  {
    id: 'react-compiler-guide',
    slug: 'react-19-compiler-complete-guide',
    title: 'React 19 & The React Compiler: The End of Manual Memoization',
    excerpt:
      'The React Compiler is production-ready and changing how we write React. Learn what it means for useMemo, useCallback, and React.memo—and how to prepare your codebase.',
    content: `
# React 19 & The React Compiler: The End of Manual Memoization

Following its v1.0 release in October 2025, the React Compiler has fundamentally changed how we optimize React applications. Manual memoization is becoming legacy code.

## What is the React Compiler?

The React Compiler automatically optimizes your components at build time. It analyzes your code and inserts memoization where beneficial—without you writing a single useMemo or useCallback.

\`\`\`typescript
// Before: Manual memoization
function ProductList({ products, onSelect }) {
  const sortedProducts = useMemo(() =>
    [...products].sort((a, b) => a.price - b.price),
    [products]
  );

  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return sortedProducts.map(p => (
    <ProductCard
      key={p.id}
      product={p}
      onSelect={handleSelect}
    />
  ));
}

// After: Let the compiler handle it
function ProductList({ products, onSelect }) {
  const sortedProducts = [...products].sort((a, b) => a.price - b.price);

  return sortedProducts.map(p => (
    <ProductCard
      key={p.id}
      product={p}
      onSelect={(id) => onSelect(id)}
    />
  ));
}
\`\`\`

The compiler produces the same optimized output—but your code is cleaner and easier to maintain.

## What This Means for Your Codebase

### useMemo and useCallback
These hooks aren't deprecated, but they're largely unnecessary for new code. The compiler handles:
- Expensive calculations
- Stable function references
- Preventing unnecessary re-renders

### React.memo
Still useful for explicit optimization boundaries, but the compiler reduces the need for most uses.

## How to Enable the React Compiler

\`\`\`javascript
// next.config.js (Next.js 15+)
module.exports = {
  experimental: {
    reactCompiler: true,
  },
};
\`\`\`

\`\`\`javascript
// babel.config.js (other setups)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // options
    }],
  ],
};
\`\`\`

## Rules of React: More Important Than Ever

The compiler relies on you following the Rules of React:

### 1. Components Must Be Pure

\`\`\`typescript
// ❌ Bad: Side effect during render
function BadComponent({ userId }) {
  localStorage.setItem('lastUser', userId); // Side effect!
  return <div>{userId}</div>;
}

// ✅ Good: Pure render, effect for side effects
function GoodComponent({ userId }) {
  useEffect(() => {
    localStorage.setItem('lastUser', userId);
  }, [userId]);
  return <div>{userId}</div>;
}
\`\`\`

### 2. Props and State Are Immutable

\`\`\`typescript
// ❌ Bad: Mutating props
function BadList({ items }) {
  items.sort((a, b) => a.order - b.order); // Mutates!
  return items.map(item => <Item key={item.id} {...item} />);
}

// ✅ Good: Create new array
function GoodList({ items }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return sorted.map(item => <Item key={item.id} {...item} />);
}
\`\`\`

### 3. Hook Calls Must Be Stable

\`\`\`typescript
// ❌ Bad: Conditional hook
function BadComponent({ showExtra }) {
  if (showExtra) {
    useEffect(() => { /* ... */ }); // Conditional hook!
  }
}

// ✅ Good: Hook always called
function GoodComponent({ showExtra }) {
  useEffect(() => {
    if (showExtra) {
      // Effect logic
    }
  }, [showExtra]);
}
\`\`\`

## Migration Strategy

### Phase 1: Audit Your Codebase
Use the React Compiler's ESLint plugin to find violations:

\`\`\`bash
npm install eslint-plugin-react-compiler
\`\`\`

### Phase 2: Fix Violations
Address any Rules of React violations before enabling the compiler.

### Phase 3: Enable Gradually
Start with specific directories:

\`\`\`javascript
{
  plugins: [
    ['babel-plugin-react-compiler', {
      sources: (filename) => {
        return filename.includes('src/components');
      },
    }],
  ],
}
\`\`\`

### Phase 4: Remove Manual Memoization
Once stable, clean up unnecessary useMemo/useCallback calls.

## Performance Comparison

In our testing at Safebooks AI:
- **Bundle size**: Slightly larger (compiler output)
- **Runtime performance**: 15-20% faster renders
- **Developer experience**: Significantly improved
- **Code review time**: Reduced (less memoization debates)

## Conclusion

The React Compiler represents React's maturity. We've moved from "you must optimize" to "optimize by default." Focus on writing clean, maintainable components—let the compiler handle the rest.

This is the React we've been waiting for.
    `,
    coverImage: '/images/blog/nextjs.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2025-01-15',
    readingTime: 11,
    category: 'React',
    tags: ['React', 'React Compiler', 'Performance', 'React 19', 'Optimization'],
    featured: true,
    views: 3210,
    likes: 234,
  },
  {
    id: 'inp-core-web-vital',
    slug: 'mastering-inp-core-web-vital-2025',
    title:
      "Mastering INP: The Core Web Vital That's Failing 50% of Mobile Sites",
    excerpt:
      'INP replaced FID in March 2024, and only 49.7% of mobile sites pass. Learn practical techniques to optimize Interaction to Next Paint and boost your rankings.',
    content: `
# Mastering INP: The Core Web Vital That's Failing 50% of Mobile Sites

In March 2024, Google replaced First Input Delay (FID) with Interaction to Next Paint (INP). The results have been sobering: only 49.7% of mobile websites currently pass Core Web Vitals assessment.

## What is INP?

INP measures the time from when a user interacts (click, tap, keypress) to when the browser paints the visual response. Unlike FID, which only measured the first interaction, INP considers ALL interactions during the page lifecycle.

**Target: Under 200ms**

\`\`\`
User clicks button → JavaScript executes → DOM updates → Browser paints
|__________________ INP measures this entire span __________________|
\`\`\`

## Why Sites Are Failing

### 1. Heavy JavaScript Execution

\`\`\`typescript
// ❌ Bad: Blocks main thread
function handleClick() {
  const result = heavyCalculation(data); // 300ms
  updateUI(result);
}

// ✅ Good: Defer heavy work
function handleClick() {
  updateUI({ loading: true }); // Immediate feedback

  requestIdleCallback(() => {
    const result = heavyCalculation(data);
    updateUI({ loading: false, result });
  });
}
\`\`\`

### 2. Synchronous State Updates

\`\`\`typescript
// ❌ Bad: Multiple synchronous updates
function handleSubmit(data) {
  setLoading(true);
  setError(null);
  setFormData(data);
  validateForm(data);
  submitToServer(data);
}

// ✅ Good: Batch updates, show immediate feedback
function handleSubmit(data) {
  // React 18+ batches these automatically
  startTransition(() => {
    setFormState({
      loading: true,
      error: null,
      data
    });
    submitToServer(data);
  });
}
\`\`\`

### 3. Layout Thrashing

\`\`\`typescript
// ❌ Bad: Causes layout thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // Forces layout
  el.style.height = height + 10 + 'px'; // Triggers layout again
});

// ✅ Good: Batch reads and writes
const heights = elements.map(el => el.offsetHeight); // All reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // All writes
});
\`\`\`

## Optimization Techniques

### 1. Use CSS for Immediate Feedback

\`\`\`css
/* Instant visual feedback without JavaScript */
.button:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
\`\`\`

### 2. Debounce Expensive Operations

\`\`\`typescript
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  // Deferred value allows UI to stay responsive
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => searchDatabase(deferredQuery),
    [deferredQuery]
  );

  return <ResultsList results={results} />;
}
\`\`\`

### 3. Web Workers for Heavy Computation

\`\`\`typescript
// main.ts
const worker = new Worker('processor.worker.ts');

function handleDataProcess(data) {
  // Show immediate loading state
  setProcessing(true);

  // Offload to worker
  worker.postMessage(data);
}

worker.onmessage = (e) => {
  setResults(e.data);
  setProcessing(false);
};
\`\`\`

### 4. Virtualize Long Lists

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## Measuring INP

### Chrome DevTools
1. Open Performance panel
2. Enable "Web Vitals" track
3. Record user interactions
4. Look for INP markers

### JavaScript API

\`\`\`typescript
import { onINP } from 'web-vitals';

onINP((metric) => {
  console.log('INP:', metric.value);

  // Send to analytics
  if (metric.value > 200) {
    analytics.track('poor_inp', {
      value: metric.value,
      entries: metric.entries,
    });
  }
});
\`\`\`

## Real-World Results

After implementing these optimizations at Safebooks AI:
- INP improved from 340ms to 89ms
- Mobile pass rate: 67% → 94%
- User engagement increased 12%

## Conclusion

INP is the most demanding Core Web Vital, but it's also the most impactful for user experience. Focus on:

1. **Immediate visual feedback** for all interactions
2. **Offload heavy work** to Web Workers or idle callbacks
3. **Virtualize** long lists and complex UIs
4. **Measure continuously** with real user monitoring

The 50% of sites failing INP represents an opportunity—fix this, and you'll stand out from half your competition.
    `,
    coverImage: '/images/blog/modern-css.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2025-01-10',
    readingTime: 10,
    category: 'Performance',
    tags: ['Performance', 'Core Web Vitals', 'INP', 'Optimization', 'SEO'],
    featured: false,
    views: 1567,
    likes: 98,
  },
  {
    id: 'redux-to-zustand-migration',
    slug: 'redux-to-zustand-migration-guide',
    title: 'From Redux to Zustand: A Practical Migration Guide',
    excerpt:
      'Redux is fading in the React ecosystem. Learn how to migrate to Zustand with real examples, patterns for complex state, and strategies for gradual adoption.',
    content: `
# From Redux to Zustand: A Practical Migration Guide

Redux isn't dead, but it's increasingly seen as legacy for new React projects. Zustand offers the same predictable state management with 90% less boilerplate.

## Why Teams Are Migrating

| Aspect | Redux Toolkit | Zustand |
|--------|--------------|---------|
| Bundle size | 47KB | 8KB |
| Boilerplate | Medium | Minimal |
| Learning curve | Steep | Gentle |
| DevTools | Excellent | Good |
| TypeScript | Good | Excellent |

## Core Concepts Comparison

### Redux Way

\`\`\`typescript
// store.ts
import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

export const store = configureStore({
  reducer: { user: userSlice.reducer },
});

// Component
function Profile() {
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUser().then(data => dispatch(setUser(data)));
  }, [dispatch]);

  return <div>{user?.name}</div>;
}
\`\`\`

### Zustand Way

\`\`\`typescript
// store.ts
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    set({ loading: true });
    const user = await fetchUser();
    set({ user, loading: false });
  },
}));

// Component
function Profile() {
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <div>{user?.name}</div>;
}
\`\`\`

## Migration Strategy

### Phase 1: Add Zustand Alongside Redux

\`\`\`typescript
// New features use Zustand
const useNewFeatureStore = create((set) => ({
  // new state
}));

// Legacy features still use Redux
const legacyData = useSelector(state => state.legacy);
\`\`\`

### Phase 2: Migrate Slice by Slice

Start with isolated slices that don't have many dependencies.

\`\`\`typescript
// Before: Redux slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    add: (state, action) => [...state, action.payload],
    remove: (state, action) => state.filter(n => n.id !== action.payload),
    clear: () => [],
  },
});

// After: Zustand store
const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  add: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification]
    })),
  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  clear: () => set({ notifications: [] }),
}));
\`\`\`

### Phase 3: Handle Async Actions

\`\`\`typescript
const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (category) => {
    set({ loading: true, error: null });
    try {
      const products = await api.getProducts(category);
      set({ products, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Accessing other state
  addToCart: (productId) => {
    const product = get().products.find(p => p.id === productId);
    if (product) {
      useCartStore.getState().add(product);
    }
  },
}));
\`\`\`

## Advanced Patterns

### Middleware (Like Redux Middleware)

\`\`\`typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      { name: 'counter-storage' }
    )
  )
);
\`\`\`

### Slices Pattern (Like Redux Slices)

\`\`\`typescript
const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});

const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
});

const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createCartSlice(...a),
}));
\`\`\`

### Selectors for Performance

\`\`\`typescript
// Avoid re-renders with selectors
const userName = useUserStore((state) => state.user?.name);
const cartCount = useCartStore((state) => state.items.length);

// Shallow comparison for objects
import { shallow } from 'zustand/shallow';
const { user, loading } = useUserStore(
  (state) => ({ user: state.user, loading: state.loading }),
  shallow
);
\`\`\`

## What to Keep from Redux

- **DevTools pattern**: Zustand supports Redux DevTools
- **Immutability**: Still important, use Immer if needed
- **Selector patterns**: Zustand encourages granular selectors
- **Action naming**: Keep descriptive action names in your methods

## Conclusion

The migration doesn't have to be all-or-nothing. Start with new features in Zustand, gradually migrate existing Redux slices, and enjoy cleaner, more maintainable code.

After our migration at Emerline, we reduced state management code by 60% while maintaining the same functionality.
    `,
    coverImage: '/images/blog/react-perf.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2025-01-05',
    readingTime: 13,
    category: 'React',
    tags: ['React', 'State Management', 'Redux', 'Zustand', 'Migration'],
    featured: false,
    views: 1234,
    likes: 89,
  },
  {
    id: 'jquery-to-react-migration',
    slug: 'jquery-to-react-migration-50000-users',
    title: 'jQuery to React: How We Migrated a Platform Serving 50,000+ Users',
    excerpt:
      'A real-world case study of migrating a legacy jQuery application to React at Inango Systems, achieving 40% performance improvement while maintaining zero downtime.',
    content: `
# jQuery to React: How We Migrated a Platform Serving 50,000+ Users

At Inango Systems, we faced a challenge many teams know well: a legacy jQuery application that worked but was increasingly difficult to maintain. Here's how we migrated to React while serving 50,000+ ISP customers.

## The Starting Point

Our jQuery application had grown organically over 5 years:
- 45,000 lines of JavaScript
- Spaghetti DOM manipulation
- Global state scattered everywhere
- 2-3 bugs per feature addition
- 8-second initial page load

## The Strategy: Strangler Fig Pattern

Instead of a risky big-bang rewrite, we used the Strangler Fig pattern—gradually replacing jQuery components with React while both coexist.

\`\`\`
Phase 1: React Container
┌──────────────────────────────────┐
│         jQuery App               │
│  ┌────────────┐                  │
│  │React Island│ (new features)   │
│  └────────────┘                  │
└──────────────────────────────────┘

Phase 2: Growing React
┌──────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │      React Components       │ │
│  └─────────────────────────────┘ │
│  jQuery (shrinking)              │
└──────────────────────────────────┘

Phase 3: React Primary
┌──────────────────────────────────┐
│         React App                │
│  ┌──────┐                        │
│  │jQuery│ (legacy, isolated)     │
│  └──────┘                        │
└──────────────────────────────────┘
\`\`\`

## Technical Implementation

### Step 1: React Mount Points

\`\`\`html
<!-- In existing jQuery templates -->
<div id="legacy-header">...</div>

<div id="react-dashboard"></div>  <!-- New React component -->

<div id="legacy-footer">...</div>
\`\`\`

\`\`\`typescript
// Mount React into jQuery page
const container = document.getElementById('react-dashboard');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
}
\`\`\`

### Step 2: Shared State Bridge

jQuery and React needed to share some state during migration:

\`\`\`typescript
// state-bridge.ts
class StateBridge {
  private listeners: Map<string, Set<Function>> = new Map();
  private state: Record<string, any> = {};

  // jQuery can set state
  setState(key: string, value: any) {
    this.state[key] = value;
    this.notify(key, value);
  }

  // React can subscribe
  subscribe(key: string, callback: Function) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => this.listeners.get(key)!.delete(callback);
  }

  private notify(key: string, value: any) {
    this.listeners.get(key)?.forEach(cb => cb(value));
  }
}

export const bridge = new StateBridge();

// jQuery side
$('#user-menu').on('change', function() {
  bridge.setState('selectedUser', $(this).val());
});

// React side
function UserDisplay() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    return bridge.subscribe('selectedUser', setUserId);
  }, []);

  return <UserCard userId={userId} />;
}
\`\`\`

### Step 3: Incremental Component Migration

We prioritized components by:
1. **Highest bug frequency** - Fix pain points first
2. **Most changed** - Reduce ongoing maintenance
3. **Isolated functionality** - Fewer dependencies

\`\`\`typescript
// Before: jQuery component
$('.customer-table').each(function() {
  const $table = $(this);
  const data = JSON.parse($table.attr('data-customers'));

  data.forEach(customer => {
    $table.append(\`
      <tr>
        <td>\${customer.name}</td>
        <td>\${customer.plan}</td>
        <td><button class="edit-btn" data-id="\${customer.id}">Edit</button></td>
      </tr>
    \`);
  });

  $table.on('click', '.edit-btn', function() {
    const id = $(this).data('id');
    openEditModal(id);
  });
});

// After: React component
function CustomerTable({ customers }: { customers: Customer[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <>
      <table>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.plan}</td>
              <td>
                <button onClick={() => setEditingId(customer.id)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingId && (
        <EditModal
          customerId={editingId}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}
\`\`\`

## Challenges We Faced

### 1. jQuery Plugins
Some jQuery plugins had no React equivalent. We wrapped them:

\`\`\`typescript
function LegacyDatePicker({ value, onChange }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const $el = $(ref.current);
    $el.datepicker({
      onSelect: (date) => onChange(date),
    });

    return () => $el.datepicker('destroy');
  }, [onChange]);

  return <input ref={ref} value={value} readOnly />;
}
\`\`\`

### 2. Global CSS Conflicts
jQuery used global CSS; React components needed isolation:

\`\`\`css
/* Scope React components */
.react-root {
  /* Reset inherited styles */
  all: initial;
  font-family: inherit;
}

.react-root * {
  box-sizing: border-box;
}
\`\`\`

### 3. Team Knowledge Gap
Not everyone knew React. We:
- Paired junior devs with React-experienced engineers
- Created internal documentation and patterns
- Started with simpler components

## Results

After 8 months of incremental migration:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Initial load | 8.2s | 2.1s | -74% |
| Bundle size | 1.2MB | 340KB | -72% |
| Bug rate | 2.3/week | 0.4/week | -83% |
| Maintenance time | 40% | 15% | -62% |
| Developer satisfaction | 3.2/5 | 4.6/5 | +44% |

## Key Takeaways

1. **Don't rewrite, strangle** - Incremental migration reduces risk
2. **Bridge state carefully** - Plan how jQuery and React communicate
3. **Migrate by value** - Start with highest-pain components
4. **Invest in team learning** - The technology shift requires skill building
5. **Measure everything** - Prove the value with metrics

The migration took longer than a rewrite would have, but we shipped value continuously and never risked the business.
    `,
    coverImage: '/images/blog/career-journey.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-12-20',
    readingTime: 14,
    category: 'Tutorial',
    tags: ['React', 'jQuery', 'Migration', 'Case Study', 'Legacy Code'],
    featured: false,
    views: 2456,
    likes: 178,
  },
  {
    id: 'achieving-95-lighthouse',
    slug: 'achieving-95-lighthouse-score-enterprise',
    title: 'Achieving 95+ Lighthouse Score on an Enterprise Dashboard',
    excerpt:
      'Real techniques we used at Safebooks AI to achieve 95+ Lighthouse scores on a data-heavy financial dashboard, reducing load time by 50%.',
    content: `
# Achieving 95+ Lighthouse Score on an Enterprise Dashboard

When I joined Safebooks AI, our financial dashboard scored 62 on Lighthouse. Six months later, we consistently hit 95+. Here's exactly how we did it.

## The Starting Point

Our dashboard displayed:
- Real-time financial charts (updating every 5 seconds)
- 50+ data tables with sorting/filtering
- PDF report generation
- Complex form wizards

Initial metrics:
- **Lighthouse**: 62
- **LCP**: 4.2s
- **INP**: 450ms
- **CLS**: 0.25

## The Optimization Journey

### 1. JavaScript Bundle Analysis

First, we analyzed what was actually being shipped:

\`\`\`bash
npm run build -- --analyze
\`\`\`

Findings:
- Chart.js: 180KB (used on 3 pages)
- PDF library: 340KB (used on 1 page)
- Moment.js: 67KB (replaceable)
- Lodash: 72KB (only using 5 functions)

### 2. Code Splitting Strategy

\`\`\`typescript
// Before: Everything loaded upfront
import { Chart } from 'chart.js';
import { PDFGenerator } from '@react-pdf/renderer';

// After: Dynamic imports
const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const PDFGenerator = dynamic(
  () => import('@/components/PDFGenerator'),
  { ssr: false }
);
\`\`\`

### 3. Replace Heavy Dependencies

\`\`\`typescript
// Moment.js (67KB) → date-fns (tree-shakeable)
import { format, parseISO } from 'date-fns';

// Full Lodash (72KB) → Individual imports
import debounce from 'lodash/debounce';
import groupBy from 'lodash/groupBy';
\`\`\`

### 4. Image Optimization

\`\`\`typescript
// Next.js Image with proper sizing
<Image
  src={chartScreenshot}
  alt="Financial chart"
  width={800}
  height={400}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={shimmerDataUrl}
/>
\`\`\`

### 5. Font Loading Strategy

\`\`\`typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeFonts: true,
  },
};

// _app.tsx - Preload critical fonts
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
\`\`\`

### 6. Critical CSS Inlining

\`\`\`typescript
// Extract critical CSS for above-the-fold content
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
};
\`\`\`

### 7. Data Fetching Optimization

\`\`\`typescript
// Before: Waterfall requests
useEffect(() => {
  fetchUser().then(user => {
    fetchAccounts(user.id).then(accounts => {
      fetchTransactions(accounts[0].id);
    });
  });
}, []);

// After: Parallel with React Query
function Dashboard() {
  const { data: user } = useQuery(['user'], fetchUser);
  const { data: accounts } = useQuery(
    ['accounts', user?.id],
    () => fetchAccounts(user!.id),
    { enabled: !!user }
  );

  // Prefetch likely next data
  const queryClient = useQueryClient();
  useEffect(() => {
    if (accounts?.[0]) {
      queryClient.prefetchQuery(
        ['transactions', accounts[0].id],
        () => fetchTransactions(accounts[0].id)
      );
    }
  }, [accounts]);
}
\`\`\`

### 8. Virtualization for Large Tables

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function TransactionTable({ transactions }) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <TransactionRow
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
            }}
            transaction={transactions[virtualRow.index]}
          />
        ))}
      </div>
    </div>
  );
}
\`\`\`

### 9. Layout Shift Prevention

\`\`\`css
/* Reserve space for dynamic content */
.chart-container {
  aspect-ratio: 16 / 9;
  min-height: 300px;
}

.avatar {
  width: 40px;
  height: 40px;
}

/* Skeleton that matches final content */
.table-skeleton {
  height: 48px; /* Matches actual row height */
}
\`\`\`

### 10. Server Components for Static Content

\`\`\`typescript
// Header with user info - Server Component
async function DashboardHeader() {
  const user = await getUser(); // Runs on server

  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <ClientSideNotifications /> {/* Only this is client */}
    </header>
  );
}
\`\`\`

## Results

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Lighthouse | 62 | 96 | 95+ ✅ |
| LCP | 4.2s | 1.3s | <1.5s ✅ |
| INP | 450ms | 85ms | <200ms ✅ |
| CLS | 0.25 | 0.02 | <0.1 ✅ |
| Bundle | 1.8MB | 420KB | - |

## Lessons Learned

1. **Measure first** - Profile before optimizing
2. **Bundle size matters** - Every KB counts on mobile
3. **Virtualize everything large** - Tables, lists, grids
4. **Prefetch intelligently** - Anticipate user actions
5. **Server Components are powerful** - Use them for static content

Performance optimization is a continuous process. We now run Lighthouse in CI and alert on regressions.
    `,
    coverImage: '/images/blog/nextjs.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-12-10',
    readingTime: 12,
    category: 'Performance',
    tags: ['Performance', 'Lighthouse', 'Optimization', 'Next.js', 'Case Study'],
    featured: false,
    views: 1890,
    likes: 145,
  },
  {
    id: 'physics-to-senior-engineer',
    slug: 'from-physics-to-senior-frontend-engineer',
    title: 'From Physics to Senior Front-End Engineer: 7 Years of Lessons',
    excerpt:
      'My unconventional journey from physics graduate to senior front-end engineer. The mindset shifts, key decisions, and advice for career changers.',
    content: `
# From Physics to Senior Front-End Engineer: 7 Years of Lessons

In 2017, I was finishing my Master's in Physics, unsure about my next step. Seven years later, I'm a Senior Front-End Engineer who's built products serving 60,000+ users. Here's what that journey taught me.

## The Transition

### Why I Left Physics

I loved the problem-solving in physics, but the academic path felt limiting. Research positions were scarce, and I wanted to build things people actually use.

Programming appeared as an obvious transition—same analytical thinking, but with immediate, tangible results.

### UNIT Factory: Learning to Learn

In 2017, I enrolled in UNIT Factory, a peer-to-peer programming school based on 42 (École 42) methodology. No teachers, no lectures—just problems to solve and peers to learn with.

This taught me the most valuable skill: **learning how to learn**. In tech, your knowledge has a half-life of about 2-3 years. The ability to pick up new concepts quickly matters more than any specific technology.

## Key Mindset Shifts

### From Physics to Programming

| Physics Mindset | Translated to Programming |
|-----------------|---------------------------|
| Build models of reality | Build abstractions of requirements |
| Simplify complex systems | Break problems into components |
| Mathematical rigor | Type safety and testing |
| Experimental validation | User testing and metrics |
| First principles thinking | Understanding "why" not just "how" |

### The Biggest Shift: Imperfection is Okay

Physics seeks elegant, complete solutions. Software development taught me that shipping 80% of a solution today beats shipping 100% never.

\`\`\`
// Physicist me: "But what about edge cases X, Y, Z?"
// Engineer me: "Let's ship, monitor, and iterate."
\`\`\`

## Career Progression Lessons

### Year 1-2: Junior at Helios (2018-2019)

**What I focused on:**
- HTML, CSS, JavaScript fundamentals
- Reading other people's code
- Asking "stupid" questions

**Key lesson:** Don't try to impress. Focus on learning. Senior developers prefer honest questions over pretended understanding.

### Year 2-4: Middle Developer at Inango (2019-2021)

**What I focused on:**
- React and Redux deep dive
- Leading my first migration (jQuery → React)
- Mentoring my first junior

**Key lesson:** The jump from junior to mid isn't about knowing more—it's about owning outcomes instead of just completing tasks.

### Year 4-6: Senior at Emerline (2021-2024)

**What I focused on:**
- Architecture decisions
- Component library design
- Cross-team collaboration
- Performance optimization

**Key lesson:** Senior isn't about writing the best code. It's about making everyone around you more effective.

### Year 6+: Senior at Safebooks AI (2024-2025)

**What I focus on now:**
- System-wide technical decisions
- Balancing business needs with technical quality
- Building for scale (9 enterprise clients)

**Key lesson:** At senior+ levels, communication and judgment matter more than coding speed.

## Advice for Career Changers

### 1. Your Background is an Asset

Physics gave me:
- Mathematical modeling → Algorithm design
- Experiment design → A/B testing mentality
- Complex problem decomposition → Architecture skills

Whatever your background, there are transferable skills. Identify and leverage them.

### 2. Build in Public

I created projects and wrote about what I learned. This:
- Reinforced my learning
- Created a portfolio
- Opened unexpected opportunities

### 3. Find Your Learning Style

I learn best by building. Others prefer:
- Reading documentation
- Watching videos
- Taking courses
- Pair programming

Experiment to find what works for you.

### 4. Join the Right Company at the Right Time

Early career: prioritize **learning opportunity** over salary
- Smaller companies: wear more hats
- Mentorship availability
- Code review culture

Mid career: prioritize **scope and impact**
- Can you own significant features?
- Is there room to grow into leadership?

### 5. Embrace the Unknown

I've felt like an imposter at every career stage. The feeling never fully goes away—you just learn to recognize it as a sign of growth.

## What I Wish I'd Known Earlier

1. **Soft skills compound faster than technical skills** - Communication, empathy, and leadership multiply your impact.

2. **Specialization comes later** - Build broad foundations first, then go deep.

3. **Performance reviews are negotiations** - Document your wins and advocate for yourself.

4. **The best code is no code** - Solving problems without writing code is a superpower.

5. **Your career is a marathon** - Burnout is real. Sustainable pace beats sprints.

## Looking Forward

Seven years in, I'm more excited about front-end development than ever. The ecosystem keeps evolving—React Server Components, the React Compiler, AI-assisted development—and there's always more to learn.

That curiosity I had as a physics student? It never went away. It just found a new home.

---

*If you're considering a career change into tech, or you're early in your journey, feel free to reach out. I'm always happy to chat.*
    `,
    coverImage: '/images/blog/career-journey.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-11-15',
    readingTime: 11,
    category: 'Career',
    tags: ['Career', 'Personal Development', 'Career Change', 'Mentorship'],
    featured: false,
    views: 3421,
    likes: 267,
  },
  {
    id: 'typescript-patterns-enterprise',
    slug: 'typescript-patterns-enterprise-applications',
    title: 'TypeScript Patterns for Enterprise React Applications',
    excerpt:
      'Battle-tested TypeScript patterns from building enterprise platforms. Generics, utility types, and type-safe API layers that scale.',
    content: `
# TypeScript Patterns for Enterprise React Applications

After building enterprise platforms at Emerline and Safebooks AI, I've developed patterns that make TypeScript work for you instead of against you.

## Pattern 1: Branded Types for Domain Safety

IDs that look the same but mean different things:

\`\`\`typescript
// Without branding - easy to mix up
function getUser(userId: string) { ... }
function getAccount(accountId: string) { ... }

getUser(accountId); // Compiles! But wrong.

// With branding - compile-time safety
type UserId = string & { readonly brand: unique symbol };
type AccountId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(userId: UserId) { ... }
function getAccount(accountId: AccountId) { ... }

getUser(accountId); // Error! Type 'AccountId' is not assignable
\`\`\`

## Pattern 2: Type-Safe API Layer

\`\`\`typescript
// Define API contract
interface APIEndpoints {
  '/users': {
    GET: { response: User[] };
    POST: { body: CreateUserDTO; response: User };
  };
  '/users/:id': {
    GET: { params: { id: string }; response: User };
    PUT: { params: { id: string }; body: UpdateUserDTO; response: User };
    DELETE: { params: { id: string }; response: void };
  };
}

// Type-safe fetch wrapper
async function api<
  Path extends keyof APIEndpoints,
  Method extends keyof APIEndpoints[Path]
>(
  path: Path,
  method: Method,
  options?: APIEndpoints[Path][Method] extends { body: infer B } ? { body: B } : never
): Promise<APIEndpoints[Path][Method] extends { response: infer R } ? R : never> {
  // Implementation
}

// Usage - fully typed!
const users = await api('/users', 'GET'); // User[]
const user = await api('/users', 'POST', { body: { name: 'John' } }); // User
\`\`\`

## Pattern 3: Discriminated Unions for State

\`\`\`typescript
// Instead of multiple booleans
interface BadState {
  loading: boolean;
  error: Error | null;
  data: User[] | null;
}
// Problem: Can have loading=true AND error AND data

// Use discriminated unions
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

function UserList() {
  const [state, setState] = useState<AsyncState<User[]>>({ status: 'idle' });

  switch (state.status) {
    case 'idle':
      return <button onClick={load}>Load Users</button>;
    case 'loading':
      return <Spinner />;
    case 'error':
      return <Error message={state.error.message} />;
    case 'success':
      return <List users={state.data} />; // data is User[], guaranteed
  }
}
\`\`\`

## Pattern 4: Builder Pattern for Complex Objects

\`\`\`typescript
class QueryBuilder<T extends Record<string, unknown>> {
  private query: Partial<T> = {};

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.query[key] = value;
    return this;
  }

  build(): Partial<T> {
    return { ...this.query };
  }
}

interface UserQuery {
  role: 'admin' | 'user';
  active: boolean;
  createdAfter: Date;
}

const query = new QueryBuilder<UserQuery>()
  .where('role', 'admin')
  .where('active', true)
  .build();
// Type: Partial<UserQuery>
\`\`\`

## Pattern 5: Props Inference from Data

\`\`\`typescript
// Infer component props from data structure
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: false },
] as const;

type ColumnKey = typeof columns[number]['key']; // 'name' | 'email' | 'role'

interface TableProps<T extends Record<ColumnKey, unknown>> {
  data: T[];
  columns: typeof columns;
  onSort?: (key: ColumnKey) => void;
}

function Table<T extends Record<ColumnKey, unknown>>({ data, columns, onSort }: TableProps<T>) {
  // Implementation
}

// Usage
<Table
  data={users} // Must have name, email, role properties
  columns={columns}
  onSort={(key) => { /* key is 'name' | 'email' | 'role' */ }}
/>
\`\`\`

## Pattern 6: Exhaustive Switch Handling

\`\`\`typescript
function assertNever(x: never): never {
  throw new Error(\`Unexpected value: \${x}\`);
}

type Status = 'pending' | 'approved' | 'rejected';

function getStatusColor(status: Status): string {
  switch (status) {
    case 'pending': return 'yellow';
    case 'approved': return 'green';
    case 'rejected': return 'red';
    default: return assertNever(status); // Compile error if case missing
  }
}

// If you add 'cancelled' to Status, TypeScript will error
// until you handle it in the switch
\`\`\`

## Pattern 7: Type-Safe Event Emitter

\`\`\`typescript
type EventMap = {
  userLoggedIn: { userId: string; timestamp: Date };
  userLoggedOut: { userId: string };
  dataUpdated: { entityType: string; entityId: string };
};

class TypedEventEmitter<T extends Record<string, unknown>> {
  private handlers: Partial<{ [K in keyof T]: Set<(data: T[K]) => void> }> = {};

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }
    this.handlers[event]!.add(handler);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.handlers[event]?.forEach(handler => handler(data));
  }
}

const emitter = new TypedEventEmitter<EventMap>();

emitter.on('userLoggedIn', (data) => {
  console.log(data.userId); // Typed!
  console.log(data.timestamp); // Typed!
});

emitter.emit('userLoggedIn', {
  userId: '123',
  timestamp: new Date()
}); // Type-checked!
\`\`\`

## Conclusion

These patterns have saved countless hours of debugging and made our codebases more maintainable. The initial investment in proper typing pays dividends as your application scales.

Remember: TypeScript is most valuable when it catches bugs at compile time that would otherwise reach production.
    `,
    coverImage: '/images/blog/typescript.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-10-20',
    readingTime: 13,
    category: 'TypeScript',
    tags: ['TypeScript', 'React', 'Patterns', 'Enterprise', 'Best Practices'],
    featured: false,
    views: 1654,
    likes: 123,
  },
];

// Helper function to get related posts
export function getRelatedPosts(postId: string, limit: number = 3): BlogPost[] {
  const currentPost = blogPosts.find(p => p.id === postId);
  if (!currentPost) return [];

  // Find posts with similar tags or category
  const relatedPosts = blogPosts
    .filter(p => p.id !== postId)
    .map(post => {
      const commonTags = post.tags.filter(tag =>
        currentPost.tags.includes(tag)
      ).length;
      const sameCategory = post.category === currentPost.category ? 2 : 0;
      return {
        post,
        score: commonTags + sameCategory,
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return relatedPosts;
}

// Helper function to get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  if (category === ALL_FILTER) return blogPosts;
  return blogPosts.filter(post => post.category === category);
}

// Helper function to get featured posts
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

// Helper function to search posts
export function searchPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(
    post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
  );
}
