import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  updatedAt?: string | undefined;
  readingTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  series?:
    | {
        name: string;
        part: number;
        total: number;
      }
    | undefined;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

/**
 * Get all blog post slugs from MDX files
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx$/, ''));
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data['title'] as string,
    excerpt: data['excerpt'] as string,
    coverImage: data['coverImage'] as string,
    author: (data['author'] as BlogPostMeta['author']) || {
      name: 'Oles Didukh',
      avatar: '/images/avatar.png',
      role: 'Senior Front-End Engineer',
    },
    publishedAt: data['publishedAt'] as string,
    updatedAt: data['updatedAt'] as string | undefined,
    readingTime:
      (data['readingTime'] as number) || calculateReadingTime(content),
    category: data['category'] as string,
    tags: (data['tags'] as string[]) || [],
    featured: (data['featured'] as boolean) || false,
    series: data['series'] as BlogPostMeta['series'],
    content,
  };
}

/**
 * Get all blog posts with metadata
 */
export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return posts;
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(): BlogPostMeta[] {
  return getAllPosts().filter(post => post.featured);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): BlogPostMeta[] {
  if (category === 'All') return getAllPosts();
  return getAllPosts().filter(post => post.category === category);
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): BlogPostMeta[] {
  const lowercaseQuery = query.toLowerCase();
  return getAllPosts().filter(
    post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPostMeta[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts();

  return allPosts
    .filter(post => post.slug !== currentSlug)
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
}

/**
 * Calculate reading time based on content length
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Get all unique categories from posts
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map(post => post.category));
  return ['All', ...Array.from(categories)];
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap(post => post.tags));
  return Array.from(tags);
}
