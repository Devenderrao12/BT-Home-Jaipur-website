import Link from 'next/link';
import { getFeaturedProperties, getProperties } from '@/lib/data/properties';
import PropertyGrid from './PropertyGrid';
import Reveal from './Reveal';

export default async function FeaturedProperties() {
  let properties = await getFeaturedProperties(6);
  let featured = properties.length > 0;
  if (!featured) properties = await getProperties({ limit: 6 }); // fall back to latest listings

  return (
    <section className="py-20 md:py-24">
      <div className="container-luxury">
        <Reveal className="mb-12 text-center">
          <p className="section-label">{featured ? 'Handpicked' : 'Just listed'}</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">{featured ? 'Featured Properties' : 'Latest Properties'}</h2>
        </Reveal>
        <PropertyGrid properties={properties} />
        <div className="mt-12 text-center"><Link href="/properties" className="btn-outline">View all properties</Link></div>
      </div>
    </section>
  );
}
