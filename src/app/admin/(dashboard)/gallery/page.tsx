import { createClient } from '@/lib/supabase/server';
import GalleryManager from '@/components/admin/GalleryManager';

export default async function AdminGalleryPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from('gallery_items').select('*').order('sort_order');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Gallery</h1>
      <GalleryManager initialItems={items || []} />
    </div>
  );
}
