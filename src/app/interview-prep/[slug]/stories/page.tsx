import { getStories } from '@/lib/interview-prep/data';
import { StoriesView } from '@/components/interview-prep/StoriesView';

export default async function StoriesPage() {
  const stories = await getStories();
  return <StoriesView stories={stories} />;
}
