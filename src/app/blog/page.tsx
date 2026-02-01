import type { Metadata } from 'next';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { BlogSectionWithErrorBoundary } from '@/components/sections/BlogSectionWithErrorBoundary';

export const metadata: Metadata = {
  title: 'Blog | Oles Didukh - Web Development Insights',
  description:
    'Read articles about React, TypeScript, web performance, and modern front-end development. Tips, tutorials, and best practices from 7+ years of experience.',
  openGraph: {
    title: 'Blog | Oles Didukh',
    description:
      'Web development insights, tutorials, and best practices in React, TypeScript, and modern front-end technologies.',
    url: 'https://olesdidukh.dev/blog',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Blog&subtitle=Web%20Development%20Insights&description=Tips%2C%20tutorials%2C%20and%20best%20practices',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Oles Didukh',
    description:
      'Web development insights and tutorials about React, TypeScript, and modern front-end development.',
    images: ['/api/og?title=Blog&subtitle=Web%20Development%20Insights'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/blog',
  },
};

export default function BlogPage() {
  return (
    <>
      <BreadcrumbSchema page="blog" />
      <Navigation />
      <main id="main-content" className="pt-20">
        <BlogSectionWithErrorBoundary />
      </main>
      <Footer />
    </>
  );
}
