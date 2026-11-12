import { Metadata } from 'next';
import Link from 'next/link';
import CallButton from '@/components/CallButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Us',
  description: `${site.name} — residential plots, villas and flats on ${site.addressLine}, ${site.city}.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-charcoal-950 text-white"><div className="container-luxury py-10 md:py-14">
        <Breadcrumbs dark items={[{ name: 'About', href: '/about' }]} />
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">About {site.name}</h1>
      </div></section>
      <div className="container-luxury max-w-3xl py-12 md:py-16">
        <p className="mb-4 leading-relaxed text-charcoal-600">
          BT_Jaipur_Homes is a premium real estate business based on Kalwar Road, Jaipur, helping
          families and investors find the right flats, villas and plots. We combine local market
          expertise with a transparent, client-first approach — from the first site visit to the
          final registry.
        </p>
        <p className="mb-4 leading-relaxed text-charcoal-600">
          Whether you&apos;re looking for a ready-to-move flat, a new-launch villa project, an
          investment plot, or a resale opportunity, our team curates listings across Jaipur and
          guides you through financing, paperwork, and negotiation.
        </p>
        <p className="mb-10 leading-relaxed text-charcoal-600">
          We&apos;re growing — new locations across Jaipur, rental listings, and commercial
          properties are coming soon.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row"><CallButton /><Link href="/contact" className="btn-gold">Contact us</Link></div>
      </div>
    </>
  );
}
