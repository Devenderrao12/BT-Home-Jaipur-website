'use client';
import { useStoredIds } from './useStoredIds';
import { hasAuthCookie } from '@/lib/authClient';

export function useFavorites() {
  const { ids, toggle, has } = useStoredIds('btjh_favorites');
  // Local-first (instant). If the visitor is logged in, mirror the change to their account in the background.
  const toggleFavorite = (id: string) => {
    const adding = !ids.includes(id);
    toggle(id);
    if (hasAuthCookie()) {
      fetch('/api/favorites', { method: adding ? 'POST' : 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ property_id: id }) }).catch(() => {});
    }
  };
  return { ids, isFavorite: has, toggleFavorite };
}
