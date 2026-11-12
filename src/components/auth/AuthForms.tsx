'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { safeNext } from '@/lib/authClient';
import { syncFavorites } from '@/lib/favoritesSync';
import { AuthCard, PasswordField, Alert, friendlyAuthError } from './AuthUI';

const field = 'mb-1 block text-sm font-medium';

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [resent, setResent] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(''); setUnconfirmed(false);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setBusy(false); setUnconfirmed(error.message.toLowerCase().includes('not confirmed')); return setErr(friendlyAuthError(error.message)); }
    await syncFavorites();
    router.replace(safeNext(next)); router.refresh();
  }
  async function resend() { await createClient().auth.resend({ type: 'signup', email: email.trim() }); setResent(true); }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to save properties and track your visit requests.">
      <form onSubmit={onSubmit} className="space-y-4">
        {notice && <Alert>{notice}</Alert>}
        <div><label htmlFor="li-email" className={field}>Email</label><input id="li-email" type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
        <PasswordField id="li-pass" value={password} onChange={setPassword} autoComplete="current-password" minLength={1} />
        {err && <Alert>{err}</Alert>}
        {unconfirmed && !resent && <button type="button" onClick={resend} className="text-sm font-semibold text-gold-700 hover:underline">Resend confirmation email</button>}
        {resent && <Alert kind="ok">Confirmation email sent.</Alert>}
        <button disabled={busy} className="btn-gold w-full disabled:opacity-60">{busy ? 'Logging in…' : 'Log in'}</button>
        <div className="flex justify-between text-sm"><Link href="/forgot-password" className="text-charcoal-600 hover:text-gold-700">Forgot password?</Link><Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-gold-700 hover:underline">Create account</Link></div>
      </form>
    </AuthCard>
  );
}

export function SignupForm({ next }: { next?: string }) {
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(''); const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    const { data, error } = await createClient().auth.signUp({
      email: f.email.trim(), password: f.password,
      options: { data: { full_name: f.name.trim(), phone: f.phone.trim() }, emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext(next))}` },
    });
    setBusy(false);
    if (error) return setErr(friendlyAuthError(error.message));
    if (data.session) { await syncFavorites(); router.replace(safeNext(next)); router.refresh(); } else setSent(true);
  }

  if (sent) return (
    <AuthCard title="Check your email">
      <Alert kind="ok">We&apos;ve sent a confirmation link to <strong>{f.email}</strong>. Open it to activate your account.</Alert>
      <p className="mt-4 text-center text-sm text-charcoal-500">Didn&apos;t get it? Check spam, or <Link className="font-semibold text-gold-700" href="/login">log in</Link> to resend.</p>
    </AuthCard>
  );
  return (
    <AuthCard title="Create your account" subtitle="Save favourites across devices and follow your enquiries.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div><label htmlFor="su-name" className={field}>Full name</label><input id="su-name" required minLength={2} maxLength={80} autoComplete="name" value={f.name} onChange={(e) => set('name')(e.target.value)} className="input" /></div>
        <div><label htmlFor="su-email" className={field}>Email</label><input id="su-email" type="email" required autoComplete="email" inputMode="email" value={f.email} onChange={(e) => set('email')(e.target.value)} className="input" /></div>
        <div><label htmlFor="su-phone" className={field}>Mobile <span className="text-charcoal-500">(optional)</span></label><input id="su-phone" type="tel" inputMode="tel" autoComplete="tel" pattern="^(\+91|91|0)?[ \-]?[6-9][0-9]{4}[ \-]?[0-9]{5}$" title="10-digit Indian mobile number" value={f.phone} onChange={(e) => set('phone')(e.target.value)} className="input" /></div>
        <PasswordField id="su-pass" value={f.password} onChange={set('password')} autoComplete="new-password" />
        <p className="-mt-2 text-xs text-charcoal-500">At least 8 characters.</p>
        {err && <Alert>{err}</Alert>}
        <button disabled={busy} className="btn-gold w-full disabled:opacity-60">{busy ? 'Creating account…' : 'Sign up'}</button>
        <p className="text-center text-sm text-charcoal-600">Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-gold-700 hover:underline">Log in</Link></p>
      </form>
    </AuthCard>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/auth/callback?next=/reset-password` });
    setBusy(false); setDone(true); // same message whether or not the email exists (no account enumeration)
  }
  return (
    <AuthCard title="Reset password" subtitle="We'll email you a link to choose a new password.">
      {done ? <Alert kind="ok">If an account exists for that email, a reset link is on its way.</Alert> : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div><label htmlFor="fp-email" className={field}>Email</label><input id="fp-email" type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
          <button disabled={busy} className="btn-gold w-full disabled:opacity-60">{busy ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
      <p className="mt-5 text-center text-sm"><Link href="/login" className="font-semibold text-gold-700 hover:underline">Back to log in</Link></p>
    </AuthCard>
  );
}

export function ResetForm() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [pw, setPw] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  useEffect(() => { createClient().auth.getUser().then(({ data }) => setReady(!!data.user)); }, []);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await createClient().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(friendlyAuthError(error.message));
    router.replace('/account'); router.refresh();
  }
  if (ready === false) return <AuthCard title="Link expired"><Alert>This reset link has expired or was already used.</Alert><p className="mt-4 text-center text-sm"><Link href="/forgot-password" className="font-semibold text-gold-700">Request a new link</Link></p></AuthCard>;
  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordField id="rp-pass" label="New password" value={pw} onChange={setPw} autoComplete="new-password" />
        {err && <Alert>{err}</Alert>}
        <button disabled={busy || ready === null} className="btn-gold w-full disabled:opacity-60">{busy ? 'Saving…' : 'Update password'}</button>
      </form>
    </AuthCard>
  );
}
