import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function who() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// GET → the logged-in customer's saved property ids
export async function GET() {
  const { supabase, user } = await who();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data } = await supabase.from('favorites').select('property_id').eq('user_id', user.id);
  return NextResponse.json({ ids: (data || []).map((r: any) => r.property_id) });
}

// POST { property_id } → save   |   DELETE { property_id } → remove   (RLS limits rows to the user)
export async function POST(req: NextRequest) {
  const { supabase, user } = await who();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { property_id } = await req.json().catch(() => ({}));
  if (!UUID.test(property_id || '')) return NextResponse.json({ error: 'Invalid property' }, { status: 400 });
  const { error } = await supabase.from('favorites').upsert({ user_id: user.id, property_id }, { onConflict: 'user_id,property_id', ignoreDuplicates: true });
  return error ? NextResponse.json({ error: 'Could not save' }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { supabase, user } = await who();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { property_id } = await req.json().catch(() => ({}));
  if (!UUID.test(property_id || '')) return NextResponse.json({ error: 'Invalid property' }, { status: 400 });
  await supabase.from('favorites').delete().eq('user_id', user.id).eq('property_id', property_id);
  return NextResponse.json({ ok: true });
}
