'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Eye, ChevronRight } from 'lucide-react';
import { INITIAL_FUNNEL, type FunnelData } from '../../funnel';
import { LivePreview } from '../../LivePreview';
import { FieldCard, StepHeader, inlineInput } from '../../steps/shared';

type MobileView = 'edit' | 'preview';
type ProductKey = 'spotify' | 'wordle' | 'roulette';

const DRAFT_KEY = 'lv_funnel_draft';
const STEP_KEY  = 'lv_funnel_step';
const PRICE = 9.90;

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const DEMO = {
  word: 'LINDA',
  clue: 'Como eu te chamo todo dia, porque é a pura verdade',
  winMessage: 'Você me conhece tão bem! ❤️',
};

// ─── Mobile view switcher ─────────────────────────────────────────────────────

function MobileViewSwitcher({ active, onChange }: { active: MobileView; onChange: (v: MobileView) => void }) {
  const tabs: { key: MobileView; label: string; icon: React.ReactNode }[] = [
    { key: 'edit',    label: 'Edição',        icon: <Pencil size={13} strokeWidth={2.5} /> },
    { key: 'preview', label: 'Visualização',  icon: <Eye    size={13} strokeWidth={2.5} /> },
  ];
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 13, padding: 3, gap: 3,
      width: '100%', maxWidth: 300,
    }}>
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
              padding: '10px 12px', borderRadius: 10, border: 'none',
              background: isActive ? '#E11D48' : 'transparent',
              boxShadow: isActive
                ? '0 2px 10px rgba(225,29,72,0.45), inset 0 1px 0 rgba(255,255,255,0.12)'
                : 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', fontFamily: 'system-ui',
              letterSpacing: isActive ? '-0.01em' : '0',
              transition: 'all 0.18s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>
              {t.icon}
            </span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({
  current, total, onGoto,
}: {
  current: number;
  total:   number;
  onGoto:  (n: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const n     = i + 1;
        const done  = n < current;
        const active = n === current;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? 1 : 'none' }}>
            <button
              onClick={() => done && onGoto(n)}
              style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, border: 'none',
                background: done || active ? '#E11D48' : '#F3F4F6',
                color: done || active ? '#fff' : '#9CA3AF',
                outline: active ? '3px solid rgba(225,29,72,0.2)' : 'none',
                outlineOffset: 2,
                cursor: done ? 'pointer' : 'default',
                transition: 'all 0.25s',
                fontFamily: 'system-ui',
              }}
            >
              {done ? '✓' : n}
            </button>
            {i < total - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: 8,
                background: done ? '#E11D48' : '#F3F4F6',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WordleUpsellPage() {
  const router = useRouter();
  const [funnel, setFunnel]         = useState<FunnelData>(INITIAL_FUNNEL);
  const [added, setAdded]           = useState(false);
  const [word, setWord]             = useState('');
  const [clue, setClue]             = useState('');
  const [win,  setWin]              = useState('');
  const [focused, setFocused]       = useState<string | null>(null);
  const [ready, setReady]           = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const [previewProduct, setPreviewProduct] = useState<ProductKey>('wordle');

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
          setPreviewProduct('wordle');
        } else {
          setPreviewProduct('spotify');
        }
      }
    } catch { /* keep defaults */ }
    setReady(true);
  }, []);

  const saveWithWord = (w: string, c: string, g: string, includeWordle: boolean) => {
    const next: FunnelData = {
      ...funnel,
      extras: includeWordle
        ? [...funnel.extras.filter(e => e !== 'wordle'), 'wordle']
        : funnel.extras.filter(e => e !== 'wordle'),
      wordle: { word: w, clue: c, winMessage: g },
    };
    setFunnel(next);
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleAdd = () => {
    setAdded(true);
    setPreviewProduct('wordle');
    saveWithWord(word || DEMO.word, clue || DEMO.clue, win || DEMO.winMessage, true);
  };
  const handleSkip = () => {
    saveWithWord(word, clue, win, false);
    router.push('/criar/upsell/roleta');
  };
  const handleContinue = () => {
    saveWithWord(word, clue, win, true);
    router.push('/criar/upsell/roleta');
  };
  const back = () => {
    localStorage.setItem(STEP_KEY, '5');
    router.push('/criar');
  };

  const onGoto = (n: number) => {
    if (n <= 5) {
      localStorage.setItem(STEP_KEY, String(n));
      router.push('/criar');
    } else if (n === 6) {
      router.push('/criar/upsell/wordle');
    } else if (n === 7) {
      router.push('/criar/upsell/roleta');
    } else if (n === 8) {
      router.push('/criar/upsell');
    }
  };

  const ok = !added || word.trim().length >= 3;

  const previewData = added && word.length >= 3
    ? { word, clue: clue || DEMO.clue, winMessage: win || DEMO.winMessage }
    : DEMO;

  return (
    <div style={{
      minHeight: '100dvh', background: '#F7F8FA',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      height: mobileView === 'preview' ? '100dvh' : undefined,
      overflow: mobileView === 'preview' ? 'hidden' : undefined,
    }}>

      {/* Header */}
      <header style={{
        height: 57, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        background: '#fff', borderBottom: '1px solid #EBEBEB',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.01em' }}>
            Love<span style={{ color: '#E11D48' }}>Valentine</span>
          </span>
        </Link>

        <div style={{ flex: 1, maxWidth: 360, margin: '0 32px', height: 4, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: '#E11D48', borderRadius: 2,
            width: `${(5 / 7) * 100}%`,
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 700, whiteSpace: 'nowrap' }}>
          6 de 8
        </span>
      </header>

      {/* Mobile view switcher */}
      <div
        className="lg:hidden flex items-center justify-center"
        style={{
          position: 'sticky', top: 57, zIndex: 40,
          background: '#0D0D0D',
          backgroundImage: 'radial-gradient(ellipse at 50% 60%, rgba(225,29,72,0.1) 0%, transparent 70%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '10px 20px',
        }}
      >
        <MobileViewSwitcher active={mobileView} onChange={setMobileView} />
      </div>

      {/* Body */}
      <div style={{
        flex: 1, display: 'flex', minHeight: 0,
        background: mobileView === 'preview' ? '#0D0D0D' : undefined,
      }}>

        {/* Left: form */}
        <div
          style={{
            flex: mobileView === 'preview' ? '0 0 0px' : 1,
            minWidth: 0,
            overflow: 'hidden',
            background: mobileView === 'preview' ? 'transparent' : '#fff',
            borderRight: mobileView === 'preview' ? 'none' : '1px solid #EBEBEB',
            display: 'grid',
            gridTemplateRows: '1fr auto',
          }}
        >
          {/* Scrollable form content */}
          <div style={{ overflowY: 'auto', padding: '32px 0 24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 24px' }}>

              <div className="hidden lg:block">
                <Stepper current={6} total={8} onGoto={onGoto} />
                <div style={{ marginBottom: 44 }} />
              </div>

              <div>
                {!added ? (
                  /* Pitch Card */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: 24,
                      background: 'linear-gradient(135deg, #FFF1F2, #FECDD3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 40, marginBottom: 20,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                    }}>
                      🎯
                    </div>

                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.18)',
                      borderRadius: 20, padding: '4px 14px', marginBottom: 16,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#E11D48', fontFamily: 'system-ui', letterSpacing: '0.05em' }}>
                        + {fmt(PRICE)}
                      </span>
                      <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'system-ui', fontWeight: 500 }}>
                        adicionado ao presente
                      </span>
                    </div>

                    <h2 style={{
                      fontSize: 24, fontWeight: 900, color: '#111827',
                      margin: '0 0 12px', fontFamily: 'system-ui', letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                    }}>
                      E se seu amor tivesse que te adivinhar?
                    </h2>

                    <p style={{
                      fontSize: 15.5, color: '#6B7280', lineHeight: 1.6,
                      margin: '0 0 32px', fontFamily: 'system-ui', maxWidth: 420,
                    }}>
                      Crie uma Charada com uma palavra que só vocês dois entendem. Ao acertar, aparece uma mensagem sua como recompensa — um momento especial de vocês dois.
                    </p>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button
                        onClick={handleAdd}
                        style={{
                          width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
                          background: '#E11D48', color: '#fff',
                          fontSize: 15, fontWeight: 800, cursor: 'pointer',
                          fontFamily: 'system-ui', letterSpacing: '-0.01em',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          boxShadow: '0 4px 16px rgba(225,29,72,0.3)',
                          transition: 'opacity 0.15s',
                        }}
                      >
                        Sim, quero a Charada
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={handleSkip}
                        style={{
                          width: '100%', padding: '13px 0', borderRadius: 14,
                          background: 'transparent', border: '1.5px solid #E5E7EB',
                          color: '#9CA3AF', fontSize: 14, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'system-ui',
                        }}
                      >
                        Não, seguir sem isso
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Configuration Card */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <StepHeader
                      title="Charada do Amor"
                      description="Personalize o jogo para o seu amor adivinhar."
                    />

                    <div style={{
                      background: '#FFF1F2', border: '1px solid #FECDD3',
                      borderRadius: 12, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 18 }}>🎯</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#BE123C', margin: 0, fontFamily: 'system-ui' }}>
                        Charada adicionada! Personalize os campos abaixo:
                      </p>
                    </div>

                    <FieldCard icon="🔤" label="Palavra secreta" focused={focused === 'word'} note="De 3 a 10 letras, sem acento. Ex: AMOR">
                      <input
                        style={inlineInput}
                        type="text"
                        value={word}
                        placeholder="SAUDADE"
                        maxLength={10}
                        onFocus={() => setFocused('word')}
                        onBlur={() => setFocused(null)}
                        onChange={e => {
                          const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                          setWord(val);
                          saveWithWord(val, clue, win, true);
                        }}
                      />
                    </FieldCard>

                    <FieldCard icon="💡" label="Dica" focused={focused === 'clue'}>
                      <input
                        style={inlineInput}
                        type="text"
                        value={clue}
                        placeholder="O que sinto quando estou longe de você…"
                        maxLength={80}
                        onFocus={() => setFocused('clue')}
                        onBlur={() => setFocused(null)}
                        onChange={e => {
                          setClue(e.target.value);
                          saveWithWord(word, e.target.value, win, true);
                        }}
                      />
                    </FieldCard>

                    <FieldCard icon="🎉" label="Mensagem ao acertar" focused={focused === 'win'}>
                      <input
                        style={inlineInput}
                        type="text"
                        value={win}
                        placeholder="Você me conhece tão bem! ❤️"
                        maxLength={80}
                        onFocus={() => setFocused('win')}
                        onBlur={() => setFocused(null)}
                        onChange={e => {
                          setWin(e.target.value);
                          saveWithWord(word, clue, e.target.value, true);
                        }}
                      />
                    </FieldCard>

                    {added && (
                      <div style={{ textAlign: 'right', marginTop: 4 }}>
                        <button
                          onClick={() => {
                            setAdded(false);
                            setPreviewProduct('spotify');
                            saveWithWord(word, clue, win, false);
                          }}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 12, color: '#EF4444', fontWeight: 600,
                            fontFamily: 'system-ui',
                          }}
                        >
                          Remover Charada
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Nav buttons */}
          <div style={{
            borderTop: '1px solid #F3F4F6',
            padding: '14px 0 24px',
            display: 'flex', justifyContent: 'center',
            background: '#fff',
          }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 24px', display: 'flex', gap: 10 }}>
              <button
                onClick={back}
                style={{
                  flex: 1, padding: '15px 0', borderRadius: 14,
                  background: '#fff', border: '2px solid #E5E7EB', color: '#374151',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'system-ui', letterSpacing: '-0.01em',
                }}
              >
                ← Voltar
              </button>
              {added && (
                <button
                  onClick={handleContinue}
                  disabled={!ok}
                  style={{
                    flex: 2, padding: '15px 0', borderRadius: 14, border: 'none',
                    background: ok ? '#E11D48' : '#F3F4F6',
                    color: ok ? '#fff' : '#9CA3AF',
                    fontSize: 15, fontWeight: 800,
                    cursor: ok ? 'pointer' : 'not-allowed',
                    fontFamily: 'system-ui', letterSpacing: '-0.01em',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Próximo →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile preview */}
        <div
          style={{
            flex: mobileView === 'preview' ? 1 : 0,
            minWidth: 0,
            overflow: 'hidden',
            background: 'transparent',
            backgroundImage: mobileView === 'preview'
              ? 'radial-gradient(ellipse at 50% 20%, rgba(225,29,72,0.1) 0%, transparent 60%)'
              : 'none',
            display: mobileView === 'preview' ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: mobileView === 'preview' ? '20px 16px' : 0,
          }}
        >
          {mobileView === 'preview' && (
            <LivePreview
              base={funnel.base} spotify={funnel.spotify}
              extras={added ? [...funnel.extras.filter(e => e !== 'wordle'), 'wordle'] : funnel.extras.filter(e => e !== 'wordle')}
              wordle={previewData}
              roulette={funnel.roulette}
              previewProduct={previewProduct}
              onPreviewChange={setPreviewProduct}
            />
          )}
        </div>

        {/* Right: live preview */}
        <div
          className="hidden lg:flex"
          style={{
            width: 420, flexShrink: 0,
            flexDirection: 'column', alignItems: 'center',
            padding: '28px 28px 32px',
            background: '#0D0D0D',
            backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.1) 0%, transparent 55%)',
            position: 'sticky', top: 57,
            height: 'calc(100dvh - 57px)',
            overflowY: 'auto',
          }}
        >
          {/* Top bar */}
          <div style={{
            width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28,
          }}>
            <div>
              <span style={{
                fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'block', marginBottom: 3,
                fontFamily: 'system-ui',
              }}>
                Visualização ao vivo
              </span>
              <span style={{
                fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 500,
                fontFamily: 'system-ui',
              }}>
                {added ? 'Charada do Amor' : 'Preview do Presente'}
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '5px 12px',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', background: '#22C55E',
                boxShadow: '0 0 0 2px rgba(34,197,94,0.3)',
              }} />
              <span style={{ fontSize: 10, color: '#4ADE80', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'system-ui' }}>
                LIVE
              </span>
            </div>
          </div>

          <LivePreview
            base={funnel.base} spotify={funnel.spotify}
            extras={added ? [...funnel.extras.filter(e => e !== 'wordle'), 'wordle'] : funnel.extras.filter(e => e !== 'wordle')}
            wordle={previewData}
            roulette={funnel.roulette}
            previewProduct={previewProduct}
            onPreviewChange={setPreviewProduct}
          />
        </div>

      </div>
    </div>
  );
}
