'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function DeleteConfirmDialog({
  title,
  description,
  itemName,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-foreground">{itemName}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
