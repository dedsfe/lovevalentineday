'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { WordleGame } from '@/components/products/wordle/WordleGame';
import type { WordleData } from '@/lib/types';

const DEMO: WordleData = {
  word:       'AMOR',
  clue:       'O que sinto por você todos os dias',
  winMessage: 'Sabia que você ia descobrir! Te amo demais 💚',
};

export default function DemoWordle() {
  return (
    <DemoPageLayout bg="#0F172A">
      <WordleGame data={DEMO} />
    </DemoPageLayout>
  );
}
