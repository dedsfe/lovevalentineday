'use client';

import { useState, useRef } from 'react';
import { Plus, X, Shuffle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { RouletteData } from '@/lib/types';

const MAX_OPTIONS = 10;

const SUGGESTIONS = [
  'Cinema', 'Jantar fora', 'Netflix em casa', 'Passeio no parque',
  'Cozinhar juntos', 'Jogar videogame', 'Spa em casa', 'Piquenique',
];

interface Props {
  value:    RouletteData;
  onChange: (data: RouletteData) => void;
}

export function RouletteConfig({ value, onChange }: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<RouletteData>) => onChange({ ...value, ...patch });

  const addOption = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || value.options.length >= MAX_OPTIONS) return;
    set({ options: [...value.options, trimmed] });
    setInput('');
    inputRef.current?.focus();
  };

  const removeOption = (i: number) =>
    set({ options: value.options.filter((_, idx) => idx !== i) });

  const addSuggestion = (s: string) => {
    if (value.options.includes(s) || value.options.length >= MAX_OPTIONS) return;
    set({ options: [...value.options, s] });
  };

  return (
    <div className="space-y-7">

      {/* Título */}
      <section>
        <Input
          label="Título da roleta"
          placeholder="Ex: O que vamos fazer hoje?"
          value={value.title}
          onChange={e => set({ title: e.target.value })}
          maxLength={40}
          hint="máx 40 caracteres"
        />
      </section>

      {/* Opções */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-ink uppercase tracking-wide">Opções da roleta</h3>
          <span className={`text-[11px] font-bold ${value.options.length < 2 ? 'text-amber-600' : 'text-ink-muted'}`}>
            {value.options.length}/{MAX_OPTIONS}
          </span>
        </div>
        <p className="text-[11px] text-ink-muted font-medium">Mínimo 2, máximo {MAX_OPTIONS}. Textos curtos ficam mais bonitos na roda.</p>

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
            placeholder="Ex: Jantar fora..."
            maxLength={28}
            className="flex-1 rounded-xl border-2 border-ink px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted/50 focus:outline-none neo-shadow-sm bg-white"
          />
          <button
            type="button"
            onClick={() => addOption()}
            disabled={value.options.length >= MAX_OPTIONS || !input.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-ink bg-brand text-white text-sm font-black neo-shadow disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Options list */}
        {value.options.length > 0 && (
          <ul className="space-y-2">
            {value.options.map((opt, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 border-ink bg-white neo-shadow-sm">
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ background: ['#E11D48','#7C3AED','#0891B2','#D97706','#059669','#EA580C','#6366F1','#DB2777','#0D9488','#9333EA'][i % 10] }}
                />
                <span className="flex-1 text-sm font-semibold text-ink truncate">{opt}</span>
                <button type="button" onClick={() => removeOption(i)} className="p-0.5 rounded hover:bg-black/5">
                  <X className="w-3.5 h-3.5 text-ink-muted" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Suggestions */}
        {value.options.length < MAX_OPTIONS && (
          <div className="space-y-2">
            <p className="text-[11px] text-ink-muted font-bold uppercase tracking-wide flex items-center gap-1.5">
              <Shuffle className="w-3 h-3" /> Sugestões rápidas
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.filter(s => !value.options.includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSuggestion(s)}
                  disabled={value.options.length >= MAX_OPTIONS}
                  className="px-3 py-1.5 rounded-lg border-2 border-ink text-xs font-bold text-ink bg-white hover:bg-subtle neo-shadow-sm disabled:opacity-40 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
