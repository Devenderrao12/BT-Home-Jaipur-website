import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// POST { ids: [...] } → merge this device's wishlist into the account, return the merged list
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ids } = await req.json().catch(() => ({ ids: [] }));
  const wanted: string[] = (Array.isArray(ids) ? ids : []).filter((x: any) => typeof x === 'string' && UUID.test(x)).slice(0, 100);
  if (wanted.length) {
    const { data: valid } = await supabase.from('properties').select('id').in('id', wanted); // ignore stale ids
    const rows = (valid || []).map((p: any) => ({ user_id: user.id, property_id: p.id }));
    if (rows.length) await supabase.from('favorites').upsert(rows, { onConflict: 'user_id,property_id', ignoreDuplicates: true });
  }
  const { data } = await supabase.from('favorites').select('property_id').eq('user_id', user.id);
  return NextResponse.json({ ids: (data || []).map((r: any) => r.property_id) });
}
