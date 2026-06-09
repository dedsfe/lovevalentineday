'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import type { RouletteData } from '@/lib/types';

const DEMO: RouletteData = {
  title:   'O que vamos fazer hoje?',
  options: ['Cinema', 'Jantar fora', 'Netflix em casa', 'Passeio no parque', 'Spa em casa', 'Piquenique'],
};

export default function DemoRoulette() {
  return (
    <DemoPageLayout bgColor="#0F172A">
      <RouletteWheel data={DEMO} />
    </DemoPageLayout>
  );
}
