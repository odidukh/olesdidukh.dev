import { notFound } from 'next/navigation';
import {
  getRelatedPosts,
  getPostBySlug,
  blogPosts,
  type BlogPost as BlogPostType,
} from '@/data/blog';
import { BlogPostContent } from '@/components/sections/BlogPostContent';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  getBlogPostBreadcrumbs,
} from '@/lib/breadcrumbs';
import { MDXContent } from '@/components/MDXContent';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const mdxSlugs = blogPosts.map(p => p.slug);

  return mdxSlugs.map(slug => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Try MDX first
  const mdxPost = getPostBySlug(slug);
  if (!mdxPost) {
    return {
      title: 'Post Not Found',
    };
  }

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
    alternates: {
      canonical: `https://olesdidukh.dev/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Try MDX first
  const mdxPost = getPostBySlug(slug);

  if (!mdxPost) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);

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
    timeRequired: `PT${mdxPost.readingTime || 5}M`,
  };

  // Breadcrumb structured data for navigation
  const breadcrumbJsonLd = generateBreadcrumbSchema(
    getBlogPostBreadcrumbs(mdxPost.title, mdxPost.slug)
  );

  // MDX content rendered as RSC
  const mdxContent = <MDXContent code={mdxPost.content} />;

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Navigation />
      <main id="main-content" className="pt-20">
        <BlogPostContent
          post={mdxPost as unknown as BlogPostType}
          relatedPosts={relatedPosts as unknown as BlogPostType[]}
          mdxContent={mdxContent}
        />
      </main>
      <Footer />
    </>
  );
}
