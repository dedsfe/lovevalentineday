'use client';

import dynamic from 'next/dynamic';
import { DemoPageLayout } from '@/components/DemoPageLayout';
import type { WordleData } from '@/lib/types';

const WordleGame = dynamic(
  () => import('@/components/products/wordle/WordleGame').then(mod => mod.WordleGame),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui', fontWeight: 700 }}>
        Carregando...
      </div>
    ),
  }
);

const DEMO: WordleData = {
  word:       'LINDA',
  clue:       'Como eu te chamo todo dia, porque é a pura verdade',
  winMessage: 'Acertou! Você é linda por dentro e por fora. Te amo demais, meu amor. 💚💕',
};

export default function DemoWordle() {
  return (
    <DemoPageLayout bg="#0F172A">
      <WordleGame data={DEMO} />
    </DemoPageLayout>
  );
}
