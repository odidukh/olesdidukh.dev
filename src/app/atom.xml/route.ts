import { blogPosts } from '@/data/blog';

const SITE_URL = 'https://olesdidukh.dev';
const SITE_TITLE = 'Oles Didukh - Blog';
const SITE_DESCRIPTION =
  'Insights on React, TypeScript, web performance, and front-end development from a Senior Front-End Engineer.';
const AUTHOR_NAME = 'Oles Didukh';
const AUTHOR_EMAIL = 'oles.didukh@gmail.com';

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate Atom feed for blog posts
 */
function generateAtomFeed(): string {
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const updated = sortedPosts[0]
    ? new Date(sortedPosts[0].publishedAt).toISOString()
    : new Date().toISOString();

  const entries = sortedPosts
    .map(post => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const publishedDate = new Date(post.publishedAt).toISOString();
      const updatedDate = post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : publishedDate;

      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl}" rel="alternate" type="text/html"/>
    <id>${postUrl}</id>
    <published>${publishedDate}</published>
    <updated>${updatedDate}</updated>
    <author>
      <name>${escapeXml(AUTHOR_NAME)}</name>
      <email>${AUTHOR_EMAIL}</email>
      <uri>${SITE_URL}</uri>
    </author>
    <summary type="html">${escapeXml(post.excerpt)}</summary>
    <category term="${escapeXml(post.category)}"/>
    ${post.tags.map(tag => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(AUTHOR_NAME)}</name>
    <email>${AUTHOR_EMAIL}</email>
    <uri>${SITE_URL}</uri>
  </author>
  <rights>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}</rights>
  <generator uri="https://nextjs.org/">Next.js</generator>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/og-image.png</logo>
${entries}
</feed>`;
}

export async function GET() {
  const feed = generateAtomFeed();

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
