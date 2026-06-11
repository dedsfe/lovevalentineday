'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  ChevronDown, MoreHorizontal, Camera, Heart,
} from 'lucide-react';
import Link from 'next/link';
import type { SpotifyData, GiftBase } from '@/lib/types';

// ─── Dynamic color from first photo ──────────────────────────────────────────

const DEFAULT_BG = '#1A1A2E';

function useDominantColor(src: string | null): string {
  const [color, setColor] = useState(DEFAULT_BG);

  useEffect(() => {
    if (!src) { setColor(DEFAULT_BG); return; }

    const img = new Image();
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const S = 24;
        const canvas = document.createElement('canvas');
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, S, S);
        const { data } = ctx.getImageData(0, 0, S, S);
        let r = 0, g = 0, b = 0;
        const n = data.length / 4;
        for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
        const f = 0.22;
        setColor(`rgb(${Math.round(r / n * f)},${Math.round(g / n * f)},${Math.round(b / n * f)})`);
      } catch { setColor(DEFAULT_BG); }
    };
    img.onerror = () => setColor(DEFAULT_BG);
    img.src = src;
  }, [src]);

  return color;
}

// ─── Relationship counter ─────────────────────────────────────────────────────

function useRelationshipTime(startDate: string, startTime = '00:00') {
  const [t, setT] = useState({ anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const tick = () => {
      const start = new Date(`${startDate}T${startTime}:00`);
      const now   = new Date();

      let anos  = now.getFullYear() - start.getFullYear();
      let meses = now.getMonth()    - start.getMonth();
      let dias  = now.getDate()     - start.getDate();

      if (dias  < 0) { meses--; dias += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (meses < 0) { anos--;  meses += 12; }

      const diff = now.getTime() - start.getTime();
      setT({
        anos, meses, dias,
        horas:    Math.floor((diff % 86_400_000) / 3_600_000),
        minutos:  Math.floor((diff % 3_600_000)  / 60_000),
        segundos: Math.floor((diff % 60_000)     / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate, startTime]);

  return t;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEXT  = '#FFFFFF';
const MUTED = '#8A9BAD';
const DARK  = '#111827';
const DARKER = '#0C111A';

// ─── Product copy ─────────────────────────────────────────────────────────────

const PRODUCT_COPY: Record<string, { tagline: string; sub: string; cta: string }> = {
  wordle: {
    tagline: 'Uma palavra guardada só pra você',
    sub:     'Consegue adivinhar o que eu escolhi? 🤔',
    cta:     'Jogar o Wordle',
  },
  roulette: {
    tagline: 'Roleta das nossas surpresas 🎡',
    sub:     'Gira e descobre o que a gente vai fazer!',
    cta:     'Girar agora',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ConnectedAudio {
  audioRef:    React.RefObject<HTMLAudioElement>;
  isPlaying:   boolean;
  progress:    number;
  currentSec:  number;
  duration:    number;
  onToggle:    () => void;
  onSeek:      (frac: number) => void;
  onMount:     (info: { previewUrl: string | null; coverSrc: string | null; title: string; artist: string }) => void;
}

export interface ProductNav {
  key:     string;
  href?:   string;       // navigation (gift page)
  onClick?: () => void;  // in-preview switch (funnel)
  label:   string;
  icon:    string;
  accent:  string;
  count?:  number;       // e.g. roulette option count
}

interface Props {
  spotify:   SpotifyData;
  base:      Pick<GiftBase, 'giverName' | 'receiverName' | 'startDate' | 'startTime'>;
  connected?: ConnectedAudio;   // when provided, uses layout audio instead of local
  products?:  ProductNav[];     // navigation widgets at the bottom
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SpotifyPlayer({ spotify, base, connected, products }: Props) {
  const [localPlaying, setLocalPlaying] = useState(false);
  const [photoIdx, setPhotoIdx]         = useState(0);
  const [localProgress, setLocalProg]   = useState(0);
  const [localSec, setLocalSec]         = useState(0);
  const [localDur, setLocalDur]         = useState(30);
  const [shuffle, setShuffle]           = useState(false);
  const [repeat, setRepeat]             = useState(false);

  const localRef = useRef<HTMLAudioElement>(null);

  // Resolved values: connected mode overrides local
  const audioRef  = connected ? connected.audioRef  : localRef;
  const playing   = connected ? connected.isPlaying : localPlaying;
  const progress  = connected ? connected.progress  : localProgress;
  const currentSec = connected ? connected.currentSec : localSec;
  const duration  = connected ? connected.duration  : localDur;
  const carouselRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const t = useRelationshipTime(base.startDate, base.startTime);

  const photos   = spotify.photos ?? [];
  const audioSrc = spotify.previewUrl ?? null;
  const coverSrc = photos[photoIdx] ?? spotify.albumArt ?? null;
  const bgColor  = useDominantColor(photos[0] ?? null);
  const reasons  = spotify.reasons ?? [];

  // Register track info with layout audio context (connected mode only).
  // Depend only on audioSrc — connected.onMount is an inline function that
  // recreates on every render; including it would call setAudioInfo every render.
  useEffect(() => {
    if (!connected) return;
    connected.onMount({
      previewUrl:  audioSrc,
      coverSrc:    photos[0] ?? spotify.albumArt ?? null,
      title:       spotify.displayTitle || spotify.musicTitle || '',
      artist:      spotify.musicArtist || '',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc]);

  // ── Photo carousel ──────────────────────────────────────────────────────────
  const startCarousel = useCallback(() => {
    if (photos.length <= 1) return;
    if (carouselRef.current) clearInterval(carouselRef.current);
    carouselRef.current = setInterval(() => setPhotoIdx(i => (i + 1) % photos.length), 4500);
  }, [photos.length]);

  useEffect(() => {
    startCarousel();
    return () => { if (carouselRef.current) clearInterval(carouselRef.current); };
  }, [startCarousel]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || photos.length <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    setPhotoIdx(i => dx < 0 ? (i + 1) % photos.length : (i - 1 + photos.length) % photos.length);
    startCarousel(); // reset timer after manual swipe
  }, [photos.length, startCarousel]);

  // ── Local audio events (only when NOT connected) ──────────────────────────
  useEffect(() => {
    if (connected) return;
    const audio = localRef.current;
    if (!audio) return;
    const onTime  = () => {
      const d = audio.duration || 30;
      setLocalSec(audio.currentTime);
      setLocalProg((audio.currentTime / d) * 100);
    };
    const onMeta  = () => setLocalDur(audio.duration);
    const onEnded = () => {
      setLocalPlaying(false);
      if (repeat && audio) { audio.currentTime = 0; audio.play(); setLocalPlaying(true); }
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [connected, repeat]);

  const togglePlay = useCallback(() => {
    if (connected) { connected.onToggle(); return; }
    const audio = localRef.current;
    if (!audio || !audioSrc) return;
    if (localPlaying) { audio.pause(); setLocalPlaying(false); }
    else { audio.play().catch(() => null); setLocalPlaying(true); }
  }, [connected, localPlaying, audioSrc]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    if (connected) { connected.onSeek(frac); return; }
    const audio = localRef.current;
    if (!audio) return;
    audio.currentTime = frac * (audio.duration || 30);
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

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100%', maxWidth: 390,
      borderRadius: 28, overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: bgColor,
      transition: 'background 0.9s ease',
    }}>
      {/* local audio only when not using layout context */}
      {!connected && audioSrc && <audio key={audioSrc} ref={localRef} src={audioSrc} preload="metadata" />}

      {/* ── Top bar ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 20px 14px' }}>
        <ChevronDown size={22} color={TEXT} style={{ opacity: 0.8, cursor: 'pointer', flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: TEXT, letterSpacing: '0.01em', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 10px' }}>
          {spotify.topText || 'Playlist do Amor'}
        </span>
        <MoreHorizontal size={22} color={TEXT} style={{ opacity: 0.8, cursor: 'pointer', flexShrink: 0 }} />
      </div>

      {/* ── Cover / Carousel ──────────────────────────────────── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ margin: '0 16px', position: 'relative', aspectRatio: '1/1', borderRadius: 18, overflow: 'hidden', background: 'rgba(0,0,0,0.38)', touchAction: 'pan-y' }}
      >
        {coverSrc ? (
          <img
            src={coverSrc}
            alt="cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.5s' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <Camera size={52} color="rgba(255,255,255,0.3)" strokeWidth={1.3} />
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', fontWeight: 500, textAlign: 'center', padding: '0 28px', lineHeight: 1.4 }}>
              A foto de vocês vai ficar aqui
            </span>
          </div>
        )}

        {photos.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {photos.map((_, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} style={{
                width: i === photoIdx ? 20 : 6, height: 6, borderRadius: 3,
                background: i === photoIdx ? TEXT : 'rgba(255,255,255,0.4)',
                border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Song info ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '18px 20px 0' }}>
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
            {spotify.displayTitle || spotify.musicTitle || 'Título da Música'}
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '6px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
            {spotify.musicArtist || 'Artista'}
          </p>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div style={{ padding: '18px 20px 0' }}>
        <div onClick={seek} style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.22)', cursor: 'pointer', position: 'relative' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 2, background: TEXT, position: 'relative' }}>
            <div style={{ position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, borderRadius: '50%', background: TEXT }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{fmt(currentSec)}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>-{fmt(Math.max(0, duration - currentSec))}</span>
        </div>
      </div>

      {/* ── Controls ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 26px' }}>
        <button onClick={() => setShuffle(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, opacity: shuffle ? 1 : 0.45 }}>
          <Shuffle size={22} color={TEXT} />
        </button>
        <button onClick={() => {
          if (connected) { connected.onSeek(0); return; }
          const el = localRef.current;
          if (el) { el.currentTime = 0; setLocalProg(0); setLocalSec(0); }
        }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          <SkipBack size={30} fill={TEXT} color={TEXT} />
        </button>
        <button onClick={togglePlay} style={{ width: 68, height: 68, borderRadius: '50%', background: TEXT, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {playing
            ? <Pause size={28} fill="#000" color="#000" />
            : <Play  size={28} fill="#000" color="#000" style={{ marginLeft: 3 }} />
          }
        </button>
        <button onClick={() => {
          if (connected) { connected.onSeek(1); return; }
          const el = localRef.current;
          if (el) el.currentTime = el.duration ?? 30;
        }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          <SkipForward size={30} fill={TEXT} color={TEXT} />
        </button>
        <button onClick={() => setRepeat(r => !r)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, opacity: repeat ? 1 : 0.45 }}>
          <Repeat size={22} color={TEXT} />
        </button>
      </div>

      {/* ── Sobre o casal — colored header ────────────────────── */}
      <div style={{ padding: '10px 20px 32px', background: bgColor }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>Sobre o casal</p>
      </div>

      {/* ── Sobre o casal — dark panel ────────────────────────── */}
      <div style={{ background: DARK, borderRadius: '22px 22px 0 0', marginTop: -18, padding: '26px 20px 32px' }}>
        <p style={{ fontSize: 23, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {base.giverName} e {base.receiverName}
        </p>
        <p style={{ fontSize: 14, color: MUTED, margin: '8px 0 22px', fontWeight: 500 }}>
          {spotify.bottomText || 'Juntos desde'} {new Date(`${base.startDate}T12:00:00`).getFullYear()}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {counterItems.map(item => (
            <div key={item.label} style={{
              background: DARKER, borderRadius: 16, padding: '18px 8px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <p style={{ fontSize: 32, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {item.value}
              </p>
              <p style={{ fontSize: 11, color: MUTED, margin: '9px 0 0', fontWeight: 600, letterSpacing: '0.03em' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mensagem especial ─────────────────────────────────── */}
      {spotify.specialMessage && (
        <div style={{ background: '#B91C1C', padding: '26px 22px 30px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Mensagem especial
          </p>
          <p style={{ fontSize: 26, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.35, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {spotify.specialMessage}
          </p>
        </div>
      )}

      {/* ── Motivos pelos quais te amo ────────────────────────── */}
      {reasons.length > 0 && (
        <div style={{ background: DARK, padding: '26px 20px 30px' }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: '0 0 18px' }}>
            {reasons.length} {reasons.length === 1 ? 'motivo' : 'motivos'} pelos quais te amo
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reasons.map((reason, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: DARKER, borderRadius: 14, padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <Heart size={16} color="#F43F5E" fill="#F43F5E" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, lineHeight: 1.45, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Foto de encerramento ──────────────────────────────── */}
      {spotify.closingPhoto && (
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
          <img
            src={spotify.closingPhoto}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Blur + gradient — only visible when there's a caption */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '14%',
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
            opacity: spotify.closingCaption ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '14%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 20px',
            opacity: spotify.closingCaption ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}>
            <p style={{
              color: TEXT, fontWeight: 800, fontSize: 18, margin: 0,
              textAlign: 'center', lineHeight: 1.3,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              fontFamily: 'system-ui',
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {spotify.closingCaption}
            </p>
          </div>
        </div>
      )}

      {/* ── Rodapé romântico ──────────────────────────────────── */}
      <div style={{
        background: DARKER, padding: '32px 20px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 28 }}>❤️</span>
        <p style={{
          fontSize: 16, fontWeight: 800, color: TEXT,
          margin: 0, textAlign: 'center', letterSpacing: '-0.01em',
        }}>
          {base.giverName || 'Você'} &amp; {base.receiverName || 'Seu amor'}
        </p>
        <p style={{
          fontSize: 12, color: MUTED, margin: 0, textAlign: 'center', fontWeight: 500,
        }}>
          Feito com muito amor 💌
        </p>
      </div>

      {/* ── Navegação para produtos extras ────────────────────── */}
      {products && products.length > 0 && (
        <div style={{ background: DARKER, padding: '0 16px 44px' }}>
          {products.map(p => {
            const copy = PRODUCT_COPY[p.key] ?? {
              tagline: p.label,
              sub: 'Tem mais uma surpresa pra você',
              cta: 'Abrir agora',
            };
            const Wrapper = p.href
              ? ({ children }: { children: React.ReactNode }) => (
                  <Link href={p.href!} style={{ textDecoration: 'none', display: 'block' }}>
                    {children}
                  </Link>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <button
                    onClick={p.onClick}
                    style={{ all: 'unset', display: 'block', width: '100%', cursor: 'pointer' }}
                  >
                    {children}
                  </button>
                );
            return (
              <Wrapper key={p.key}>
                <div style={{
                  position: 'relative', overflow: 'hidden',
                  borderRadius: 20, marginBottom: 12,
                  background: `linear-gradient(135deg, ${p.accent}18 0%, rgba(0,0,0,0) 60%)`,
                  border: `1px solid ${p.accent}30`,
                  padding: '20px 18px 18px',
                }}>
                  {/* Glow blob */}
                  <div style={{
                    position: 'absolute', top: -30, right: -30,
                    width: 120, height: 120, borderRadius: '50%',
                    background: `radial-gradient(circle, ${p.accent}28 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* Tag */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: `${p.accent}20`,
                    border: `1px solid ${p.accent}35`,
                    borderRadius: 20, padding: '3px 10px',
                    marginBottom: 10,
                  }}>
                    <span style={{ fontSize: 12 }}>{p.icon}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: p.accent,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      fontFamily: 'system-ui',
                    }}>
                      {p.count != null ? `${p.count} surpresas` : 'Mini-jogo'}
                    </span>
                  </div>

                  {/* Text */}
                  <p style={{
                    fontSize: 17, fontWeight: 900, color: '#fff',
                    margin: '0 0 5px', letterSpacing: '-0.02em',
                    fontFamily: 'system-ui', lineHeight: 1.2,
                  }}>
                    {copy.tagline}
                  </p>
                  <p style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.42)',
                    margin: '0 0 16px', fontFamily: 'system-ui', lineHeight: 1.4,
                  }}>
                    {copy.sub}
                  </p>

                  {/* CTA */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: p.accent, borderRadius: 12,
                    padding: '11px 18px',
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 800, color: '#fff',
                      fontFamily: 'system-ui', letterSpacing: '-0.01em',
                    }}>
                      {copy.cta}
                    </span>
                    <span style={{ fontSize: 13 }}>→</span>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}
    </div>
  );
}
