'use client';

import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import type { GiftBase, SpotifyData } from '@/lib/types';

interface Props {
  base:       GiftBase;
  spotify:    SpotifyData;
  width?:     number;   // phone width in px, default 310
  scrollable?: boolean; // allow scrolling inside screen, default true
}

export function LivePreview({ base, spotify, width = 310, scrollable = true }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const previewBase = {
    giverName:    base.giverName    || 'Você',
    receiverName: base.receiverName || 'Ele / Ela',
    startDate:    base.startDate    || today,
    startTime:    base.startTime    || '00:00',
    coverPhoto:   base.coverPhoto   || '',
  };

  // Screen area: left 8.5%, right 8.6%, top/bottom 3.8%
  // SpotifyPlayer is designed for 390px → scale via zoom
  const screenWidth  = width * (1 - 0.085 - 0.086); // 0.829
  const zoom         = screenWidth / 390;
  const radius       = Math.round(26 * (width / 310));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/*
        Phone container. Position: relative so the glow, content, and frame
        can be layered via z-index.

        Glow (z:0) → content (z:1) → frame overlay (z:10)

        mix-blend-mode: screen on the frame makes its black "screen area"
        pixels transparent → reveals the SpotifyPlayer rendered behind it.
        The glow is only visible outside the phone body silhouette because
        the phone body (white pixels) → screen(white,x) = white, covering it.
      */}
      <div style={{ position: 'relative', width }}>

        {/* Ambient glow halo */}
        <div style={{
          position: 'absolute', inset: -24,
          background: 'radial-gradient(ellipse at 50% 42%, rgba(225,29,72,0.15) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Screen area: outer clips to border-radius, inner scrolls */}
        <div style={{
          position: 'absolute',
          top: '3.8%', left: '8.5%', right: '8.6%', bottom: '3.8%',
          borderRadius: radius,
          overflow: 'hidden',
          zIndex: 1,
        }}>
          <div
            className="scrollbar-hide"
            style={{
              width: '100%', height: '100%',
              overflowY: scrollable ? 'auto' : 'hidden',
              overflowX: 'hidden',
            }}
          >
            <div style={{ width: 390, zoom, transformOrigin: 'top left' }}>
              <SpotifyPlayer spotify={spotify} base={previewBase} />
            </div>
          </div>
        </div>

        {/* iPhone frame overlay */}
        <img
          src="/iphone-frame-cropped.png"
          alt=""
          draggable={false}
          style={{
            width: '100%', display: 'block',
            position: 'relative', zIndex: 10,
            mixBlendMode: 'screen',
            pointerEvents: 'none', userSelect: 'none',
          }}
        />
      </div>

      {scrollable && (
        <p style={{
          marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.22)',
          fontWeight: 600, textAlign: 'center', letterSpacing: '0.05em',
          fontFamily: 'system-ui',
        }}>
          ↕ Role para ver o presente completo
        </p>
      )}
    </div>
  );
}
