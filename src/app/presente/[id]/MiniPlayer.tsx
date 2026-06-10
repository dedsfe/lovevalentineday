'use client';

import Link from 'next/link';
import { Play, Pause } from 'lucide-react';
import { useGift } from './GiftContext';

interface ProductLink {
  href:  string;
  label: string;
  icon:  string;
}

interface Props {
  presenteHref: string;
  otherProducts?: ProductLink[];
}

export function MiniPlayer({ presenteHref, otherProducts = [] }: Props) {
  const { audio, togglePlay } = useGift();

  const hasTrack = !!audio.previewUrl;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(16,16,16,0.97)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Progress strip */}
      {hasTrack && (
        <div style={{ height: 2, background: 'rgba(255,255,255,0.1)' }}>
          <div style={{
            height: '100%', background: '#E11D48',
            width: `${audio.progress}%`, transition: 'width 0.5s linear',
          }} />
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 20px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
      }}>
        {/* Cover */}
        {audio.coverSrc ? (
          <img src={audio.coverSrc} style={{
            width: 40, height: 40, borderRadius: 6,
            objectFit: 'cover', flexShrink: 0,
          }} alt="" />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: 6, flexShrink: 0,
            background: 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            🎵
          </div>
        )}

        {/* Track info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 700, color: '#fff',
            margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {audio.trackTitle || 'Nossa música'}
          </p>
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.45)',
            margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {audio.isPlaying ? '▶ Tocando' : audio.trackArtist || 'Pausado'}
          </p>
        </div>

        {/* Play/pause */}
        {hasTrack && (
          <button
            onClick={togglePlay}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {audio.isPlaying
              ? <Pause size={16} fill="#000" color="#000" />
              : <Play  size={16} fill="#000" color="#000" style={{ marginLeft: 2 }} />
            }
          </button>
        )}

        {/* Other product links */}
        {otherProducts.map(p => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              flexShrink: 0,
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, textDecoration: 'none',
            }}
            title={p.label}
          >
            {p.icon}
          </Link>
        ))}

        {/* Back to Spotify */}
        <Link
          href={presenteHref}
          style={{
            flexShrink: 0, fontSize: 11, fontWeight: 700,
            color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '6px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          ↩ Spotify
        </Link>
      </div>
    </div>
  );
}
