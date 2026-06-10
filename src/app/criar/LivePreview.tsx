'use client';

import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import type { GiftBase, SpotifyData } from '@/lib/types';

interface Props {
  base:        GiftBase;
  spotify:     SpotifyData;
  width?:      number;   // phone width in px, default 310
  scrollable?: boolean;  // allow scrolling inside screen, default true
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

  // Screen area in the cutout PNG (measured from pixel analysis):
  // rows 54-1385 / 1440h  → top 3.75%, bottom 3.82%
  // cols 80-700  / 780w   → left 10.26%, right 10.26%
  const TOP    = 0.0375;
  const BOTTOM = 0.0382;
  const LEFT   = 0.1026;
  const RIGHT  = 0.1026;

  const screenWidth  = width * (1 - LEFT - RIGHT);
  const zoom         = screenWidth / 390;
  // border-radius of the screen corners (visual match to phone glass)
  const radius       = Math.round(44 * (width / 310));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      <div style={{ position: 'relative', width }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: -24,
          background: 'radial-gradient(ellipse at 50% 42%, rgba(225,29,72,0.15) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Content sits behind the phone frame; the cutout PNG reveals it */}
        <div style={{
          position: 'absolute',
          top: `${TOP * 100}%`, left: `${LEFT * 100}%`,
          right: `${RIGHT * 100}%`, bottom: `${BOTTOM * 100}%`,
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

        {/* iPhone frame with transparent screen cutout — sits on top */}
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
