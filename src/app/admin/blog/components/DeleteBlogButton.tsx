'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import { Trash2 } from 'lucide-react';

interface DeleteBlogButtonProps {
  postId: string;
  postTitle: string;
}

export function DeleteBlogButton({ postId, postTitle }: DeleteBlogButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        captureException(error, {
          component: 'DeleteBlogButton',
          action: 'delete_post',
          postId,
        });
        alert('Failed to delete post');
        return;
      }

      router.refresh();
    } catch (error) {
      captureException(error, {
        component: 'DeleteBlogButton',
        action: 'delete_post',
        postId,
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
          title="Delete Blog Post"
          description="This action cannot be undone"
          itemName={postTitle}
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
