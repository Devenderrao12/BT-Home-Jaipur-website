'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-charcoal-100 bg-white p-6 shadow-luxury sm:p-8">
      <h1 className="text-center font-display text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-center text-sm text-charcoal-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function PasswordField({ id, label = 'Password', value, onChange, autoComplete, minLength = 8 }: { id: string; label?: string; value: string; onChange: (v: string) => void; autoComplete: string; minLength?: number }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} required minLength={minLength} maxLength={72} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className="input !pr-12" />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-charcoal-500 hover:text-charcoal-900">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export const Alert = ({ kind = 'error', children }: { kind?: 'error' | 'ok'; children: React.ReactNode }) => (
  <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-sm ${kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{children}</p>
);

export function friendlyAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'Incorrect email or password.';
  if (m.includes('not confirmed')) return 'Please confirm your email first — check your inbox for the link.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a few minutes and try again.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'An account with this email already exists. Try logging in.';
  if (m.includes('password') && (m.includes('weak') || m.includes('least') || m.includes('characters'))) return 'Please choose a stronger password (at least 8 characters).';
  return 'Something went wrong. Please try again.';
}
