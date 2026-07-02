import { notFound } from 'next/navigation';
import { getSessionBySlug } from '@/lib/interview-prep/data';
import { BriefingView } from '@/components/interview-prep/BriefingView';

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);
  if (!session) notFound();
  return <BriefingView session={session} />;
}
