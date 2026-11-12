import { NextRequest, NextResponse } from 'next/server';
import { adminOrResponse } from '@/lib/auth';

const ALLOWED = /^(image\/(jpeg|png|webp|avif|gif)|video\/(mp4|webm|quicktime))$/;
const MAX_BYTES = 50 * 1024 * 1024;

// Admin-only: uploads images/videos to the "property-media" bucket
export async function POST(req: NextRequest) {
  const auth = await adminOrResponse();
  if ('error' in auth) return auth.error;

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const propertyId = String(form.get('propertyId') || 'misc').replace(/[^\w-]/g, '').slice(0, 64) || 'misc';
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED.test(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WebP, AVIF, GIF, MP4 or WebM files are allowed' }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File is too large (max 50 MB)' }, { status: 413 });

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5);
  const path = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await auth.supabase.storage.from('property-media').upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: auth.supabase.storage.from('property-media').getPublicUrl(path).data.publicUrl, path });
}
