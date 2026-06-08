'use client';

import { useState } from 'react';
import { WordleGame }   from '@/components/products/wordle/WordleGame';
import { WordleConfig } from '@/components/products/wordle/WordleConfig';
import type { WordleData } from '@/lib/types';

const DEFAULT: WordleData = {
  word:       'AMOR',
  clue:       'O que sinto por você todos os dias',
  winMessage: 'Sabia que você ia descobrir! Te amo demais 💚',
};

export default function DemoWordle() {
  const [wordle, setWordle] = useState<WordleData>(DEFAULT);

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <h1 className="text-xl font-black text-center mb-8">Demo — Wordle do Amor</h1>

      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        <div className="bg-white rounded-3xl border-2 border-black p-6 neo-shadow">
          <h2 className="text-sm font-black uppercase tracking-wide mb-5">Configurar</h2>
          <WordleConfig value={wordle} onChange={setWordle} />
        </div>

        <div className="flex justify-center lg:sticky lg:top-10">
          <WordleGame data={wordle} />
        </div>

      </div>
    </main>
  );
}
