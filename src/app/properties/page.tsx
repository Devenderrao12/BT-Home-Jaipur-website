import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/properties',
  crumb: "Properties",
  h1: "All Properties in Jaipur",
  intro: "Browse every plot, villa and flat listed by BT_Jaipur_Homes. Filter by location, budget and bedrooms.",
  fixed: {},
  hide: [],
};

export const metadata: Metadata = {
  title: "Properties for Sale in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/properties' },
  openGraph: { title: "Properties for Sale in Jaipur", url: '/properties' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
