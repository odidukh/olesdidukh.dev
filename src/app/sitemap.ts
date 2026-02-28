import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { projectsData } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://olesdidukh.dev';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about/journey`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/philosophy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projectsData.map(project => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
