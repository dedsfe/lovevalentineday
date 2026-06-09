'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import type { RouletteData } from '@/lib/types';

const DEMO: RouletteData = {
  title:   'O que a gente vai fazer hoje, meu amor? 💕',
  options: ['Jantar romântico', 'Cinema juntos', 'Netflix e pipoca', 'Passeio ao pôr do sol', 'Spa em casa', 'Surpresa do Lucas'],
};

export default function DemoRoulette() {
  return (
    <DemoPageLayout bg="#0F172A">
      <RouletteWheel data={DEMO} />
    </DemoPageLayout>
  );
}
