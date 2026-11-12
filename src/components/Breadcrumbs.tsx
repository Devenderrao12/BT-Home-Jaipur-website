import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import JsonLd from './JsonLd';
import { absoluteUrl } from '@/lib/site';

export interface Crumb { name: string; href: string }

export default function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const all = [{ name: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-xs ${dark ? 'text-charcoal-300' : 'text-charcoal-500'}`}>
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} aria-hidden />}
              {i === all.length - 1 ? <span aria-current="page" className="font-medium">{c.name}</span> : <Link href={c.href} className="hover:text-gold-700">{c.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
      }} />
    </>
  );
}
