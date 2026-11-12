import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, LogOut } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import ProfileForm from '@/components/account/ProfileForm';
import PropertyGrid from '@/components/PropertyGrid';
import { Property } from '@/lib/types';

export const metadata: Metadata = { title: 'My account', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const { supabase, user, profile } = await requireUser('/account');

  const [{ data: favs }, { data: leads }] = await Promise.all([
    supabase.from('favorites').select('property:properties(*, category:categories(*), images:property_images(*))').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('leads').select('id, created_at, status, preferred_date, preferred_time, property:properties(title, slug)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
  ]);
  const saved = (favs || []).map((f: any) => f.property).filter(Boolean) as Property[];

  return (
    <>
      <section className="bg-charcoal-950 text-white"><div className="container-luxury flex flex-wrap items-end justify-between gap-4 py-10 md:py-14">
        <div><p className="section-label !text-gold-300">My account</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">Hello, {profile?.full_name || user.email}</h1></div>
        <div className="flex gap-3">
          {profile?.role === 'admin' && <Link href="/admin" className="btn-gold !py-2.5"><ShieldCheck size={16} /> Admin dashboard</Link>}
          <form action="/auth/signout" method="post"><button className="btn-light !py-2.5"><LogOut size={16} /> Log out</button></form>
        </div>
      </div></section>

      <div className="container-luxury grid gap-10 py-10 lg:grid-cols-[360px_1fr] md:py-14">
        <aside className="space-y-6">
          <ProfileForm userId={user.id} email={user.email || ''} fullName={profile?.full_name || ''} phone={profile?.phone || ''} />
        </aside>
        <div className="space-y-12">
          <section aria-labelledby="saved-h"><h2 id="saved-h" className="mb-5 text-2xl font-bold">Saved properties</h2>
            {saved.length ? <PropertyGrid properties={saved} cols={2} headingLevel={3} /> : <p className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 p-8 text-center text-charcoal-600">Tap the heart on any property to save it here. <Link href="/properties" className="font-semibold text-gold-700">Browse properties</Link></p>}
          </section>
          <section aria-labelledby="visits-h"><h2 id="visits-h" className="mb-5 text-2xl font-bold">My visit requests</h2>
            {leads?.length ? (
              <ul className="divide-y divide-charcoal-100 rounded-2xl border border-charcoal-100">
                {leads.map((l: any) => (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                    <div>{l.property ? <Link href={`/properties/${l.property.slug}`} className="font-semibold hover:text-gold-700">{l.property.title}</Link> : <span className="font-semibold">General enquiry</span>}
                      <p className="text-charcoal-500">{new Date(l.created_at).toLocaleDateString('en-IN')}{l.preferred_date ? ` · visit on ${l.preferred_date}` : ''}</p></div>
                    <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold capitalize text-gold-800">{String(l.status).replace('_', ' ')}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 p-8 text-center text-charcoal-600">No visit requests yet while logged in.</p>}
          </section>
        </div>
      </div>
    </>
  );
}
