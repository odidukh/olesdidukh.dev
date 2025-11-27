import { notFound } from 'next/navigation';
import { blogPosts, getRelatedPosts } from '@/data/blog';
import { BlogPostContent } from '@/components/sections/BlogPostContent';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import {
  generateBreadcrumbSchema,
  getBlogPostBreadcrumbs,
} from '@/lib/breadcrumbs';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.id);

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
