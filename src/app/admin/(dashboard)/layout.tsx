import { Metadata } from 'next';
import AdminSidebar from '@/components/AdminSidebar';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: { absolute: 'Admin | BT_Jaipur_Homes' }, robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin(); // middleware already checked; this re-verifies on the server for every render
  return (
    <div className="flex min-h-screen bg-charcoal-50">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
