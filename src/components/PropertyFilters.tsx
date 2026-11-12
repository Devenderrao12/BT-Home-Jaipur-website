'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { PRICE_RANGES } from '@/lib/constants';

const TAGS = [
  { label: 'Resale', slug: 'resale' }, { label: 'New Launch', slug: 'new-launch' },
  { label: 'Ready to Move', slug: 'ready-to-move' }, { label: 'Under Construction', slug: 'under-construction' },
];
const STATUSES = [{ v: '', l: 'Any' }, { v: 'available', l: 'Available' }, { v: 'featured', l: 'Featured' }, { v: 'sold', l: 'Sold' }, { v: 'on_hold', l: 'On hold' }];
const CATEGORIES = [{ v: 'plots', l: 'Plots' }, { v: 'villas', l: 'Villas' }, { v: 'flats', l: 'Flats' }, { v: 'commercial', l: 'Commercial' }];

const chip = (on: boolean) => `rounded-full border px-3.5 py-1.5 text-sm transition active:scale-95 ${on ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-charcoal-200 text-charcoal-700 hover:border-gold-500'}`;

export default function PropertyFilters({ hide = [] as string[] }: { hide?: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [loc, setLoc] = useState(sp.get('search') || '');

  // Apply several param changes in ONE navigation (fixes the old double-push overwrite bug)
  function apply(changes: Record<string, string>) {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(changes)) v ? next.set(k, v) : next.delete(k);
    const qs = next.toString();
    start(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  const priceIdx = Math.max(0, PRICE_RANGES.findIndex((r) => r.min === (sp.get('minPrice') || '') && r.max === (sp.get('maxPrice') || '')));
  const activeCount = ['search', 'type', 'category', 'minPrice', 'maxPrice', 'bedrooms', 'status', 'tag'].filter((k) => sp.get(k)).length;

  const body = (p: string) => (
    <div className="space-y-6" aria-busy={pending}>
      <form onSubmit={(e) => { e.preventDefault(); apply({ search: loc.trim() }); }}>
        <label className="mb-2 block text-sm font-semibold text-charcoal-800" htmlFor={`${p}-loc`}>Location / keyword</label>
        <input id={`${p}-loc`} value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="e.g. Kalwar Road" className="input" enterKeyHint="search" />
      </form>

      {!hide.includes('type') && (
        <div>
          <p className="mb-2 text-sm font-semibold text-charcoal-800">Looking to</p>
          <div className="flex gap-2">{[['', 'All'], ['sale', 'Buy'], ['rent', 'Rent']].map(([v, l]) => <button key={v} onClick={() => apply({ type: v })} className={chip((sp.get('type') || '') === v)}>{l}</button>)}</div>
        </div>
      )}
      {!hide.includes('category') && (
        <div>
          <p className="mb-2 text-sm font-semibold text-charcoal-800">Property type</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => apply({ category: '' })} className={chip(!sp.get('category'))}>All</button>
            {CATEGORIES.map((c) => <button key={c.v} onClick={() => apply({ category: c.v })} className={chip(sp.get('category') === c.v)}>{c.l}</button>)}
          </div>
        </div>
      )}
      <div>
        <label htmlFor={`${p}-price`} className="mb-2 block text-sm font-semibold text-charcoal-800">Budget</label>
        <select id={`${p}-price`} className="input" value={priceIdx} onChange={(e) => { const r = PRICE_RANGES[Number(e.target.value)]; apply({ minPrice: r.min, maxPrice: r.max }); }}>
          {PRICE_RANGES.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
        </select>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-charcoal-800">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => apply({ bedrooms: '' })} className={chip(!sp.get('bedrooms'))}>Any</button>
          {[1, 2, 3, 4, 5].map((b) => <button key={b} onClick={() => apply({ bedrooms: String(b) })} className={chip(sp.get('bedrooms') === String(b))}>{b}+</button>)}
        </div>
      </div>
      {!hide.includes('tag') && (
        <div>
          <p className="mb-2 text-sm font-semibold text-charcoal-800">Project stage</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => apply({ tag: '' })} className={chip(!sp.get('tag'))}>Any</button>
            {TAGS.map((t) => <button key={t.slug} onClick={() => apply({ tag: t.slug })} className={chip(sp.get('tag') === t.slug)}>{t.label}</button>)}
          </div>
        </div>
      )}
      <div>
        <p className="mb-2 text-sm font-semibold text-charcoal-800">Availability</p>
        <div className="flex flex-wrap gap-2">{STATUSES.map((s) => <button key={s.v} onClick={() => apply({ status: s.v })} className={chip((sp.get('status') || '') === s.v)}>{s.l}</button>)}</div>
      </div>
      {activeCount > 0 && <button onClick={() => { setLoc(''); start(() => router.push(pathname, { scroll: false })); }} className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:underline"><X size={14} /> Clear all filters</button>}
    </div>
  );

  return (
    <>
      {/* Mobile: collapsible panel */}
      <div className="lg:hidden">
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="btn-outline w-full !justify-between">
          <span className="inline-flex items-center gap-2"><SlidersHorizontal size={16} /> Filters{activeCount ? ` (${activeCount})` : ''}</span><span className="text-xs">{open ? 'Hide' : 'Show'}</span>
        </button>
        {open && <div className="card-luxury mt-3 p-5">{body('m')}</div>}
      </div>
      {/* Desktop: sticky sidebar */}
      <div className="card-luxury sticky top-24 hidden p-6 lg:block"><h2 className="mb-5 font-display text-lg font-bold">Refine your search</h2>{body('d')}</div>
    </>
  );
}
