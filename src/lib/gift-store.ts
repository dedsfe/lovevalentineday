import type { FunnelData } from '@/app/criar/funnel';
import { INITIAL_FUNNEL } from '@/app/criar/funnel';

export interface StoredGift {
  id:        string;
  createdAt: string;
  funnel:    FunnelData;
  addons:    string[];
  status?:   'pending' | 'paid';
}

const KEY = (id: string) => `lv_gift_${id}`;

// Busca no Supabase via API; cai pro localStorage se não achar (presentes antigos)
export async function fetchGift(id: string): Promise<StoredGift | null> {
  try {
    const res = await fetch(`/api/gifts?id=${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      return { ...data, funnel: { ...INITIAL_FUNNEL, ...data.funnel } };
    }
  } catch { /* offline ou API fora — tenta localStorage */ }
  return loadGift(id);
}

export function loadGift(id: string): StoredGift | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Merge with defaults so new fields added later don't break old gifts
    return { ...parsed, funnel: { ...INITIAL_FUNNEL, ...parsed.funnel } };
  } catch { return null; }
}
