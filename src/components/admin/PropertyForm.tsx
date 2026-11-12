'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import ImageUploader, { UploadedImage } from './ImageUploader';

interface CategoryOption { id: string; name: string; }
interface TagOption { id: string; name: string; slug: string; }

export default function PropertyForm({
  categories,
  tags,
  initialData,
}: {
  categories: CategoryOption[];
  tags: TagOption[];
  initialData?: any;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    title: initialData?.title || '',
    category_id: initialData?.category_id || categories[0]?.id || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    city: initialData?.city || 'Jaipur',
    price: initialData?.price || '',
    listing_type: initialData?.listing_type || 'sale',
    monthly_rent: initialData?.monthly_rent || '',
    area_sqft: initialData?.area_sqft || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    facing: initialData?.facing || '',
    furnishing: initialData?.furnishing || '',
    status: initialData?.status || 'available',
    is_featured: initialData?.is_featured || false,
    video_url: initialData?.video_url || '',
    amenities: (initialData?.amenities || []).join(', '),
  });
  const [images, setImages] = useState<UploadedImage[]>(
    (initialData?.images || []).map((i: any) => ({ url: i.url, is_cover: i.is_cover }))
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    (initialData?.tags || []).map((t: any) => t.id)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        slug: initialData?.slug || slugify(form.title),
        category_id: form.category_id || null,
        description: form.description,
        address: form.address,
        city: form.city,
        price: Number(form.price) || 0,
        listing_type: form.listing_type,
        monthly_rent: form.listing_type === 'rent' && form.monthly_rent ? Number(form.monthly_rent) : null,
        area_sqft: form.area_sqft ? Number(form.area_sqft) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        facing: form.facing || null,
        furnishing: form.furnishing || null,
        status: form.status,
        is_featured: form.is_featured,
        video_url: form.video_url || null,
        amenities: form.amenities.split(',').map((a: string) => a.trim()).filter(Boolean),
      };

      let propertyId = initialData?.id;

      if (isEdit) {
        const { error: updateError } = await supabase.from('properties').update(payload).eq('id', propertyId);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase.from('properties').insert(payload).select().single();
        if (insertError) throw insertError;
        propertyId = data.id;
      }

      // Sync images: delete old, insert current set
      await supabase.from('property_images').delete().eq('property_id', propertyId);
      if (images.length > 0) {
        await supabase.from('property_images').insert(
          images.map((img, idx) => ({
            property_id: propertyId,
            url: img.url,
            is_cover: img.is_cover || idx === 0,
            sort_order: idx,
          }))
        );
      }

      // Sync tags
      await supabase.from('property_tags').delete().eq('property_id', propertyId);
      if (selectedTags.length > 0) {
        await supabase.from('property_tags').insert(
          selectedTags.map((tagId) => ({ property_id: propertyId, tag_id: tagId }))
        );
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Basic Details</h2>
        <input required placeholder="Property Title" value={form.title} onChange={(e) => update('title', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />

        <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <textarea placeholder="Description" rows={5} value={form.description} onChange={(e) => update('description', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
      </div>

      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Location & Pricing</h2>
        <input placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => update('price', e.target.value)}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.listing_type} onChange={(e) => update('listing_type', e.target.value)}
            className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm">
            <option value="sale">For Sale (Buy)</option>
            <option value="rent">For Rent</option>
          </select>
          {form.listing_type === 'rent' && (
            <input type="number" placeholder="Monthly rent (₹)" value={form.monthly_rent} onChange={(e) => update('monthly_rent', e.target.value)}
              className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          )}
        </div>
      </div>

      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input type="number" placeholder="Area (sqft)" value={form.area_sqft} onChange={(e) => update('area_sqft', e.target.value)}
            className="border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)}
            className="border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)}
            className="border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Facing" value={form.facing} onChange={(e) => update('facing', e.target.value)}
            className="border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
        </div>
        <input placeholder="Furnishing (Unfurnished/Semi/Fully)" value={form.furnishing} onChange={(e) => update('furnishing', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
        <input placeholder="Amenities (comma separated, e.g. Gym, Pool, Parking)" value={form.amenities} onChange={(e) => update('amenities', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
      </div>

      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Status & Tags</h2>
        <select value={form.status} onChange={(e) => update('status', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm">
          <option value="available">Available</option>
          <option value="featured">Featured</option>
          <option value="sold">Sold</option>
          <option value="on_hold">On Hold</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
          Show in Featured Properties
        </label>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button type="button" key={t.id} onClick={() => toggleTag(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm border ${selectedTags.includes(t.id) ? 'bg-gold-500 text-white border-gold-500' : 'border-charcoal-200 text-charcoal-600'}`}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card-luxury p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Media</h2>
        <ImageUploader images={images} onChange={setImages} propertyId={initialData?.id} />
        <input placeholder="Video URL (YouTube/Vimeo embed link)" value={form.video_url} onChange={(e) => update('video_url', e.target.value)}
          className="w-full border border-charcoal-200 rounded-lg px-4 py-2.5 text-sm" />
      </div>

      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
      </button>
    </form>
  );
}
