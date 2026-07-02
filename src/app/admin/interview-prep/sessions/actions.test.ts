import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, updateSession, deleteSession } from './actions';
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
  slug: 'houston-round-2',
  company: 'Houston',
  role: 'Senior FE',
  round: 'Round 2',
  scheduled_at: null,
  status: 'upcoming' as const,
  product: null,
  interviewers: [{ name: 'Harry', role: 'Founder', focus: 'depth' }],
  likely_topics: [{ topic: 'Charts', whereToDrill: 'Technical' }],
  your_numbers: [{ label: 'LCP', value: '1.5s' }],
  bottom_line: null,
  stack_map: [{ theirTech: 'React', yourStanding: 'Expert' }],
  focus_category_ids: [] as string[],
};

beforeEach(() => vi.clearAllMocks());

describe('createSession', () => {
  it('errors when unauthorized', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      error: 'Not authenticated',
      supabase: null,
      user: null,
    } as unknown as AuthResult);
    expect(await createSession(valid)).toEqual({
      error: 'Not authenticated',
    });
  });
  it('rejects invalid input before the database', async () => {
    const sb = makeSupabase();
    authOk(sb);
    const r = await createSession({ ...valid, company: '' });
    expect('error' in r).toBe(true);
    expect(sb.from).not.toHaveBeenCalled();
  });
  it('inserts and revalidates both paths', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await createSession(valid)).toEqual({ success: true });
    expect(sb.from).toHaveBeenCalledWith('interview_sessions');
    expect(revalidatePath).toHaveBeenCalledWith(
      '/admin/interview-prep/sessions'
    );
    expect(revalidatePath).toHaveBeenCalledWith('/interview-prep', 'layout');
  });
});

describe('updateSession', () => {
  it('updates by id', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await updateSession('s1', valid)).toEqual({ success: true });
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 's1');
  });
});

describe('deleteSession', () => {
  it('deletes by id without validation', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await deleteSession('s1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 's1');
  });
});
