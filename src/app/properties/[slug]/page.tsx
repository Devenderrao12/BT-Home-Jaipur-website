import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { BedDouble, Bath, Ruler, Compass, Layers, MapPin, Phone, MessageCircle, CalendarCheck, Sofa } from 'lucide-react';
import { getPropertyBySlug, getRelatedProperties } from '@/lib/data/properties';
import { formatPrice, formatArea, whatsappLink, propertyWhatsAppMessage, toPlainText } from '@/lib/utils';
import { site, absoluteUrl } from '@/lib/site';
import { PROPERTY_PLACEHOLDER } from '@/lib/constants';
import PropertyGallery from '@/components/PropertyGallery';
import ScheduleVisitForm from '@/components/ScheduleVisitForm';
import GoogleMap from '@/components/GoogleMap';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getPropertyBySlug(params.slug);
  if (!p) return { title: 'Property not found', robots: { index: false } };
  const title = p.meta_title || `${p.title}${p.category?.name ? ` – ${p.category.name}` : ''} in ${p.city || site.city}`;
  const description = p.meta_description || toPlainText(p.description) || `${p.title} — ${formatPrice(p.price)}. ${p.address || ''} ${p.city}. Listed by ${site.name}.`.trim();
  const img = p.images?.[0]?.url;
  return {
    title, description,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title, description, url: `/properties/${p.slug}`, type: 'website', images: img ? [{ url: img, alt: p.title }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: img ? [img] : undefined },
  };
}

