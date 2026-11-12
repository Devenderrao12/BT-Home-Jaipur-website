import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/villas',
  crumb: "Villas",
  h1: "Villas for Sale in Jaipur",
  intro: "Independent villas for sale in Jaipur. View photos, specifications and locations.",
  fixed: { categorySlug: 'villas' },
  hide: ["category"],
};

export const metadata: Metadata = {
  title: "Villas for Sale in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/villas' },
  openGraph: { title: "Villas for Sale in Jaipur", url: '/villas' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
