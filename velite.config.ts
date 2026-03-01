import { defineConfig, s } from 'velite';

// `s` is extended from Zod with some custom types,
// you can also import re-exported `z` from `velite` if you don't need these extension types.

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: {
    posts: {
      name: 'Post', // collection type name
      pattern: 'blog/**/*.mdx', // content files glob pattern
      schema: s
        .object({
          title: s.string().max(99), // Zod primitive type
          slug: s.string(), // defined in frontmatter
          excerpt: s.string().max(200),
          coverImage: s.string(),
          blurDataURL: s.string().optional(),
          publishedAt: s.isodate(), // input Date-like string, output ISO Date string
          updatedAt: s.isodate().optional(),
          readingTime: s.number().optional(),
          category: s.string(),
          tags: s.array(s.string()),
          featured: s.boolean().default(false),
          // views and likes are dynamic data, typically shouldn't be in static MDX frontmatter, but let's keep them optional or default
          views: s.number().default(0),
          likes: s.number().default(0),
          author: s
            .object({
              name: s.string(),
              avatar: s.string(),
              role: s.string(),
            })
            .default({
              name: 'Oles Didukh',
              avatar: '/images/avatar.png',
              role: 'Senior Front-End Engineer',
            }),
          series: s
            .object({
              name: s.string(),
              part: s.number(),
              total: s.number(),
            })
            .optional(),
          content: s.mdx(), // transform MDX to HTML or generic JSX
        })
        .transform(data => ({
          ...data,
          id: data.slug,
          permalink: `/blog/\${data.slug}`,
          readingTime:
            data.readingTime ||
            Math.ceil(data.content.split(/\\s+/).length / 200),
        })),
    },
    projects: {
      name: 'Project',
      pattern: 'projects/**/*.mdx',
      schema: s
        .object({
          title: s.string().max(99),
          id: s.string(),
          description: s.string(),
          category: s.string(),
          technologies: s.array(s.string()),
          image: s.string(),
          images: s.array(s.string()),
          blurDataURL: s.string().optional(),
          demoUrl: s.string().optional(),
          githubUrl: s.string().optional(),
          liveUrl: s.string().optional(),
          featured: s.boolean().default(false),
          year: s.number(),
          duration: s.string(),
          role: s.string(),
          team: s.string().optional(),
          client: s.string().optional(),
          challenges: s.array(s.string()).default([]),
          solutions: s.array(s.string()).default([]),
          results: s
            .array(
              s.object({
                metric: s.string(),
                value: s.string(),
              })
            )
            .default([]),
          testimonial: s
            .object({
              text: s.string(),
              author: s.string(),
              role: s.string(),
            })
            .optional(),
          video: s
            .object({
              url: s.string(),
              thumbnail: s.string().optional(),
              type: s.enum(['local', 'youtube', 'vimeo']),
              title: s.string().optional(),
              duration: s.string().optional(),
            })
            .optional(),
          content: s.mdx(),
        })
        .transform(data => ({ ...data, permalink: `/projects/\${data.id}` })),
    },
  },
});
