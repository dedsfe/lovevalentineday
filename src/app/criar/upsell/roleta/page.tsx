'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Plus, X } from 'lucide-react';
import { PhoneMockup } from '@/components/PhoneMockup';
import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import { INITIAL_FUNNEL, type FunnelData } from '../../funnel';
import { inlineInput } from '../../steps/shared';

const DRAFT_KEY = 'lv_funnel_draft';
const PRICE = 9.90;
const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const DEMO_ROULETTE = {
  title:   'O que a gente vai fazer hoje, meu amor? 💕',
  options: ['Jantar romântico', 'Cinema juntos', 'Netflix e pipoca', 'Passeio ao pôr do sol', 'Spa em casa', 'Surpresa especial'],
};

// ─── Options list input ───────────────────────────────────────────────────────

function OptionsList({
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Ex: Jantar especial…"
          maxLength={50}
          disabled={options.length >= 12}
          style={{
            flex: 1,
            ...inlineInput,
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '11px 14px',
            fontSize: 14,
            color: '#fff',
          }}
        />
        <button
          onClick={add}
          disabled={!input.trim() || options.length >= 12}
          style={{
            width: 44, height: 44, borderRadius: 10, border: 'none', flexShrink: 0,
            background: (!input.trim() || options.length >= 12)
              ? 'rgba(255,255,255,0.06)'
              : '#E11D48',
            color: (!input.trim() || options.length >= 12)
              ? 'rgba(255,255,255,0.2)'
              : '#fff',
            cursor: (!input.trim() || options.length >= 12) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {options.map((opt, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9, padding: '9px 13px',
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(225,29,72,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#E11D48', flexShrink: 0,
                fontFamily: 'system-ui',
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'system-ui' }}>
                {opt}
              </span>
              <button
                onClick={() => onChange(options.filter((_, idx) => idx !== i))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.25)' }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, fontFamily: 'system-ui' }}>
        {options.length}/12 opções · mínimo 2 para ativar
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoletaUpsellPage() {
  const router = useRouter();
  const [funnel, setFunnel]   = useState<FunnelData>(INITIAL_FUNNEL);
  const [added, setAdded]     = useState(false);
  const [title, setTitle]     = useState('O que vamos fazer hoje?');
  const [options, setOptions] = useState<string[]>([]);
  const wordleAdded = funnel.extras.includes('wordle');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed: FunnelData = { ...INITIAL_FUNNEL, ...JSON.parse(raw) };
        setFunnel(parsed);
        if (parsed.extras.includes('roulette')) {
          setAdded(true);
          setTitle(parsed.roulette.title);
          setOptions(parsed.roulette.options);
        }
      }
    } catch { /* keep defaults */ }
  }, []);

  const save = (includeRoulette: boolean) => {
    const next: FunnelData = {
      ...funnel,
      extras: includeRoulette
        ? [...funnel.extras.filter(e => e !== 'roulette'), 'roulette']
        : funnel.extras.filter(e => e !== 'roulette'),
      roulette: includeRoulette ? { title, options } : funnel.roulette,
    };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleAdd = () => {
    setAdded(true);
    save(true);
  };
  const handleSkip = () => {
    save(false);
    router.push('/criar/upsell');
  };
  const handleContinue = () => {
    save(true);
    router.push('/criar/upsell');
  };

  const previewData = added && options.length >= 2
    ? { title, options }
    : DEMO_ROULETTE;

  return (
    <div style={{
      minHeight: '100dvh', background: '#0D0D0D',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <header style={{
        height: 57, flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 50, background: '#0D0D0D',
      }}>
        <Link href="/criar/upsell/wordle" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)' }}>
          <ArrowLeft size={16} />
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'system-ui' }}>Voltar</span>
        </Link>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
          Love<span style={{ color: '#E11D48' }}>Valentine</span>
        </span>
        {/* Progress 2 of 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 4, borderRadius: 2, background: '#E11D48' }} />
          <div style={{ width: 24, height: 4, borderRadius: 2, background: '#E11D48' }} />
        </div>
      </header>

      {/* Body */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'stretch',
        maxWidth: 1100, width: '100%', margin: '0 auto',
        padding: '0 24px',
        gap: 0,
      }}>

        {/* Left: content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '48px 48px 48px 0',
          maxWidth: 560,
        }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            width: 'fit-content',
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#F87171', fontFamily: 'system-ui', letterSpacing: '0.04em' }}>
              {wordleAdded ? '🟩 Wordle adicionado · ' : ''}✦ EXTRA 2 DE 2
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900,
            color: '#fff', margin: '0 0 16px',
            lineHeight: 1.1, letterSpacing: '-0.03em',
          }}>
            O presente que{' '}
            <span style={{ color: '#E11D48' }}>não termina no link.</span>
          </h1>

          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65,
            margin: '0 0 36px', maxWidth: 440,
          }}>
            Adicione atividades para fazer juntos — um jantar, um passeio, uma surpresa.
            Ela gira a roleta e descobre o próximo capítulo de vocês.
          </p>

          {/* Price */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
          }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
              +{fmt(PRICE)}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              adicionado ao presente
            </span>
          </div>

          {!added ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleAdd}
                style={{
                  padding: '18px 0', borderRadius: 16, border: 'none',
                  background: '#E11D48', color: '#fff',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'system-ui', letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 8px 32px rgba(225,29,72,0.35)',
                }}
              >
                Sim, quero a Roleta
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleSkip}
                style={{
                  padding: '16px 0', borderRadius: 16,
                  background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                {wordleAdded ? 'Não, já está ótimo' : 'Não, já está bom assim'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.2)',
                borderRadius: 12, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🎡</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F87171', margin: 0, fontFamily: 'system-ui' }}>
                  Roleta adicionada! Adicione as atividades:
                </p>
              </div>

              {/* Title field */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '14px 16px',
              }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: 'system-ui', letterSpacing: '0.02em' }}>
                  🎡  Título da roleta
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={50}
                  placeholder="O que vamos fazer hoje?"
                  style={{
                    ...inlineInput,
                    background: 'transparent', border: 'none', padding: 0,
                    color: '#fff', fontSize: 15, fontWeight: 600,
                    width: '100%', outline: 'none',
                  }}
                />
              </div>

              <OptionsList options={options} onChange={setOptions} />

              <button
                onClick={handleContinue}
                style={{
                  padding: '17px 0', borderRadius: 16, border: 'none',
                  background: '#E11D48', color: '#fff',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'system-ui', letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 8px 32px rgba(225,29,72,0.35)',
                }}
              >
                Continuar para o resumo
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Right: phone preview — desktop only */}
        <div
          className="hidden lg:flex"
          style={{
            width: 400, flexShrink: 0,
            alignItems: 'center', justifyContent: 'center',
            padding: '48px 0 48px 48px',
          }}
        >
          <PhoneMockup maxWidth={300} screenHeight={520}>
            <RouletteWheel data={previewData} />
          </PhoneMockup>
        </div>

      </div>
    </div>
  );
}
