'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { Trash2 } from 'lucide-react';

interface DeleteSkillButtonProps {
  skillId: string;
  skillName: string;
}

export function DeleteSkillButton({
  skillId,
  skillName,
}: DeleteSkillButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) {
        captureException(error, {
          component: 'DeleteSkillButton',
          action: 'delete_skill',
          skillId,
        });
        alert('Failed to delete skill');
        return;
      }

      router.refresh();
    } catch (error) {
      captureException(error, {
        component: 'DeleteSkillButton',
        action: 'delete_skill',
        skillId,
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
          title="Delete Skill"
          description="This action cannot be undone"
          itemName={skillName}
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
