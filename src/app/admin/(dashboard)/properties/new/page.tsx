import { createClient } from '@/lib/supabase/server';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function NewPropertyPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('id, name').order('sort_order');
  const { data: tags } = await supabase.from('tags').select('id, name, slug');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Add New Property</h1>
      <PropertyForm categories={categories || []} tags={tags || []} />
    </div>
  );
}
