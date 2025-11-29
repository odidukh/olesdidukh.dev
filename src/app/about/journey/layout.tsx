import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Journey | Oles Didukh - Career Story',
  description:
    'From curious beginner to Senior Front-End Engineer. Explore the milestones, learnings, and achievements that shaped my 7+ year career in web development.',
  openGraph: {
    title: 'My Journey | Oles Didukh',
    description:
      'Career story and professional growth. Milestones, achievements, and continuous learning path in web development.',
    url: 'https://olesdidukh.dev/about/journey',
    type: 'website',
    images: [
      {
        url: '/api/og?title=My%20Journey&subtitle=Career%20Story&description=From%20beginner%20to%20Senior%20Engineer',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh Journey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Journey | Oles Didukh',
    description:
      'Career story from beginner to Senior Front-End Engineer. Milestones and achievements.',
    images: ['/api/og?title=My%20Journey&subtitle=Career%20Story'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/about/journey',
  },
};

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
