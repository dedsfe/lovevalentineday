'use client';

import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import type { RouletteData } from '@/lib/types';

const DEMO: RouletteData = {
  title:   'O que vamos fazer hoje?',
  options: ['Cinema', 'Jantar fora', 'Netflix em casa', 'Passeio no parque', 'Spa em casa', 'Piquenique'],
};

export default function DemoRoulette() {
  return (
    <main style={{ minHeight: '100dvh', background: '#0F172A' }}>
      <RouletteWheel data={DEMO} />
    </main>
  );
}
