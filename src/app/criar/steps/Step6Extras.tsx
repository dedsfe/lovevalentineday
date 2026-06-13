'use client';

import { useState } from 'react';
import { Plus, X, ChevronRight } from 'lucide-react';
import type { WordleData, RouletteData } from '@/lib/types';
import { FieldCard, StepHeader, SectionDivider, inlineInput } from './shared';

const BASE_PRICE = 29.90;
const EXTRA_PRICES: Record<'wordle' | 'roulette', number> = {
  wordle:   9.90,
  roulette: 9.90,
};

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type UpsellPhase = 'wordle-pitch' | 'roulette-pitch' | 'config';

interface Props {
  wordle:     WordleData;
  roulette:   RouletteData;
  extras:     ('wordle' | 'roulette')[];
  onToggle:   (key: 'wordle' | 'roulette') => void;
  onWordle:   (payload: Partial<WordleData>) => void;
  onRoulette: (payload: Partial<RouletteData>) => void;
}

// ─── Upsell pitch card ────────────────────────────────────────────────────────

function UpsellCard({
  emoji, emojiBg,
  headline, sub,
  price,
  ctaLabel, skipLabel,
  onAdd, onSkip,
}: {
  emoji: string; emojiBg: string;
  headline: string; sub: string;
  price: number;
  ctaLabel: string; skipLabel: string;
  onAdd: () => void; onSkip: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

      {/* Emoji hero */}
      <div style={{
        width: 88, height: 88, borderRadius: 28,
        background: emojiBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44, marginBottom: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        {emoji}
      </div>

      {/* Price badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.2)',
        borderRadius: 20, padding: '4px 14px', marginBottom: 16,
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#E11D48', fontFamily: 'system-ui', letterSpacing: '0.05em' }}>
          + {fmt(price)}
        </span>
        <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'system-ui', fontWeight: 500 }}>
          adicionado ao total
        </span>
      </div>

      {/* Copy */}
      <h2 style={{
        fontSize: 22, fontWeight: 900, color: '#111827',
        margin: '0 0 12px', fontFamily: 'system-ui', letterSpacing: '-0.03em',
        lineHeight: 1.2,
      }}>
        {headline}
      </h2>
      <p style={{
        fontSize: 14.5, color: '#6B7280', lineHeight: 1.6,
        margin: '0 0 32px', fontFamily: 'system-ui', maxWidth: 360,
      }}>
        {sub}
      </p>

      {/* CTAs */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onAdd}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
            background: '#E11D48', color: '#fff',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'system-ui', letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 4px 16px rgba(225,29,72,0.3)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
        >
          {ctaLabel}
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={onSkip}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 14,
            background: 'transparent', border: '1.5px solid #E5E7EB',
            color: '#9CA3AF', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'system-ui',
          }}
        >
          {skipLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Toggle card (config view) ────────────────────────────────────────────────

function ToggleCard({
  icon, title, description, active, onToggle, price,
}: {
  icon: string; title: string; description: string;
  active: boolean; onToggle: () => void; price: number;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <p style={{
            fontSize: 15, fontWeight: 800, color: active ? '#E11D48' : '#111827',
            margin: 0, fontFamily: 'system-ui', transition: 'color 0.2s',
          }}>
            {title}
          </p>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: active ? '#E11D48' : '#6B7280',
            background: active ? 'rgba(225,29,72,0.08)' : '#F3F4F6',
            borderRadius: 6, padding: '2px 7px',
            fontFamily: 'system-ui', transition: 'all 0.2s',
          }}>
            +{fmt(price)}
          </span>
        </div>
        <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0, fontFamily: 'system-ui', lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
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

// ─── Roulette options input ───────────────────────────────────────────────────

function RouletteOptions({ options, onChange }: { options: string[]; onChange: (opts: string[]) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    const text = input.trim();
    if (!text || options.length >= 12) return;
    onChange([...options, text]);
    setInput('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Ex: Jantar especial…"
          maxLength={50}
          disabled={options.length >= 12}
          style={{ flex: 1, ...inlineInput, border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '11px 14px', fontSize: 14 }}
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
                fontSize: 11, fontWeight: 800, color: '#E11D48', flexShrink: 0, fontFamily: 'system-ui',
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'system-ui' }}>
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
        {options.length}/12 opções · mínimo 2 para ativar
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Step6Extras({ wordle, roulette, extras, onToggle, onWordle, onRoulette }: Props) {
  const [focused, setFocused] = useState<string | null>(null);
  const focus = (id: string) => setFocused(id);
  const blur  = () => setFocused(null);
  const isFoc = (id: string) => focused === id;

  // Start at config if user already has extras (returning to this step)
  const [phase, setPhase] = useState<UpsellPhase>(() =>
    extras.length > 0 ? 'config' : 'wordle-pitch'
  );

  const wordleOn   = extras.includes('wordle');
  const rouletteOn = extras.includes('roulette');
  const extrasTotal = extras.reduce((sum, k) => sum + EXTRA_PRICES[k], 0);
  const total       = BASE_PRICE + extrasTotal;

  // ── Wordle pitch ──────────────────────────────────────────────────────────

  if (phase === 'wordle-pitch') {
    return (
      <div>
        <StepHeader
          title="Quase lá…"
          description="Antes de finalizar, veja o que dá pra adicionar ao presente."
        />
        <UpsellCard
          emoji="🎯"
          emojiBg="linear-gradient(135deg, #FFF1F2, #FECDD3)"
          headline="E se seu amor tivesse que te adivinhar?"
          sub="Crie uma Charada com uma palavra que só vocês dois entendem. Ao acertar, aparece uma mensagem sua como recompensa."
          price={EXTRA_PRICES.wordle}
          ctaLabel="Sim, quero a Charada"
          skipLabel="Não, seguir sem isso"
          onAdd={() => {
            if (!wordleOn) onToggle('wordle');
            setPhase('roulette-pitch');
          }}
          onSkip={() => setPhase('roulette-pitch')}
        />
      </div>
    );
  }

  // ── Roulette pitch ────────────────────────────────────────────────────────

  if (phase === 'roulette-pitch') {
    return (
      <div>
        <StepHeader
          title={wordleOn ? 'Ótima escolha! Mais uma coisa…' : 'Mais uma coisa…'}
          description="Um último extra antes de finalizar."
        />
        <UpsellCard
          emoji="🎡"
          emojiBg="linear-gradient(135deg, #FEE2E2, #FECDD3)"
          headline="O presente que não termina no link."
          sub="Adicione atividades para fazer juntos — um jantar, um passeio, um momento. Quem recebe gira a roleta e descobre o próximo capítulo de vocês."
          price={EXTRA_PRICES.roulette}
          ctaLabel="Sim, quero a Roleta"
          skipLabel={wordleOn ? 'Não, já está ótimo' : 'Não, já está bom assim'}
          onAdd={() => {
            if (!rouletteOn) onToggle('roulette');
            setPhase('config');
          }}
          onSkip={() => setPhase('config')}
        />
      </div>
    );
  }

  // ── Config view ───────────────────────────────────────────────────────────

  return (
    <div>
      <StepHeader
        title="Extras"
        description="Ajuste o que quiser antes de finalizar."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Wordle toggle + config */}
        <ToggleCard
          icon="🎯" title="Charada do Amor" price={EXTRA_PRICES.wordle}
          description="A pessoa adivinha uma palavra secreta que você escolheu."
          active={wordleOn} onToggle={() => onToggle('wordle')}
        />
        {wordleOn && (
          <div style={{
            border: '1.5px solid rgba(225,29,72,0.15)', borderRadius: 14,
            padding: '20px 18px', background: '#FFFBFB',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <FieldCard icon="🔤" label="Palavra secreta" focused={isFoc('word')} note="De 3 a 10 letras, sem acento. Ex: AMOR">
              <input
                style={inlineInput} type="text" value={wordle.word}
                placeholder="SAUDADE" maxLength={10}
                onFocus={() => focus('word')} onBlur={blur}
                onChange={e => onWordle({ word: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') })}
              />
            </FieldCard>
            <FieldCard icon="💡" label="Dica" focused={isFoc('clue')}>
              <input
                style={inlineInput} type="text" value={wordle.clue}
                placeholder="O que sinto quando estou longe de você…"
                maxLength={80} onFocus={() => focus('clue')} onBlur={blur}
                onChange={e => onWordle({ clue: e.target.value })}
              />
            </FieldCard>
            <FieldCard icon="🎉" label="Mensagem ao acertar" focused={isFoc('win')}>
              <input
                style={inlineInput} type="text" value={wordle.winMessage}
                placeholder="Você me conhece tão bem! ❤️"
                maxLength={80} onFocus={() => focus('win')} onBlur={blur}
                onChange={e => onWordle({ winMessage: e.target.value })}
              />
            </FieldCard>
          </div>
        )}

        {/* Roulette toggle + config */}
        <ToggleCard
          icon="🎡" title="Roleta Surpresa" price={EXTRA_PRICES.roulette}
          description="A pessoa gira uma roleta com atividades que vocês podem fazer juntos."
          active={rouletteOn} onToggle={() => onToggle('roulette')}
        />
        {rouletteOn && (
          <div style={{
            border: '1.5px solid rgba(225,29,72,0.15)', borderRadius: 14,
            padding: '20px 18px', background: '#FFFBFB',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <FieldCard icon="🎡" label="Título da roleta" focused={isFoc('rtitle')}>
              <input
                style={inlineInput} type="text" value={roulette.title}
                placeholder="O que vamos fazer hoje?" maxLength={50}
                onFocus={() => focus('rtitle')} onBlur={blur}
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

      {/* Total */}
      <div style={{
        marginTop: 24,
        background: extras.length > 0 ? '#FFF1F2' : '#FAFAFA',
        border: `1.5px solid ${extras.length > 0 ? 'rgba(225,29,72,0.2)' : '#E5E7EB'}`,
        borderRadius: 16, padding: '16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.2s',
      }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', margin: '0 0 3px', fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total estimado
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, fontFamily: 'system-ui', textDecoration: extras.length > 0 ? 'line-through' : 'none' }}>
              {fmt(BASE_PRICE)}
            </p>
            {extras.length > 0 && (
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0, fontFamily: 'system-ui' }}>
                + {fmt(extrasTotal)} extras
              </p>
            )}
          </div>
        </div>
        <p style={{
          fontSize: 22, fontWeight: 900,
          color: extras.length > 0 ? '#E11D48' : '#374151',
          margin: 0, fontFamily: 'system-ui', letterSpacing: '-0.02em',
          transition: 'color 0.2s',
        }}>
          {fmt(total)}
        </p>
      </div>
    </div>
  );
}
