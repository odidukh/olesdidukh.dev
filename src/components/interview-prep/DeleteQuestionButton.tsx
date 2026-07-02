'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { deleteCustomQuestion } from '@/app/interview-prep/actions';

export interface DeleteQuestionButtonProps {
  id: string;
}

export function DeleteQuestionButton({ id }: DeleteQuestionButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    const result = await deleteCustomQuestion(id);
    setLoading(false);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Question deleted');
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Delete question"
        onClick={() => setOpen(true)}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:text-error"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {open && (
        <DeleteConfirmDialog
          title="Delete question"
          description="This removes the custom question."
          itemName="this custom question"
          loading={loading}
          onConfirm={confirm}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
