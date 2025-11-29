import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills | Oles Didukh - Technical Expertise',
  description:
    'A comprehensive overview of my technical skills including React, TypeScript, Next.js, and modern web development technologies. From frontend to full-stack capabilities.',
  openGraph: {
    title: 'Skills | Oles Didukh',
    description:
      'Technical expertise in React, TypeScript, Next.js, and modern web development. Frontend, backend, and DevOps skills.',
    url: 'https://olesdidukh.dev/skills',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Skills&subtitle=Technical%20Expertise&description=React%2C%20TypeScript%2C%20Next.js%20and%20more',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh Skills',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills | Oles Didukh',
    description:
      'Technical expertise in React, TypeScript, Next.js, and modern web development technologies.',
    images: ['/api/og?title=Skills&subtitle=Technical%20Expertise'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/skills',
  },
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
