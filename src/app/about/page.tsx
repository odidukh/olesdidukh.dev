import type { Metadata } from 'next';
import { AboutSection } from '@/components/sections/AboutSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'About Oles Didukh | Senior Front-End Engineer',
  description:
    'Learn about Oles Didukh, a Senior Front-End Engineer with 7+ years of experience specializing in React, TypeScript, and Next.js. Passionate about building exceptional web experiences.',
  openGraph: {
    title: 'About Oles Didukh | Senior Front-End Engineer',
    description:
      'Senior Front-End Engineer with 7+ years of experience building high-performance web applications.',
    url: 'https://olesdidukh.dev/about',
    type: 'profile',
    images: [
      {
        url: '/api/og?title=About%20Me&subtitle=Senior%20Front-End%20Engineer&description=7%2B%20years%20building%20exceptional%20web%20experiences',
        width: 1200,
        height: 630,
        alt: 'About Oles Didukh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Oles Didukh',
    description:
      'Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
    images: ['/api/og?title=About%20Me&subtitle=Senior%20Front-End%20Engineer'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema page="about" />
      <Navigation />
      <main id="main-content" className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
