import { createClient } from '@/lib/supabase/server';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

export default async function AdminTestimonialsPage() {
  const supabase = createClient();
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Testimonials</h1>
      <TestimonialsManager initialTestimonials={testimonials || []} />
    </div>
  );
}
