'use client';

import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import type { GiftBase, SpotifyData } from '@/lib/types';

interface Props {
  base:    GiftBase;
  spotify: SpotifyData;
}

export function LivePreview({ base, spotify }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const previewBase = {
    giverName:    base.giverName    || 'Você',
    receiverName: base.receiverName || 'Ele / Ela',
    startDate:    base.startDate    || today,
    startTime:    base.startTime    || '00:00',
    coverPhoto:   base.coverPhoto   || '',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/*
        iPhone frame: image is 780×1440 transparent PNG.
        Screen area insets: left 8.5%, right 8.6%, top 3.8%, bottom 3.8%.
        mix-blend-mode: screen makes the black screen pixels transparent,
        revealing the SpotifyPlayer content below. Requires dark panel bg.
      */}
      {/*
        Phone width: 310px → screen area ≈ 257px wide.
        SpotifyPlayer is designed for 390px, so we zoom it to 257/390 ≈ 0.66
        so the content looks like a proportional miniature inside the phone.
      */}
      <div style={{ position: 'relative', width: 310 }}>

        {/* Content rendered in the screen area (behind the phone image) */}
        <div
          className="scrollbar-hide"
          style={{
            position: 'absolute',
            top: '3.8%', left: '8.5%', right: '8.6%', bottom: '3.8%',
            overflowY: 'auto', overflowX: 'hidden',
            borderRadius: 26,
            zIndex: 1,
          }}
        >
          {/* Zoom wrapper: renders SpotifyPlayer at 390px then scales it down */}
          <div style={{ width: 390, zoom: 0.66, transformOrigin: 'top left' }}>
            <SpotifyPlayer spotify={spotify} base={previewBase} />
          </div>
        </div>

        {/* Phone frame overlay — black screen area becomes transparent via screen blend */}
        <img
          src="/iphone-frame-cropped.png"
          alt=""
          draggable={false}
          style={{
            width: '100%', display: 'block',
            position: 'relative', zIndex: 10,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>

      <p style={{
        marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.3)',
        fontWeight: 600, textAlign: 'center', letterSpacing: '0.04em',
        fontFamily: 'system-ui',
      }}>
        ↕ Role para ver o presente completo
      </p>
    </div>
  );
}
