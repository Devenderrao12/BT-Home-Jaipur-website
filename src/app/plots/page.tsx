import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/plots',
  crumb: "Plots",
  h1: "Residential Plots for Sale in Jaipur",
  intro: "Residential and investment plots for sale in Jaipur, with area, price and location details.",
  fixed: { categorySlug: 'plots' },
  hide: ["category"],
};

export const metadata: Metadata = {
  title: "Residential Plots for Sale in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/plots' },
  openGraph: { title: "Residential Plots for Sale in Jaipur", url: '/plots' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
