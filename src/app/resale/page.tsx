import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/resale',
  crumb: "Resale",
  h1: "Resale Properties in Jaipur",
  intro: "Resale properties in Jaipur listed by BT_Jaipur_Homes.",
  fixed: { tagSlug: 'resale' },
  hide: ["tag"],
};

export const metadata: Metadata = {
  title: "Resale Properties in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/resale' },
  openGraph: { title: "Resale Properties in Jaipur", url: '/resale' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
