'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { loadGift, type StoredGift } from '@/lib/gift-store';

function ExtraCard({
  emoji, title, description, cta, accent,
}: {
  emoji: string; title: string; description: string; cta: string; accent: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 20, padding: '22px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      cursor: 'pointer', transition: 'background 0.18s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
        background: `${accent}22`, border: `1.5px solid ${accent}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
      }}>
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px', fontFamily: 'system-ui' }}>
          {title}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: 'system-ui', lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: accent, fontFamily: 'system-ui', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {cta}
      </span>
    </div>
  );
}

export default function PresentePage() {
  const { id } = useParams<{ id: string }>();
  const [gift, setGift]       = useState<StoredGift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGift(loadGift(id));
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#E11D48', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!gift) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', fontFamily: 'system-ui' }}>
        <p style={{ fontSize: 48, margin: '0 0 16px' }}>💔</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 8px', textAlign: 'center' }}>Presente não encontrado</p>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 32px', textAlign: 'center' }}>
          Este link pode ter expirado ou foi aberto em outro dispositivo.
        </p>
        <Link href="/" style={{ background: '#E11D48', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: 14, fontWeight: 700, fontSize: 15 }}>
          Criar meu presente
        </Link>
      </div>
    );
  }

  const { funnel } = gift;
  const hasWordle   = funnel.extras.includes('wordle')   && funnel.wordle.word.length   >= 3;
  const hasRoulette = funnel.extras.includes('roulette') && funnel.roulette.options.length >= 2;

  return (
    <div style={{ minHeight: '100dvh', background: '#0A0A0A' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 390 }}>
          <SpotifyPlayer spotify={funnel.spotify} base={funnel.base} />
        </div>
      </div>

      {(hasWordle || hasRoulette) && (
        <div style={{ padding: '48px 24px 80px', maxWidth: 438, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.14em', textAlign: 'center', margin: '0 0 18px', fontFamily: 'system-ui' }}>
            Mini-jogos
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hasWordle && (
              <Link href={`/presente/${id}/wordle`} style={{ textDecoration: 'none' }}>
                <ExtraCard emoji="🟩" title="Wordle do Amor" description={`Adivinhe a palavra secreta de ${funnel.wordle.word.length} letras`} cta="Jogar →" accent="#22C55E" />
              </Link>
            )}
            {hasRoulette && (
              <Link href={`/presente/${id}/roleta`} style={{ textDecoration: 'none' }}>
                <ExtraCard emoji="🎡" title={funnel.roulette.title || 'Roleta Surpresa'} description={`${funnel.roulette.options.length} opções te esperam`} cta="Girar →" accent="#E11D48" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
