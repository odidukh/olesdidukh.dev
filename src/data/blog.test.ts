import { describe, it, expect } from 'vitest';
import {
  blogPosts,
  blogCategories,
  DEFAULT_AUTHOR,
  getRelatedPosts,
  getPostsByCategory,
  getFeaturedPosts,
  searchPosts,
} from './blog';
import { ALL_FILTER } from '@/constants';

describe('blogPosts', () => {
  it('contains blog posts', () => {
    expect(blogPosts.length).toBeGreaterThan(0);
  });

  it('each post has required fields', () => {
    blogPosts.forEach(post => {
      expect(post.id).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.excerpt).toBeDefined();
      expect(post.content).toBeDefined();
      expect(post.coverImage).toBeDefined();
      expect(post.author).toBeDefined();
      expect(post.publishedAt).toBeDefined();
      expect(post.readingTime).toBeDefined();
      expect(post.category).toBeDefined();
      expect(post.tags).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(typeof post.featured).toBe('boolean');
      expect(typeof post.views).toBe('number');
      expect(typeof post.likes).toBe('number');
    });
  });

  it('each post has unique id', () => {
    const ids = blogPosts.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each post has unique slug', () => {
    const slugs = blogPosts.map(p => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('each post has valid author structure', () => {
    blogPosts.forEach(post => {
      expect(post.author.name).toBeDefined();
      expect(post.author.avatar).toBeDefined();
      expect(post.author.role).toBeDefined();
    });
  });

  it('each post has positive reading time', () => {
    blogPosts.forEach(post => {
      expect(post.readingTime).toBeGreaterThan(0);
    });
  });

  it('each post has non-negative views and likes', () => {
    blogPosts.forEach(post => {
      expect(post.views).toBeGreaterThanOrEqual(0);
      expect(post.likes).toBeGreaterThanOrEqual(0);
    });
  });

  it('each post has valid publishedAt date format', () => {
    // Velite generates ISO 8601 date strings (e.g. '2025-01-28T00:00:00.000Z')
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    blogPosts.forEach(post => {
      expect(post.publishedAt).toMatch(isoDateRegex);
    });
  });

  it('series posts have valid series structure', () => {
    const seriesPosts = blogPosts.filter(p => p.series);
    seriesPosts.forEach(post => {
      expect(post.series?.name).toBeDefined();
      expect(post.series?.part).toBeGreaterThan(0);
      expect(post.series?.total).toBeGreaterThan(0);
      expect(post.series?.part).toBeLessThanOrEqual(post.series?.total ?? 0);
    });
  });
});

describe('blogCategories', () => {
  it('includes ALL_FILTER as first category', () => {
    expect(blogCategories[0]).toBe(ALL_FILTER);
  });

  it('includes all unique categories from posts', () => {
    const uniqueCategories = new Set(blogPosts.map(p => p.category));

    uniqueCategories.forEach(category => {
      expect(blogCategories).toContain(category);
    });
  });

  it('has no duplicate categories', () => {
    const uniqueCategories = new Set(blogCategories);
    expect(uniqueCategories.size).toBe(blogCategories.length);
  });

  it('all categories are non-empty strings', () => {
    blogCategories.forEach(category => {
      expect(typeof category).toBe('string');
      expect(category.length).toBeGreaterThan(0);
    });
  });
});

describe('DEFAULT_AUTHOR', () => {
  it('has required fields', () => {
    expect(DEFAULT_AUTHOR.name).toBeDefined();
    expect(DEFAULT_AUTHOR.avatar).toBeDefined();
    expect(DEFAULT_AUTHOR.role).toBeDefined();
  });

  it('has non-empty values', () => {
    expect(DEFAULT_AUTHOR.name.length).toBeGreaterThan(0);
    expect(DEFAULT_AUTHOR.avatar.length).toBeGreaterThan(0);
    expect(DEFAULT_AUTHOR.role.length).toBeGreaterThan(0);
  });

  it('is used by all posts', () => {
    blogPosts.forEach(post => {
      expect(post.author).toEqual(DEFAULT_AUTHOR);
    });
  });
});

describe('getRelatedPosts', () => {
  it('returns related posts for valid id', () => {
    const related = getRelatedPosts('optimizing-react-performance', 3);

    expect(related.length).toBeLessThanOrEqual(3);
    related.forEach(post => {
      expect(post.id).not.toBe('optimizing-react-performance');
    });
  });

  it('returns empty array for invalid id', () => {
    const related = getRelatedPosts('non-existent-post', 3);

    expect(related).toEqual([]);
  });

  it('respects limit parameter', () => {
    const related1 = getRelatedPosts('optimizing-react-performance', 1);
    const related2 = getRelatedPosts('optimizing-react-performance', 2);

    expect(related1.length).toBeLessThanOrEqual(1);
    expect(related2.length).toBeLessThanOrEqual(2);
  });

  it('returns posts with matching category or tags', () => {
    const currentPost = blogPosts.find(
      p => p.id === 'optimizing-react-performance'
    );
    const related = getRelatedPosts('optimizing-react-performance', 5);

    related.forEach(post => {
      const sameCategory = post.category === currentPost?.category;
      const sharedTags = post.tags.some(tag => currentPost?.tags.includes(tag));
      expect(sameCategory || sharedTags).toBe(true);
    });
  });

  it('uses default limit of 3', () => {
    const related = getRelatedPosts('optimizing-react-performance');

    expect(related.length).toBeLessThanOrEqual(3);
  });

  it('excludes the current post from results', () => {
    const related = getRelatedPosts('optimizing-react-performance', 10);

    const containsCurrent = related.some(
      p => p.id === 'optimizing-react-performance'
    );
    expect(containsCurrent).toBe(false);
  });
});

describe('getPostsByCategory', () => {
  it('returns all posts for ALL_FILTER category', () => {
    const posts = getPostsByCategory(ALL_FILTER);

    expect(posts.length).toBe(blogPosts.length);
  });

  it('filters posts by category', () => {
    const reactPosts = getPostsByCategory('React');

    expect(reactPosts.length).toBeGreaterThan(0);
    reactPosts.forEach(post => {
      expect(post.category).toBe('React');
    });
  });

  it('returns empty array for non-existent category', () => {
    const posts = getPostsByCategory('NonExistentCategory');

    expect(posts).toEqual([]);
  });

  it('is case-sensitive', () => {
    const posts = getPostsByCategory('react');

    expect(posts).toEqual([]);
  });

  it('returns subset of all posts', () => {
    const categoryPosts = getPostsByCategory('TypeScript');

    expect(categoryPosts.length).toBeLessThanOrEqual(blogPosts.length);
  });
});

describe('getFeaturedPosts', () => {
  it('returns only featured posts', () => {
    const featured = getFeaturedPosts();

    expect(featured.length).toBeGreaterThan(0);
    featured.forEach(post => {
      expect(post.featured).toBe(true);
    });
  });

  it('returns fewer or equal posts than total', () => {
    const featured = getFeaturedPosts();

    expect(featured.length).toBeLessThanOrEqual(blogPosts.length);
  });

  it('returns all posts marked as featured', () => {
    const featured = getFeaturedPosts();
    const expectedFeatured = blogPosts.filter(p => p.featured);

    expect(featured.length).toBe(expectedFeatured.length);
  });
});

describe('searchPosts', () => {
  it('finds posts by title', () => {
    const results = searchPosts('React');

    expect(results.length).toBeGreaterThan(0);
    const hasReactInTitle = results.some(p =>
      p.title.toLowerCase().includes('react')
    );
    expect(hasReactInTitle).toBe(true);
  });

  it('finds posts by excerpt', () => {
    const results = searchPosts('performance');

    expect(results.length).toBeGreaterThan(0);
  });

  it('finds posts by tags', () => {
    const results = searchPosts('TypeScript');

    expect(results.length).toBeGreaterThan(0);
    const hasTypeScriptTag = results.some(p =>
      p.tags.some(tag => tag.toLowerCase().includes('typescript'))
    );
    expect(hasTypeScriptTag).toBe(true);
  });

  it('finds posts by category', () => {
    const results = searchPosts('Career');

    expect(results.length).toBeGreaterThan(0);
    const hasCareerCategory = results.some(
      p => p.category.toLowerCase() === 'career'
    );
    expect(hasCareerCategory).toBe(true);
  });

  it('is case-insensitive', () => {
    const upperResults = searchPosts('REACT');
    const lowerResults = searchPosts('react');

    expect(upperResults.length).toBe(lowerResults.length);
  });

  it('returns empty array for no matches', () => {
    const results = searchPosts('xyznonexistentquery123');

    expect(results).toEqual([]);
  });

  it('handles empty query', () => {
    const results = searchPosts('');

    expect(results.length).toBe(blogPosts.length);
  });

  it('treats whitespace as literal search (returns no matches)', () => {
    const results = searchPosts('   ');

    // Whitespace is treated as literal search, not trimmed
    expect(results).toEqual([]);
  });
});
