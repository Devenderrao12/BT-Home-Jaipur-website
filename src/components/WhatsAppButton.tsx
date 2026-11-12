'use client';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';
import { whatsappLink } from '@/lib/utils';

export default function WhatsAppButton({ message }: { message?: string }) {
  const pathname = usePathname() || '';
  // property pages have their own sticky action bar; admin has none
  if (pathname.startsWith('/admin') || pathname.startsWith('/properties/')) return null;
  return (
    <a
      href={whatsappLink(site.whatsapp, message || `Hi ${site.name}, I am interested in a property.`)}
      target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-luxury transition-transform duration-200 hover:scale-110 active:scale-95"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" aria-hidden="true"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.362.694 4.566 1.887 6.416L4 29l7.78-1.844A11.93 11.93 0 0016 27c6.628 0 12-5.373 12-12S22.629 3 16.001 3zm.001 21.75a9.7 9.7 0 01-4.95-1.354l-.355-.21-4.62 1.095 1.117-4.5-.232-.368A9.72 9.72 0 016.25 15c0-5.38 4.372-9.75 9.752-9.75 5.38 0 9.75 4.37 9.75 9.75s-4.37 9.75-9.75 9.75zm5.35-7.297c-.293-.147-1.734-.856-2.003-.954-.269-.098-.465-.147-.66.147-.196.293-.758.953-.929 1.148-.171.196-.343.22-.635.073-.293-.147-1.238-.456-2.36-1.456-.872-.778-1.462-1.738-1.633-2.03-.171-.293-.018-.451.129-.598.132-.132.293-.343.44-.514.147-.171.196-.293.294-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.588-.905-2.175-.238-.572-.48-.494-.66-.503l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.002-1.026 2.443 0 1.442 1.05 2.835 1.197 3.03.147.196 2.066 3.155 5.007 4.424.699.302 1.245.482 1.67.617.702.223 1.34.192 1.845.117.563-.084 1.734-.709 1.978-1.393.245-.685.245-1.271.171-1.393-.073-.123-.269-.196-.562-.343z" /></svg>
    </a>
  );
}
