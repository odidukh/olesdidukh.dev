'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { Trash2 } from 'lucide-react';

interface DeleteExperienceButtonProps {
  experienceId: string;
  company: string;
}

export function DeleteExperienceButton({
  experienceId,
  company,
}: DeleteExperienceButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);

      if (error) {
        captureException(error, {
          component: 'DeleteExperienceButton',
          action: 'delete_experience',
          experienceId,
        });
        alert('Failed to delete experience');
        return;
      }

      router.refresh();
    } catch (error) {
      captureException(error, {
        component: 'DeleteExperienceButton',
        action: 'delete_experience',
        experienceId,
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
          title="Delete Experience"
          description="This action cannot be undone"
          itemName={company}
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
