'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { WordleData, RouletteData } from '@/lib/types';
import { FieldCard, StepHeader, SectionDivider, inlineInput } from './shared';

interface Props {
  wordle:       WordleData;
  roulette:     RouletteData;
  extras:       ('wordle' | 'roulette')[];
  onToggle:     (key: 'wordle' | 'roulette') => void;
  onWordle:     (payload: Partial<WordleData>) => void;
  onRoulette:   (payload: Partial<RouletteData>) => void;
}

// ─── Toggle card ──────────────────────────────────────────────────────────────

function ToggleCard({
  icon, title, description, active, onToggle,
}: {
  icon: string; title: string; description: string; active: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 16,
        background: active ? '#FFF1F2' : '#FAFAFA',
        border: `1.5px solid ${active ? '#E11D48' : '#E5E7EB'}`,
        borderRadius: 16, padding: '16px 18px',
        boxShadow: active ? '0 0 0 3px rgba(225,29,72,0.08)' : 'none',
        transition: 'all 0.2s',
      } as React.CSSProperties}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: active ? '#fff' : '#F3F4F6',
        border: `1.5px solid ${active ? 'rgba(225,29,72,0.2)' : '#E5E7EB'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        transition: 'all 0.2s',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 15, fontWeight: 800, color: active ? '#E11D48' : '#111827',
          margin: '0 0 3px', fontFamily: 'system-ui', transition: 'color 0.2s',
        }}>
          {title}
        </p>
        <p style={{
          fontSize: 12.5, color: '#6B7280', margin: 0,
          fontFamily: 'system-ui', lineHeight: 1.4,
        }}>
          {description}
        </p>
      </div>
      {/* Toggle pill */}
      <div style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: active ? '#E11D48' : '#E5E7EB',
        position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 3,
          left: active ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'left 0.2s',
        }} />
      </div>
    </button>
  );
}

// ─── Roulette option input ─────────────────────────────────────────────────────

function RouletteOptions({
  options, onChange,
}: {
  options: string[]; onChange: (opts: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const text = input.trim();
    if (!text || options.length >= 12) return;
    onChange([...options, text]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Input */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Ex: Jantar especial…"
          maxLength={50}
          disabled={options.length >= 12}
          style={{
            flex: 1, ...inlineInput,
            border: '1.5px solid #E5E7EB', borderRadius: 12,
            padding: '11px 14px', fontSize: 14,
          }}
        />
        <button
          onClick={add}
          disabled={!input.trim() || options.length >= 12}
          style={{
            width: 46, height: 46, borderRadius: 12, border: 'none', flexShrink: 0,
            background: (!input.trim() || options.length >= 12) ? '#F3F4F6' : '#E11D48',
            color: (!input.trim() || options.length >= 12) ? '#9CA3AF' : '#fff',
            cursor: (!input.trim() || options.length >= 12) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      {options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {options.map((opt, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff', border: '1.5px solid #F3F4F6',
              borderRadius: 10, padding: '10px 14px',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#E11D48',
                flexShrink: 0, fontFamily: 'system-ui',
              }}>
                {i + 1}
              </span>
              <span style={{
                flex: 1, fontSize: 14, fontWeight: 600, color: '#111827',
                fontFamily: 'system-ui',
              }}>
                {opt}
              </span>
              <button
                onClick={() => onChange(options.filter((_, idx) => idx !== i))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#9CA3AF' }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: 0, fontFamily: 'system-ui' }}>
        {options.length}/12 opções · mínimo 2 para ativar a roleta
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Step6Extras({ wordle, roulette, extras, onToggle, onWordle, onRoulette }: Props) {
  const [focused, setFocused] = useState<string | null>(null);
  const focus = (id: string) => setFocused(id);
  const blur  = () => setFocused(null);
  const isFoc = (id: string) => focused === id;

  const wordleOn   = extras.includes('wordle');
  const rouletteOn = extras.includes('roulette');

  return (
    <div>
      <StepHeader
        title="Extras"
        description="Adicione mini-jogos ao presente — tudo opcional."
        optional
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Wordle ── */}
        <ToggleCard
          icon="🟩"
          title="Wordle do Amor"
          description="A pessoa adivinha uma palavra secreta que você escolheu."
          active={wordleOn}
          onToggle={() => onToggle('wordle')}
        />

        {wordleOn && (
          <div style={{
            border: '1.5px solid rgba(225,29,72,0.15)',
            borderRadius: 14, padding: '20px 18px',
            background: '#FFFBFB',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <FieldCard icon="🔤" label="Palavra secreta" focused={isFoc('word')} note="De 3 a 10 letras, sem acento. Ex: AMOR">
              <input
                style={inlineInput}
                type="text"
                value={wordle.word}
                placeholder="SAUDADE"
                maxLength={10}
                onFocus={() => focus('word')}
                onBlur={blur}
                onChange={e => onWordle({ word: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') })}
              />
            </FieldCard>

            <FieldCard icon="💡" label="Dica" focused={isFoc('clue')}>
              <input
                style={inlineInput}
                type="text"
                value={wordle.clue}
                placeholder="O que sinto quando estou longe de você…"
                maxLength={80}
                onFocus={() => focus('clue')}
                onBlur={blur}
                onChange={e => onWordle({ clue: e.target.value })}
              />
            </FieldCard>

            <FieldCard icon="🎉" label="Mensagem ao acertar" focused={isFoc('win')}>
              <input
                style={inlineInput}
                type="text"
                value={wordle.winMessage}
                placeholder="Você me conhece tão bem! ❤️"
                maxLength={80}
                onFocus={() => focus('win')}
                onBlur={blur}
                onChange={e => onWordle({ winMessage: e.target.value })}
              />
            </FieldCard>
          </div>
        )}

        {/* ── Roulette ── */}
        <ToggleCard
          icon="🎡"
          title="Roleta Surpresa"
          description="A pessoa gira uma roleta com atividades que vocês podem fazer juntos."
          active={rouletteOn}
          onToggle={() => onToggle('roulette')}
        />

        {rouletteOn && (
          <div style={{
            border: '1.5px solid rgba(225,29,72,0.15)',
            borderRadius: 14, padding: '20px 18px',
            background: '#FFFBFB',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <FieldCard icon="🎡" label="Título da roleta" focused={isFoc('rtitle')}>
              <input
                style={inlineInput}
                type="text"
                value={roulette.title}
                placeholder="O que vamos fazer hoje?"
                maxLength={50}
                onFocus={() => focus('rtitle')}
                onBlur={blur}
                onChange={e => onRoulette({ title: e.target.value })}
              />
            </FieldCard>

            <SectionDivider label="Opções da roleta" />
            <RouletteOptions
              options={roulette.options}
              onChange={opts => onRoulette({ options: opts })}
            />
          </div>
        )}

      </div>
    </div>
  );
}
