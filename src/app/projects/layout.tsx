import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Oles Didukh - Portfolio',
  description:
    'Explore my portfolio of web development projects. From React applications to full-stack solutions, see real-world examples of modern front-end engineering.',
  openGraph: {
    title: 'Projects | Oles Didukh',
    description:
      'Portfolio of web development projects showcasing React, TypeScript, Next.js, and modern front-end technologies.',
    url: 'https://olesdidukh.dev/projects',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Projects&subtitle=Portfolio&description=Web%20development%20projects%20and%20case%20studies',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Oles Didukh',
    description:
      'Portfolio of web development projects showcasing React, TypeScript, and modern front-end technologies.',
    images: ['/api/og?title=Projects&subtitle=Portfolio'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/projects',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
