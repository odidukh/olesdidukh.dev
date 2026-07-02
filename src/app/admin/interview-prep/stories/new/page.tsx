import { StoryForm } from '@/app/admin/interview-prep/stories/components/StoryForm';

export const metadata = {
  title: 'New Story | Admin Dashboard',
};

export default function NewStoryPage() {
  return <StoryForm mode="create" />;
}
