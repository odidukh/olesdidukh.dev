import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections/ContactSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Contact Oles Didukh | Get In Touch',
  description:
    'Get in touch with Oles Didukh for freelance projects, full-time opportunities, or collaboration. Available for web development projects using React, TypeScript, and Next.js.',
  openGraph: {
    title: 'Contact Oles Didukh | Get In Touch',
    description:
      'Get in touch for freelance projects, full-time opportunities, or collaboration.',
    url: 'https://olesdidukh.dev/contact',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Get%20In%20Touch&subtitle=Let%27s%20Work%20Together&description=Available%20for%20freelance%20and%20full-time%20opportunities',
        width: 1200,
        height: 630,
        alt: 'Contact Oles Didukh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Oles Didukh',
    description: 'Get in touch for web development projects and opportunities.',
    images: [
      '/api/og?title=Get%20In%20Touch&subtitle=Let%27s%20Work%20Together',
    ],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema page="contact" />
      <Navigation />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
