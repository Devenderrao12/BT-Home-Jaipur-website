// Server-side auth guards. Every protected page/route calls one of these — authorization is
// enforced on the server AND by database RLS, never by hiding links.
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface Profile { id: string; full_name: string | null; phone: string | null; role: 'customer' | 'admin' }

export async function getUserAndProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser(); // validates the JWT with Supabase (not just the cookie)
  if (!user) return { supabase, user: null, profile: null as Profile | null };
  const { data } = await supabase.from('profiles').select('id, full_name, phone, role').eq('id', user.id).maybeSingle();
  return { supabase, user, profile: (data as Profile | null) };
}

export async function requireUser(next = '/account') {
  const r = await getUserAndProfile();
  if (!r.user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return r as typeof r & { user: NonNullable<typeof r.user> };
}

export async function requireAdmin() {
  const r = await getUserAndProfile();
  if (!r.user) redirect('/admin/login');
  if (r.profile?.role !== 'admin') redirect('/admin/login?error=forbidden');
  return r as typeof r & { user: NonNullable<typeof r.user> };
}

/** For API routes: returns the admin user, or a Response to return immediately. */
export async function adminOrResponse() {
  const r = await getUserAndProfile();
  if (!r.user) return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) } as const;
  if (r.profile?.role !== 'admin') return { error: Response.json({ error: 'Forbidden' }, { status: 403 }) } as const;
  return { user: r.user, supabase: r.supabase } as const;
}
