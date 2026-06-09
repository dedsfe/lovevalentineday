'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { WordleGame } from '@/components/products/wordle/WordleGame';
import type { WordleData } from '@/lib/types';

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
