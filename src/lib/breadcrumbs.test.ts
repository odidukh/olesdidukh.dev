import { describe, it, expect } from 'vitest';
import {
  generateBreadcrumbSchema,
  breadcrumbConfigs,
  getBlogPostBreadcrumbs,
  getProjectBreadcrumbs,
} from './breadcrumbs';

describe('generateBreadcrumbSchema', () => {
  it('generates valid BreadcrumbList schema', () => {
    const items = [
      { name: 'Home', url: 'https://example.com' },
      { name: 'Blog', url: 'https://example.com/blog' },
    ];

    const schema = generateBreadcrumbSchema(items);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
  });

  it('assigns correct positions starting from 1', () => {
    const items = [
      { name: 'Home', url: 'https://example.com' },
      { name: 'Blog', url: 'https://example.com/blog' },
      { name: 'Post', url: 'https://example.com/blog/post' },
    ];

    const schema = generateBreadcrumbSchema(items);

    expect(schema.itemListElement[0]?.position).toBe(1);
    expect(schema.itemListElement[1]?.position).toBe(2);
    expect(schema.itemListElement[2]?.position).toBe(3);
  });

  it('includes correct name and item properties', () => {
    const items = [{ name: 'Home', url: 'https://example.com' }];

    const schema = generateBreadcrumbSchema(items);

    expect(schema.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com',
    });
  });

  it('handles empty array', () => {
    const schema = generateBreadcrumbSchema([]);

    expect(schema.itemListElement).toEqual([]);
  });
});

describe('breadcrumbConfigs', () => {
  it('has configuration for about page', () => {
    expect(breadcrumbConfigs.about).toBeDefined();
    expect(breadcrumbConfigs.about).toHaveLength(2);
    expect(breadcrumbConfigs.about[0]?.name).toBe('Home');
    expect(breadcrumbConfigs.about[1]?.name).toBe('About');
  });

  it('has configuration for nested about pages', () => {
    expect(breadcrumbConfigs['about/journey']).toBeDefined();
    expect(breadcrumbConfigs['about/journey']).toHaveLength(3);
    expect(breadcrumbConfigs['about/philosophy']).toBeDefined();
    expect(breadcrumbConfigs['about/philosophy']).toHaveLength(3);
  });

  it('has configuration for all main pages', () => {
    const expectedPages = [
      'about',
      'about/journey',
      'about/philosophy',
      'experience',
      'projects',
      'skills',
      'blog',
      'contact',
    ];

    expectedPages.forEach(page => {
      expect(
        breadcrumbConfigs[page as keyof typeof breadcrumbConfigs]
      ).toBeDefined();
    });
  });

  it('all configs start with Home', () => {
    Object.values(breadcrumbConfigs).forEach(config => {
      expect(config[0]?.name).toBe('Home');
      expect(config[0]?.url).toBe('https://olesdidukh.dev');
    });
  });
});

describe('getBlogPostBreadcrumbs', () => {
  it('generates breadcrumbs for a blog post', () => {
    const breadcrumbs = getBlogPostBreadcrumbs('My Post', 'my-post');

    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[0]?.name).toBe('Home');
    expect(breadcrumbs[1]?.name).toBe('Blog');
    expect(breadcrumbs[2]?.name).toBe('My Post');
    expect(breadcrumbs[2]?.url).toBe('https://olesdidukh.dev/blog/my-post');
  });

  it('handles special characters in title', () => {
    const breadcrumbs = getBlogPostBreadcrumbs(
      "What's New in React 19",
      'whats-new-in-react-19'
    );

    expect(breadcrumbs[2]?.name).toBe("What's New in React 19");
  });
});

describe('getProjectBreadcrumbs', () => {
  it('generates breadcrumbs for a project', () => {
    const breadcrumbs = getProjectBreadcrumbs('My Project', 'my-project');

    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[0]?.name).toBe('Home');
    expect(breadcrumbs[1]?.name).toBe('Projects');
    expect(breadcrumbs[2]?.name).toBe('My Project');
    expect(breadcrumbs[2]?.url).toBe(
      'https://olesdidukh.dev/projects/my-project'
    );
  });

  it('handles project slugs with special patterns', () => {
    const breadcrumbs = getProjectBreadcrumbs(
      'E-Commerce Platform',
      'ecommerce-platform'
    );

    expect(breadcrumbs[2]?.name).toBe('E-Commerce Platform');
    expect(breadcrumbs[2]?.url).toBe(
      'https://olesdidukh.dev/projects/ecommerce-platform'
    );
  });
});
