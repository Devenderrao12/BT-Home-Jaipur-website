import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/authClient';

const go = (path: string) => new Response(null, { status: 303, headers: { Location: path } });

// Landing point for email-confirmation and password-reset links
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const next = safeNext(req.nextUrl.searchParams.get('next'));
  if (code) {
    const { error } = await createClient().auth.exchangeCodeForSession(code);
    if (!error) return go(next);
  }
  return go('/login?error=link');
}
