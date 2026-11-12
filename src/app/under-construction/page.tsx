import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/under-construction',
  crumb: "Under Construction",
  h1: "Under Construction Properties in Jaipur",
  intro: "Under-construction projects and properties in Jaipur.",
  fixed: { tagSlug: 'under-construction' },
  hide: ["tag"],
};

export const metadata: Metadata = {
  title: "Under Construction Properties in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/under-construction' },
  openGraph: { title: "Under Construction Properties in Jaipur", url: '/under-construction' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
