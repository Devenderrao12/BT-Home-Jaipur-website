'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { PRICE_RANGES } from '@/lib/constants';

const MODES = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'commercial', label: 'Commercial' },
] as const;

export default function PropertySearch() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof MODES)[number]['key']>('buy');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (mode === 'buy') q.set('type', 'sale');
    if (mode === 'rent') q.set('type', 'rent');
    if (mode === 'commercial') q.set('category', 'commercial');
    else if (category) q.set('category', category);
    if (location.trim()) q.set('search', location.trim());
    const r = PRICE_RANGES[budget];
    if (r.min) q.set('minPrice', r.min);
    if (r.max) q.set('maxPrice', r.max);
    router.push(`/properties?${q.toString()}`);
  }

  return (
    <div className="rounded-3xl bg-white/95 p-3 shadow-luxury backdrop-blur sm:p-4">
      <div role="tablist" aria-label="Search type" className="mb-3 inline-flex rounded-full bg-charcoal-50 p-1">
        {MODES.map((m) => (
          <button key={m.key} role="tab" aria-selected={mode === m.key} onClick={() => setMode(m.key)} type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === m.key ? 'bg-charcoal-900 text-white shadow-soft' : 'text-charcoal-600 hover:text-charcoal-900'}`}>{m.label}</button>
        ))}
      </div>
      <form onSubmit={submit} className="grid gap-2 md:grid-cols-[1.6fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Location, project or keyword</span>
          <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-700" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location, locality or project" className="input !pl-10" autoComplete="off" enterKeyHint="search" />
        </label>
        <label>
          <span className="sr-only">Property type</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={mode === 'commercial'} className="input disabled:bg-charcoal-50 disabled:text-charcoal-500">
            <option value="">{mode === 'commercial' ? 'Commercial' : 'All property types'}</option>
            <option value="plots">Plots</option><option value="villas">Villas</option><option value="flats">Flats</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Budget</span>
          <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="input" disabled={mode === 'rent'} title={mode === 'rent' ? 'Budget filter applies to sale prices' : undefined}>
            {PRICE_RANGES.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
          </select>
        </label>
        <button type="submit" className="btn-gold !py-3"><Search size={16} /> Search</button>
      </form>
    </div>
  );
}
