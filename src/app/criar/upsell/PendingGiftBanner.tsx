'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export const PENDING_GIFT_KEY = 'lv_pending_gift';

// Rede de segurança pro pagamento: se o checkout do Mercado Pago não
// redirecionar de volta (tela do Pix às vezes trava), o link de entrega não
// pode se perder. O id do presente fica no localStorage antes do redirect e,
// quando o usuário voltar ao funil, este banner devolve o caminho da entrega.
export function PendingGiftBanner() {
  const [gift, setGift] = useState<{ id: string; paid: boolean } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_GIFT_KEY);
      if (!raw) return;
      const { id } = JSON.parse(raw) as { id?: string };
      if (!id) return;

      fetch(`/api/gifts?id=${id}`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data?.status) setGift({ id, paid: data.status === 'paid' });
        })
        .catch(() => { /* sem rede, sem banner */ });
    } catch { /* localStorage indisponível */ }
  }, []);

  if (!gift) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      padding: '10px 20px', flexWrap: 'wrap',
      background: gift.paid ? '#ECFDF5' : '#FFFBEB',
      borderBottom: `1px solid ${gift.paid ? '#A7F3D0' : '#FDE68A'}`,
      fontSize: 13.5, fontWeight: 600,
      color: gift.paid ? '#065F46' : '#92400E',
    }}>
      <span>
        {gift.paid
          ? 'Pagamento confirmado! Seu presente está pronto.'
          : 'Já pagou e não foi redirecionado? Sua página de entrega está guardada.'}
      </span>
      <Link
        href={`/criar/entrega/${gift.id}`}
        style={{
          color: gift.paid ? '#047857' : '#B45309',
          fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap',
        }}
      >
        Ver página de entrega →
      </Link>
      <button
        onClick={() => { localStorage.removeItem(PENDING_GIFT_KEY); setGift(null); }}
        aria-label="Dispensar"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'inherit', fontSize: 16, lineHeight: 1, padding: 4, opacity: 0.6,
        }}
      >
        ×
      </button>
    </div>
  );
}
