'use client';

import { WordleGame } from '@/components/products/wordle/WordleGame';
import type { WordleData } from '@/lib/types';

const DEMO: WordleData = {
  word:       'AMOR',
  clue:       'O que sinto por você todos os dias',
  winMessage: 'Sabia que você ia descobrir! Te amo demais 💚',
};

export default function DemoWordle() {
  return (
    <main style={{ minHeight: '100dvh', background: '#0F172A' }}>
      <WordleGame data={DEMO} />
    </main>
  );
}
