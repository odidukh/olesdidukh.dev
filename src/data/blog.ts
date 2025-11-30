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
  'Open Source',
] as const;

/** Type for valid blog categories */
export type BlogCategory = (typeof blogCategories)[number];

export const blogPosts: BlogPost[] = [
  {
    id: 'optimizing-react-performance',
    slug: 'optimizing-react-performance-best-practices-2024',
    title: 'Optimizing React Performance: Best Practices for 2024',
    excerpt:
      'Learn advanced techniques to optimize your React applications for maximum performance, including code splitting, lazy loading, and efficient state management.',
    content: `
# Optimizing React Performance: Best Practices for 2024

Performance optimization is crucial for creating smooth, responsive React applications. In this comprehensive guide, we'll explore advanced techniques that can significantly improve your app's performance.

## Table of Contents
1. Understanding React's Rendering Process
2. Code Splitting and Lazy Loading
3. Memoization Strategies
4. State Management Optimization
5. Virtual DOM Optimization
6. Performance Monitoring

## Understanding React's Rendering Process

React's reconciliation algorithm is at the heart of its performance. Understanding how React decides when and what to re-render is crucial for optimization.

### The Virtual DOM

React maintains a virtual representation of the DOM in memory. When state changes occur, React:
1. Creates a new virtual DOM tree
2. Compares it with the previous virtual DOM tree (diffing)
3. Updates only the changed parts in the actual DOM

\`\`\`javascript
// Example of unnecessary re-renders
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // This object is recreated on every render
  const config = { theme: 'dark', size: 'large' };
  
  return <ChildComponent config={config} />;
}
\`\`\`

## Code Splitting and Lazy Loading

Code splitting is one of the most effective ways to improve initial load time.

### Using React.lazy()

\`\`\`javascript
import React, { lazy, Suspense } from 'react';

// Instead of regular import
// import HeavyComponent from './HeavyComponent';

// Use lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

### Route-based Code Splitting

\`\`\`javascript
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

## Memoization Strategies

Memoization prevents unnecessary re-renders and recalculations.

### Using React.memo()

\`\`\`javascript
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  console.log('Rendering ExpensiveComponent');
  return (
    <div>
      {/* Complex rendering logic */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id;
});
\`\`\`

### useMemo for Expensive Calculations

\`\`\`javascript
function DataProcessor({ items }) {
  const processedData = useMemo(() => {
    // Expensive calculation
    return items
      .filter(item => item.active)
      .sort((a, b) => b.priority - a.priority)
      .map(item => ({
        ...item,
        formatted: formatComplexData(item)
      }));
  }, [items]);

  return <DataVisualization data={processedData} />;
}
\`\`\`

### useCallback for Stable Function References

\`\`\`javascript
function SearchComponent({ onSearch }) {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      onSearch(searchTerm);
    }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
}
\`\`\`

## State Management Optimization

### Local vs Global State

Not all state needs to be global. Keep state as local as possible.

\`\`\`javascript
// ❌ Bad: Everything in global state
const globalState = {
  user: {...},
  theme: {...},
  formData: {...}, // Should be local
  modalOpen: false, // Should be local
  searchQuery: '', // Should be local
};

// ✅ Good: Only truly global state
const globalState = {
  user: {...},
  theme: {...},
};
\`\`\`

### State Colocation

Keep state close to where it's used.

\`\`\`javascript
// ❌ Bad: State at the top level
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <Header />
      <MainContent />
      <Footer onOpenModal={() => setIsModalOpen(true)} />
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

// ✅ Good: State colocated with usage
function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
\`\`\`

## Virtual DOM Optimization

### Keys in Lists

Always use stable, unique keys for list items.

\`\`\`javascript
// ❌ Bad: Using index as key
items.map((item, index) => <Item key={index} {...item} />)

// ✅ Good: Using stable unique ID
items.map(item => <Item key={item.id} {...item} />)
\`\`\`

### Avoid Inline Functions and Objects

\`\`\`javascript
// ❌ Bad: Creates new function on every render
<button onClick={() => handleClick(item.id)}>Click</button>

// ✅ Good: Stable function reference
const handleItemClick = useCallback((id) => {
  // handle click
}, []);

<button onClick={handleItemClick}>Click</button>
\`\`\`

## Performance Monitoring

### Using React DevTools Profiler

The React DevTools Profiler helps identify performance bottlenecks:

1. Open React DevTools
2. Navigate to the Profiler tab
3. Start recording
4. Interact with your app
5. Stop recording and analyze the flame graph

### Custom Performance Monitoring

\`\`\`javascript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(\`Component \${id} took \${actualDuration}ms to render\`);
  
  // Send to analytics
  if (actualDuration > 16) { // Longer than one frame
    analytics.track('slow_render', {
      component: id,
      duration: actualDuration,
      phase
    });
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponents />
    </Profiler>
  );
}
\`\`\`

## Conclusion

React performance optimization is an ongoing process. Start with measuring, identify bottlenecks, apply optimizations, and measure again. Remember:

- **Measure first**: Don't optimize prematurely
- **Profile regularly**: Performance can degrade over time
- **Focus on user experience**: Optimize what matters to users
- **Keep learning**: New patterns and tools emerge constantly

By following these best practices, you can build React applications that are not only functional but also blazingly fast.

## Resources

- [React Profiler API](https://reactjs.org/docs/profiler.html)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance Checklist](https://github.com/performance-checklist)
    `,
    coverImage: '/images/blog/react-perf.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-03-15',
    readingTime: 12,
    category: 'React',
    tags: [
      'React',
      'Performance',
      'Optimization',
      'Best Practices',
      'JavaScript',
    ],
    featured: true,
    views: 1250,
    likes: 89,
  },
  {
    id: 'typescript-advanced-patterns',
    slug: 'typescript-advanced-patterns-generics-utilities',
    title: 'Advanced TypeScript Patterns: Generics, Utility Types, and More',
    excerpt:
      "Dive deep into TypeScript's advanced features including conditional types, mapped types, template literals, and practical patterns for building type-safe applications.",
    content: `
# Advanced TypeScript Patterns: Generics, Utility Types, and More

TypeScript has evolved far beyond simple type annotations. In this article, we'll explore advanced patterns that will level up your TypeScript game.

## Generic Constraints and Conditional Types

### Advanced Generic Patterns

\`\`\`typescript
// Generic with constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Generic utility function
function pluck<T, K extends keyof T>(objects: T[], key: K): T[K][] {
  return objects.map(obj => obj[key]);
}
\`\`\`

### Conditional Types

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;
type IsString<T> = T extends string ? true : false;

// Practical example: Extract promise type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Result = UnwrapPromise<Promise<string>>; // string
type Direct = UnwrapPromise<number>; // number
\`\`\`

## Mapped Types and Template Literal Types

### Creating Flexible APIs

\`\`\`typescript
// Mapped type for readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Template literal types
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<'click'>; // 'onClick'

// Combining with mapped types
type Handlers<T> = {
  [K in keyof T as EventName<K & string>]: (value: T[K]) => void;
};
\`\`\`

## Utility Types in Practice

\`\`\`typescript
// Custom utility types
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

// Practical application
interface Config {
  api: {
    endpoint: string;
    timeout: number;
    retry: {
      attempts: number;
      delay: number;
    };
  };
}

type PartialConfig = DeepPartial<Config>;
\`\`\`

The article continues with more advanced patterns...
    `,
    coverImage: '/images/blog/typescript.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-03-10',
    readingTime: 15,
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Type Safety', 'Programming Patterns'],
    featured: true,
    views: 980,
    likes: 76,
  },
  {
    id: 'react-server-components',
    slug: 'understanding-react-server-components-next-js',
    title: 'Understanding React Server Components in Next.js 14',
    excerpt:
      'A comprehensive guide to React Server Components, their benefits, use cases, and implementation patterns in Next.js 14.',
    content: `
# Understanding React Server Components in Next.js 14

React Server Components (RSC) represent a paradigm shift in how we build React applications. Let's explore how they work and when to use them.

## What Are Server Components?

Server Components run on the server and send their rendered output to the client. They can:
- Fetch data directly from databases
- Read files from the file system
- Use server-only dependencies
- Reduce client bundle size

## Server vs Client Components

\`\`\`typescript
// Server Component (default in app directory)
async function ProductList() {
  const products = await db.query('SELECT * FROM products');
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Client Component
'use client';

function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    await addToCart(productId);
    setLoading(false);
  };
  
  return <button onClick={handleClick}>Add to Cart</button>;
}
\`\`\`

More content continues...
    `,
    coverImage: '/images/blog/nextjs.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-03-05',
    readingTime: 10,
    category: 'React',
    tags: ['React', 'Next.js', 'Server Components', 'RSC', 'Web Development'],
    featured: false,
    views: 756,
    likes: 62,
    series: {
      name: 'Next.js 14 Deep Dive',
      part: 1,
      total: 3,
    },
  },
  {
    id: 'web-performance-metrics',
    slug: 'web-performance-metrics-core-web-vitals',
    title: 'Mastering Web Performance: Core Web Vitals and Beyond',
    excerpt:
      "Learn how to measure, monitor, and improve your website's performance using Core Web Vitals and other essential metrics.",
    content: `
# Mastering Web Performance: Core Web Vitals and Beyond

Performance directly impacts user experience and SEO. Let's dive deep into Core Web Vitals and optimization strategies.

## Understanding Core Web Vitals

### LCP (Largest Contentful Paint)
Measures loading performance. Should occur within 2.5 seconds.

### FID (First Input Delay)
Measures interactivity. Should be less than 100 milliseconds.

### CLS (Cumulative Layout Shift)
Measures visual stability. Should maintain a score of less than 0.1.

## Optimization Strategies

### Improving LCP
\`\`\`javascript
// Preload critical resources
<link rel="preload" as="image" href="hero-image.webp" />

// Use responsive images
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
\`\`\`

More optimization techniques...
    `,
    coverImage: '/images/blog/modern-css.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-02-28',
    readingTime: 8,
    category: 'Performance',
    tags: ['Performance', 'Core Web Vitals', 'SEO', 'Optimization'],
    featured: false,
    views: 623,
    likes: 48,
  },
  {
    id: 'state-management-comparison',
    slug: 'react-state-management-comparison-2024',
    title: 'State Management in React: Comparing Redux, Zustand, and Jotai',
    excerpt:
      'An in-depth comparison of popular React state management solutions, their pros and cons, and when to use each.',
    content: `
# State Management in React: Comparing Redux, Zustand, and Jotai

Choosing the right state management solution can make or break your React application. Let's compare the most popular options in 2024.

## Redux Toolkit

### Pros
- Mature ecosystem
- Excellent DevTools
- Predictable state updates
- Time-travel debugging

### Implementation
\`\`\`typescript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 },
  },
});

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});
\`\`\`

## Zustand

### Pros
- Minimal boilerplate
- TypeScript friendly
- No providers needed
- Small bundle size (8KB)

### Implementation
\`\`\`typescript
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}));
\`\`\`

Detailed comparison continues...
    `,
    coverImage: '/images/blog/react-perf.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-02-20',
    readingTime: 14,
    category: 'React',
    tags: ['React', 'State Management', 'Redux', 'Zustand', 'Jotai'],
    featured: false,
    views: 892,
    likes: 71,
  },
  {
    id: 'frontend-testing-strategies',
    slug: 'comprehensive-frontend-testing-strategies',
    title: 'Comprehensive Frontend Testing Strategies for Modern Web Apps',
    excerpt:
      'Learn how to implement effective testing strategies including unit tests, integration tests, and E2E tests for your frontend applications.',
    content: `
# Comprehensive Frontend Testing Strategies for Modern Web Apps

Testing is crucial for maintaining code quality and preventing regressions. Let's explore a complete testing strategy.

## The Testing Pyramid

1. **Unit Tests** (70%) - Fast, isolated component tests
2. **Integration Tests** (20%) - Component interaction tests  
3. **E2E Tests** (10%) - Full user flow tests

## Unit Testing with Jest and React Testing Library

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  it('increments count when button is clicked', () => {
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    const count = screen.getByText(/count: 0/i);
    
    fireEvent.click(button);
    
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });
});
\`\`\`

More testing patterns and examples...
    `,
    coverImage: '/images/blog/typescript.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-02-15',
    readingTime: 11,
    category: 'Best Practices',
    tags: ['Testing', 'Jest', 'React Testing Library', 'E2E', 'Cypress'],
    featured: false,
    views: 534,
    likes: 42,
  },
  {
    id: 'css-modern-techniques',
    slug: 'modern-css-techniques-2024',
    title: 'Modern CSS Techniques: Container Queries, Layers, and More',
    excerpt:
      'Explore the latest CSS features including container queries, cascade layers, and modern layout techniques that are changing how we style web applications.',
    content: `
# Modern CSS Techniques: Container Queries, Layers, and More

CSS has evolved significantly. Let's explore modern features that make styling more powerful and maintainable.

## Container Queries

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
\`\`\`

## Cascade Layers

\`\`\`css
@layer reset, base, components, utilities;

@layer components {
  .button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
}

@layer utilities {
  .mt-4 { margin-top: 1rem; }
}
\`\`\`

More modern CSS techniques...
    `,
    coverImage: '/images/blog/modern-css.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-02-10',
    readingTime: 9,
    category: 'Web Development',
    tags: ['CSS', 'Container Queries', 'Cascade Layers', 'Modern CSS'],
    featured: false,
    views: 412,
    likes: 35,
  },
  {
    id: 'career-senior-developer',
    slug: 'journey-to-senior-developer-lessons-learned',
    title: 'My Journey to Senior Developer: Lessons Learned',
    excerpt:
      'Personal insights and practical advice from my journey from physics graduate to senior front-end engineer, including key decisions and learning strategies.',
    content: `
# My Journey to Senior Developer: Lessons Learned

After 7 years in software development and transitioning from physics to programming, here are the key lessons that shaped my career.

## The Career Transition

Coming from a physics background, I had strong analytical skills but needed to learn practical programming. The key was leveraging my problem-solving abilities while being humble about what I didn't know.

## Key Lessons

### 1. Deep Understanding Over Surface Knowledge
Don't just learn frameworks; understand the problems they solve.

### 2. Communication is Code
The best code is worthless if you can't explain it to others.

### 3. Mentorship Accelerates Growth
Both having mentors and mentoring others accelerated my learning.

Personal stories and advice continue...
    `,
    coverImage: '/images/blog/career-journey.png',
    author: DEFAULT_AUTHOR,
    publishedAt: '2024-02-01',
    readingTime: 7,
    category: 'Career',
    tags: [
      'Career',
      'Personal Development',
      'Software Engineering',
      'Mentorship',
    ],
    featured: false,
    views: 1456,
    likes: 98,
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
