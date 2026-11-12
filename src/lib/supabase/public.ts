// Cookie-free, read-only Supabase client for PUBLIC pages. Because it never touches cookies(),
// pages that use it can be statically generated / ISR-cached instead of rendered per request.
import { createClient } from '@supabase/supabase-js';

export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }) },
  });
}