function videoEmbed(url: string): { kind: 'file' | 'iframe'; src: string } {
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { kind: 'file', src: url };
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  return { kind: 'iframe', src: url };
}

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const p = await getPropertyBySlug(params.slug);
  if (!p) notFound();
  const related = await getRelatedProperties(p, 3);

  const sorted = [...(p.images || [])].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order);
  const images = sorted.length ? sorted.map((i) => ({ url: i.url, alt: i.alt_text || `${p.title} – photo` })) : [{ url: PROPERTY_PLACEHOLDER, alt: p.title }];

  const isRent = p.listing_type === 'rent' && !!p.monthly_rent;
  const priceText = isRent ? `${formatPrice(p.monthly_rent!)} / month` : formatPrice(p.price);
  const url = absoluteUrl(`/properties/${p.slug}`);
  const wa = whatsappLink(site.whatsapp, propertyWhatsAppMessage(p.title, url, priceText));

  const facts = [
    p.bedrooms ? { icon: BedDouble, label: 'Bedrooms', value: p.bedrooms } : null,
    p.bathrooms ? { icon: Bath, label: 'Bathrooms', value: p.bathrooms } : null,
    p.area_sqft ? { icon: Ruler, label: 'Area', value: formatArea(p.area_sqft) } : null,
    p.facing ? { icon: Compass, label: 'Facing', value: p.facing } : null,
    p.total_floors ? { icon: Layers, label: 'Floor', value: `${p.floor_number ?? '–'} of ${p.total_floors}` } : null,
    p.furnishing ? { icon: Sofa, label: 'Furnishing', value: p.furnishing } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string | number }[];

  const video = p.video_url ? videoEmbed(p.video_url) : null;
  const crumbs = [{ name: 'Properties', href: '/properties' }, ...(p.category ? [{ name: p.category.name, href: `/${p.category.slug}` }] : []), { name: p.title, href: `/properties/${p.slug}` }];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="border-b border-charcoal-100 bg-charcoal-50"><div className="container-luxury py-4"><Breadcrumbs items={crumbs} /></div></div>

      <div className="container-luxury grid gap-10 py-8 lg:grid-cols-[1fr_380px] lg:py-12">
        <div className="min-w-0 space-y-10">
          <PropertyGallery images={images} title={p.title} />

          <header>
            <div className="flex flex-wrap items-center gap-2">
              {p.category?.name && <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-700">{p.category.name}</span>}
              {p.status === 'sold' && <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Sold</span>}
              {p.status === 'on_hold' && <span className="rounded-full bg-charcoal-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">On hold</span>}
              {isRent && <span className="rounded-full bg-charcoal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal-700">For rent</span>}
            </div>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">{p.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-charcoal-500"><MapPin size={16} className="shrink-0" /> {[p.address, p.city].filter(Boolean).join(', ')}</p>
            <p className="mt-4 font-display text-3xl font-bold text-gold-700 md:text-4xl">{priceText}</p>
            {p.is_price_negotiable && <p className="mt-1 text-sm text-charcoal-500">Price negotiable</p>}
            {!isRent && p.price_per_sqft ? <p className="text-sm text-charcoal-500">{formatPrice(p.price_per_sqft)} per sq.ft</p> : null}
          </header>

          {facts.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 rounded-2xl border border-charcoal-100 p-5 sm:grid-cols-3" aria-label="Key facts">
              {facts.map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <f.icon className="shrink-0 text-gold-700" size={22} aria-hidden />
                  <div><p className="text-xs uppercase tracking-wide text-charcoal-500">{f.label}</p><p className="text-sm font-semibold">{f.value}</p></div>
                </li>
              ))}
            </ul>
          )}

          {p.description && <section><h2 className="mb-3 text-2xl font-bold">About this property</h2><p className="whitespace-pre-line leading-relaxed text-charcoal-600">{p.description}</p></section>}

          {p.amenities?.length > 0 && (
            <section><h2 className="mb-3 text-2xl font-bold">Amenities</h2>
              <ul className="flex flex-wrap gap-2">{p.amenities.map((a) => <li key={a} className="rounded-full border border-charcoal-100 bg-charcoal-50 px-4 py-1.5 text-sm text-charcoal-700">{a}</li>)}</ul>
            </section>
          )}

          {video && (
            <section><h2 className="mb-3 text-2xl font-bold">Video</h2>
              <div className="aspect-video overflow-hidden rounded-2xl bg-charcoal-950">
                {video.kind === 'file'
                  ? <video src={video.src} controls preload="none" playsInline className="h-full w-full" />
                  : <iframe src={video.src} title={`${p.title} video`} loading="lazy" allowFullScreen className="h-full w-full" />}
              </div>
            </section>
          )}

          <section className="defer-render"><h2 className="mb-3 text-2xl font-bold">Location</h2><GoogleMap title={`Map of ${p.title}`} embedUrl={p.latitude && p.longitude ? `https://www.google.com/maps?q=${p.latitude},${p.longitude}&output=embed` : p.address ? `https://www.google.com/maps?q=${encodeURIComponent(`${p.address}, ${p.city}`)}&output=embed` : undefined} /></section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-luxury hidden space-y-3 p-5 lg:block">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold w-full"><MessageCircle size={16} /> Enquire on WhatsApp</a>
            <a href={`tel:${site.phone}`} className="btn-outline w-full"><Phone size={16} /> Call {site.phoneDisplay}</a>
          </div>
          <ScheduleVisitForm id="visit" propertyId={p.id} propertyTitle={p.title} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-luxury defer-render pb-12"><h2 className="mb-6 text-2xl font-bold">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{related.map((r) => <PropertyCard key={r.id} property={r} />)}</div>
        </section>
      )}

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-charcoal-100 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <a href={`tel:${site.phone}`} className="btn-outline !px-2 !py-3"><Phone size={16} /> Call</a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold !bg-[#25D366] !px-2 !py-3 text-white hover:!bg-[#1ebe5a]"><MessageCircle size={16} /> WhatsApp</a>
        <a href="#visit" className="btn-gold !px-2 !py-3"><CalendarCheck size={16} /> Visit</a>
      </div>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'RealEstateListing', name: p.title, url,
        description: toPlainText(p.description, 500) || undefined,
        datePosted: p.created_at,
        image: sorted.map((i) => i.url),
        offers: { '@type': 'Offer', price: isRent ? p.monthly_rent : p.price, priceCurrency: 'INR', availability: p.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock', url },
        contentLocation: { '@type': 'Place', name: p.title, address: { '@type': 'PostalAddress', streetAddress: p.address || undefined, addressLocality: p.city || site.city, addressRegion: site.region, addressCountry: site.country } },
        provider: { '@id': absoluteUrl('/#business') },
      }} />
    </div>
  );
}
