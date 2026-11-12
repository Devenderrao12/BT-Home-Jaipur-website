import { createClient } from '@/lib/supabase/server';
import { Building2, Users, Star, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ count: propertiesCount }, { count: leadsCount }, { count: newLeadsCount }, { count: featuredCount }] =
    await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    ]);

  const { data: recentLeads } = await supabase
    .from('leads').select('*').order('created_at', { ascending: false }).limit(5);

  const stats = [
    { label: 'Total Properties', value: propertiesCount || 0, icon: Building2, href: '/admin/properties' },
    { label: 'Total Leads', value: leadsCount || 0, icon: Users, href: '/admin/leads' },
    { label: 'New Leads', value: newLeadsCount || 0, icon: Users, href: '/admin/leads' },
    { label: 'Featured Properties', value: featuredCount || 0, icon: Star, href: '/admin/properties' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card-luxury p-6">
            <s.icon className="text-gold-500 mb-3" />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-charcoal-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="card-luxury p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm text-gold-700 font-medium hover:underline">View all</Link>
        </div>
        {(recentLeads || []).length === 0 ? (
          <p className="text-sm text-charcoal-500">No leads yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-500 border-b border-charcoal-100">
                <th className="py-2">Name</th><th>Phone</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentLeads || []).map((l: any) => (
                <tr key={l.id} className="border-b border-charcoal-50">
                  <td className="py-2">{l.name}</td>
                  <td>{l.phone}</td>
                  <td className="capitalize">{l.status.replace('_', ' ')}</td>
                  <td>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
