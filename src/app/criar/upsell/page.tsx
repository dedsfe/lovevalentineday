'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Eye } from 'lucide-react';
import { INITIAL_FUNNEL, type FunnelData } from '../funnel';
import { LivePreview } from '../LivePreview';

type MobileView = 'edit' | 'preview';
type ProductKey = 'spotify' | 'wordle' | 'roulette';

const DRAFT_KEY = 'lv_funnel_draft';
const STEP_KEY  = 'lv_funnel_step';
const BASE_PRICE = 29.90;
const EXTRA_PRICES: Record<'wordle' | 'roulette', number> = {
  wordle:   9.90,
  roulette: 9.90,
};
const EXTRA_META: Record<'wordle' | 'roulette', { emoji: string; label: string; description: string }> = {
  wordle:   { emoji: '🟩', label: 'Wordle do Amor',  description: 'Palavra secreta + mensagem ao acertar' },
  roulette: { emoji: '🎡', label: 'Roleta Surpresa', description: 'Atividades para fazer juntos' },
};

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ─── Mobile view switcher ─────────────────────────────────────────────────────

function MobileViewSwitcher({ active, onChange }: { active: MobileView; onChange: (v: MobileView) => void }) {
  const tabs: { key: MobileView; label: string; icon: React.ReactNode }[] = [
    { key: 'edit',    label: 'Resumo',        icon: <Pencil size={13} strokeWidth={2.5} /> },
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

export default function UpsellPage() {
  const router = useRouter();
  const [funnel, setFunnel]         = useState<FunnelData>(INITIAL_FUNNEL);
  const [paying, setPaying]         = useState(false);
  const [payError, setPayError]     = useState('');
  const [ready, setReady]           = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const [previewProduct, setPreviewProduct] = useState<ProductKey>('spotify');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setFunnel({ ...INITIAL_FUNNEL, ...JSON.parse(raw) });
    } catch { /* use defaults */ }
    setReady(true);
  }, []);

  const extras   = funnel.extras as ('wordle' | 'roulette')[];
  const extrasTotal = extras.reduce((s, k) => s + EXTRA_PRICES[k], 0);
  const total    = BASE_PRICE + extrasTotal;

  const { giverName, receiverName } = funnel.base;
  const displayNames = giverName && receiverName
    ? `${giverName} & ${receiverName}`
    : 'Seu presente';

  const checkout = async (addons: ('wordle' | 'roulette')[] = extras) => {
    if (paying) return;
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnel, addons }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error);
      window.location.href = data.url;
    } catch {
      setPayError('Não foi possível iniciar o pagamento. Tente novamente.');
      setPaying(false);
    }
  };

  const back = () => {
    router.push('/criar/upsell/roleta');
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
            width: '100%',
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 700, whiteSpace: 'nowrap' }}>
          8 de 8
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
            gridTemplateRows: '1fr',
          }}
        >
          {/* Scrollable form content */}
          <div style={{ overflowY: 'auto', padding: '32px 0 48px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 520, padding: '0 24px' }}>

              <div className="hidden lg:block">
                <Stepper current={8} total={8} onGoto={onGoto} />
                <div style={{ marginBottom: 44 }} />
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.18)',
                  borderRadius: 20, padding: '4px 14px', marginBottom: 16,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#E11D48', fontFamily: 'system-ui', letterSpacing: '0.05em' }}>
                    🎁 RESUMO DO PEDIDO
                  </span>
                </div>
                <h1 style={{
                  fontSize: 28, fontWeight: 800, color: '#111827',
                  margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.15,
                }}>
                  {displayNames}
                </h1>
                <p style={{ fontSize: 14.5, color: '#6B7280', margin: 0, fontFamily: 'system-ui' }}>
                  Confira os detalhes antes de finalizar
                </p>
              </div>

              {/* Base product */}
              <div style={{
                background: '#fff', border: '1.5px solid #E5E7EB',
                borderRadius: 16, padding: '18px 20px', marginBottom: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 13,
                    background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>
                    💝
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#111827', margin: '0 0 3px', fontFamily: 'system-ui' }}>
                      Presente Digital
                    </p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontFamily: 'system-ui' }}>
                      Música · Contador · Fotos · Mensagem · Motivos
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, fontFamily: 'system-ui', whiteSpace: 'nowrap', marginLeft: 12 }}>
                  {fmt(BASE_PRICE)}
                </p>
              </div>

              {/* Extras */}
              {extras.length > 0 && (
                <>
                  <p style={{
                    fontSize: 11, fontWeight: 800, color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    margin: '20px 0 10px', fontFamily: 'system-ui',
                  }}>
                    Extras adicionados
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {extras.map(key => {
                      const meta = EXTRA_META[key];
                      return (
                        <div key={key} style={{
                          background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.15)',
                          borderRadius: 14, padding: '16px 20px',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                              width: 46, height: 46, borderRadius: 13,
                              background: 'rgba(225,29,72,0.06)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                            }}>
                              {meta.emoji}
                            </div>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 800, color: '#E11D48', margin: '0 0 3px', fontFamily: 'system-ui' }}>
                                {meta.label}
                              </p>
                              <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontFamily: 'system-ui' }}>
                                {meta.description}
                              </p>
                            </div>
                          </div>
                          <p style={{ fontSize: 15, fontWeight: 800, color: '#E11D48', margin: 0, fontFamily: 'system-ui', whiteSpace: 'nowrap', marginLeft: 12 }}>
                            +{fmt(EXTRA_PRICES[key])}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Total + CTA */}
              <div style={{
                marginTop: 28,
                background: '#fff', border: '1.5px solid #E5E7EB',
                borderRadius: 20, padding: '24px',
              }}>
                {/* Line items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#6B7280', fontFamily: 'system-ui' }}>
                      Presente Digital
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'system-ui' }}>
                      {fmt(BASE_PRICE)}
                    </span>
                  </div>
                  {extras.map(key => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, color: '#6B7280', fontFamily: 'system-ui' }}>
                        {EXTRA_META[key].label}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'system-ui' }}>
                        +{fmt(EXTRA_PRICES[key])}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: '#F3F4F6', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#111827', fontFamily: 'system-ui' }}>
                      Total
                    </span>
                    <span style={{
                      fontSize: 26, fontWeight: 900, color: '#E11D48',
                      letterSpacing: '-0.03em', fontFamily: 'system-ui',
                    }}>
                      {fmt(total)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={back}
                    disabled={paying}
                    style={{
                      flex: 1, padding: '15px 0', borderRadius: 14,
                      background: '#fff', border: '2px solid #E5E7EB', color: '#374151',
                      fontSize: 15, fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer',
                      fontFamily: 'system-ui', letterSpacing: '-0.01em',
                    }}
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={() => checkout()}
                    disabled={paying}
                    style={{
                      flex: 2, padding: '15px 0', borderRadius: 14, border: 'none',
                      background: '#E11D48', color: '#fff',
                      fontSize: 15, fontWeight: 800, cursor: paying ? 'wait' : 'pointer',
                      fontFamily: 'system-ui', letterSpacing: '-0.01em',
                      boxShadow: '0 8px 32px rgba(225,29,72,0.4)',
                      transition: 'opacity 0.15s',
                      opacity: paying ? 0.6 : 1,
                    }}
                  >
                    {paying ? 'Preparando pagamento…' : `Pagar — ${fmt(total)}`}
                  </button>
                </div>

                {payError && (
                  <p style={{
                    fontSize: 13, color: '#EF4444', textAlign: 'center',
                    margin: '12px 0 0', fontFamily: 'system-ui', fontWeight: 600,
                  }}>
                    {payError}
                  </p>
                )}

                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <button
                    onClick={() => checkout([])}
                    disabled={paying}
                    style={{
                      background: 'none', border: 'none', cursor: paying ? 'wait' : 'pointer',
                      fontSize: 13, color: '#9CA3AF',
                      fontFamily: 'system-ui', fontWeight: 600,
                    }}
                  >
                    Continuar sem extras — {fmt(BASE_PRICE)}
                  </button>
                </div>
              </div>

              {/* Trust */}
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap',
              }}>
                {['🔒 Pagamento seguro', '⚡ Link em segundos', '💌 Presente garantido'].map(label => (
                  <span key={label} style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, fontFamily: 'system-ui' }}>
                    {label}
                  </span>
                ))}
              </div>

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
              extras={funnel.extras} wordle={funnel.wordle} roulette={funnel.roulette}
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
                Preview do Presente
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
            extras={funnel.extras} wordle={funnel.wordle} roulette={funnel.roulette}
            previewProduct={previewProduct}
            onPreviewChange={setPreviewProduct}
          />
        </div>

      </div>
    </div>
  );
}
