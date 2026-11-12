import { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();
  const core = ['', '/properties', '/buy', '/rent', '/commercial', '/flats', '/villas', '/plots', '/resale', '/new-launch', '/ready-to-move', '/under-construction', '/about', '/contact', '/gallery', '/blog', '/emi-calculator'];
  const now = new Date();
  const staticRoutes = core.map((r) => ({ url: absoluteUrl(r || '/'), lastModified: now, changeFrequency: 'daily' as const, priority: r === '' ? 1 : r === '/contact' ? 0.8 : 0.7 }));

  const [{ data: props }, { data: posts }] = await Promise.all([
    supabase.from('properties').select('slug, updated_at').neq('status', 'sold'),
    supabase.from('blog_posts').select('slug, published_at').eq('is_published', true),
  ]);
  return [
    ...staticRoutes,
    ...(props || []).map((p: any) => ({ url: absoluteUrl(`/properties/${p.slug}`), lastModified: new Date(p.updated_at), changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...(posts || []).map((p: any) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.published_at), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
