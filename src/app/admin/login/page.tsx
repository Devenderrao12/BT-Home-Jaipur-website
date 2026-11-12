import { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = { title: 'Admin sign in', robots: { index: false, follow: false } };

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  return <AdminLoginForm next={searchParams.next} forbidden={searchParams.error === 'forbidden'} />;
}
