'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Alert } from '@/components/auth/AuthUI';

export default function ProfileForm({ userId, email, fullName, phone }: { userId: string; email: string; fullName: string; phone: string }) {
  const [name, setName] = useState(fullName); const [ph, setPh] = useState(phone);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setState('saving');
    // Only name & phone can be changed — the database blocks any attempt to touch `role`
    const { error } = await createClient().from('profiles').update({ full_name: name.trim() || null, phone: ph.trim() || null }).eq('id', userId);
    setState(error ? 'error' : 'saved');
  }
  return (
    <form onSubmit={onSubmit} className="card-luxury space-y-4 p-6">
      <h2 className="font-display text-xl font-bold">Your details</h2>
      <div><label className="mb-1 block text-sm font-medium">Email</label><input value={email} disabled className="input bg-charcoal-50 text-charcoal-600" /></div>
      <div><label htmlFor="pf-name" className="mb-1 block text-sm font-medium">Full name</label><input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className="input" /></div>
      <div><label htmlFor="pf-phone" className="mb-1 block text-sm font-medium">Mobile</label><input id="pf-phone" type="tel" inputMode="tel" value={ph} onChange={(e) => setPh(e.target.value)} maxLength={20} autoComplete="tel" className="input" /></div>
      {state === 'saved' && <Alert kind="ok">Saved.</Alert>}
      {state === 'error' && <Alert>Could not save. Please try again.</Alert>}
      <button disabled={state === 'saving'} className="btn-gold disabled:opacity-60">{state === 'saving' ? 'Saving…' : 'Save changes'}</button>
    </form>
  );
}
