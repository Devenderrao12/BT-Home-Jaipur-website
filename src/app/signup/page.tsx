import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = { title: 'Create account', robots: { index: false, follow: false }, alternates: { canonical: '/signup' } };

export default function Page({ searchParams }: { searchParams: { [k: string]: string | undefined } }) {
  return <div className="bg-charcoal-50 px-4 py-12 md:py-20"><SignupForm next={searchParams.next} /></div>;
}
