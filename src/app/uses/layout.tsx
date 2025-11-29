import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses & Stack | Oles Didukh',
  description:
    'A comprehensive look at the tools, technologies, and services Oles Didukh uses for software development. Hardware, development environment, VS Code extensions, and more.',
  openGraph: {
    title: 'Uses & Stack | Oles Didukh',
    description:
      'Discover the tools and technologies I use for software development.',
    url: 'https://olesdidukh.dev/uses',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Uses%20%26%20Stack&subtitle=Developer%20Setup&type=default',
        width: 1200,
        height: 630,
        alt: 'Uses & Stack - Oles Didukh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uses & Stack | Oles Didukh',
    description: 'Tools and technologies for software development.',
    images: ['/api/og?title=Uses%20%26%20Stack&subtitle=Developer%20Setup'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/uses',
  },
};

export default function UsesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
