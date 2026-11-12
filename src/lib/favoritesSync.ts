'use client';
const KEY = 'btjh_favorites';

/** After login/signup: merge this device's wishlist into the account and pull the merged list back. */
export async function syncFavorites() {
  try {
    const local: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    const res = await fetch('/api/favorites/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: local }) });
    if (!res.ok) return;
    const { ids } = await res.json();
    localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new StorageEvent('storage', { key: KEY })); // refresh counters in this tab
  } catch {}
}
