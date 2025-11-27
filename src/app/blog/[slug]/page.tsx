import { notFound } from 'next/navigation';
import {
  blogPosts,
  getRelatedPosts as getLegacyRelatedPosts,
} from '@/data/blog';
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts as getMdxRelatedPosts,
} from '@/lib/mdx';
import { BlogPostContent } from '@/components/sections/BlogPostContent';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import {
  generateBreadcrumbSchema,
  getBlogPostBreadcrumbs,
} from '@/lib/breadcrumbs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts (MDX + legacy)
export async function generateStaticParams() {
  const mdxSlugs = getAllPostSlugs();
  const legacySlugs = blogPosts.map(post => post.slug);

  // Combine and dedupe slugs
  const allSlugs = [...new Set([...mdxSlugs, ...legacySlugs])];

  return allSlugs.map(slug => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Try MDX first
  const mdxPost = getPostBySlug(slug);
  if (mdxPost) {
    const ogImageUrl = `/api/og?title=${encodeURIComponent(mdxPost.title)}&type=blog&description=${encodeURIComponent(mdxPost.excerpt.slice(0, 100))}`;

    return {
      title: `${mdxPost.title} | Oles Didukh Blog`,
      description: mdxPost.excerpt,
      openGraph: {
        title: mdxPost.title,
        description: mdxPost.excerpt,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: mdxPost.title,
          },
        ],
        type: 'article',
        publishedTime: mdxPost.publishedAt,
        authors: [mdxPost.author.name],
        tags: mdxPost.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: mdxPost.title,
        description: mdxPost.excerpt,
        images: [ogImageUrl],
      },
    };
  }

  // Fall back to legacy
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&type=blog&description=${encodeURIComponent(post.excerpt.slice(0, 100))}`;

  return {
    title: `${post.title} | Oles Didukh Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

// MDX options with syntax highlighting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxOptions: any = {
  mdxOptions: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
          keepBackground: false,
        },
      ],
    ],
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Try MDX first
  const mdxPost = getPostBySlug(slug);

  if (mdxPost) {
    const relatedPosts = getMdxRelatedPosts(slug);

    // Article structured data for SEO
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: mdxPost.title,
      description: mdxPost.excerpt,
      image: mdxPost.coverImage,
      datePublished: mdxPost.publishedAt,
      dateModified: mdxPost.updatedAt ?? mdxPost.publishedAt,
      author: {
        '@type': 'Person',
        name: mdxPost.author.name,
        url: 'https://olesdidukh.dev',
        jobTitle: mdxPost.author.role,
      },
      publisher: {
        '@type': 'Person',
        name: 'Oles Didukh',
        url: 'https://olesdidukh.dev',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://olesdidukh.dev/blog/${mdxPost.slug}`,
      },
      keywords: mdxPost.tags.join(', '),
      articleSection: mdxPost.category,
      timeRequired: `PT${mdxPost.readingTime}M`,
    };

    // Breadcrumb structured data for navigation
    const breadcrumbJsonLd = generateBreadcrumbSchema(
      getBlogPostBreadcrumbs(mdxPost.title, mdxPost.slug)
    );

    // MDX components for RSC
    const mdxComponents = getMDXComponents({});

    // MDX content rendered as RSC
    const mdxContent = (
      <MDXRemote
        source={mdxPost.content}
        components={mdxComponents}
        options={mdxOptions}
      />
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <Navigation />
        <main className="pt-20">
          <BlogPostContent
            post={mdxPost}
            relatedPosts={relatedPosts}
            mdxContent={mdxContent}
          />
        </main>
        <Footer />
      </>
    );
  }

  // Fall back to legacy posts
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getLegacyRelatedPosts(post.id);

  // Article structured data for SEO
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: 'https://olesdidukh.dev',
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Person',
      name: 'Oles Didukh',
      url: 'https://olesdidukh.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://olesdidukh.dev/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
  };

  // Breadcrumb structured data for navigation
  const breadcrumbJsonLd = generateBreadcrumbSchema(
    getBlogPostBreadcrumbs(post.title, post.slug)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navigation />
      <main className="pt-20">
        <BlogPostContent post={post} relatedPosts={relatedPosts} />
      </main>
      <Footer />
    </>
  );
}
