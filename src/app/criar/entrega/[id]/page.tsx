'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { fetchGift } from '@/lib/gift-store';
import { PENDING_GIFT_KEY } from '@/app/criar/upsell/PendingGiftBanner';
import { Check, Copy, ExternalLink, Gift } from 'lucide-react';

export default function EntregaPage() {
  const { id } = useParams<{ id: string }>();
  const [url, setUrl]         = useState('');
  const [qrSrc, setQrSrc]     = useState('');
  const [copied, setCopied]   = useState(false);
  const [names, setNames]     = useState('');
  const [paid, setPaid]       = useState<boolean | null>(null);

  useEffect(() => {
    const origin  = window.location.origin;
    const giftUrl = `${origin}/presente/${id}`;
    setUrl(giftUrl);

    QRCode.toDataURL(giftUrl, {
      width: 240, margin: 2,
      color: { dark: '#0F172A', light: '#ffffff' },
    }).then(setQrSrc);

    fetchGift(id).then(gift => {
      if (!gift) { setPaid(false); return; }
      const isPaid = gift.status === 'paid';
      setPaid(isPaid);
      if (isPaid) {
        try {
          localStorage.removeItem(PENDING_GIFT_KEY);
          localStorage.removeItem('lv_funnel_draft');
          localStorage.removeItem('lv_funnel_step');
        } catch { /* localStorage indisponível */ }
      }
      const { giverName, receiverName } = gift.funnel.base;
      if (giverName && receiverName) setNames(`${giverName} & ${receiverName}`);
    });
  }, [id]);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  if (paid === null) {
    return (
      <div style={{ minHeight: '100dvh', background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(0,0,0,0.08)', borderTopColor: '#E11D48', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!paid) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#F7F8FA',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 32px', gap: 12,
      }}>
        <div style={{ fontSize: 44 }}>⏳</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>
          Aguardando confirmação
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 28px', maxWidth: 320, lineHeight: 1.5 }}>
          O pagamento ainda não foi confirmado. Se você pagou via Pix, pode levar alguns instantes.
        </p>
        <button
          onClick={() => { setPaid(null); fetchGift(id).then(g => setPaid(g ? g.status === 'paid' : false)); }}
          style={{
            background: '#E11D48', color: '#fff', border: 'none', borderRadius: 14,
            padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'system-ui',
          }}
        >
          Verificar pagamento
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#F7F8FA',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>

      {/* Header */}
      <header style={{
        width: '100%', height: 57, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fff', borderBottom: '1px solid #EBEBEB',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: '-0.01em' }}>
          Love<span style={{ color: '#E11D48' }}>Valentine</span>
        </span>
      </header>

      <div style={{
        width: '100%', maxWidth: 500,
        padding: '48px 24px 80px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      }}>

        {/* Success badge */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #E11D48, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(225,29,72,0.3)',
        }}>
          <Gift size={32} color="#fff" strokeWidth={2} />
        </div>

        <h1 style={{
          fontSize: 28, fontWeight: 900, color: '#111827',
          margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.02em',
        }}>
          Presente criado! 🎉
        </h1>
        {names && (
          <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 40px', textAlign: 'center' }}>
            {names}
          </p>
        )}
        {!names && <div style={{ marginBottom: 40 }} />}

        {/* QR code card */}
        <div style={{
          background: '#fff', border: '1.5px solid #E5E7EB',
          borderRadius: 24, padding: '32px 32px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          width: '100%', gap: 20, boxSizing: 'border-box',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <p style={{
            fontSize: 13, fontWeight: 700, color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0,
          }}>
            Escaneie para abrir
          </p>

          {qrSrc && (
            <div style={{
              padding: 12, background: '#fff',
              border: '1.5px solid #F3F4F6', borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <img src={qrSrc} alt="QR Code" width={200} height={200} style={{ display: 'block' }} />
            </div>
          )}

          <div style={{
            width: '100%', background: '#F9FAFB',
            border: '1.5px solid #E5E7EB', borderRadius: 14,
            padding: '14px 16px', display: 'flex',
            alignItems: 'center', gap: 12, boxSizing: 'border-box',
          }}>
            <span style={{
              flex: 1, fontSize: 13, color: '#374151', fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {url}
            </span>
            <button
              onClick={copy}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: copied ? '#22C55E' : '#E11D48',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '8px 14px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
                fontFamily: 'system-ui',
              }}
            >
              {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* WhatsApp share — primary action: the whole promise is "envie pelo WhatsApp" */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Preparei uma surpresa pra você ❤️ Abre aqui: ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 16, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#25D366', color: '#fff', borderRadius: 16,
            padding: '18px 0', fontSize: 16, fontWeight: 800,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxSizing: 'border-box',
            boxShadow: '0 8px 28px rgba(37,211,102,0.35)',
            transition: 'opacity 0.15s',
          }}
        >
          Enviar pelo WhatsApp
        </a>

        {/* Open button */}
        <Link
          href={`/presente/${id}`}
          style={{
            marginTop: 10, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#0F172A', color: '#fff', borderRadius: 16,
            padding: '18px 0', fontSize: 16, fontWeight: 800,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxSizing: 'border-box',
            transition: 'opacity 0.15s',
          }}
        >
          <ExternalLink size={18} strokeWidth={2} />
          Ver o presente antes de enviar
        </Link>

        {/* Sharing note — só em ambiente local */}
        {url.includes('localhost') && (
        <div style={{
          marginTop: 20, padding: '16px 18px',
          background: '#FFFBEB', border: '1.5px solid rgba(217,119,6,0.2)',
          borderRadius: 14, width: '100%', boxSizing: 'border-box',
        }}>
          <p style={{
            fontSize: 12.5, color: '#92400E', margin: 0, lineHeight: 1.5,
            fontWeight: 500,
          }}>
            <strong>⚠️ Rodando localmente:</strong> este link aponta para localhost. Na versão publicada na Vercel, o mesmo presente abre em qualquer celular.
          </p>
        </div>
        )}

      </div>
    </div>
  );
}
