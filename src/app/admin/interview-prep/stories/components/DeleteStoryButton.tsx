'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { deleteStory } from '@/app/admin/interview-prep/stories/actions';
import { Trash2 } from 'lucide-react';

interface DeleteStoryButtonProps {
  storyId: string;
  storyTitle: string;
}

export function DeleteStoryButton({
  storyId,
  storyTitle,
}: DeleteStoryButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteStory(storyId);

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
          title="Delete Story"
          description="This action cannot be undone."
          itemName={storyTitle}
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
