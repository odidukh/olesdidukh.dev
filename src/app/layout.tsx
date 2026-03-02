import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { SkipLink } from '@/components/ui/SkipLink';
import { JsonLd } from '@/components/JsonLd';
import { ContentProtection } from '@/components/ContentProtection';
import { getNonce } from '@/lib/nonce';
import './globals.css';

/**
 * Font Configuration
 *
 * Using next/font for optimal font loading:
 * - Automatic font-display: swap for FOUT prevention
 * - Self-hosted fonts (no external requests to Google Fonts)
 * - Automatic CSS size-adjust for reduced CLS
 * - Preloading of font files
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true, // Preload font files
  adjustFontFallback: true, // Reduce CLS with size-adjusted fallback
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Oles Didukh - Senior Front-End Engineer',
  description:
    'Portfolio of Oles Didukh, a Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
  metadataBase: new URL('https://olesdidukh.dev'),
  alternates: {
    canonical: 'https://olesdidukh.dev',
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'Oles Didukh - Blog RSS Feed' },
      ],
      'application/atom+xml': [
        { url: '/atom.xml', title: 'Oles Didukh - Blog Atom Feed' },
      ],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://olesdidukh.dev',
    siteName: 'Oles Didukh - Portfolio',
    title: 'Oles Didukh - Senior Front-End Engineer',
    description:
      'Portfolio of Oles Didukh, a Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
    images: [
      {
        url: '/api/og?title=Oles%20Didukh&subtitle=Senior%20Front-End%20Engineer',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh - Senior Front-End Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oles Didukh - Senior Front-End Engineer',
    description:
      'Portfolio of Oles Didukh, a Senior Front-End Engineer specializing in React, TypeScript, and Next.js.',
    images: [
      '/api/og?title=Oles%20Didukh&subtitle=Senior%20Front-End%20Engineer',
    ],
  },
};

/**
 * Resource hints for performance optimization
 * - preconnect: Establish early connections to important third-party origins
 * - dns-prefetch: Resolve DNS for external domains ahead of time
 */
const resourceHints = {
  // High-priority connections (preconnect)
  preconnect: [
    'https://va.vercel-scripts.com', // Vercel Analytics
    'https://www.googletagmanager.com', // Google Analytics (if configured)
    'https://www.clarity.ms', // Microsoft Clarity (if configured)
  ],
  // Lower-priority DNS resolution (dns-prefetch)
  dnsPrefetch: [
    'https://api.buttondown.email', // Newsletter API
    'https://o4504644030119936.ingest.us.sentry.io', // Sentry (example, update with actual DSN)
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getNonce();

  // JSON-LD structured data for SEO
  // Note: Email is intentionally omitted to prevent scraping
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://olesdidukh.dev/#person',
    name: 'Oles Didukh',
    alternateName: 'Oles',
    jobTitle: 'Senior Front-End Engineer',
    description:
      'Senior Front-End Engineer specializing in React, TypeScript, and Next.js with 8+ years of experience building high-performance web applications.',
    url: 'https://olesdidukh.dev',
    image: 'https://olesdidukh.dev/og-image.png',
    sameAs: [
      'https://github.com/odidukh',
      'https://linkedin.com/in/oles-didukh',
      'https://www.threads.com/@oles.o.didukh',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource Hints - Preconnect for high-priority third-party origins */}
        {resourceHints.preconnect.map(url => (
          <link key={url} rel="preconnect" href={url} crossOrigin="anonymous" />
        ))}
        {/* Resource Hints - DNS Prefetch for lower-priority domains */}
        {resourceHints.dnsPrefetch.map(url => (
          <link key={url} rel="dns-prefetch" href={url} />
        ))}
        {/* Structured Data */}
        <JsonLd data={jsonLd} nonce={nonce} />
        {/* Theme initialization script - prevents flash of wrong theme */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-storage');
                  var mode = stored ? JSON.parse(stored).state.mode : 'system';
                  var isDark = mode === 'dark' ||
                    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContentProtection />
        <SkipLink />
        {children}
        <Providers />
      </body>
    </html>
  );
}
