import { NextRequest, NextResponse } from 'next/server';
import { adminOrResponse } from '@/lib/auth';
import { getProperties } from '@/lib/data/properties';
import { slugify } from '@/lib/utils';

// GET /api/properties?ids=a,b,c — public; used by Wishlist & Compare (fetches only what's needed)
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('ids');
  const ids = raw ? raw.split(',').map((s) => s.trim()).filter((s) => /^[0-9a-f-]{36}$/i.test(s)).slice(0, 24) : undefined;
  if (raw && !ids?.length) return NextResponse.json({ properties: [] });
  const properties = await getProperties({ ids, limit: ids ? undefined : 60 });
  return NextResponse.json({ properties }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}

// POST /api/properties — ADMIN only: create a property
export async function POST(req: NextRequest) {
  const auth = await adminOrResponse();
  if ('error' in auth) return auth.error;
  const body = await req.json();
  const slug = body.slug || slugify(body.title);
  const { data, error } = await auth.supabase.from('properties').insert({ ...body, slug, created_by: auth.user.id }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ property: data });
}
