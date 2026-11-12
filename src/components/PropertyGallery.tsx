'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';

export interface GalleryImage { url: string; alt: string }

export default function PropertyGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = images.length;
  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (!lightbox) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(false); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [lightbox, go]);

  const cur = images[active];
  return (
    <div>
      <button type="button" onClick={() => n && setLightbox(true)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-charcoal-100 md:aspect-[16/10]">
        <span className="sr-only">Open {title} photo gallery</span>
        <Image src={cur.url} alt={cur.alt} fill priority={active === 0} sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
        {n > 1 && <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal-950/80 px-3 py-1.5 text-xs font-semibold text-white"><Images size={14} /> {active + 1} / {n}</span>}
      </button>

      {n > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="list">
          {images.map((img, i) => (
            <button key={img.url + i} role="listitem" onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === active}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition md:h-20 md:w-28 ${i === active ? 'border-gold-500' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <Image src={img.url} alt="" fill sizes="112px" className="object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label={`${title} photos`} className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal-950/95"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touchX.current = null; }}>
          <button onClick={() => setLightbox(false)} aria-label="Close gallery" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><X size={22} /></button>
          {n > 1 && <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6"><ChevronLeft size={26} /></button>}
          <div className="relative h-[80vh] w-[94vw] max-w-6xl">
            <Image src={cur.url} alt={cur.alt} fill sizes="94vw" className="object-contain" />
          </div>
          {n > 1 && <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6"><ChevronRight size={26} /></button>}
          <p className="absolute bottom-4 text-sm text-white/70">{active + 1} / {n}</p>
        </div>
      )}
    </div>
  );
}
