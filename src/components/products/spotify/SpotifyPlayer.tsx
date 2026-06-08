'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, MoreHorizontal, Camera } from 'lucide-react';
import type { SpotifyData, GiftBase } from '@/lib/types';

// ─── Relationship counter ────────────────────────────────────────────────────

function useRelationshipTime(startDate: string, startTime = '00:00') {
  const [t, setT] = useState({ anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const tick = () => {
      const start = new Date(`${startDate}T${startTime}:00`);
      const now   = new Date();

      let anos   = now.getFullYear() - start.getFullYear();
      let meses  = now.getMonth()    - start.getMonth();
      let dias   = now.getDate()     - start.getDate();

      if (dias   < 0) { meses--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); dias += prev.getDate(); }
      if (meses  < 0) { anos--;  meses += 12; }

      const horas    = now.getHours()   - start.getHours()   + (dias   < 0 ? 24 : 0);
      const minutos  = now.getMinutes() - start.getMinutes() + (horas  < 0 ? 60 : 0);
      const segundos = now.getSeconds() - start.getSeconds() + (minutos < 0 ? 60 : 0);

      // simpler: use elapsed ms for h/m/s to avoid edge cases
      const diff = now.getTime() - start.getTime();
      const hh   = Math.floor((diff % 86_400_000) / 3_600_000);
      const mm   = Math.floor((diff % 3_600_000)  / 60_000);
      const ss   = Math.floor((diff % 60_000)     / 1000);

      setT({ anos, meses, dias, horas: hh, minutos: mm, segundos: ss });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate, startTime]);

  return t;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  spotify: SpotifyData;
  base: Pick<GiftBase, 'giverName' | 'receiverName' | 'startDate' | 'startTime'>;
}

// ─── Component ───────────────────────────────────────────────────────────────

const BG = '#1C2B3A';
const BG2 = '#243447';
const TEXT = '#FFFFFF';
const MUTED = '#8899AA';
const ACCENT = '#1DB954';

export function SpotifyPlayer({ spotify, base }: Props) {
  const [playing, setPlaying]     = useState(false);
  const [photoIdx, setPhotoIdx]   = useState(0);
  const [progress, setProgress]   = useState(0);
  const [currentSec, setCurrent]  = useState(0);
  const [duration, setDuration]   = useState(30);
  const [shuffle, setShuffle]     = useState(false);
  const [repeat, setRepeat]       = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t        = useRelationshipTime(base.startDate, base.startTime);

  const audioSrc = spotify.previewUrl ?? spotify.musicUrl ?? null;
  const photos   = spotify.photos ?? [];
  const coverSrc = photos[photoIdx] ?? spotify.albumArt ?? null;

  // ── Photo carousel ────────────────────────────────────────────────────────
  useEffect(() => {
    if (photos.length <= 1) return;
    timerRef.current = setInterval(() => setPhotoIdx(i => (i + 1) % photos.length), 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length]);

  // ── Audio events ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime  = () => { const d = audio.duration || 30; setCurrent(audio.currentTime); setProgress((audio.currentTime / d) * 100); };
    const onMeta  = () => setDuration(audio.duration);
    const onEnded = () => { setPlaying(false); if (repeat && audio) { audio.currentTime = 0; audio.play(); setPlaying(true); } };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onMeta); audio.removeEventListener('ended', onEnded); };
  }, [repeat]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;
    if (playing) { audio.pause(); } else { audio.play().catch(() => null); }
    setPlaying(p => !p);
  }, [playing, audioSrc]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * (audio.duration || 30);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  const counterItems = [
    { label: 'Anos',     value: t.anos },
    { label: 'Meses',    value: t.meses },
    { label: 'Dias',     value: t.dias },
    { label: 'Horas',    value: t.horas },
    { label: 'Minutos',  value: t.minutos },
    { label: 'Segundos', value: t.segundos },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: BG, width: '100%', maxWidth: 420, borderRadius: 20, overflow: 'hidden', fontFamily: 'inherit' }}>
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 8px' }}>
        <ChevronDown size={22} color={MUTED} style={{ cursor: 'pointer' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase' }}>
          {spotify.topText || 'Playlist do Amor'}
        </span>
        <MoreHorizontal size={22} color={MUTED} style={{ cursor: 'pointer' }} />
      </div>

      {/* ── Cover / Carousel ─────────────────────────────────────────────── */}
      <div style={{ margin: '12px 20px 0', position: 'relative', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', background: BG2 }}>
        {coverSrc ? (
          <img
            src={coverSrc}
            alt="cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.6s' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Camera size={48} color={MUTED} strokeWidth={1.5} />
            <span style={{ fontSize: 14, color: MUTED, fontWeight: 500, textAlign: 'center', padding: '0 24px' }}>
              A foto de vocês vai ficar aqui
            </span>
          </div>
        )}

        {/* Photo carousel dots */}
        {photos.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                style={{ width: i === photoIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === photoIdx ? ACCENT : 'rgba(255,255,255,0.35)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Song info ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 20px 0' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {spotify.musicTitle || 'Título da Música'}
          </p>
          <p style={{ fontSize: 14, color: MUTED, margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {spotify.musicArtist || 'Artista'}
          </p>
        </div>
        {/* Spotify-style saved indicator */}
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 12, flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0' }}>
        <div
          onClick={seek}
          style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' }}
        >
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 2, background: TEXT, position: 'relative' }}>
            <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: TEXT }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: MUTED }}>{fmt(currentSec)}</span>
          <span style={{ fontSize: 11, color: MUTED }}>-{fmt(Math.max(0, duration - currentSec))}</span>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 20px' }}>
        <button onClick={() => setShuffle(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
          <Shuffle size={20} color={shuffle ? ACCENT : MUTED} />
        </button>
        <button
          onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; setProgress(0); setCurrent(0); } }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
        >
          <SkipBack size={32} fill={TEXT} color={TEXT} />
        </button>
        <button
          onClick={togglePlay}
          style={{ width: 64, height: 64, borderRadius: '50%', background: TEXT, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        >
          {playing
            ? <Pause size={28} fill={BG} color={BG} />
            : <Play  size={28} fill={BG} color={BG} style={{ marginLeft: 3 }} />
          }
        </button>
        <button
          onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration ?? 30; }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
        >
          <SkipForward size={32} fill={TEXT} color={TEXT} />
        </button>
        <button onClick={() => setRepeat(r => !r)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
          <Repeat size={20} color={repeat ? ACCENT : MUTED} />
        </button>
      </div>

      {/* ── Sobre o casal ─────────────────────────────────────────────────── */}
      <div style={{ background: BG2, margin: '0 0 0', padding: '20px 20px 24px' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>
          {base.giverName} e {base.receiverName}
        </p>
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 16px' }}>
          {spotify.bottomText || 'Juntos desde'} {new Date(base.startDate).getFullYear()}
        </p>

        {/* 6-box counter */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {counterItems.map(item => (
            <div
              key={item.label}
              style={{ background: '#1A2535', borderRadius: 12, padding: '14px 8px', textAlign: 'center' }}
            >
              <p style={{ fontSize: 26, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1 }}>
                {item.value}
              </p>
              <p style={{ fontSize: 11, color: MUTED, margin: '6px 0 0', fontWeight: 500 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
