import { site } from '@/lib/site';

export default function GoogleMap({ embedUrl, title = 'Map showing our location' }: { embedUrl?: string; title?: string }) {
  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl bg-charcoal-100 shadow-luxury">
      <iframe title={title} src={embedUrl || site.mapsEmbed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </div>
  );
}
