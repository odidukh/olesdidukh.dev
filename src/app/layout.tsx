import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Oles Didukh - Senior Front-End Engineer',
  description:
    'Portfolio of Oles Didukh, a Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
  metadataBase: new URL('https://olesdidukh.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://olesdidukh.dev',
    siteName: 'Oles Didukh - Portfolio',
    title: 'Oles Didukh - Senior Front-End Engineer',
    description:
      'Portfolio of Oles Didukh, a Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oles Didukh - Senior Front-End Engineer',
    description:
      'Portfolio of Oles Didukh, a Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Oles Didukh',
    alternateName: 'Oles',
    jobTitle: 'Senior Front-End Engineer',
    description:
      'Senior Front-End Engineer specializing in React, TypeScript, and Next.js with 7+ years of experience building high-performance web applications.',
    url: 'https://olesdidukh.dev',
    image: 'https://olesdidukh.dev/og-image.png',
    email: 'oles.didukh@gmail.com',
    sameAs: [
      'https://github.com/odidukh',
      'https://linkedin.com/in/oles-didukh',
    ],
    knowsAbout: [
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'Front-End Development',
      'Web Performance',
      'UI/UX Design',
      'Web Accessibility',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Providers />
      </body>
    </html>
  );
}
