import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Property } from '@/lib/types';
import { site } from '@/lib/site';
import { whatsappLink } from '@/lib/utils';
import PropertyCard from './PropertyCard';
import Reveal from './Reveal';

export function EmptyState({ title = 'No properties match your search yet' }: { title?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 px-6 py-14 text-center">
      <h2 className="font-display text-xl font-bold text-charcoal-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-500">Try widening your filters, or tell us what you&apos;re looking for — new properties are shared with enquirers first.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a className="btn-gold" href={whatsappLink(site.whatsapp, 'Hi, I am looking for a property in Jaipur.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Enquire on WhatsApp</a>
        <Link className="btn-outline" href="/properties">Clear filters</Link>
      </div>
    </div>
  );
}

export default function PropertyGrid({ properties, cols = 3, headingLevel = 3 }: { properties: Property[]; cols?: 2 | 3; headingLevel?: 2 | 3 }) {
  if (!properties.length) return <EmptyState />;
  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${cols === 3 ? 'xl:grid-cols-3' : ''}`}>
      {properties.map((p, i) => (
        i < 3
          ? <div key={p.id}><PropertyCard property={p} priority={i < 2} headingLevel={headingLevel} /></div> // above the fold: no reveal, protects LCP
          : <Reveal key={p.id} delay={(i % 3) * 70}><PropertyCard property={p} headingLevel={headingLevel} /></Reveal>
      ))}
    </div>
  );
}
