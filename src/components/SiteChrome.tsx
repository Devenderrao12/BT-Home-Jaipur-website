'use client';
import { usePathname } from 'next/navigation';

// Public header/footer/WhatsApp are hidden on the admin screens (which have their own layout)
export default function SiteChrome({ header, footer, float, children }: { header: React.ReactNode; footer: React.ReactNode; float: React.ReactNode; children: React.ReactNode }) {
  const admin = (usePathname() || '').startsWith('/admin');
  if (admin) return <main id="main">{children}</main>;
  return <>{header}<main id="main">{children}</main>{footer}{float}</>;
}
