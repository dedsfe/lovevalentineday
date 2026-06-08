'use client';

import { Input } from '@/components/ui/Input';
import type { WordleData } from '@/lib/types';

interface Props {
  value:    WordleData;
  onChange: (data: WordleData) => void;
}

export function WordleConfig({ value, onChange }: Props) {
  const set     = (patch: Partial<WordleData>) => onChange({ ...value, ...patch });
  const wordLen = value.word.length;
  const valid   = wordLen >= 3 && wordLen <= 10;

  const cellSize = Math.min(52, Math.floor(280 / Math.max(wordLen, 1)) - 5);

  return (
    <div className="space-y-7">

      {/* Palavra */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-ink uppercase tracking-wide">Palavra secreta</h3>
          <span className={`text-[11px] font-bold ${valid ? 'text-green-600' : 'text-amber-600'}`}>
            {wordLen}/10 letras
          </span>
        </div>

        <input
          type="text"
          value={value.word}
          onChange={e => {
            const cleaned = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
            set({ word: cleaned });
          }}
          placeholder="AMOR"
          className="w-full rounded-xl border-2 border-ink px-4 py-3 text-2xl font-black text-ink placeholder:text-ink-muted/30 focus:outline-none neo-shadow-sm bg-white tracking-[0.25em] text-center"
        />
        <p className="text-[11px] text-ink-muted font-medium">Só letras A–Z, sem acentos, de 3 a 10 caracteres.</p>

        {/* Preview mini grid */}
        {wordLen >= 3 && (
          <div className="flex gap-1.5 justify-center pt-1">
            {Array.from({ length: wordLen }, (_, i) => (
              <div
                key={i}
                style={{ width: cellSize, height: cellSize }}
                className="bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white font-black" style={{ fontSize: Math.max(11, cellSize * 0.4) }}>
                  {value.word[i] ?? ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dica */}
      <section>
        <Input
          label="Dica para quem vai jogar"
          placeholder="Ex: O que sinto por você todos os dias..."
          value={value.clue}
          onChange={e => set({ clue: e.target.value })}
          maxLength={60}
          hint="máx 60 — aparece acima do jogo como pista"
        />
      </section>

      {/* Mensagem de vitória */}
      <section className="space-y-2">
        <label className="text-xs font-bold text-ink-muted uppercase tracking-wide">Mensagem ao acertar</label>
        <textarea
          value={value.winMessage}
          onChange={e => set({ winMessage: e.target.value })}
          placeholder="Ex: Sabia que você ia descobrir! Amo você demais 💚"
          rows={3}
          maxLength={120}
          className="w-full rounded-xl border-2 border-ink px-4 py-3 text-sm font-semibold text-ink placeholder:text-ink-muted/50 focus:outline-none neo-shadow-sm bg-white resize-none"
        />
        <p className="text-[11px] text-ink-muted font-medium">
          {value.winMessage.length}/120 — aparece em verde quando acertar a palavra
        </p>
      </section>

    </div>
  );
}
