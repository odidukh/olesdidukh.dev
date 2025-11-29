import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Philosophy | Oles Didukh - Development Principles',
  description:
    'My development philosophy and core principles. Performance-first approach, clean architecture, user-centric design, and continuous learning guide every line of code.',
  openGraph: {
    title: 'Philosophy | Oles Didukh',
    description:
      'Development philosophy and core principles. Performance, clean code, accessibility, and continuous improvement.',
    url: 'https://olesdidukh.dev/about/philosophy',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Philosophy&subtitle=Development%20Principles&description=Core%20beliefs%20that%20guide%20my%20code',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh Philosophy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philosophy | Oles Didukh',
    description:
      'Development philosophy and core principles guiding my approach to software engineering.',
    images: ['/api/og?title=Philosophy&subtitle=Development%20Principles'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/about/philosophy',
  },
};

export default function PhilosophyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
