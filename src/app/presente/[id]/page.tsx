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
