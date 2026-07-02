'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { resetSessionProgress } from '@/app/interview-prep/actions';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';

export interface ResetProgressButtonProps {
  sessionId: string;
}

export function ResetProgressButton({ sessionId }: ResetProgressButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const resetAll = useInterviewProgressStore(s => s.resetAll);

  const confirm = async () => {
    setLoading(true);
    const result = await resetSessionProgress(sessionId);
    setLoading(false);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    resetAll();
    toast.success('Progress reset');
    setOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <RotateCcw className="mr-1 h-4 w-4" /> Reset progress
      </Button>
      {open && (
        <DeleteConfirmDialog
          title="Reset progress"
          description="This clears every rating and star for this session."
          itemName="all progress for this session"
          loading={loading}
          onConfirm={confirm}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
