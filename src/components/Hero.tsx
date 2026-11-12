import PropertySearch from './PropertySearch';
import Parallax from './Parallax';
import { site } from '@/lib/site';

// Hero is pure CSS/SVG (no image request) → text is the LCP element, paints immediately.
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-950 text-white">
      <Parallax speed={0.18} className="absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(193,154,75,0.30),transparent_65%)] drift" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(86,102,131,0.35),transparent_65%)]" />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0a1221_0%,#131c30_70%,#1f2b42_100%)] opacity-90" />
      <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full text-white/[0.05] md:h-56" viewBox="0 0 1440 220" preserveAspectRatio="none" fill="currentColor">
        <path d="M0 220V150h60v-40h50v40h40V90h70v60h50v-50h60v50h45V60h80v90h40v-30h70v30h55V80h60v70h50v-45h65v45h40V70h75v80h50v-40h60v40h45v-60h70v60h60V110h55v110z" />
      </svg>

      <div className="container-luxury pb-16 pt-14 md:pb-24 md:pt-24">
        <p className="hero-rise section-label !text-gold-300">{site.addressLine} · {site.city}</p>
        <h1 className="hero-rise mt-4 max-w-3xl text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl" style={{ ['--d' as any]: '80ms' }}>
          Plots, villas &amp; flats in <span className="text-gold-300">Jaipur</span>, chosen with care.
        </h1>
        <p className="hero-rise mt-5 max-w-xl text-base text-charcoal-200 md:text-lg" style={{ ['--d' as any]: '160ms' }}>
          Explore residential properties, compare your options and book a site visit — all in one place.
        </p>
        <div className="hero-rise mt-10 max-w-5xl" style={{ ['--d' as any]: '240ms' }}><PropertySearch /></div>
      </div>
    </section>
  );
}
