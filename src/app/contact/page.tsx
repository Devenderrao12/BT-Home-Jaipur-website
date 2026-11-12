import { Metadata } from 'next';
import { Phone, MapPin, Mail, MessageCircle } from 'lucide-react';
import ScheduleVisitForm from '@/components/ScheduleVisitForm';
import GoogleMap from '@/components/GoogleMap';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';
import { whatsappLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact & Schedule a Site Visit',
  description: `Contact ${site.name} on ${site.addressLine}, ${site.city}. Call ${site.phoneDisplay}, message us on WhatsApp or request a site visit.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const tile = 'card-luxury flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-luxury';
  return (
    <>
      <section className="bg-charcoal-950 text-white"><div className="container-luxury py-10 md:py-14">
        <Breadcrumbs dark items={[{ name: 'Contact', href: '/contact' }]} />
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">Contact {site.name}</h1>
        <p className="mt-3 max-w-xl text-charcoal-200">Call, message or request a visit — we&apos;ll respond as soon as we can.</p>
      </div></section>
      <div className="container-luxury grid gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-4">
          <a href={`tel:${site.phone}`} className={tile}><Phone className="mt-1 text-gold-700" /><div><p className="font-semibold">Call us</p><p className="text-sm text-charcoal-600">{site.phoneDisplay}</p></div></a>
          <a href={whatsappLink(site.whatsapp, `Hi ${site.name}, I have an enquiry.`)} target="_blank" rel="noopener noreferrer" className={tile}><MessageCircle className="mt-1 text-gold-700" /><div><p className="font-semibold">WhatsApp</p><p className="text-sm text-charcoal-600">Chat with us directly</p></div></a>
          <div className={tile}><MapPin className="mt-1 text-gold-700" /><div><p className="font-semibold">Office</p><p className="text-sm text-charcoal-600">{site.addressLine}, {site.city}, {site.region}</p></div></div>
          {site.email && <a href={`mailto:${site.email}`} className={tile}><Mail className="mt-1 text-gold-700" /><div><p className="font-semibold">Email</p><p className="text-sm text-charcoal-600">{site.email}</p></div></a>}
          <GoogleMap />
        </div>
        <ScheduleVisitForm id="contact-form" />
      </div>
    </>
  );
}
