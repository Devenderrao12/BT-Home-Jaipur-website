'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, Heart, Scale, User } from 'lucide-react';
import { hasAuthCookie } from '@/lib/authClient';
import { site } from '@/lib/site';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useCompare } from '@/lib/hooks/useCompare';

const links = [
  { href: '/buy', label: 'Buy' },
  { href: '/rent', label: 'Rent' },
  { href: '/commercial', label: 'Commercial' },
  { href: '/flats', label: 'Flats' },
  { href: '/villas', label: 'Villas' },
  { href: '/plots', label: 'Plots' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
const drawerExtra = [
  { href: '/properties', label: 'All Properties' },
  { href: '/new-launch', label: 'New Launch' },
  { href: '/ready-to-move', label: 'Ready to Move' },
  { href: '/resale', label: 'Resale' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/emi-calculator', label: 'EMI Calculator' },
];

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-charcoal-950">{n}</span>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { ids: favs } = useFavorites();
  const { ids: cmp } = useCompare();
  const [authed, setAuthed] = useState(false);
  useEffect(() => setAuthed(hasAuthCookie()), [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const active = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(href + '/'));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal-950/95 backdrop-blur supports-[backdrop-filter]:bg-charcoal-950/85">
      <div className="container-luxury flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-white md:text-2xl" aria-label={`${site.name} home`}>
          BT_<span className="text-gold-400">Jaipur</span>_Homes
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`group relative py-2 text-sm font-medium transition-colors ${active(l.href) ? 'text-gold-300' : 'text-charcoal-100 hover:text-white'}`}>
              {l.label}
              <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold-400 transition-transform duration-300 ${active(l.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/favorites" aria-label={`Wishlist (${favs.length})`} className="relative rounded-full p-2.5 text-charcoal-100 hover:bg-white/10 hover:text-white"><Heart size={20} /><Badge n={favs.length} /></Link>
          <Link href="/compare" aria-label={`Compare (${cmp.length})`} className="relative rounded-full p-2.5 text-charcoal-100 hover:bg-white/10 hover:text-white"><Scale size={20} /><Badge n={cmp.length} /></Link>
          <Link href={authed ? '/account' : '/login'} aria-label={authed ? 'My account' : 'Log in or sign up'} className="flex items-center gap-1.5 rounded-full p-2.5 text-sm font-medium text-charcoal-100 hover:bg-white/10 hover:text-white"><User size={20} /><span className="hidden lg:inline">{authed ? 'Account' : 'Log in'}</span></Link>
          <a href={`tel:${site.phone}`} className="btn-gold ml-1 hidden !px-5 !py-2.5 sm:inline-flex"><Phone size={15} /> <span className="hidden md:inline">{site.phoneDisplay}</span><span className="md:hidden">Call</span></a>
          <button className="rounded-full p-2.5 text-white hover:bg-white/10 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-charcoal-950 xl:hidden">
          <nav className="container-luxury flex flex-col py-4" aria-label="Mobile">
            {[...links, ...drawerExtra].map((l, i) => (
              <Link key={l.href} href={l.href} style={{ animationDelay: `${i * 20}ms` }} className={`hero-rise border-b border-white/5 py-3.5 text-lg ${active(l.href) ? 'text-gold-300' : 'text-white'}`}>{l.label}</Link>
            ))}
            <Link href={authed ? '/account' : '/login'} className="hero-rise border-b border-white/5 py-3.5 text-lg text-gold-300">{authed ? 'My account' : 'Log in / Sign up'}</Link>
            <a href={`tel:${site.phone}`} className="btn-gold mt-6 w-full"><Phone size={16} /> Call {site.phoneDisplay}</a>
          </nav>
        </div>
      )}
    </header>
  );
}
