'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Upload } from 'lucide-react';

export default function GalleryManager({ initialItems }: { initialItems: any[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video');
      const ext = file.name.split('.').pop();
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('property-media').upload(path, file);
      if (uploadError) { alert(uploadError.message); continue; }
      const { data: urlData } = supabase.storage.from('property-media').getPublicUrl(path);

      const { data, error } = await supabase.from('gallery_items').insert({
        media_url: urlData.publicUrl,
        media_type: isVideo ? 'video' : 'image',
        title: file.name,
        sort_order: items.length,
      }).select().single();

      if (!error) setItems((prev) => [...prev, data]);
    }
    setUploading(false);
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this gallery item?')) return;
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-charcoal-300 rounded-lg py-8 cursor-pointer hover:border-gold-500 text-sm text-charcoal-500 mb-8 max-w-lg">
        <Upload size={16} />
        {uploading ? 'Uploading...' : 'Click to upload photos or videos'}
        <input type="file" accept="image/*,video/*" multiple hidden onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
      </label>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group border border-charcoal-200">
            {item.media_type === 'video' ? (
              <video src={item.media_url} className="w-full h-full object-cover" />
            ) : (
              <img src={item.media_url} alt={item.title || ''} className="w-full h-full object-cover" />
            )}
            <button onClick={() => deleteItem(item.id)}
              className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-charcoal-500 text-sm">No gallery items yet.</p>}
    </div>
  );
}
