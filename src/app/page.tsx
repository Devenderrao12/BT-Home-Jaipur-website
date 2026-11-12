import Link from 'next/link';
import { Suspense } from 'react';
import { LandPlot, Home, Building2, Sparkles, Search, CalendarCheck, KeyRound, MessageCircle, ArrowRight } from 'lucide-react';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import Testimonials from '@/components/Testimonials';
import GoogleMap from '@/components/GoogleMap';
import CallButton from '@/components/CallButton';
import Reveal from '@/components/Reveal';
import { site } from '@/lib/site';
import { whatsappLink } from '@/lib/utils';

export const revalidate = 60;

const categories = [
  { name: 'Plots', href: '/plots', icon: LandPlot, desc: 'Residential & investment plots' },
  { name: 'Villas', href: '/villas', icon: Home, desc: 'Independent luxury villas' },
  { name: 'Flats', href: '/flats', icon: Building2, desc: 'Modern apartments across Jaipur' },
  { name: 'New Launch', href: '/new-launch', icon: Sparkles, desc: 'Latest project launches' },
];
const steps = [
  { icon: Search, title: 'Explore', text: 'Search by location, budget and type. Save favourites and compare side by side.' },
  { icon: CalendarCheck, title: 'Visit', text: 'Book a site visit at a time that suits you — we confirm by phone or WhatsApp.' },
  { icon: KeyRound, title: 'Decide', text: 'Get clear guidance on pricing, paperwork and next steps before you commit.' },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="py-20 md:py-24">
        <div className="container-luxury">
          <Reveal className="mb-12 text-center">
            <p className="section-label">Browse by category</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Find what you&apos;re looking for</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 70}>
                <Link href={c.href} className="group block h-full rounded-2xl border border-charcoal-100 bg-white p-6 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-luxury md:p-8">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-700 transition group-hover:bg-gold-500 group-hover:text-charcoal-950"><c.icon size={26} /></span>
                  <h3 className="mt-4 text-lg font-bold">{c.name}</h3>
                  <p className="mt-1 text-sm text-charcoal-500">{c.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 opacity-0 transition group-hover:opacity-100 max-md:opacity-100">Explore <ArrowRight size={14} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-[600px]" />}><FeaturedProperties /></Suspense>

      <section className="defer-render bg-charcoal-50 py-20 md:py-24">
        <div className="container-luxury">
          <Reveal className="mb-12 text-center"><p className="section-label">How it works</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">From search to site visit</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 90} className="rounded-2xl bg-white p-7 shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 text-gold-300"><s.icon size={22} /></span>
                <h3 className="mt-5 text-xl font-bold"><span className="mr-2 text-gold-700">{i + 1}.</span>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="defer-render py-20 md:py-24">
        <div className="container-luxury grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="section-label">Visit us</p>
            <h2 className="mb-4 mt-2 text-3xl font-bold">{site.addressLine}, {site.city}</h2>
            <p className="mb-6 text-charcoal-600">Drop by for a personal consultation, or schedule a site visit for any of our properties.</p>
            <div className="flex flex-col gap-3 sm:flex-row"><CallButton /><Link href="/contact" className="btn-gold">Schedule a visit</Link></div>
          </Reveal>
          <Reveal delay={100}><GoogleMap /></Reveal>
        </div>
      </section>

      <Testimonials />

      <section className="py-16">
        <div className="container-luxury">
          <Reveal className="relative overflow-hidden rounded-3xl bg-charcoal-950 px-6 py-12 text-center text-white md:py-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(193,154,75,0.3),transparent_65%)]" />
            <h2 className="relative text-3xl font-bold md:text-4xl">Ready to see a property in person?</h2>
            <p className="relative mx-auto mt-3 max-w-lg text-charcoal-200">Tell us what you&apos;re looking for and we&apos;ll get back to you.</p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={whatsappLink(site.whatsapp, `Hi ${site.name}, I'd like help finding a property in Jaipur.`)} target="_blank" rel="noopener noreferrer" className="btn-gold"><MessageCircle size={16} /> WhatsApp us</a>
              <Link href="/contact" className="btn-light">Request a visit</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
