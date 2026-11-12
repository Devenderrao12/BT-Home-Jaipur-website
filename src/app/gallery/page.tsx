import { Metadata } from 'next';
import Image from 'next/image';
import { createPublicClient } from '@/lib/supabase/public';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Gallery – Photos & Videos', description: 'Photos and videos from BT_Jaipur_Homes properties and projects in Jaipur.', alternates: { canonical: '/gallery' } };

export default async function GalleryPage() {
  const { data } = await createPublicClient().from('gallery_items').select('*').order('sort_order');
  const items = data || [];
  return (
    <>
      <section className="bg-charcoal-950 text-white"><div className="container-luxury py-10 md:py-14"><Breadcrumbs dark items={[{ name: 'Gallery', href: '/gallery' }]} /><h1 className="mt-4 text-3xl font-bold md:text-5xl">Photos &amp; videos</h1></div></section>
      <div className="container-luxury py-12 md:py-16">
        {items.length === 0 ? <p className="text-center text-charcoal-500">Gallery items will appear here soon.</p> : (
          <div className="columns-2 gap-4 md:columns-3">
            {items.map((it: any, i: number) => (
              <div key={it.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-charcoal-100">
                {it.media_type === 'video'
                  ? <video src={it.media_url} controls preload="none" playsInline className="h-auto w-full" />
                  : <Image src={it.media_url} alt={it.title || 'BT_Jaipur_Homes gallery photo'} width={640} height={480} sizes="(max-width: 768px) 50vw, 33vw" loading={i < 4 ? 'eager' : 'lazy'} className="h-auto w-full object-cover" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
