'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import {
  customQuestionSchema,
  type CustomQuestionInput,
} from '@/app/interview-prep/schema';
import { addCustomQuestion } from '@/app/interview-prep/actions';
import type { InterviewCategory } from '@/lib/supabase/types';

export interface AddQuestionModalProps {
  categories: InterviewCategory[];
}

const SELECT_CLASS =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm';

export function AddQuestionModal({ categories }: AddQuestionModalProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomQuestionInput>({
    resolver: zodResolver(customQuestionSchema),
    defaultValues: {
      question: '',
      model_answer: null,
      category_id: null,
      difficulty: 'medium',
    },
  });

  const onSubmit = handleSubmit(async values => {
    const result = await addCustomQuestion(values);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Question added');
    reset();
    setOpen(false);
  });

  const emptyToNull = (value: string) => (value === '' ? null : value);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add custom question
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(32rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              Add question
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="question" required>
                Question
              </Label>
              <Textarea
                id="question"
                {...register('question')}
                error={!!errors.question}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="model_answer">Model answer</Label>
              <Textarea
                id="model_answer"
                {...register('model_answer', { setValueAs: emptyToNull })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  className={SELECT_CLASS}
                  {...register('category_id', { setValueAs: emptyToNull })}
                >
                  <option value="">General</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className={SELECT_CLASS}
                  {...register('difficulty')}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" variant="gradient" loading={isSubmitting}>
                Add question
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
