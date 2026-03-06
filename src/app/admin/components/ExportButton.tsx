'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Check, Loader2, AlertCircle } from 'lucide-react';

interface ExportButtonProps {
  type: 'blog' | 'projects' | 'experience' | 'skills' | 'all';
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ExportButton({
  type,
  label,
  variant = 'outline',
}: ExportButtonProps) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Export failed');
        return;
      }

      setStatus('success');
      setMessage(`${data.filesWritten.length} file(s) exported`);

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch {
      setStatus('error');
      setMessage('Export failed');
    }
  };

  const icon = {
    idle: <Download className="w-4 h-4 mr-2" />,
    loading: <Loader2 className="w-4 h-4 mr-2 animate-spin" />,
    success: <Check className="w-4 h-4 mr-2" />,
    error: <AlertCircle className="w-4 h-4 mr-2" />,
  }[status];

  const buttonLabel = {
    idle: label || `Export ${type === 'all' ? 'All' : type}`,
    loading: 'Exporting...',
    success: message,
    error: message,
  }[status];

  return (
    <Button
      variant={
        status === 'error'
          ? 'destructive'
          : status === 'success'
            ? 'default'
            : variant
      }
      onClick={handleExport}
      disabled={status === 'loading'}
    >
      {icon}
      {buttonLabel}
    </Button>
  );
}
