import { createClient } from '@/lib/supabase/server';
import CategoryManager from '@/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');
  const { data: tags } = await supabase.from('tags').select('*').order('name');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Categories &amp; Tags</h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Add new property categories (e.g. &quot;Commercial&quot;, &quot;Rental&quot;) or listing tags
        without touching any code — they&apos;ll automatically appear across the site.
      </p>
      <CategoryManager initialCategories={categories || []} initialTags={tags || []} />
    </div>
  );
}
