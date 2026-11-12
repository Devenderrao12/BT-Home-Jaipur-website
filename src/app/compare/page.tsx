'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, X } from 'lucide-react';
import { useCompare } from '@/lib/hooks/useCompare';
import { Property } from '@/lib/types';
import { formatPrice, formatArea } from '@/lib/utils';
import { PROPERTY_PLACEHOLDER } from '@/lib/constants';

export default function ComparePage() {
  const { ids, clearCompare, toggleCompare } = useCompare();
  const key = ids.join(',');
  const [props, setProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctl = new AbortController();
    if (!key) { setProps([]); setLoading(false); return; }
    fetch(`/api/properties?ids=${key}`, { signal: ctl.signal })
      .then((r) => r.json()).then((j) => { setProps(j.properties || []); setLoading(false); })
      .catch((e) => { if (e.name !== 'AbortError') setLoading(false); });
    return () => ctl.abort();
  }, [key]);

  const rows: [string, (p: Property) => React.ReactNode][] = [
    ['Price', (p) => (p.listing_type === 'rent' && p.monthly_rent ? `${formatPrice(p.monthly_rent)} / mo` : formatPrice(p.price))],
    ['Type', (p) => p.category?.name ?? '—'],
    ['Area', (p) => formatArea(p.area_sqft)],
    ['Bedrooms', (p) => p.bedrooms ?? '—'], ['Bathrooms', (p) => p.bathrooms ?? '—'],
    ['Furnishing', (p) => p.furnishing ?? '—'], ['Facing', (p) => p.facing ?? '—'],
    ['Status', (p) => <span className="capitalize">{p.status.replace('_', ' ')}</span>],
    ['Location', (p) => p.address || p.city],
  ];

  return (
    <div className="container-luxury py-12 md:py-16">
      <div className="flex items-end justify-between gap-4">
        <div><p className="section-label">Compare</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">Property comparison</h1></div>
        {props.length > 0 && <button onClick={clearCompare} className="text-sm font-semibold text-gold-700 hover:underline">Clear all</button>}
      </div>
      <div className="mt-8">
        {loading ? <div className="h-64 animate-pulse rounded-2xl bg-charcoal-50" />
          : props.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 px-6 py-14 text-center">
              <Scale className="mx-auto text-gold-500" size={36} />
              <p className="mt-3 text-charcoal-600">Use the compare icon on up to 4 properties to see them side by side.</p>
              <Link href="/properties" className="btn-gold mt-5">Browse properties</Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-charcoal-100">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-32 bg-charcoal-50 p-4 text-xs font-semibold uppercase tracking-wide text-charcoal-500">Feature</th>
                    {props.map((p) => (
                      <th key={p.id} className="relative border-l border-charcoal-100 p-4 align-top">
                        <button onClick={() => toggleCompare(p.id)} aria-label={`Remove ${p.title}`} className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-1.5 text-charcoal-600 shadow-soft hover:text-red-600"><X size={16} /></button>
                        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-charcoal-100"><Image src={(p.images?.[0]?.url) || PROPERTY_PLACEHOLDER} alt={p.title} fill sizes="260px" className="object-cover" /></div>
                        <Link href={`/properties/${p.slug}`} className="font-display text-base font-bold hover:text-gold-700">{p.title}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, render]) => (
                    <tr key={label} className="border-t border-charcoal-100">
                      <th scope="row" className="bg-charcoal-50 p-4 text-sm font-medium text-charcoal-600">{label}</th>
                      {props.map((p) => <td key={p.id} className="border-l border-charcoal-100 p-4 text-sm">{render(p)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
