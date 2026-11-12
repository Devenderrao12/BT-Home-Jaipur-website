'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Trash2, Plus } from 'lucide-react';

interface Category { id: string; name: string; slug: string; description?: string; is_active: boolean; sort_order: number; }
interface Tag { id: string; name: string; slug: string; }

export default function CategoryManager({ initialCategories, initialTags }: { initialCategories: Category[]; initialTags: Tag[] }) {
  const supabase = createClient();
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  async function addCategory() {
    if (!newCategory.trim()) return;
    const slug = slugify(newCategory);
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCategory, slug, sort_order: categories.length + 1 })
      .select()
      .single();
    if (error) { alert(error.message); return; }
    setCategories([...categories, data]);
    setNewCategory('');
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Properties in it will be uncategorized.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setCategories(categories.filter((c) => c.id !== id));
  }

  async function addTag() {
    if (!newTag.trim()) return;
    const slug = slugify(newTag);
    const { data, error } = await supabase.from('tags').insert({ name: newTag, slug }).select().single();
    if (error) { alert(error.message); return; }
    setTags([...tags, data]);
    setNewTag('');
  }

  async function deleteTag(id: string) {
    if (!confirm('Delete this tag?')) return;
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setTags(tags.filter((t) => t.id !== id));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card-luxury p-6">
        <h2 className="font-display font-bold text-lg mb-4">Categories</h2>
        <div className="flex gap-2 mb-4">
          <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Commercial"
            className="flex-1 border border-charcoal-200 rounded-lg px-3 py-2 text-sm" />
          <button onClick={addCategory} className="btn-gold !px-4 !py-2"><Plus size={16} /></button>
        </div>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between border-b border-charcoal-50 pb-2">
              <span className="text-sm">{c.name} <span className="text-charcoal-400">/{c.slug}</span></span>
              <button onClick={() => deleteCategory(c.id)}><Trash2 size={14} className="text-charcoal-400 hover:text-red-600" /></button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-luxury p-6">
        <h2 className="font-display font-bold text-lg mb-4">Listing Tags</h2>
        <div className="flex gap-2 mb-4">
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g. Bank Auction"
            className="flex-1 border border-charcoal-200 rounded-lg px-3 py-2 text-sm" />
          <button onClick={addTag} className="btn-gold !px-4 !py-2"><Plus size={16} /></button>
        </div>
        <ul className="space-y-2">
          {tags.map((t) => (
            <li key={t.id} className="flex items-center justify-between border-b border-charcoal-50 pb-2">
              <span className="text-sm">{t.name} <span className="text-charcoal-400">/{t.slug}</span></span>
              <button onClick={() => deleteTag(t.id)}><Trash2 size={14} className="text-charcoal-400 hover:text-red-600" /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
