'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Heart, MoreHorizontal,
  Volume2, ChevronDown,
} from 'lucide-react';
import type { SpotifyData, GiftBase } from '@/lib/types';

// ─── Relationship counter ────────────────────────────────────────────────────

function useRelationshipTime(startDate: string, startTime = '00:00') {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date(`${startDate}T${startTime}:00`).getTime();

    const tick = () => {
      const diff = Date.now() - start;
      setElapsed({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate, startTime]);

  return elapsed;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  spotify: SpotifyData;
  base: Pick<GiftBase, 'giverName' | 'receiverName' | 'startDate' | 'startTime'>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SpotifyPlayer({ spotify, base }: Props) {
  const [playing, setPlaying]       = useState(false);
  const [photoIdx, setPhotoIdx]     = useState(0);
  const [progress, setProgress]     = useState(0);       // 0–100
  const [currentSec, setCurrentSec] = useState(0);
  const [duration, setDuration]     = useState(30);
  const [liked, setLiked]           = useState(false);
  const [shuffle, setShuffle]       = useState(false);
  const [repeat, setRepeat]         = useState(false);
  const [volume, setVolume]         = useState(80);

  const audioRef  = useRef<HTMLAudioElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const time      = useRelationshipTime(base.startDate, base.startTime);

  const audioSrc = spotify.previewUrl ?? spotify.musicUrl ?? null;
  const photos   = spotify.photos ?? [];
  const coverSrc = photos[photoIdx] ?? spotify.albumArt ?? null;

  // ── Photo carousel auto-advance ───────────────────────────────────────────
  useEffect(() => {
    if (photos.length <= 1) return;
    timerRef.current = setInterval(() => setPhotoIdx(i => (i + 1) % photos.length), 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length]);

  // ── Audio events ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      const d = audio.duration || 30;
      setCurrentSec(audio.currentTime);
      setProgress((audio.currentTime / d) * 100);
    };
    const onMeta   = () => setDuration(audio.duration);
    const onEnded  = () => {
      setPlaying(false);
      if (repeat && audio) { audio.currentTime = 0; audio.play(); setPlaying(true); }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [repeat]);

  // ── Volume sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

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

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex flex-col overflow-hidden select-none"
      style={{ background: '#121212', width: '100%', maxWidth: 390, borderRadius: 16 }}
    >
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

      {/* Ambient glow from cover */}
      {coverSrc && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <img
            src={coverSrc}
            alt=""
            className="w-full h-full object-cover opacity-25 blur-3xl scale-125"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(18,18,18,0.3) 0%, #121212 60%)' }} />
        </div>
      )}

      {/* ─── Top bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-7 pb-1">
        <ChevronDown className="w-6 h-6 cursor-pointer" style={{ color: 'rgba(255,255,255,0.7)' }} />
        <div className="text-center">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            {spotify.topText || 'Playlist do Amor'}
          </p>
        </div>
        <MoreHorizontal className="w-6 h-6 cursor-pointer" style={{ color: 'rgba(255,255,255,0.7)' }} />
      </div>

      {/* ─── Cover / Carousel ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-5 mt-5" style={{ aspectRatio: '1 / 1' }}>
        {coverSrc ? (
          <img
            src={coverSrc}
            alt="cover"
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{ borderRadius: 8, boxShadow: '0 24px 72px rgba(0,0,0,0.7)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ borderRadius: 8, background: '#282828' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="rgba(255,255,255,0.15)">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
            </svg>
          </div>
        )}

        {/* Photo dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                style={{
                  width: i === photoIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === photoIdx ? '#1DB954' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.3s',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Song info ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-start justify-between px-6 mt-7">
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {spotify.musicTitle || 'Nossa Música'}
          </p>
          <p style={{ fontSize: 14, color: '#B3B3B3', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {spotify.musicArtist || 'Artista'}
          </p>
        </div>
        <button onClick={() => setLiked(l => !l)} style={{ marginLeft: 16, marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Heart
            size={24}
            fill={liked ? '#1DB954' : 'none'}
            stroke={liked ? '#1DB954' : '#B3B3B3'}
          />
        </button>
      </div>

      {/* ─── Progress bar ────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 mt-5">
        <div
          onClick={seek}
          className="group cursor-pointer"
          style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', position: 'relative' }}
        >
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 2, background: '#fff', position: 'relative', transition: 'background 0.15s' }}
               className="group-hover:[background:#1DB954]!">
            <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#fff', opacity: 0, transition: 'opacity 0.15s' }}
                 className="group-hover:opacity-100" />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#B3B3B3' }}>{fmt(currentSec)}</span>
          <span style={{ fontSize: 11, color: '#B3B3B3' }}>-{fmt(Math.max(0, duration - currentSec))}</span>
        </div>
      </div>

      {/* ─── Controls ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-7 mt-3">
        <button onClick={() => setShuffle(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Shuffle size={20} color={shuffle ? '#1DB954' : '#B3B3B3'} />
        </button>

        <button
          onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; setProgress(0); setCurrentSec(0); } }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <SkipBack size={30} fill="#fff" color="#fff" />
        </button>

        <button
          onClick={togglePlay}
          style={{
            width: 56, height: 56, borderRadius: '50%', background: '#fff',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          {playing
            ? <Pause size={24} fill="#000" color="#000" />
            : <Play size={24} fill="#000" color="#000" style={{ marginLeft: 2 }} />
          }
        </button>

        <button
          onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration ?? 30; }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <SkipForward size={30} fill="#fff" color="#fff" />
        </button>

        <button onClick={() => setRepeat(r => !r)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Repeat size={20} color={repeat ? '#1DB954' : '#B3B3B3'} />
        </button>
      </div>

      {/* ─── Volume ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-3 px-6 mt-6">
        <Volume2 size={16} color="#B3B3B3" />
        <div
          className="flex-1 cursor-pointer group"
          style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', position: 'relative' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
          }}
        >
          <div style={{ width: `${volume}%`, height: '100%', borderRadius: 2, background: '#B3B3B3' }}
               className="group-hover:[background:#fff]!" />
        </div>
        <Volume2 size={20} color="#B3B3B3" />
      </div>

      {/* ─── Relationship counter (feature exclusiva) ─────────────────────── */}
      <div className="relative z-10 mx-5 mt-6 mb-6 text-center"
           style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#B3B3B3', textTransform: 'uppercase', marginBottom: 6 }}>
          {spotify.bottomText || 'Juntos há'}
        </p>
        <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>
          {time.days}d &nbsp;{time.hours}h &nbsp;{time.minutes}m &nbsp;{time.seconds}s
        </p>
        <p style={{ fontSize: 12, color: '#B3B3B3', marginTop: 5, fontWeight: 600 }}>
          {base.giverName} &amp; {base.receiverName} &nbsp;💕
        </p>
      </div>
    </div>
  );
}
