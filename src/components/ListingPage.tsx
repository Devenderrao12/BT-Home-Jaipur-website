import { Suspense } from 'react';
import { getProperties, PropertyFilters as F } from '@/lib/data/properties';
import PropertyFilters from './PropertyFilters';
import PropertyGrid from './PropertyGrid';
import Breadcrumbs from './Breadcrumbs';
import JsonLd from './JsonLd';
import { absoluteUrl } from '@/lib/site';

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export interface ListingConfig {
  path: string; crumb: string; h1: string; intro: string;
  fixed?: Partial<F>;
  hide?: string[]; // filters that make no sense on this page
}

export default async function ListingPage({ config, searchParams }: { config: ListingConfig; searchParams: SP }) {
  const num = (k: string) => (one(searchParams[k]) ? Number(one(searchParams[k])) : undefined);
  const type = one(searchParams.type);
  const properties = await getProperties({
    categorySlug: one(searchParams.category),
    tagSlug: one(searchParams.tag),
    status: one(searchParams.status),
    listingType: type === 'sale' || type === 'rent' ? type : undefined,
    minPrice: num('minPrice'), maxPrice: num('maxPrice'), bedrooms: num('bedrooms'),
    search: one(searchParams.search),
    ...config.fixed, // page-level scope always wins
  });

  return (
    <>
      <section className="bg-charcoal-950 text-white">
        <div className="container-luxury py-10 md:py-14">
          <Breadcrumbs dark items={config.path === '/properties' ? [{ name: 'Properties', href: '/properties' }] : [{ name: config.crumb, href: config.path }]} />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold md:text-5xl">{config.h1}</h1>
          <p className="mt-3 max-w-2xl text-charcoal-200">{config.intro}</p>
        </div>
      </section>

      <div className="container-luxury py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <aside><Suspense fallback={<div className="h-12 rounded-xl bg-charcoal-50" />}><PropertyFilters hide={config.hide} /></Suspense></aside>
          <section aria-label="Property results">
            <p className="mb-5 text-sm text-charcoal-500" aria-live="polite">{properties.length} {properties.length === 1 ? 'property' : 'properties'} found</p>
            <PropertyGrid properties={properties} cols={3} headingLevel={2} />
          </section>
        </div>
      </div>

      {properties.length > 0 && (
        <JsonLd data={{
          '@context': 'https://schema.org', '@type': 'ItemList', name: config.h1,
          itemListElement: properties.slice(0, 20).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/properties/${p.slug}`), name: p.title })),
        }} />
      )}
    </>
  );
}
