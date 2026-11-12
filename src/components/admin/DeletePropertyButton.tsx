'use client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-charcoal-600 hover:text-red-600" aria-label="Delete property">
      <Trash2 size={16} />
    </button>
  );
}
