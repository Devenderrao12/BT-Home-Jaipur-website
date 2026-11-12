import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { createPublicClient } from '@/lib/supabase/public';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';
import { BLOG_PLACEHOLDER } from '@/lib/constants';

export const revalidate = 300;
export const metadata: Metadata = {
  title: 'Real Estate Blog – Jaipur Property Insights',
  description: 'Property buying tips, market insights and guides for Jaipur from BT_Jaipur_Homes.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const { data } = await createPublicClient().from('blog_posts').select('id,title,slug,excerpt,cover_image_url,published_at').eq('is_published', true).order('published_at', { ascending: false });
  const posts = data || [];
  return (
    <>
      <section className="bg-charcoal-950 text-white"><div className="container-luxury py-10 md:py-14"><Breadcrumbs dark items={[{ name: 'Blog', href: '/blog' }]} /><h1 className="mt-4 text-3xl font-bold md:text-5xl">Insights &amp; guides</h1></div></section>
      <div className="container-luxury py-12 md:py-16">
        {posts.length === 0 ? <p className="text-center text-charcoal-500">No articles yet — check back soon.</p> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any, i: number) => (
              <Reveal key={post.id} delay={(i % 3) * 70}>
                <Link href={`/blog/${post.slug}`} className="group card-luxury block h-full transition duration-300 hover:-translate-y-1 hover:shadow-luxury">
                  <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-100"><Image src={post.cover_image_url || BLOG_PLACEHOLDER} alt={post.title} fill sizes="(max-width: 768px) 92vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></div>
                  <div className="p-5"><p className="text-xs text-charcoal-500">{format(new Date(post.published_at), 'dd MMM yyyy')}</p><h2 className="mt-1 text-lg font-bold group-hover:text-gold-700">{post.title}</h2><p className="mt-2 line-clamp-2 text-sm text-charcoal-500">{post.excerpt}</p></div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
