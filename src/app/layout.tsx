import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SiteChrome from '@/components/SiteChrome';
import JsonLd from '@/components/JsonLd';
import { site, absoluteUrl } from '@/lib/site';

const sans = localFont({ src: './fonts/inter.woff2', variable: '--font-sans', display: 'swap', weight: '100 900' });
const display = localFont({ src: './fonts/playfair.woff2', variable: '--font-display', display: 'swap', weight: '400 900' });

const description = `Residential plots, villas and flats for sale on ${site.addressLine}, ${site.city}. Browse listings, compare properties and schedule a site visit with ${site.name}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: `Real Estate in Jaipur – Plots, Villas & Flats | ${site.name}`, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: { title: `Real Estate in Jaipur | ${site.name}`, description, url: site.siteUrl, siteName: site.name, locale: 'en_IN', type: 'website' },
  twitter: { card: 'summary_large_image', title: `Real Estate in Jaipur | ${site.name}`, description },
  robots: { index: true, follow: true },
  // Add your Google Search Console token as NEXT_PUBLIC_GSC_VERIFICATION to verify ownership
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a1221' };

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': absoluteUrl('/#business'),
  name: site.name,
  url: site.siteUrl,
  telephone: site.phone,
  ...(site.email ? { email: site.email } : {}),
  areaServed: { '@type': 'City', name: site.city },
  address: { '@type': 'PostalAddress', streetAddress: site.addressLine, addressLocality: site.city, addressRegion: site.region, addressCountry: site.country },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <SiteChrome header={<Navbar />} footer={<Footer />} float={<WhatsAppButton />}>{children}</SiteChrome>
        <JsonLd data={localBusiness} />
      </body>
    </html>
  );
}
