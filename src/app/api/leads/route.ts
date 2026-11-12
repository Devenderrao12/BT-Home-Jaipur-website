import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const PHONE = /^(\+91|91|0)?[ -]?[6-9]\d{4}[ -]?\d{5}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cut = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (b.website) return NextResponse.json({ success: true }); // honeypot tripped: pretend success

    const name = cut(b.name, 80), phone = cut(b.phone, 20), email = cut(b.email, 120);
    if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    if (!PHONE.test(phone)) return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    if (email && !EMAIL.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

    const { data: { user } } = await createClient().auth.getUser(); // null for guests
    const { error } = await createAdminClient().from('leads').insert({
      user_id: user?.id ?? null,
      property_id: cut(b.property_id, 64) || null,
      name, phone, email: email || null,
      message: cut(b.message, 1000) || null,
      preferred_date: /^\d{4}-\d{2}-\d{2}$/.test(b.preferred_date || '') ? b.preferred_date : null,
      preferred_time: cut(b.preferred_time, 10) || null,
      source: cut(b.source, 30) || 'website',
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('lead error:', err?.message);
    return NextResponse.json({ error: 'We could not save your request. Please call or WhatsApp us.' }, { status: 500 });
  }
}
