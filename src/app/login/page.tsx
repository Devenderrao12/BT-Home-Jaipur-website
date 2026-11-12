import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = { title: 'Log in', robots: { index: false, follow: false }, alternates: { canonical: '/login' } };

export default function Page({ searchParams }: { searchParams: { [k: string]: string | undefined } }) {
  return <div className="bg-charcoal-50 px-4 py-12 md:py-20"><LoginForm next={searchParams.next} notice={searchParams.error === 'link' ? 'That link expired or was opened in a different browser — please log in.' : undefined} /></div>;
}
