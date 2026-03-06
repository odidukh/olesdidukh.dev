'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { Trash2 } from 'lucide-react';

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        captureException(error, {
          component: 'DeleteProjectButton',
          action: 'delete_project',
          projectId,
        });
        alert('Failed to delete project');
        return;
      }

      router.refresh();
    } catch (error) {
      captureException(error, {
        component: 'DeleteProjectButton',
        action: 'delete_project',
        projectId,
      });
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <DeleteConfirmDialog
          title="Delete Project"
          description="This action cannot be undone"
          itemName={projectTitle}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 rounded-lg hover:bg-error/10 transition-colors text-muted-foreground hover:text-error"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
