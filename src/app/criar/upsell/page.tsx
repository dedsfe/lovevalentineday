'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { INITIAL_FUNNEL, type FunnelData } from '../funnel';
import { saveGift, generateGiftId } from '@/lib/gift-store';

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

export default function UpsellPage() {
  const router  = useRouter();
  const [funnel, setFunnel] = useState<FunnelData>(INITIAL_FUNNEL);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lv_funnel_draft');
      if (raw) setFunnel({ ...INITIAL_FUNNEL, ...JSON.parse(raw) });
    } catch { /* use defaults */ }
  }, []);

  const extras   = funnel.extras as ('wordle' | 'roulette')[];
  const extrasTotal = extras.reduce((s, k) => s + EXTRA_PRICES[k], 0);
  const total    = BASE_PRICE + extrasTotal;

  const { giverName, receiverName } = funnel.base;
  const displayNames = giverName && receiverName
    ? `${giverName} & ${receiverName}`
    : 'Seu presente';

  const checkout = () => {
    const id = generateGiftId();
    saveGift({ id, createdAt: new Date().toISOString(), funnel, addons: extras });
    router.push(`/criar/entrega/${id}`);
  };

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
        <Link href="/criar/upsell/roleta" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)' }}>
          <ArrowLeft size={16} />
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'system-ui' }}>Voltar</span>
        </Link>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
          Love<span style={{ color: '#E11D48' }}>Valentine</span>
        </span>
        <div style={{ width: 60 }} />
      </header>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '48px 24px 80px',
      }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '6px 18px', marginBottom: 20,
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui', letterSpacing: '0.06em' }}>
                🎁 RESUMO DO PEDIDO
              </span>
            </div>
            <h1 style={{
              fontSize: 32, fontWeight: 900, color: '#fff',
              margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.15,
            }}>
              {displayNames}
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', margin: 0, fontFamily: 'system-ui' }}>
              Confira antes de finalizar
            </p>
          </div>

          {/* Base product */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '18px 20px', marginBottom: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(225,29,72,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                💝
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 0 3px', fontFamily: 'system-ui' }}>
                  Presente Digital
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0, fontFamily: 'system-ui' }}>
                  Música · Contador · Fotos · Mensagem · Motivos
                </p>
              </div>
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'system-ui', whiteSpace: 'nowrap', marginLeft: 12 }}>
              {fmt(BASE_PRICE)}
            </p>
          </div>

          {/* Extras */}
          {extras.length > 0 && (
            <>
              <p style={{
                fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.25)',
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
                      background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.18)',
                      borderRadius: 14, padding: '16px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: 13,
                          background: 'rgba(225,29,72,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                        }}>
                          {meta.emoji}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 800, color: '#E11D48', margin: '0 0 3px', fontFamily: 'system-ui' }}>
                            {meta.label}
                          </p>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0, fontFamily: 'system-ui' }}>
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
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '24px',
          }}>
            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui' }}>
                  Presente Digital
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'system-ui' }}>
                  {fmt(BASE_PRICE)}
                </span>
              </div>
              {extras.map(key => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui' }}>
                    {EXTRA_META[key].label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'system-ui' }}>
                    +{fmt(EXTRA_PRICES[key])}
                  </span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'system-ui' }}>
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

            <button
              onClick={checkout}
              style={{
                width: '100%', padding: '18px 0', borderRadius: 16, border: 'none',
                background: '#E11D48', color: '#fff',
                fontSize: 17, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'system-ui', letterSpacing: '-0.01em',
                boxShadow: '0 8px 32px rgba(225,29,72,0.4)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Finalizar e pagar — {fmt(total)}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button
                onClick={checkout}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'rgba(255,255,255,0.2)',
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
              <span key={label} style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 600, fontFamily: 'system-ui' }}>
                {label}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
