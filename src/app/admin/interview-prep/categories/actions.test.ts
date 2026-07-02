import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCategory, updateCategory, deleteCategory } from './actions';
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
  name: 'Behavioral',
  slug: 'behavioral',
  weight: 1,
  sort_order: 0,
};

beforeEach(() => vi.clearAllMocks());

describe('createCategory', () => {
  it('errors when unauthorized', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      error: 'Not authenticated',
      supabase: null,
      user: null,
    } as unknown as AuthResult);
    expect(await createCategory(valid)).toEqual({ error: 'Not authenticated' });
  });
  it('rejects invalid input before the database', async () => {
    const sb = makeSupabase();
    authOk(sb);
    const r = await createCategory({ ...valid, name: '' });
    expect('error' in r).toBe(true);
    expect(sb.from).not.toHaveBeenCalled();
  });
  it('inserts and revalidates both paths', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await createCategory(valid)).toEqual({ success: true });
    expect(sb.from).toHaveBeenCalledWith('interview_categories');
    expect(revalidatePath).toHaveBeenCalledWith(
      '/admin/interview-prep/categories'
    );
    expect(revalidatePath).toHaveBeenCalledWith('/interview-prep', 'layout');
  });
});

describe('updateCategory', () => {
  it('updates by id', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await updateCategory('c1', valid)).toEqual({ success: true });
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 'c1');
  });
});

describe('deleteCategory', () => {
  it('deletes by id without validation', async () => {
    const sb = makeSupabase();
    authOk(sb);
    expect(await deleteCategory('c1')).toEqual({ success: true });
    expect(sb.builder.delete).toHaveBeenCalled();
    expect(sb.builder.eq).toHaveBeenCalledWith('id', 'c1');
  });
});
