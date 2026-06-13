'use client';

import dynamic from 'next/dynamic';
import { DemoPageLayout } from '@/components/DemoPageLayout';
import type { RouletteData } from '@/lib/types';

const RouletteWheel = dynamic(
  () => import('@/components/products/roulette/RouletteWheel').then(mod => mod.RouletteWheel),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui', fontWeight: 700 }}>
        Carregando...
      </div>
    ),
  }
);

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
