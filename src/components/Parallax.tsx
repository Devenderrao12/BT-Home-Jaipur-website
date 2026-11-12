'use client';
import { useEffect, useRef } from 'react';

// Subtle parallax: one passive scroll listener, rAF-throttled, transform-only.
// Disabled for reduced-motion users and small/low-power screens.
export default function Parallax({ children, speed = 0.12, className = '' }: { children?: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (window.scrollY < window.innerHeight * 1.2) el.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={className} aria-hidden="true">{children}</div>;
}
