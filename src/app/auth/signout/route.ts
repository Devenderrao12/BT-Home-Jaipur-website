import { createClient } from '@/lib/supabase/server';

// POST only (a GET link could be triggered by third-party pages to log users out).
// Relative Location => always lands on the host the visitor is actually using.
export async function POST() {
  await createClient().auth.signOut();
  return new Response(null, { status: 303, headers: { Location: '/' } });
}
