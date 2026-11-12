import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/rent',
  crumb: "Rent",
  h1: "Properties for Rent in Jaipur",
  intro: "Rental properties in Jaipur listed by BT_Jaipur_Homes.",
  fixed: { listingType: 'rent' },
  hide: ["type"],
};

export const metadata: Metadata = {
  title: "Properties for Rent in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/rent' },
  openGraph: { title: "Properties for Rent in Jaipur", url: '/rent' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
