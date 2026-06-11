// Preços em centavos — fonte única da verdade, usada pelo checkout (cobrança)
// e pelo webhook (validação do valor pago).

export const BASE_PRICE_CENTS = 2990;

export const EXTRA_PRICE_CENTS: Record<'wordle' | 'roulette', number> = {
  wordle:   990,
  roulette: 990,
};

export const EXTRA_LABEL: Record<'wordle' | 'roulette', string> = {
  wordle:   'Wordle do Amor',
  roulette: 'Roleta Surpresa',
};

export type ExtraKey = keyof typeof EXTRA_PRICE_CENTS;

export function isExtraKey(key: string): key is ExtraKey {
  return key in EXTRA_PRICE_CENTS;
}

export function totalCents(addons: string[]): number {
  return BASE_PRICE_CENTS + addons.filter(isExtraKey).reduce((sum, k) => sum + EXTRA_PRICE_CENTS[k], 0);
}
