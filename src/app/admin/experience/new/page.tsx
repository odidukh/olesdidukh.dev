import { ExperienceForm } from '@/app/admin/experience/components/ExperienceForm';

export const metadata = {
  title: 'Add Experience | Admin Dashboard',
};

export default function NewExperiencePage() {
  return <ExperienceForm mode="create" />;
}
