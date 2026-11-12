'use client';
import { useState } from 'react';
import { useStoredIds } from './useStoredIds';

export const MAX_COMPARE = 4;

export function useCompare() {
  const { ids, toggle, clear, has } = useStoredIds('btjh_compare', MAX_COMPARE);
  const [notice, setNotice] = useState('');
  const toggleCompare = (id: string) => {
    if (toggle(id) === false) {
      setNotice(`You can compare up to ${MAX_COMPARE} properties.`);
      setTimeout(() => setNotice(''), 2500);
    }
  };
  return { ids, isInCompare: has, toggleCompare, clearCompare: clear, notice };
}
