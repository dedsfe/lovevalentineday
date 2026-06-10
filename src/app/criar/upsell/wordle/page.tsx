'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { PhoneMockup } from '@/components/PhoneMockup';
import { WordleGame } from '@/components/products/wordle/WordleGame';
import { INITIAL_FUNNEL, type FunnelData } from '../../funnel';
import { inlineInput } from '../../steps/shared';

const DRAFT_KEY = 'lv_funnel_draft';
const PRICE = 9.90;
const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const DEMO = {
  word: 'LINDA',
  clue: 'Como eu te chamo todo dia, porque é a pura verdade',
  winMessage: 'Você me conhece tão bem! ❤️',
};

// ─── Inline config ────────────────────────────────────────────────────────────

function WordleConfig({
  word, clue, winMessage,
  onWord, onClue, onWin,
}: {
  word: string; clue: string; winMessage: string;
  onWord: (v: string) => void; onClue: (v: string) => void; onWin: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14, padding: '4px 0',
      }}>
        {[
          { label: '🔤  Palavra secreta', value: word, note: '3 a 10 letras · sem acento', onChange: (v: string) => onWord(v.toUpperCase().replace(/[^A-Z]/g, '')), max: 10 },
          { label: '💡  Dica para ela', value: clue, note: undefined, onChange: onClue, max: 80 },
          { label: '🎉  Mensagem ao acertar', value: winMessage, note: undefined, onChange: onWin, max: 80 },
        ].map((f, i, arr) => (
          <div key={f.label} style={{ padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: 'system-ui', letterSpacing: '0.02em' }}>
              {f.label}
            </label>
            <input
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              maxLength={f.max}
              placeholder={f.label.includes('Palavra') ? 'SAUDADE' : f.label.includes('Dica') ? 'Como eu te chamo todo dia…' : 'Você me conhece tão bem! ❤️'}
              style={{
                ...inlineInput,
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                width: '100%',
                outline: 'none',
              }}
            />
            {f.note && (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '4px 0 0', fontFamily: 'system-ui' }}>
                {f.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WordleUpsellPage() {
  const router = useRouter();
  const [funnel, setFunnel] = useState<FunnelData>(INITIAL_FUNNEL);
  const [added, setAdded]   = useState(false);
  const [word, setWord]     = useState('');
  const [clue, setClue]     = useState('');
  const [win,  setWin]      = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed: FunnelData = { ...INITIAL_FUNNEL, ...JSON.parse(raw) };
        setFunnel(parsed);
        if (parsed.extras.includes('wordle')) {
          setAdded(true);
          setWord(parsed.wordle.word);
          setClue(parsed.wordle.clue);
          setWin(parsed.wordle.winMessage);
        }
      }
    } catch { /* keep defaults */ }
  }, []);

  const save = (includeWordle: boolean) => {
    const next: FunnelData = {
      ...funnel,
      extras: includeWordle
        ? [...funnel.extras.filter(e => e !== 'wordle'), 'wordle']
        : funnel.extras.filter(e => e !== 'wordle'),
      wordle: includeWordle
        ? { word, clue, winMessage: win }
        : funnel.wordle,
    };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleAdd = () => {
    setAdded(true);
    save(true);
  };
  const handleSkip = () => {
    save(false);
    router.push('/criar/upsell/roleta');
  };
  const handleContinue = () => {
    save(true);
    router.push('/criar/upsell/roleta');
  };

  const previewData = added && word.length >= 3
    ? { word, clue: clue || DEMO.clue, winMessage: win || DEMO.winMessage }
    : DEMO;

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
        <Link href="/criar" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)' }}>
          <ArrowLeft size={16} />
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'system-ui' }}>Voltar</span>
        </Link>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
          Love<span style={{ color: '#E11D48' }}>Valentine</span>
        </span>
        {/* Progress 1 of 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 4, borderRadius: 2, background: '#E11D48' }} />
          <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
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
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            width: 'fit-content',
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#4ADE80', fontFamily: 'system-ui', letterSpacing: '0.04em' }}>
              ✦ EXTRA 1 DE 2
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900,
            color: '#fff', margin: '0 0 16px',
            lineHeight: 1.1, letterSpacing: '-0.03em',
          }}>
            E se ela tivesse que{' '}
            <span style={{ color: '#E11D48' }}>te adivinhar?</span>
          </h1>

          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65,
            margin: '0 0 36px', maxWidth: 440,
          }}>
            Crie um Wordle com uma palavra que só vocês dois entendem. Quando ela acertar,
            aparece uma mensagem escrita só pra ela — um momento só de vocês dois.
          </p>

          {/* Price */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
          }}>
            <span style={{
              fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em',
            }}>
              +{fmt(PRICE)}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              adicionado ao presente
            </span>
          </div>

          {!added ? (
            /* Pitch CTAs */
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
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
              >
                Sim, quero o Wordle
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
                Não, seguir sem isso
              </button>
            </div>
          ) : (
            /* Config + Continue */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 12, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🟩</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80', margin: 0, fontFamily: 'system-ui' }}>
                  Wordle adicionado! Agora personalize:
                </p>
              </div>
              <WordleConfig
                word={word} clue={clue} winMessage={win}
                onWord={setWord} onClue={setClue} onWin={setWin}
              />
              <button
                onClick={handleContinue}
                style={{
                  padding: '17px 0', borderRadius: 16, border: 'none',
                  background: '#E11D48', color: '#fff',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'system-ui', letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 8px 32px rgba(225,29,72,0.35)',
                  marginTop: 4,
                }}
              >
                Continuar
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Right: phone preview — hidden on mobile */}
        <div
          className="hidden lg:flex"
          style={{
            width: 400, flexShrink: 0,
            alignItems: 'center', justifyContent: 'center',
            padding: '48px 0 48px 48px',
          }}
        >
          <PhoneMockup maxWidth={300} screenHeight={520}>
            <WordleGame data={previewData} />
          </PhoneMockup>
        </div>

      </div>
    </div>
  );
}
