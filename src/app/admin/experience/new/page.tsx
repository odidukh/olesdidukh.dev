import { ExperienceForm } from '../components/ExperienceForm';

export const metadata = {
  title: 'Add Experience | Admin Dashboard',
};

export default function NewExperiencePage() {
  return <ExperienceForm mode="create" />;
}
