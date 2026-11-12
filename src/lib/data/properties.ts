import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { Property } from '@/lib/types';

export interface PropertyFilters {
  categorySlug?: string;
  tagSlug?: string;
  status?: string;
  listingType?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string; // matches title, address, city (location search)
  featuredOnly?: boolean;
  limit?: number;
  ids?: string[];
}

const SELECT = `*, category:categories(*), location:locations(*), images:property_images(*)`;

// strip characters that would break PostgREST's or() syntax
const clean = (s: string) => s.replace(/[,()%*\\]/g, ' ').trim();

export async function getProperties(f: PropertyFilters = {}): Promise<Property[]> {
  const supabase = createPublicClient();

  // Resolve category/tag lookups in parallel
  const [cat, tag] = await Promise.all([
    f.categorySlug ? supabase.from('categories').select('id').eq('slug', f.categorySlug).maybeSingle() : null,
    f.tagSlug ? supabase.from('tags').select('id').eq('slug', f.tagSlug).maybeSingle() : null,
  ]);
  if (f.categorySlug && !cat?.data) return [];
  let tagPropertyIds: Set<string> | null = null;
  if (f.tagSlug) {
    if (!tag?.data) return [];
    const { data } = await supabase.from('property_tags').select('property_id').eq('tag_id', tag.data.id);
    tagPropertyIds = new Set((data || []).map((r: any) => r.property_id));
    if (tagPropertyIds.size === 0) return [];
  }

  let q = supabase
    .from('properties')
    .select(SELECT)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (cat?.data) q = q.eq('category_id', cat.data.id);
  if (tagPropertyIds) q = q.in('id', Array.from(tagPropertyIds));
  if (f.ids) q = q.in('id', f.ids);
  if (f.status) q = q.eq('status', f.status);
  if (f.listingType) q = q.eq('listing_type', f.listingType);
  if (f.featuredOnly) q = q.eq('is_featured', true);
  if (f.minPrice) q = q.gte('price', f.minPrice);
  if (f.maxPrice) q = q.lte('price', f.maxPrice);
  if (f.bedrooms) q = q.gte('bedrooms', f.bedrooms); // "3+ BHK" means 3 or more
  if (f.search) {
    const s = clean(f.search);
    if (s) q = q.or(`title.ilike.%${s}%,address.ilike.%${s}%,city.ilike.%${s}%`);
  }
  if (f.limit) q = q.limit(f.limit);

  const { data, error } = await q;
  if (error) {
    console.error('getProperties error:', error.message);
    return [];
  }
  return (data as unknown as Property[]) || [];
}

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('properties')
    .select(SELECT)
    .eq('slug', slug)
    .order('sort_order', { referencedTable: 'property_images', ascending: true })
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as Property;
});

export async function getFeaturedProperties(limit = 6) {
  return getProperties({ featuredOnly: true, limit });
}

export async function getRelatedProperties(p: Property, limit = 3) {
  const list = await getProperties({ categorySlug: p.category?.slug, limit: limit + 1 });
  return list.filter((x) => x.id !== p.id).slice(0, limit);
}

export async function getCategories() {
  const supabase = createPublicClient();
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
  return data || [];
}
