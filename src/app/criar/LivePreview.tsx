'use client';

import { Music2, Hash, Disc3, ChevronLeft } from 'lucide-react';
import { SpotifyPlayer, type ProductNav } from '@/components/products/spotify/SpotifyPlayer';
import { WordleGame }    from '@/components/products/wordle/WordleGame';
import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import type { GiftBase, SpotifyData, WordleData, RouletteData } from '@/lib/types';

// ─── Segmented control ────────────────────────────────────────────────────────

type ProductKey = 'spotify' | 'wordle' | 'roulette';

const TAB_ICONS: Record<ProductKey, React.ReactNode> = {
  spotify:  <Music2 size={12} strokeWidth={2.2} />,
  wordle:   <Hash   size={12} strokeWidth={2.2} />,
  roulette: <Disc3  size={12} strokeWidth={2.2} />,
};

function SegmentedControl({
  tabs, active, onChange,
}: {
  tabs:     { key: ProductKey; label: string }[];
  active:   ProductKey;
  onChange: (k: ProductKey) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 11, padding: 3, gap: 2,
      marginBottom: 16, width: '100%', maxWidth: 280,
    }}>
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 5,
              padding: '7px 8px', borderRadius: 8, border: 'none',
              background: isActive
                ? 'rgba(255,255,255,0.14)'
                : 'transparent',
              boxShadow: isActive
                ? '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
                : 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.28)',
              fontSize: 11, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', fontFamily: 'system-ui',
              transition: 'all 0.16s ease',
              whiteSpace: 'nowrap',
              letterSpacing: isActive ? '-0.01em' : '0',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.6 }}>
              {TAB_ICONS[t.key]}
            </span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Back bar (inside phone, top of each product) ─────────────────────────────

function BackBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '14px 16px 10px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      gap: 10,
    }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18, padding: '5px 11px 5px 7px',
          color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'system-ui', flexShrink: 0,
          transition: 'all 0.15s',
        }}
      >
        <ChevronLeft size={12} strokeWidth={2.5} />
        Spotify
      </button>

      <span style={{
        flex: 1, fontSize: 13, fontWeight: 700, color: '#fff',
        fontFamily: 'system-ui', letterSpacing: '-0.01em',
        textAlign: 'center', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {title}
      </span>

      {/* Mirror the button width so title stays centered */}
      <div style={{ width: 72, flexShrink: 0 }} />
    </div>
  );
}

// ─── Demo data (only when user hasn't typed anything yet) ─────────────────────

const DEMO_WORDLE: WordleData = {
  word:       'AMOR',
  clue:       'O que sinto toda vez que penso em você…',
  winMessage: 'Você me conhece tão bem! ❤️',
};

const DEMO_ROULETTE: RouletteData = {
  title:   'O que vamos fazer hoje?',
  options: ['Jantar especial', 'Cinema', 'Massagem', 'Passeio', 'Netflix'],
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  base:             GiftBase;
  spotify:          SpotifyData;
  width?:           number;
  scrollable?:      boolean;
  extras?:          ('wordle' | 'roulette')[];
  wordle?:          WordleData;
  roulette?:        RouletteData;
  previewProduct?:  ProductKey;
  onPreviewChange?: (p: ProductKey) => void;
}

// ─── LivePreview ──────────────────────────────────────────────────────────────

