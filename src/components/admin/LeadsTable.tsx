'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2 } from 'lucide-react';

const STATUSES = ['new', 'contacted', 'visit_scheduled', 'converted', 'closed'];

export default function LeadsTable({ initialLeads }: { initialLeads: any[] }) {
  const supabase = createClient();
  const [leads, setLeads] = useState(initialLeads);

  async function updateStatus(id: string, status: string) {
    setLeads(leads.map((l) => l.id === id ? { ...l, status } : l));
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) alert(error.message);
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setLeads(leads.filter((l) => l.id !== id));
  }

  return (
    <div className="card-luxury overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="text-left text-charcoal-500 border-b border-charcoal-100">
            <th className="p-4">Name</th><th>Phone</th><th>Property</th><th>Preferred Visit</th><th>Status</th><th>Date</th><th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b border-charcoal-50">
              <td className="p-4">
                <p className="font-medium">{l.name}</p>
                {l.email && <p className="text-xs text-charcoal-400">{l.email}</p>}
              </td>
              <td><a href={`tel:${l.phone}`} className="text-gold-700">{l.phone}</a></td>
              <td>{l.property?.title || '—'}</td>
              <td>{l.preferred_date ? `${l.preferred_date} ${l.preferred_time || ''}` : '—'}</td>
              <td>
                <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}
                  className="border border-charcoal-200 rounded-lg px-2 py-1 text-xs capitalize">
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </td>
              <td>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
              <td className="p-4 text-right">
                <button onClick={() => deleteLead(l.id)}><Trash2 size={16} className="text-charcoal-400 hover:text-red-600" /></button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr><td colSpan={7} className="p-6 text-center text-charcoal-500">No leads yet. Leads from the Contact and Schedule Visit forms will appear here.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
