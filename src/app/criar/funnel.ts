import type { GiftBase, SpotifyData, WordleData, RouletteData } from '@/lib/types';

// ─── State ────────────────────────────────────────────────────────────────────

export interface FunnelData {
  base:     GiftBase;
  spotify:  SpotifyData;
  wordle:   WordleData;
  roulette: RouletteData;
  extras:   ('wordle' | 'roulette')[];
}

export const INITIAL_FUNNEL: FunnelData = {
  base: {
    giverName:    '',
    receiverName: '',
    startDate:    '',
    startTime:    '00:00',
    coverPhoto:   '',
  },
  spotify: {
    source:         'preset',
    musicUrl:       '',
    musicTitle:     '',
    musicArtist:    '',
    topText:        'Nossa música ❤️',
    bottomText:     'Namorados há',
    photos:         [],
    specialMessage: '',
    closingPhoto:   '',
    closingCaption: '',
    reasons:        [],
  },
  wordle:   { word: '', clue: '', winMessage: '' },
  roulette: { title: 'O que vamos fazer hoje?', options: [] },
  extras:   [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

export type FunnelAction =
  | { type: 'PATCH_BASE';     payload: Partial<GiftBase> }
  | { type: 'PATCH_SPOTIFY';  payload: Partial<SpotifyData> }
  | { type: 'PATCH_WORDLE';   payload: Partial<WordleData> }
  | { type: 'PATCH_ROULETTE'; payload: Partial<RouletteData> }
  | { type: 'TOGGLE_EXTRA';   payload: 'wordle' | 'roulette' };

export function funnelReducer(state: FunnelData, action: FunnelAction): FunnelData {
  switch (action.type) {
    case 'PATCH_BASE':
      return { ...state, base:     { ...state.base,     ...action.payload } };
    case 'PATCH_SPOTIFY':
      return { ...state, spotify:  { ...state.spotify,  ...action.payload } };
    case 'PATCH_WORDLE':
      return { ...state, wordle:   { ...state.wordle,   ...action.payload } };
    case 'PATCH_ROULETTE':
      return { ...state, roulette: { ...state.roulette, ...action.payload } };
    case 'TOGGLE_EXTRA': {
      const has = state.extras.includes(action.payload);
      return {
        ...state,
        extras: has
          ? state.extras.filter(e => e !== action.payload)
          : [...state.extras, action.payload],
      };
    }
  }
}

// ─── Steps ────────────────────────────────────────────────────────────────────

export const STEPS = [
  { id: 1, title: 'Nomes & Data',  description: 'Quem são os apaixonados?' },
  { id: 2, title: 'Música',        description: 'A trilha sonora do amor' },
  { id: 3, title: 'Fotos',         description: 'O carousel do casal' },
  { id: 4, title: 'Mensagem',      description: 'Palavras do coração' },
  { id: 5, title: 'Motivos',       description: 'Por que te amo' },
  { id: 6, title: 'Extras',        description: 'Wordle e Roleta' },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

// ─── Validation ───────────────────────────────────────────────────────────────

export function canAdvance(step: StepId, data: FunnelData): boolean {
  switch (step) {
    case 1:
      return (
        data.base.giverName.trim().length > 0 &&
        data.base.receiverName.trim().length > 0 &&
        /^\d{4}-\d{2}-\d{2}$/.test(data.base.startDate)
      );
    case 2:
      return data.spotify.musicTitle.trim().length > 0;
    default:
      return true;
  }
}
