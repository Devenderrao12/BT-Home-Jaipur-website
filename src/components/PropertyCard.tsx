'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Ruler, MapPin, Heart, Scale, ArrowUpRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatPrice, formatArea } from '@/lib/utils';
import { PROPERTY_PLACEHOLDER } from '@/lib/constants';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useCompare } from '@/lib/hooks/useCompare';

export default function PropertyCard({ property: p, priority = false, headingLevel = 3 }: { property: Property; priority?: boolean; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();
  const cover = p.images?.find((i) => i.is_cover) || p.images?.[0];
  const fav = isFavorite(p.id);
  const cmp = isInCompare(p.id);
  const isRent = p.listing_type === 'rent' && !!p.monthly_rent;
  const href = `/properties/${p.slug}`;

  return (
    <article className="group card-luxury transition duration-300 hover:-translate-y-1 hover:shadow-luxury">
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-100">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Image
            src={cover?.url || PROPERTY_PLACEHOLDER}
            alt={cover?.alt_text || `${p.title}${p.address ? ` – ${p.address}` : ''}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 31vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {p.is_featured && <span className="rounded-full bg-gold-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal-950">Featured</span>}
          {p.status === 'sold' && <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">Sold</span>}
          {p.status === 'on_hold' && <span className="rounded-full bg-charcoal-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">On hold</span>}
          {isRent && <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal-900">For rent</span>}
        </div>

        <div className="absolute right-3 top-3 flex gap-2">
          <button onClick={() => toggleFavorite(p.id)} aria-pressed={fav} aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft transition active:scale-90 hover:bg-white">
            <Heart size={18} className={fav ? 'fill-red-500 text-red-500' : 'text-charcoal-700'} />
          </button>
          <button onClick={() => toggleCompare(p.id)} aria-pressed={cmp} aria-label={cmp ? 'Remove from comparison' : 'Add to comparison'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-soft transition active:scale-90 hover:bg-white">
            <Scale size={18} className={cmp ? 'text-gold-700' : 'text-charcoal-700'} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {p.category?.name && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">{p.category.name}</p>}
        <p className="mt-1 font-display text-2xl font-bold text-charcoal-900">
          {isRent ? <>{formatPrice(p.monthly_rent!)}<span className="text-sm font-sans font-medium text-charcoal-500"> / month</span></> : formatPrice(p.price)}
        </p>
        <H className="mt-1 line-clamp-1 font-sans text-base font-semibold text-charcoal-900">
          <Link href={href} className="hover:text-gold-700">{p.title}</Link>
        </H>
        <p className="mt-1 flex items-center gap-1 text-sm text-charcoal-500"><MapPin size={14} className="shrink-0" /><span className="line-clamp-1">{p.address || p.city}</span></p>

        <div className="mt-4 flex items-center gap-4 border-t border-charcoal-100 pt-4 text-sm text-charcoal-600">
          {p.bedrooms ? <span className="flex items-center gap-1.5"><BedDouble size={16} /> {p.bedrooms} Bed</span> : null}
          {p.bathrooms ? <span className="flex items-center gap-1.5"><Bath size={16} /> {p.bathrooms} Bath</span> : null}
          {p.area_sqft ? <span className="flex items-center gap-1.5"><Ruler size={16} /> {formatArea(p.area_sqft)}</span> : null}
          <Link href={href} aria-label={`View ${p.title}`} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition group-hover:bg-gold-500 group-hover:text-charcoal-950"><ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}
