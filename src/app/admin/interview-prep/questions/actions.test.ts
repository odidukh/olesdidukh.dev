import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQuestion, updateQuestion, deleteQuestion } from './actions';
import { requireAdmin } from '@/app/admin/lib/auth';
import { revalidatePath } from 'next/cache';

vi.mock('@/app/admin/lib/auth', () => ({ requireAdmin: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

function makeSupabase(
  opts: {
    insertError?: unknown;
    deleteError?: unknown;
    updateError?: unknown;
  } = {}
) {
  const builder = {
    insert: vi.fn<(rows: unknown[]) => Promise<{ error: unknown }>>(() =>
      Promise.resolve({ error: opts.insertError ?? null })
    ),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    then: (resolve: (v: { error: unknown }) => void) =>
      resolve({ error: opts.deleteError ?? opts.updateError ?? null }),
  };
  return { from: vi.fn(() => builder), builder };
}

type AuthResult = Awaited<ReturnType<typeof requireAdmin>>;
function authOk(sb: ReturnType<typeof makeSupabase>) {
  vi.mocked(requireAdmin).mockResolvedValue({
    error: null,
    supabase: sb,
    user: { email: 'a' },
  } as unknown as AuthResult);
}

const valid = {
  question: 'Tell me about yourself.',
  model_answer: null,
  category_id: null,
  story_id: null,
  difficulty: 'medium' as const,
  time_estimate_sec: null,
  tags: [],
  tips: [{ point: 'Keep it 60-90s', detail: null }],
  is_custom: false,
  source: null,
};

beforeEach(() => vi.clearAllMocks());

describe('createQuestion', () => {
  it('errors when unauthorized', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      error: 'Not authenticated',
      supabase: null,
      user: null,
    } as unknown as AuthResult);
    expect(await createQuestion(valid)).toEqual({
      error: 'Not authenticated',
    });
  });
  it('rejects invalid input before the database', async () => {
    const sb = makeSupabase();
    authOk(sb);
    const r = await createQuestion({ ...valid, question: '' });
    expect('error' in r).toBe(true);
    expect(sb.from).not.toHaveBeenCalled();
  });
  it('inserts and revalidates both paths', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await createQuestion(valid)).toEqual({ success: true });
    expect(sb.from).toHaveBeenCalledWith('interview_questions');
    expect(revalidatePath).toHaveBeenCalledWith(
      '/admin/interview-prep/questions'
    );
    expect(revalidatePath).toHaveBeenCalledWith('/interview-prep', 'layout');
  });
});

describe('updateQuestion', () => {
  it('updates by id', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await updateQuestion('q1', valid)).toEqual({ success: true });
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 'q1');
  });
});

describe('deleteQuestion', () => {
  it('deletes by id without validation', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await deleteQuestion('q1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 'q1');
  });

  it('deletes any question with no is_custom guard', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await deleteQuestion('q1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
    // no select() guard call — admin delete is unrestricted
    expect(
      (sb.builder as unknown as Record<string, unknown>)['select']
    ).toBeUndefined();
  });
});
