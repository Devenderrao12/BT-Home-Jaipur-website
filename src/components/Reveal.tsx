'use client';
import { useEffect, useRef } from 'react';

// Scroll-triggered reveal: one IntersectionObserver per element, unobserved after first reveal.
export default function Reveal({
  children, delay = 0, className = '', as: Tag = 'div',
}: { children: React.ReactNode; delay?: number; className?: string; as?: any }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add('is-visible'); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={{ ['--d' as any]: `${delay}ms` }}>{children}</Tag>;
}
