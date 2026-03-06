import type { Project } from '@/lib/supabase/types';

/**
 * Generate MDX content matching the Velite project schema.
 * Frontmatter uses camelCase keys to match velite.config.ts.
 */
export function generateProjectMDX(project: Project): string {
  const lines: string[] = ['---'];

  lines.push(`id: '${esc(project.slug)}'`);
  lines.push(`title: '${esc(project.title)}'`);
  lines.push(`description: '${esc(project.description)}'`);
  lines.push(`category: '${esc(project.category)}'`);

  // Technologies
  lines.push('technologies:');
  for (const tech of project.technologies) {
    lines.push(`  - '${esc(tech)}'`);
  }

  lines.push(`image: '${esc(project.image)}'`);

  // Images
  lines.push('images:');
  for (const img of project.images) {
    lines.push(`  - '${esc(img)}'`);
  }

  // Optional URLs
  if (project.live_url) {
    lines.push(`liveUrl: '${esc(project.live_url)}'`);
  }
  if (project.demo_url) {
    lines.push(`demoUrl: '${esc(project.demo_url)}'`);
  }
  if (project.github_url) {
    lines.push(`githubUrl: '${esc(project.github_url)}'`);
  }

  lines.push(`featured: ${project.featured}`);
  lines.push(`year: ${project.year}`);
  lines.push(`duration: '${esc(project.duration)}'`);
  lines.push(`role: '${esc(project.role)}'`);

  if (project.team) {
    lines.push(`team: '${esc(project.team)}'`);
  }
  if (project.client) {
    lines.push(`client: '${esc(project.client)}'`);
  }

  // Challenges
  if (project.challenges.length > 0) {
    lines.push('challenges:');
    for (const c of project.challenges) {
      lines.push(`  - '${esc(c)}'`);
    }
  }

  // Solutions
  if (project.solutions.length > 0) {
    lines.push('solutions:');
    for (const s of project.solutions) {
      lines.push(`  - '${esc(s)}'`);
    }
  }

  // Results (array of { metric, value })
  const results = project.results as
    | Array<{ metric: string; value: string }>
    | undefined;
  if (results && Array.isArray(results) && results.length > 0) {
    lines.push('results:');
    for (const r of results) {
      lines.push(`  - metric: '${esc(r.metric)}'`);
      lines.push(`    value: '${esc(r.value)}'`);
    }
  }

  // Testimonial (optional object { text, author, role })
  const testimonial = project.testimonial as {
    text: string;
    author: string;
    role: string;
  } | null;
  if (testimonial) {
    lines.push('testimonial:');
    lines.push(`  text: '${esc(testimonial.text)}'`);
    lines.push(`  author: '${esc(testimonial.author)}'`);
    lines.push(`  role: '${esc(testimonial.role)}'`);
  }

  // Video (optional)
  const video = project.video as {
    url: string;
    thumbnail?: string;
    type: string;
    title?: string;
    duration?: string;
  } | null;
  if (video) {
    lines.push('video:');
    lines.push(`  url: '${esc(video.url)}'`);
    lines.push(`  type: '${esc(video.type)}'`);
    if (video.thumbnail) {
      lines.push(`  thumbnail: '${esc(video.thumbnail)}'`);
    }
    if (video.title) {
      lines.push(`  title: '${esc(video.title)}'`);
    }
    if (video.duration) {
      lines.push(`  duration: '${esc(video.duration)}'`);
    }
  }

  lines.push('---');
  lines.push('');
  lines.push(project.long_description);
  lines.push('');

  return lines.join('\n');
}

/** Escape single quotes for YAML single-quoted strings. */
function esc(value: string): string {
  return value.replace(/'/g, "''");
}
