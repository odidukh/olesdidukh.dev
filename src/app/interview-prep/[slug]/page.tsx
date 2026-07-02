import { redirect } from 'next/navigation';

export default async function SessionIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/interview-prep/${slug}/briefing`);
}
