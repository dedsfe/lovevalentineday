import type { FunnelData } from '@/app/criar/funnel';
import { INITIAL_FUNNEL } from '@/app/criar/funnel';

export interface StoredGift {
  id:        string;
  createdAt: string;
  funnel:    FunnelData;
  addons:    string[];
}

const KEY = (id: string) => `lv_gift_${id}`;

export function saveGift(gift: StoredGift): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY(gift.id), JSON.stringify(gift));
  } catch {
    // localStorage full — strip photos and retry once
    const stripped: StoredGift = {
      ...gift,
      funnel: {
        ...gift.funnel,
        spotify: {
          ...gift.funnel.spotify,
          photos: gift.funnel.spotify.photos.slice(0, 1),
          closingPhoto: '',
          albumArt: '',
        },
      },
    };
    try {
      localStorage.setItem(KEY(gift.id), JSON.stringify(stripped));
    } catch {
      // give up silently — gift ID still usable for navigation
    }
  }
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

export function generateGiftId(): string {
  return Math.random().toString(36).slice(2, 10);
}
