'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { FunnelData } from '../funnel';
import { INITIAL_FUNNEL } from '../funnel';
import { saveGift, generateGiftId } from '@/lib/gift-store';

// ─── Pricing ──────────────────────────────────────────────────────────────────

const BASE_PRICE = 29.90;

interface Addon {
  id:          string;
  emoji:       string;
  title:       string;
  description: string;
  price:       number;
}

const ADDONS: Addon[] = [
  {
    id:          'lifetime',
    emoji:       '♾️',
    title:       'Link Vitalício',
    description: 'Presente disponível para sempre, sem expiração.',
    price:       19.90,
  },
  {
    id:          'custom_domain',
    emoji:       '🔗',
    title:       'Link Personalizado',
    description: 'Escolha a URL: lovepanda.app/você-e-eu',
    price:       14.90,
  },
  {
    id:          'pdf',
    emoji:       '📄',
    title:       'Versão em PDF',
    description: 'Baixe o presente como PDF para guardar para sempre.',
    price:       9.90,
  },
];

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UpsellPage() {
  const router = useRouter();
  const [funnel, setFunnel] = useState<FunnelData>(INITIAL_FUNNEL);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lv_funnel_draft');
      if (raw) setFunnel({ ...INITIAL_FUNNEL, ...JSON.parse(raw) });
    } catch { /* use defaults */ }
  }, []);

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const addonsTotal = ADDONS.filter(a => selected.has(a.id)).reduce((s, a) => s + a.price, 0);
  const total       = BASE_PRICE + addonsTotal;

  const { giverName, receiverName } = funnel.base;
  const displayNames = giverName && receiverName
    ? `${giverName} & ${receiverName}`
    : 'Seu presente';

  return (
    <div style={{
      minHeight: '100dvh', background: '#F7F8FA',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>

      {/* Header */}
      <header style={{
        width: '100%', height: 57, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        background: '#fff', borderBottom: '1px solid #EBEBEB',
        position: 'sticky', top: 0, zIndex: 50,
        boxSizing: 'border-box',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.01em' }}>
            Love<span style={{ color: '#E11D48' }}>Valentine</span>
          </span>
        </Link>
        <button
          onClick={() => router.push('/criar')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#9CA3AF', fontWeight: 600, fontFamily: 'system-ui',
          }}
        >
          ← Voltar ao funil
        </button>
      </header>

      <div style={{ width: '100%', maxWidth: 560, padding: '40px 24px 80px', boxSizing: 'border-box' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#FFF1F2', border: '1px solid rgba(225,29,72,0.15)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 13, color: '#E11D48', fontWeight: 700 }}>
              🎁 Quase pronto!
            </span>
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 800, color: '#111827',
            margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.15,
          }}>
            {displayNames}
          </h1>
          <p style={{ fontSize: 16, color: '#6B7280', margin: 0 }}>
            Seu presente está criado. Escolha os extras e finalize.
          </p>
        </div>

        {/* Base price card */}
        <div style={{
          background: '#fff', border: '1.5px solid #E5E7EB',
          borderRadius: 18, padding: '20px 22px', marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 13,
              background: '#FFF1F2', border: '1.5px solid rgba(225,29,72,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              💝
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 3px' }}>
                Presente Digital
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                Player de música · Contador · Fotos · Mensagem · Motivos
              </p>
            </div>
          </div>
          <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0, whiteSpace: 'nowrap', marginLeft: 12 }}>
            {fmt(BASE_PRICE)}
          </p>
        </div>

        {/* Add-ons */}
        <p style={{
          fontSize: 12, fontWeight: 700, color: '#9CA3AF',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          margin: '28px 0 12px',
        }}>
          Adicionar ao presente
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ADDONS.map(addon => {
            const active = selected.has(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => toggle(addon.id)}
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: active ? '#FFF1F2' : '#fff',
                  border: `1.5px solid ${active ? '#E11D48' : '#E5E7EB'}`,
                  borderRadius: 16, padding: '16px 18px',
                  boxShadow: active ? '0 0 0 3px rgba(225,29,72,0.08)' : 'none',
                  transition: 'all 0.18s',
                } as React.CSSProperties}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  background: active ? '#fff' : '#F9FAFB',
                  border: `1.5px solid ${active ? 'rgba(225,29,72,0.2)' : '#F0F0F0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {addon.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: active ? '#E11D48' : '#111827', margin: '0 0 3px' }}>
                    {addon.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                    {addon.description}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: active ? '#E11D48' : '#374151' }}>
                    +{fmt(addon.price)}
                  </span>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: active ? '#E11D48' : 'transparent',
                    border: `2px solid ${active ? '#E11D48' : '#D1D5DB'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s',
                  }}>
                    {active && <Check size={12} color="#fff" strokeWidth={3} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Total + CTAs */}
        <div style={{
          marginTop: 36,
          background: '#fff', border: '1.5px solid #E5E7EB',
          borderRadius: 20, padding: '24px 24px 28px',
        }}>
          {/* Line items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#6B7280' }}>Presente Digital</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{fmt(BASE_PRICE)}</span>
            </div>
            {ADDONS.filter(a => selected.has(a.id)).map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>{a.title}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>+{fmt(a.price)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: '#F3F4F6', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#E11D48', letterSpacing: '-0.02em' }}>
                {fmt(total)}
              </span>
            </div>
          </div>

          {/* Big CTA */}
          <button
            onClick={() => {
              const id = generateGiftId();
              saveGift({ id, createdAt: new Date().toISOString(), funnel, addons: [...selected] });
              router.push(`/presente/${id}`);
            }}
            style={{
              width: '100%', padding: '18px 0', borderRadius: 16, border: 'none',
              background: '#E11D48', color: '#fff',
              fontSize: 17, fontWeight: 800, cursor: 'pointer',
              letterSpacing: '-0.01em', fontFamily: 'system-ui',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Finalizar e pagar — {fmt(total)}
          </button>

          {/* Skip upsell */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => {
                const id = generateGiftId();
                saveGift({ id, createdAt: new Date().toISOString(), funnel, addons: [] });
                router.push(`/presente/${id}`);
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, color: '#9CA3AF', fontFamily: 'system-ui',
                fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              Continuar sem extras — {fmt(BASE_PRICE)}
            </button>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 28, marginTop: 28, flexWrap: 'wrap',
        }}>
          {['🔒 Pagamento seguro', '⚡ Link em segundos', '💌 Presente garantido'].map(label => (
            <span key={label} style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
              {label}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
