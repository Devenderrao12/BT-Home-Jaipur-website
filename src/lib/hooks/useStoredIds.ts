'use client';
import { useCallback, useSyncExternalStore } from 'react';

// Tiny shared store so every component (cards, navbar counters, pages) stays in sync.
const cache = new Map<string, string[]>();
const listeners = new Map<string, Set<() => void>>();
const EMPTY: string[] = [];

function read(key: string): string[] {
  if (typeof window === 'undefined') return EMPTY;
  if (!cache.has(key)) {
    try { cache.set(key, JSON.parse(localStorage.getItem(key) || '[]')); } catch { cache.set(key, []); }
  }
  return cache.get(key)!;
}
function write(key: string, next: string[]) {
  cache.set(key, next);
  try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  listeners.get(key)?.forEach((l) => l());
}
function subscribe(key: string, cb: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === key) { cache.delete(key); cb(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.get(key)!.delete(cb); window.removeEventListener('storage', onStorage); };
}

export function useStoredIds(key: string, max = Infinity) {
  const ids = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => read(key),
    () => EMPTY
  );
  const toggle = useCallback((id: string) => {
    const cur = read(key);
    if (cur.includes(id)) return write(key, cur.filter((x) => x !== id));
    if (cur.length >= max) return false;
    write(key, [...cur, id]);
  }, [key, max]);
  const clear = useCallback(() => write(key, []), [key]);
  return { ids, toggle, clear, has: (id: string) => ids.includes(id) };
}
