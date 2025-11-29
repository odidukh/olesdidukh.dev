import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status | Oles Didukh',
  description:
    'Real-time system status, performance metrics, and service health for olesdidukh.dev portfolio website.',
  openGraph: {
    title: 'System Status | Oles Didukh',
    description:
      'Real-time system status, performance metrics, and service health for olesdidukh.dev portfolio website.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
