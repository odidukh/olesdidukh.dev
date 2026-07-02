import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addCustomQuestion,
  deleteCustomQuestion,
  resetSessionProgress,
} from './actions';
import { requireAdmin } from '@/app/admin/lib/auth';
import { revalidatePath } from 'next/cache';

vi.mock('@/app/admin/lib/auth', () => ({ requireAdmin: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

interface FakeOpts {
  insertError?: unknown;
  deleteError?: unknown;
  selectError?: unknown;
  selectData?: { is_custom: boolean } | null;
}

function makeSupabase(opts: FakeOpts = {}) {
  const builder = {
    insert: vi.fn<(rows: unknown[]) => Promise<{ error: unknown }>>(() =>
      Promise.resolve({ error: opts.insertError ?? null })
    ),
    select: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    maybeSingle: vi.fn(() =>
      Promise.resolve({
        data: opts.selectData ?? null,
        error: opts.selectError ?? null,
      })
    ),
    then: (resolve: (value: { error: unknown }) => void) =>
      resolve({ error: opts.deleteError ?? null }),
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

const validInput = {
  question: 'What is hydration?',
  model_answer: null,
  category_id: null,
  difficulty: 'medium',
} as const;

beforeEach(() => vi.clearAllMocks());

describe('addCustomQuestion', () => {
  it('returns an error when not authorized', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      error: 'Not authorized',
      supabase: null,
      user: null,
    } as unknown as AuthResult);
    expect(await addCustomQuestion(validInput)).toEqual({
      error: 'Not authorized',
    });
  });

  it('rejects invalid input before touching the database', async () => {
    const sb = makeSupabase();
    authOk(sb);
    const result = await addCustomQuestion({ ...validInput, question: '' });
    expect('error' in result).toBe(true);
    expect(sb.from).not.toHaveBeenCalled();
  });

  it('inserts a custom question and revalidates', async () => {
    const sb = makeSupabase();
    authOk(sb);
    const result = await addCustomQuestion(validInput);
    expect(sb.from).toHaveBeenCalledWith('interview_questions');
    const inserted = sb.builder.insert.mock.calls[0]?.[0]?.[0];
    expect(inserted).toMatchObject({
      is_custom: true,
      source: 'custom',
      question: 'What is hydration?',
    });
    expect(revalidatePath).toHaveBeenCalledWith('/interview-prep', 'layout');
    expect(result).toEqual({ success: true });
  });
});

describe('deleteCustomQuestion', () => {
  it('refuses to delete a non-custom question', async () => {
    const sb = makeSupabase({ selectData: { is_custom: false } });
    authOk(sb);
    expect(await deleteCustomQuestion('q1')).toEqual({
      error: 'Only custom questions can be deleted',
    });
    expect(sb.builder.delete).not.toHaveBeenCalled();
  });

  it('deletes a custom question', async () => {
    const sb = makeSupabase({ selectData: { is_custom: true } });
    authOk(sb);
    expect(await deleteCustomQuestion('q1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
  });
});

describe('resetSessionProgress', () => {
  it('clears progress rows for the session', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await resetSessionProgress('s1')).toEqual({ success: true });
    expect(sb.from).toHaveBeenCalledWith('interview_progress');
    expect(sb.builder.eq).toHaveBeenCalledWith('session_id', 's1');
  });
});
