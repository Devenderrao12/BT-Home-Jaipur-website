import { Phone } from 'lucide-react';
import { site } from '@/lib/site';

export default function CallButton({ className = '' }: { className?: string }) {
  return <a href={`tel:${site.phone}`} className={`btn-outline ${className}`}><Phone size={16} /> Call {site.phoneDisplay}</a>;
}
