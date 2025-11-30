import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies | Oles Didukh',
  description:
    'Explore detailed case studies of my most impactful web development projects. Learn about challenges faced, solutions implemented, and measurable results achieved.',
  openGraph: {
    title: 'Case Studies | Oles Didukh',
    description:
      'Explore detailed case studies showcasing real projects with real results.',
    url: 'https://olesdidukh.dev/case-studies',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Case%20Studies&subtitle=Real%20Projects%2C%20Real%20Results&description=Explore%20my%20most%20impactful%20projects',
        width: 1200,
        height: 630,
        alt: 'Case Studies - Oles Didukh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies | Oles Didukh',
    description:
      'Explore detailed case studies of impactful web development projects.',
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/case-studies',
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
