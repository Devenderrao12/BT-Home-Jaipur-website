import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Narrow matcher: public pages stay static & fast (no middleware work on them)
export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login', '/signup', '/forgot-password'],
};
