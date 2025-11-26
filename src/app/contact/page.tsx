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
  },
  twitter: {
    card: 'summary',
    title: 'Contact Oles Didukh',
    description: 'Get in touch for web development projects and opportunities.',
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
