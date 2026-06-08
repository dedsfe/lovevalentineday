'use client';

import { useState } from 'react';
import { RouletteWheel }  from '@/components/products/roulette/RouletteWheel';
import { RouletteConfig } from '@/components/products/roulette/RouletteConfig';
import type { RouletteData } from '@/lib/types';

const DEFAULT: RouletteData = {
  title:   'O que vamos fazer hoje?',
  options: ['Cinema', 'Jantar fora', 'Netflix em casa', 'Passeio no parque'],
};

export default function DemoRoulette() {
  const [roulette, setRoulette] = useState<RouletteData>(DEFAULT);

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <h1 className="text-xl font-black text-center mb-8">Demo — Roleta do Casal</h1>

      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        <div className="bg-white rounded-3xl border-2 border-black p-6 neo-shadow">
          <h2 className="text-sm font-black uppercase tracking-wide mb-5">Configurar</h2>
          <RouletteConfig value={roulette} onChange={setRoulette} />
        </div>

        <div className="flex justify-center lg:sticky lg:top-10">
          <RouletteWheel data={roulette} />
        </div>

      </div>
    </main>
  );
}
