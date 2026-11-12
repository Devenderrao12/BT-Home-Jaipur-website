'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { Property } from '@/lib/types';
import PropertyCard from '@/components/PropertyCard';

export default function FavoritesPage() {
  const { ids } = useFavorites();
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

  return (
    <div className="container-luxury py-12 md:py-16">
      <p className="section-label">Saved</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Your wishlist</h1>
      <div className="mt-8">
        {loading ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-charcoal-50" />)}</div>
          : props.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 px-6 py-14 text-center">
              <Heart className="mx-auto text-gold-500" size={36} />
              <p className="mt-3 text-charcoal-600">Tap the heart on any property to save it here.</p>
              <Link href="/properties" className="btn-gold mt-5">Browse properties</Link>
            </div>
          ) : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{props.map((p) => <PropertyCard key={p.id} property={p} />)}</div>}
      </div>
    </div>
  );
}
