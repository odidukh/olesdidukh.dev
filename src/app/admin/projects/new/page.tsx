import { ProjectForm } from '../components/ProjectForm';

export const metadata = {
  title: 'New Project | Admin Dashboard',
};

export default function NewProjectPage() {
  return <ProjectForm mode="create" />;
}
