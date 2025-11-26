import type { Metadata } from 'next';
import { BlogSection } from '@/components/sections/BlogSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Oles Didukh',
    description:
      'Web development insights and tutorials about React, TypeScript, and modern front-end development.',
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
      <main className="pt-20">
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}
