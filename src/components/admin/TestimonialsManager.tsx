'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Plus, X, Star } from 'lucide-react';

export default function TestimonialsManager({ initialTestimonials }: { initialTestimonials: any[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_name: '', message: '', rating: 5, client_photo_url: '' });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.from('testimonials').insert({ ...form, is_published: true }).select().single();
    setSaving(false);
    if (error) { alert(error.message); return; }
    setItems([data, ...items]);
    setForm({ client_name: '', message: '', rating: 5, client_photo_url: '' });
    setShowForm(false);
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-gold !py-2.5 mb-6">
        {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Add Testimonial'}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card-luxury p-6 space-y-4 mb-8 max-w-lg">
          <input required placeholder="Client Name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Client Photo URL (optional)" value={form.client_photo_url} onChange={(e) => setForm({ ...form, client_photo_url: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <textarea required placeholder="Testimonial message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Saving...' : 'Add Testimonial'}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="card-luxury p-5">
            <div className="flex justify-between items-start">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-gold-500 text-gold-500" />)}
              </div>
              <button onClick={() => deleteItem(t.id)}><Trash2 size={16} className="text-charcoal-400 hover:text-red-600" /></button>
            </div>
            <p className="text-sm text-charcoal-600">&ldquo;{t.message}&rdquo;</p>
            <p className="text-sm font-semibold mt-3">{t.client_name}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-charcoal-500 text-sm">No testimonials yet.</p>}
      </div>
    </div>
  );
}
