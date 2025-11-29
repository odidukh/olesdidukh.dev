import Fuse, { type IFuseOptions } from 'fuse.js';
import { blogPosts, type BlogPost } from '@/data/blog';
import { projectsData, type Project } from '@/data/projects';

/**
 * Search result types
 */
export type SearchResultType = 'blog' | 'project' | 'page';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  url: string;
  category?: string;
  tags?: string[];
  image?: string;
}

/**
 * Static pages that are searchable
 */
const staticPages: SearchResult[] = [
  {
    id: 'home',
    type: 'page',
    title: 'Home',
    description: 'Welcome to my portfolio - Senior Front-End Engineer',
    url: '/',
  },
  {
    id: 'about',
    type: 'page',
    title: 'About Me',
    description: 'Learn about my journey, skills, and professional background',
    url: '/about',
  },
  {
    id: 'experience',
    type: 'page',
    title: 'Experience',
    description: 'My professional experience and career timeline',
    url: '/experience',
  },
  {
    id: 'projects',
    type: 'page',
    title: 'Projects',
    description: 'Showcase of my featured projects and work',
    url: '/projects',
  },
  {
    id: 'skills',
    type: 'page',
    title: 'Skills',
    description: 'Technical skills, tools, and expertise',
    url: '/skills',
  },
  {
    id: 'blog',
    type: 'page',
    title: 'Blog',
    description: 'Articles about web development, React, and TypeScript',
    url: '/blog',
  },
  {
    id: 'contact',
    type: 'page',
    title: 'Contact',
    description: 'Get in touch for collaboration or inquiries',
    url: '/contact',
  },
];

/**
 * Transform blog posts to search results
 */
function blogToSearchResult(post: BlogPost): SearchResult {
  return {
    id: post.id,
    type: 'blog',
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    category: post.category,
    tags: post.tags,
    image: post.coverImage,
  };
}

/**
 * Transform projects to search results
 */
function projectToSearchResult(project: Project): SearchResult {
  return {
    id: project.id,
    type: 'project',
    title: project.title,
    description: project.description,
    url: `/projects/${project.id}`,
    category: project.category,
    tags: project.technologies,
    image: project.image,
  };
}

/**
 * Build the complete search index
 */
function buildSearchIndex(): SearchResult[] {
  const blogResults = blogPosts.map(blogToSearchResult);
  const projectResults = projectsData.map(projectToSearchResult);

  return [...staticPages, ...blogResults, ...projectResults];
}

/**
 * Fuse.js configuration for fuzzy search
 */
const fuseOptions: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.15 },
    { name: 'tags', weight: 0.15 },
  ],
  threshold: 0.3, // Lower = more strict matching
  ignoreLocation: true,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

// Create the search index once
const searchIndex = buildSearchIndex();
const fuse = new Fuse(searchIndex, fuseOptions);

/**
 * Search the index with a query string
 */
export function search(query: string, limit = 10): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = fuse.search(query.trim(), { limit });
  return results.map(result => result.item);
}

/**
 * Get recent/suggested items when no query is provided
 */
export function getRecentItems(limit = 5): SearchResult[] {
  // Return a mix of featured content
  const featured = searchIndex.filter(
    item =>
      item.type === 'page' ||
      (item.type === 'blog' &&
        blogPosts.find(p => p.id === item.id)?.featured) ||
      (item.type === 'project' &&
        projectsData.find(p => p.id === item.id)?.featured)
  );

  return featured.slice(0, limit);
}

/**
 * Group search results by type
 */
export function groupResultsByType(
  results: SearchResult[]
): Record<SearchResultType, SearchResult[]> {
  return {
    page: results.filter(r => r.type === 'page'),
    project: results.filter(r => r.type === 'project'),
    blog: results.filter(r => r.type === 'blog'),
  };
}

export { searchIndex };
