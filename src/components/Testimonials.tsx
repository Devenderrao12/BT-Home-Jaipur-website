import { createPublicClient } from '@/lib/supabase/public';
import { Star } from 'lucide-react';
import Reveal from './Reveal';

export default async function Testimonials() {
  const { data } = await createPublicClient().from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(6);
  const items = data || [];
  if (!items.length) return null;
  return (
    <section className="defer-render bg-charcoal-950 py-20 text-white md:py-24">
      <div className="container-luxury">
        <Reveal className="mb-12 text-center">
          <p className="section-label !text-gold-300">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">What our clients say</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t: any, i: number) => (
            <Reveal key={t.id} delay={i * 80} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div role="img" className="mb-3 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>{Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={16} className="fill-gold-400 text-gold-400" />)}</div>
              <p className="text-sm leading-relaxed text-charcoal-100">&ldquo;{t.message}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-white">{t.client_name}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
