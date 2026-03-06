import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' as const, supabase: null, user: null };
  }

  const adminEmail = env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) {
    return { error: 'Not authorized' as const, supabase: null, user: null };
  }

  return { error: null, supabase, user };
}
