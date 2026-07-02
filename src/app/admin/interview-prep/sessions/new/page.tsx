import { getCategories } from '@/lib/interview-prep/data';
import { SessionForm } from '@/app/admin/interview-prep/sessions/components/SessionForm';

export const metadata = {
  title: 'New Session | Admin Dashboard',
};

export default async function NewSessionPage() {
  const categories = await getCategories();

  return <SessionForm mode="create" categories={categories} />;
}
