import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/commercial',
  crumb: "Commercial",
  h1: "Commercial Properties in Jaipur",
  intro: "Commercial spaces and properties in Jaipur.",
  fixed: { categorySlug: 'commercial' },
  hide: ["category"],
};

export const metadata: Metadata = {
  title: "Commercial Properties in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/commercial' },
  openGraph: { title: "Commercial Properties in Jaipur", url: '/commercial' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
