'use client';
import { useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { site } from '@/lib/site';
import { whatsappLink } from '@/lib/utils';

export default function ScheduleVisitForm({ propertyId, propertyTitle, id }: { propertyId?: string; propertyTitle?: string; id?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('loading'); setMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId || null,
          name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'),
          preferred_date: fd.get('date') || null, preferred_time: fd.get('time') || null,
          message: fd.get('message'), website: fd.get('website'), // honeypot
          source: 'website',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Could not send your request.');
      setState('success'); form.reset();
    } catch (err: any) {
      setState('error'); setMsg(err.message || 'Something went wrong. Please call or WhatsApp us.');
    }
  }

  if (state === 'success') {
    return (
      <div id={id} className="card-luxury p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto text-green-600" size={40} />
        <h2 className="mt-3 font-display text-xl font-bold">Request received</h2>
        <p className="mt-1 text-sm text-charcoal-600">Thank you — our team will contact you shortly to confirm your visit.</p>
        <a className="btn-outline mt-5 w-full" target="_blank" rel="noopener noreferrer" href={whatsappLink(site.whatsapp, `Hi ${site.name}, I just requested a visit${propertyTitle ? ` for "${propertyTitle}"` : ''}.`)}><MessageCircle size={16} /> Message us on WhatsApp</a>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} className="card-luxury scroll-mt-24 space-y-4 p-6" noValidate={false}>
      <div>
        <h2 className="font-display text-xl font-bold">Schedule a visit</h2>
        <p className="mt-1 text-sm text-charcoal-500">Takes under a minute. We&apos;ll confirm by phone.</p>
      </div>
      {/* honeypot – hidden from people, bots fill it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      <div><label htmlFor={`${id}-name`} className="mb-1 block text-sm font-medium">Your name</label><input id={`${id}-name`} name="name" required minLength={2} maxLength={80} autoComplete="name" className="input" /></div>
      <div><label htmlFor={`${id}-phone`} className="mb-1 block text-sm font-medium">Mobile number</label><input id={`${id}-phone`} name="phone" required type="tel" inputMode="tel" autoComplete="tel" pattern="^(\+91|91|0)?[ \-]?[6-9][0-9]{4}[ \-]?[0-9]{5}$" title="Enter a 10-digit Indian mobile number" placeholder="98765 43210" className="input" /></div>
      <div><label htmlFor={`${id}-email`} className="mb-1 block text-sm font-medium">Email <span className="text-charcoal-500">(optional)</span></label><input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" className="input" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor={`${id}-date`} className="mb-1 block text-sm font-medium">Preferred date</label><input id={`${id}-date`} name="date" type="date" min={today} className="input" /></div>
        <div><label htmlFor={`${id}-time`} className="mb-1 block text-sm font-medium">Time</label><input id={`${id}-time`} name="time" type="time" className="input" /></div>
      </div>
      <div><label htmlFor={`${id}-msg`} className="mb-1 block text-sm font-medium">Message <span className="text-charcoal-500">(optional)</span></label><textarea id={`${id}-msg`} name="message" rows={3} maxLength={1000} defaultValue={propertyTitle ? `I'd like to visit "${propertyTitle}".` : ''} className="input" /></div>
      <button type="submit" disabled={state === 'loading'} className="btn-gold w-full disabled:opacity-60">{state === 'loading' ? 'Sending…' : 'Request a visit'}</button>
      {state === 'error' && <p role="alert" className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}
