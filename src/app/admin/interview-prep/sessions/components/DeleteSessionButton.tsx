'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { deleteSession } from '@/app/admin/interview-prep/sessions/actions';
import { Trash2 } from 'lucide-react';

interface DeleteSessionButtonProps {
  sessionId: string;
  sessionLabel: string;
}

export function DeleteSessionButton({
  sessionId,
  sessionLabel,
}: DeleteSessionButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteSession(sessionId);

    if ('error' in result) {
      alert(result.error);
    } else {
      router.refresh();
    }

    setLoading(false);
    setShowConfirm(false);
  };

  return (
    <>
      {showConfirm && (
        <DeleteConfirmDialog
          title="Delete Session"
          description="Deleting a session also removes all saved progress for it."
          itemName={sessionLabel}
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
