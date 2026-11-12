import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/buy',
  crumb: "Buy",
  h1: "Properties for Sale in Jaipur",
  intro: "Residential plots, villas and flats for sale in Jaipur, with prices and locations shown upfront.",
  fixed: { listingType: 'sale' },
  hide: ["type"],
};

export const metadata: Metadata = {
  title: "Buy Property in Jaipur \u2013 Plots, Villas & Flats",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/buy' },
  openGraph: { title: "Buy Property in Jaipur \u2013 Plots, Villas & Flats", url: '/buy' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
