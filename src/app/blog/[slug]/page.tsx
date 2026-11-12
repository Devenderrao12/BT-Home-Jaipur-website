import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { cache } from 'react';
import { format } from 'date-fns';
import { createPublicClient } from '@/lib/supabase/public';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, site } from '@/lib/site';
import { toPlainText } from '@/lib/utils';

export const revalidate = 300;
const getPost = cache(async (slug: string) => (await createPublicClient().from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).maybeSingle()).data);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Article not found', robots: { index: false } };
  const description = post.excerpt || toPlainText(post.content);
  return {
    title: post.title, description, alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description, publishedTime: post.published_at, images: post.cover_image_url ? [post.cover_image_url] : undefined },
    twitter: { card: 'summary_large_image', title: post.title, description },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return (
    <article className="container-luxury max-w-3xl py-10 md:py-14">
      <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }, { name: post.title, href: `/blog/${post.slug}` }]} />
      <h1 className="mt-5 text-3xl font-bold md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-charcoal-500">{format(new Date(post.published_at), 'dd MMM yyyy')} · {post.author}</p>
      {post.cover_image_url && <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={post.cover_image_url} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>}
      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-charcoal-700">{post.content}</div>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.published_at, author: { '@type': 'Organization', name: post.author || site.name }, image: post.cover_image_url || undefined, mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`), publisher: { '@id': absoluteUrl('/#business') } }} />
    </article>
  );
}
