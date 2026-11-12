'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Trash2, Plus, X } from 'lucide-react';

export default function BlogManager({ initialPosts }: { initialPosts: any[] }) {
  const supabase = createClient();
  const [posts, setPosts] = useState(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover_image_url: '' });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.from('blog_posts').insert({
      title: form.title,
      slug: slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      is_published: true,
    }).select().single();
    setSaving(false);
    if (error) { alert(error.message); return; }
    setPosts([data, ...posts]);
    setForm({ title: '', excerpt: '', content: '', cover_image_url: '' });
    setShowForm(false);
  }

  async function togglePublish(id: string, current: boolean) {
    setPosts(posts.map((p) => p.id === id ? { ...p, is_published: !current } : p));
    await supabase.from('blog_posts').update({ is_published: !current }).eq('id', id);
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setPosts(posts.filter((p) => p.id !== id));
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-gold !py-2.5 mb-6">
        {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'New Post'}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card-luxury p-6 space-y-4 mb-8">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Cover Image URL" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <textarea placeholder="Excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <textarea required placeholder="Content" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Publishing...' : 'Publish Post'}</button>
        </form>
      )}

      <div className="card-luxury divide-y divide-charcoal-50">
        {posts.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-charcoal-400">{p.is_published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => togglePublish(p.id, p.is_published)} className="text-xs text-gold-700 font-medium hover:underline">
                {p.is_published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => deletePost(p.id)}><Trash2 size={16} className="text-charcoal-400 hover:text-red-600" /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="p-6 text-center text-charcoal-500 text-sm">No blog posts yet.</p>}
      </div>
    </div>
  );
}
