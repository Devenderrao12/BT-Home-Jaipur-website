import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/flats',
  crumb: "Flats",
  h1: "Flats & Apartments for Sale in Jaipur",
  intro: "Flats and apartments for sale in Jaipur. Compare prices, sizes and locations, then book a visit.",
  fixed: { categorySlug: 'flats' },
  hide: ["category"],
};

export const metadata: Metadata = {
  title: "Flats for Sale in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/flats' },
  openGraph: { title: "Flats for Sale in Jaipur", url: '/flats' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
