'use client';

import { useParams } from 'next/navigation';
import { SpotifyPlayer, type ProductNav } from '@/components/products/spotify/SpotifyPlayer';
import { useGift } from './GiftContext';

// ─── Product config ───────────────────────────────────────────────────────────

const PRODUCT_META: Record<string, { icon: string; label: string; accent: string }> = {
  wordle:   { icon: '🟩', label: 'Wordle do Amor',  accent: '#22C55E' },
  roulette: { icon: '🎡', label: 'Roleta Surpresa', accent: '#E11D48' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PresentePage() {
  const { id } = useParams<{ id: string }>();
  const { gift, audio, audioRef, togglePlay, seek, setAudioInfo } = useGift();

  if (!gift) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#0A0A0A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#E11D48',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Gate de pagamento: presente ainda não pago não exibe o conteúdo.
  if (gift.status === 'pending') {
    return (
      <div style={{
        minHeight: '100dvh', background: '#0A0A0A', color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '0 32px', gap: 12,
      }}>
        <div style={{ fontSize: 44 }}>⏳</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
          Pagamento em processamento
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: 320, lineHeight: 1.5 }}>
          Este presente fica disponível assim que o pagamento for confirmado.
          Se você acabou de pagar via Pix, pode levar alguns instantes — atualize a página.
        </p>
      </div>
    );
  }

  const { funnel } = gift;

  const hasWordle   = funnel.extras.includes('wordle')   && funnel.wordle.word.length >= 3;
  const hasRoulette = funnel.extras.includes('roulette') && funnel.roulette.options.length >= 2;

  const products: ProductNav[] = [
    ...(hasWordle   ? [{ key: 'wordle',   href: `/presente/${id}/wordle`,  ...PRODUCT_META.wordle   }] : []),
    ...(hasRoulette ? [{ key: 'roulette', href: `/presente/${id}/roleta`,  ...PRODUCT_META.roulette }] : []),
  ];

  return (
    <div style={{ minHeight: '100dvh', background: '#0A0A0A' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 390 }}>
          <SpotifyPlayer
            spotify={funnel.spotify}
            base={funnel.base}
            products={products}
            connected={{
              audioRef,
              isPlaying:  audio.isPlaying,
              progress:   audio.progress,
              currentSec: audio.currentSec,
              duration:   audio.duration,
              onToggle:   togglePlay,
              onSeek:     seek,
              onMount:    ({ previewUrl, coverSrc, title, artist }) =>
                setAudioInfo({ previewUrl, coverSrc, trackTitle: title, trackArtist: artist }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
