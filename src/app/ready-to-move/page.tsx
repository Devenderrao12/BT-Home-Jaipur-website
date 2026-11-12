import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/ready-to-move',
  crumb: "Ready to Move",
  h1: "Ready to Move Properties in Jaipur",
  intro: "Ready-to-move homes in Jaipur you can visit and occupy sooner.",
  fixed: { tagSlug: 'ready-to-move' },
  hide: ["tag"],
};

export const metadata: Metadata = {
  title: "Ready to Move Properties in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/ready-to-move' },
  openGraph: { title: "Ready to Move Properties in Jaipur", url: '/ready-to-move' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
