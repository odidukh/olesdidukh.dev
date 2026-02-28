interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates BreadcrumbList structured data for SEO
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Common breadcrumb configurations for different pages
 */
export const breadcrumbConfigs = {
  about: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'About', url: 'https://olesdidukh.dev/about' },
  ],
  'about/journey': [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'About', url: 'https://olesdidukh.dev/about' },
    { name: 'My Journey', url: 'https://olesdidukh.dev/about/journey' },
  ],
  'about/philosophy': [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'About', url: 'https://olesdidukh.dev/about' },
    { name: 'Philosophy', url: 'https://olesdidukh.dev/about/philosophy' },
  ],
  experience: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Experience', url: 'https://olesdidukh.dev/experience' },
  ],
  projects: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Projects', url: 'https://olesdidukh.dev/projects' },
  ],
  skills: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Skills', url: 'https://olesdidukh.dev/skills' },
  ],
  blog: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Blog', url: 'https://olesdidukh.dev/blog' },
  ],
  contact: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Contact', url: 'https://olesdidukh.dev/contact' },
  ],
  guestbook: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Guestbook', url: 'https://olesdidukh.dev/guestbook' },
  ],
  uses: [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Uses', url: 'https://olesdidukh.dev/uses' },
  ],
};

/**
 * Generate breadcrumb schema for a blog post
 */
export function getBlogPostBreadcrumbs(postTitle: string, postSlug: string) {
  return [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Blog', url: 'https://olesdidukh.dev/blog' },
    { name: postTitle, url: `https://olesdidukh.dev/blog/${postSlug}` },
  ];
}

/**
 * Generate breadcrumb schema for a project page
 */
export function getProjectBreadcrumbs(
  projectTitle: string,
  projectSlug: string
) {
  return [
    { name: 'Home', url: 'https://olesdidukh.dev' },
    { name: 'Projects', url: 'https://olesdidukh.dev/projects' },
    {
      name: projectTitle,
      url: `https://olesdidukh.dev/projects/${projectSlug}`,
    },
  ];
}