export function LivePreview({
  base, spotify,
  width = 310, scrollable = true,
  extras = [], wordle, roulette,
  previewProduct = 'spotify',
  onPreviewChange,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const previewBase = {
    giverName:    base.giverName    || 'Você',
    receiverName: base.receiverName || 'Ele / Ela',
    startDate:    base.startDate    || today,
    startTime:    base.startTime    || '00:00',
    coverPhoto:   base.coverPhoto   || '',
  };

  const TOP = 0.0375; const BOTTOM = 0.0382;
  const LEFT = 0.1026; const RIGHT  = 0.1026;
  const screenWidth = width * (1 - LEFT - RIGHT);
  const zoom        = screenWidth / 390;
  const radius      = Math.round(44 * (width / 310));

  const tabs: { key: ProductKey; label: string }[] = [
    { key: 'spotify',  label: 'Spotify' },
    ...(extras.includes('wordle')   ? [{ key: 'wordle'   as ProductKey, label: 'Wordle'  }] : []),
    ...(extras.includes('roulette') ? [{ key: 'roulette' as ProductKey, label: 'Roleta'  }] : []),
  ];

  // Nav cards at the bottom of Spotify view — click switches preview tab
  const spotifyProducts: ProductNav[] = [
    ...(extras.includes('wordle') ? [{
      key: 'wordle', icon: '🟩', label: 'Wordle do Amor', accent: '#22C55E',
      onClick: () => onPreviewChange?.('wordle'),
    }] : []),
    ...(extras.includes('roulette') ? [{
      key: 'roulette', icon: '🎡', label: 'Roleta Surpresa', accent: '#E11D48',
      count: roulette && roulette.options.length > 0 ? roulette.options.length : undefined,
      onClick: () => onPreviewChange?.('roulette'),
    }] : []),
  ];

  // Real-time data: use actual input once viable, else demo so phone is never blank
  const wordleData   = wordle   && wordle.word.length   >= 3 ? wordle   : DEMO_WORDLE;
  const rouletteData = roulette && roulette.options.length >= 2 ? roulette : DEMO_ROULETTE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* Segmented control */}
      {tabs.length > 1 && (
        <SegmentedControl tabs={tabs} active={previewProduct} onChange={p => onPreviewChange?.(p)} />
      )}

      <div style={{ position: 'relative', width }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: -24,
          background: 'radial-gradient(ellipse at 50% 42%, rgba(225,29,72,0.15) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Content behind phone frame */}
        <div style={{
          position: 'absolute',
          top: `${TOP * 100}%`, left: `${LEFT * 100}%`,
          right: `${RIGHT * 100}%`, bottom: `${BOTTOM * 100}%`,
          borderRadius: radius, overflow: 'hidden', zIndex: 1,
        }}>
          <div
            className="scrollbar-hide"
            style={{
              width: '100%', height: '100%',
              overflowY: scrollable ? 'auto' : 'hidden',
              overflowX: 'hidden',
              background: '#0F172A',
            }}
          >
            <div style={{ width: 390, zoom, transformOrigin: 'top left' }}>

              {/* ── Spotify ──────────────────────────────── */}
              {previewProduct === 'spotify' && (
                <SpotifyPlayer
                  spotify={spotify}
                  base={previewBase}
                  products={spotifyProducts}
                />
              )}

              {/* ── Wordle ───────────────────────────────── */}
              {previewProduct === 'wordle' && (
                <div style={{ background: '#0F172A' }}>
                  <BackBar
                    title="Wordle do Amor"
                    onBack={() => onPreviewChange?.('spotify')}
                  />
                  <div style={{ padding: '16px 16px 24px' }}>
                    <WordleGame data={wordleData} />
                  </div>
                </div>
              )}

              {/* ── Roulette ─────────────────────────────── */}
              {previewProduct === 'roulette' && (
                <div style={{ background: '#0F172A' }}>
                  <BackBar
                    title={rouletteData.title || 'Roleta Surpresa'}
                    onBack={() => onPreviewChange?.('spotify')}
                  />
                  <div style={{ padding: '16px 16px 24px' }}>
                    {/* noConfetti: prevent canvas-confetti from painting over full viewport */}
                    <RouletteWheel data={rouletteData} noConfetti />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* iPhone frame on top */}
        <img
          src="/iphone-frame-cutout.png"
          alt=""
          draggable={false}
          style={{
            width: '100%', display: 'block',
            position: 'relative', zIndex: 10,
            pointerEvents: 'none', userSelect: 'none',
          }}
        />
      </div>

      {scrollable && (
        <p style={{
          marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.2)',
          fontWeight: 600, textAlign: 'center', letterSpacing: '0.05em',
          fontFamily: 'system-ui',
        }}>
          ↕ Role para ver o presente completo
        </p>
      )}
    </div>
  );
}
