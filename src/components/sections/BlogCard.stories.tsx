import type { Meta, StoryObj } from '@storybook/nextjs';
import { BlogCard } from './BlogCard';
import type { BlogPost } from '@/data/blog';

// Mock blog post data for stories
const mockPost: BlogPost = {
  id: 'demo-post',
  slug: 'demo-post',
  title: 'Building Modern Web Applications with React and TypeScript',
  excerpt:
    'Learn how to build scalable and maintainable web applications using React and TypeScript with best practices and modern patterns.',
  content: '',
  coverImage: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Blog+Post',
  author: {
    name: 'Oles Didukh',
    avatar: 'https://placehold.co/100x100/1a1a2e/ffffff?text=OD',
    role: 'Senior Front-End Engineer',
  },
  publishedAt: '2024-03-15',
  readingTime: 8,
  category: 'React',
  tags: ['React', 'TypeScript', 'Best Practices', 'Web Development'],
  featured: false,
  views: 2500,
  likes: 150,
};

const featuredPost: BlogPost = {
  ...mockPost,
  id: 'featured-post',
  slug: 'featured-post',
  title: 'The Complete Guide to React Performance Optimization',
  excerpt:
    'Master React performance optimization techniques including memoization, code splitting, lazy loading, and more.',
  featured: true,
  views: 15000,
  likes: 890,
};

const seriesPost: BlogPost = {
  ...mockPost,
  id: 'series-post',
  slug: 'series-post',
  title: 'TypeScript Deep Dive: Advanced Types',
  excerpt:
    'Explore advanced TypeScript features including conditional types, mapped types, and template literal types.',
  category: 'TypeScript',
  tags: ['TypeScript', 'Advanced', 'Tutorial'],
  series: {
    name: 'TypeScript Deep Dive',
    part: 2,
    total: 5,
  },
  views: 5200,
  likes: 320,
};

const shortPost: BlogPost = {
  ...mockPost,
  id: 'short-post',
  slug: 'short-post',
  title: 'Quick Tip: CSS Grid Auto-Fill',
  excerpt: 'A quick tip on using CSS Grid auto-fill for responsive layouts.',
  readingTime: 3,
  category: 'Web Development',
  tags: ['CSS', 'Quick Tip'],
  views: 800,
  likes: 45,
};

const meta = {
  title: 'Sections/BlogCard',
  component: BlogCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A card component for displaying blog post previews. Shows cover image, title, excerpt, author info, and engagement stats with hover animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Index for staggered animation delay',
    },
  },
  args: {
    index: 0,
  },
  decorators: [
    Story => (
      <div className="w-[380px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Card
export const Default: Story = {
  args: {
    post: mockPost,
  },
};

// Featured Post
export const Featured: Story = {
  args: {
    post: featuredPost,
  },
};

// Series Post
export const PartOfSeries: Story = {
  args: {
    post: seriesPost,
  },
};

// Short Read
export const ShortRead: Story = {
  args: {
    post: shortPost,
  },
};

// High Engagement
export const HighEngagement: Story = {
  args: {
    post: {
      ...mockPost,
      views: 50000,
      likes: 2500,
    },
  },
};

// Grid Showcase
export const GridShowcase: Story = {
  args: {
    post: mockPost,
  },
  decorators: [
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[1200px]">
        <BlogCard post={mockPost} index={0} />
        <BlogCard post={featuredPost} index={1} />
        <BlogCard post={seriesPost} index={2} />
        <BlogCard post={shortPost} index={3} />
        <BlogCard
          post={{ ...mockPost, id: 'post-5', category: 'Performance' }}
          index={4}
        />
        <BlogCard
          post={{ ...mockPost, id: 'post-6', category: 'Career' }}
          index={5}
        />
      </div>
    ),
  ],
};

// Different Categories
export const CategoryVariations: Story = {
  args: {
    post: mockPost,
  },
  decorators: [
    () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[1200px]">
        <BlogCard
          post={{ ...mockPost, id: 'react', category: 'React' }}
          index={0}
        />
        <BlogCard
          post={{ ...mockPost, id: 'typescript', category: 'TypeScript' }}
          index={1}
        />
        <BlogCard
          post={{ ...mockPost, id: 'performance', category: 'Performance' }}
          index={2}
        />
      </div>
    ),
  ],
};
