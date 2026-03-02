import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience | Oles Didukh - Professional Journey',
  description:
    'Explore my 8+ years of professional experience as a Front-End Engineer. From startups to enterprise solutions, see my career progression and achievements.',
  openGraph: {
    title: 'Experience | Oles Didukh',
    description:
      '8+ years of professional front-end development experience. Career timeline, achievements, and technical expertise.',
    url: 'https://olesdidukh.dev/experience',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Experience&subtitle=Professional%20Journey&description=8%2B%20years%20of%20front-end%20development',
        width: 1200,
        height: 630,
        alt: 'Oles Didukh Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experience | Oles Didukh',
    description:
      '8+ years of professional front-end development experience and career achievements.',
    images: ['/api/og?title=Experience&subtitle=Professional%20Journey'],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/experience',
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
