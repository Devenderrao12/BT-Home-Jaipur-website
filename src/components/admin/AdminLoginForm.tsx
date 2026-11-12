'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { safeNext } from '@/lib/authClient';
import { PasswordField, Alert, friendlyAuthError } from '@/components/auth/AuthUI';

export default function AdminLoginForm({ next, forbidden }: { next?: string; forbidden?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(forbidden ? 'That account does not have admin access.' : '');
  const [fails, setFails] = useState(0); const [lockUntil, setLockUntil] = useState(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Date.now() < lockUntil) return setErr(`Too many failed attempts. Try again in ${Math.ceil((lockUntil - Date.now()) / 1000)}s.`);
    setBusy(true); setErr('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      const n = fails + 1; setFails(n); setBusy(false);
      if (n >= 5) { setLockUntil(Date.now() + 60_000); setFails(0); }
      return setErr(friendlyAuthError(error?.message || ''));
    }
    // Signed in — but being a valid USER is not enough: the profile role must be 'admin'
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut(); setBusy(false);
      return setErr('That account does not have admin access.');
    }
    router.replace(safeNext(next, '/admin')); router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-luxury">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-950 text-gold-300"><ShieldCheck size={24} /></span>
          <h1 className="mt-3 font-display text-2xl font-bold">Admin sign in</h1>
          <p className="text-sm text-charcoal-500">BT_Jaipur_Homes dashboard</p>
        </div>
        <div><label htmlFor="ad-email" className="mb-1 block text-sm font-medium">Email</label><input id="ad-email" type="email" required autoComplete="username" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
        <PasswordField id="ad-pass" value={password} onChange={setPassword} autoComplete="current-password" minLength={1} />
        {err && <Alert>{err}</Alert>}
        <button disabled={busy} className="btn-gold w-full disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-center text-xs text-charcoal-500"><Link href="/" className="hover:text-gold-700">← Back to website</Link></p>
      </form>
    </div>
  );
}
