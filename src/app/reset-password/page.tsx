import { Metadata } from 'next';
import { ResetForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = { title: 'Reset password', robots: { index: false, follow: false }, alternates: { canonical: '/reset-password' } };

export default function Page({ searchParams }: { searchParams: { [k: string]: string | undefined } }) {
  return <div className="bg-charcoal-50 px-4 py-12 md:py-20"><ResetForm /></div>;
}
