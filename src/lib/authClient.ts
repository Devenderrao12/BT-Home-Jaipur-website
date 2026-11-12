// Tiny browser-safe helpers (no Supabase SDK imported => zero JS cost on normal pages)

/** Only allow same-site relative paths as post-login redirects (prevents open-redirect phishing). */
export function safeNext(next: string | null | undefined, fallback = '/account'): string {
  if (!next || typeof next !== 'string') return fallback;
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\') || /[\r\n]/.test(next)) return fallback;
  return next;
}

/** True if a Supabase session cookie exists. UI hint only (Login vs Account) — never used for security. */
export function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return /(?:^|;\s*)sb-[^=]*-auth-token/.test(document.cookie);
}
