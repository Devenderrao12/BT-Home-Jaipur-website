import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { site } from '@/lib/site';

const col = 'space-y-2.5 text-sm';
const a = 'text-charcoal-300 transition-colors hover:text-gold-300';

export default function Footer() {
  return (
    <footer className="mt-24 bg-charcoal-950 text-charcoal-200">
      <div className="container-luxury grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl font-bold text-white">BT_<span className="text-gold-400">Jaipur</span>_Homes</p>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-300">Residential plots, villas and flats on {site.addressLine}, {site.city}.</p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Properties</h2>
          <ul className={col}>
            {[['/buy', 'Buy'], ['/rent', 'Rent'], ['/commercial', 'Commercial'], ['/flats', 'Flats'], ['/villas', 'Villas'], ['/plots', 'Plots'], ['/new-launch', 'New Launch'], ['/ready-to-move', 'Ready to Move'], ['/resale', 'Resale']].map(([h, l]) => <li key={h}><Link href={h} className={a}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Company</h2>
          <ul className={col}>
            {[['/about', 'About Us'], ['/blog', 'Blog'], ['/gallery', 'Gallery'], ['/emi-calculator', 'EMI Calculator'], ['/contact', 'Contact'], ['/login', 'Customer login'], ['/signup', 'Create account']].map(([h, l]) => <li key={h}><Link href={h} className={a}>{l}</Link></li>)}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> {site.addressLine}, {site.city}, {site.region}</li>
            <li><a href={`tel:${site.phone}`} className={`flex items-center gap-2 ${a}`}><Phone size={16} className="text-gold-400" /> {site.phoneDisplay}</a></li>
            {site.email && <li><a href={`mailto:${site.email}`} className={`flex items-center gap-2 ${a}`}><Mail size={16} className="text-gold-400" /> {site.email}</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-charcoal-400">© {new Date().getFullYear()} {site.name}. All rights reserved. <span aria-hidden="true">·</span> <Link href="/admin/login" rel="nofollow" className="hover:text-gold-300">Admin</Link></div>
    </footer>
  );
}
