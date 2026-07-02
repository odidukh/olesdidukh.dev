import { getCategories, getQuestions } from '@/lib/interview-prep/data';
import { DashboardView } from '@/components/interview-prep/DashboardView';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, questions] = await Promise.all([
    getCategories(),
    getQuestions(),
  ]);
  return (
    <DashboardView categories={categories} questions={questions} slug={slug} />
  );
}
