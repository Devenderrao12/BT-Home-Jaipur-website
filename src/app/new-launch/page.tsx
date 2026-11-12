import { Metadata } from 'next';
import ListingPage, { ListingConfig } from '@/components/ListingPage';
import { site } from '@/lib/site';

export const revalidate = 60;

const config: ListingConfig = {
  path: '/new-launch',
  crumb: "New Launch",
  h1: "New Launch Properties in Jaipur",
  intro: "Newly launched residential projects and properties in Jaipur.",
  fixed: { tagSlug: 'new-launch' },
  hide: ["tag"],
};

export const metadata: Metadata = {
  title: "New Launch Properties in Jaipur",
  description: `${config.intro} ${site.name}, ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/new-launch' },
  openGraph: { title: "New Launch Properties in Jaipur", url: '/new-launch' },
};

export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  return <ListingPage config={config} searchParams={searchParams} />;
}
