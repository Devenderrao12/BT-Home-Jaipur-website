import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: property }, { data: categories }, { data: tags }] = await Promise.all([
    supabase.from('properties')
      .select('*, images:property_images(*), tags:property_tags(tag:tags(*))')
      .eq('id', params.id)
      .single(),
    supabase.from('categories').select('id, name').order('sort_order'),
    supabase.from('tags').select('id, name, slug'),
  ]);

  if (!property) notFound();

  // flatten property_tags(tag:tags(*)) -> tags: [{id,name,slug}]
  const flattenedTags = (property.tags || []).map((t: any) => t.tag).filter(Boolean);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Edit Property</h1>
      <PropertyForm
        categories={categories || []}
        tags={tags || []}
        initialData={{ ...property, tags: flattenedTags }}
      />
    </div>
  );
}
