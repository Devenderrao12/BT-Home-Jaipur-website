import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { safeNext } from '@/lib/authClient';

// Runs only on /admin, /account and the auth pages (see src/middleware.ts matcher).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => request.cookies.get(name)?.value,
      set: (name: string, value: string, options: any) => { response.cookies.set({ name, value, ...options }); },
      remove: (name: string, options: any) => { response.cookies.set({ name, value: '', ...options }); },
    },
  });

  // getUser() re-validates the token with Supabase and refreshes it if needed
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname, searchParams } = request.nextUrl;

  const redirect = (to: string) => {
    const r = NextResponse.redirect(new URL(to, request.url));
    response.cookies.getAll().forEach((c) => r.cookies.set(c)); // keep refreshed session cookies
    return r;
  };
  const isAdmin = async () => {
    if (!user) return false;
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    return data?.role === 'admin';
  };

  // ---- Admin area: must be a signed-in user whose profile role is 'admin' ----
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return (await isAdmin()) ? redirect('/admin') : response;
    if (!user) return redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
    if (!(await isAdmin())) return redirect('/admin/login?error=forbidden');
    return response;
  }

  // ---- Customer area ----
  if (pathname.startsWith('/account')) {
    if (!user) return redirect(`/login?next=${encodeURIComponent(pathname)}`);
    return response;
  }

  // ---- Already signed in? skip the login/signup screens ----
  if (user && ['/login', '/signup', '/forgot-password'].includes(pathname)) {
    return redirect(safeNext(searchParams.get('next')));
  }
  return response;
}
