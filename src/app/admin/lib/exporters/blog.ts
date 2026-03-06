import type { BlogPost } from '@/lib/supabase/types';

/**
 * Generate MDX content matching the Velite blog schema.
 * Frontmatter uses camelCase keys to match velite.config.ts.
 */
export function generateBlogMDX(post: BlogPost): string {
  const lines: string[] = ['---'];

  lines.push(`slug: '${esc(post.slug)}'`);
  lines.push(`title: '${esc(post.title)}'`);
  lines.push(`excerpt: '${esc(post.excerpt)}'`);
  lines.push(`coverImage: '${esc(post.cover_image)}'`);

  const publishDate = post.published_at
    ? new Date(post.published_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  lines.push(`publishedAt: '${publishDate}'`);

  if (post.reading_time) {
    lines.push(`readingTime: ${post.reading_time}`);
  }

  lines.push(`category: '${esc(post.category)}'`);

  // Tags
  lines.push('tags:');
  for (const tag of post.tags) {
    lines.push(`  - '${esc(tag)}'`);
  }

  lines.push(`featured: ${post.featured}`);
  lines.push(`views: ${post.views}`);
  lines.push(`likes: ${post.likes}`);

  // Author
  lines.push('author:');
  lines.push(`  name: '${esc(post.author_name || 'Oles Didukh')}'`);
  lines.push(`  avatar: '${esc(post.author_avatar || '/images/avatar.png')}'`);
  lines.push(
    `  role: '${esc(post.author_role || 'Senior Front-End Engineer')}'`
  );

  // Series (optional)
  if (post.series_name) {
    lines.push('series:');
    lines.push(`  name: '${esc(post.series_name)}'`);
    lines.push(`  part: ${post.series_part}`);
    lines.push(`  total: ${post.series_total}`);
  }

  lines.push('---');
  lines.push('');
  lines.push(post.content);
  lines.push('');

  return lines.join('\n');
}

/** Escape single quotes for YAML single-quoted strings. */
function esc(value: string): string {
  return value.replace(/'/g, "''");
}
