'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Building2, Users, FileText, MessageSquareQuote,
  Images, Tags, LogOut,
} from 'lucide-react';
import { classNames } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-64 bg-charcoal-950 text-white min-h-screen p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="font-display text-xl font-bold">BT_Jaipur_Homes</h2>
        <p className="text-xs text-charcoal-400">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== '/admin' && pathname?.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={classNames(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active ? 'bg-gold-500 text-white' : 'text-charcoal-300 hover:bg-charcoal-800'
              )}
            >
              <l.icon size={18} /> {l.label}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal-300 hover:bg-charcoal-800">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
