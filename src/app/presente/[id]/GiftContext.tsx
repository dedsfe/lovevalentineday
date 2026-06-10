'use client';

import {
  createContext, useContext, useRef, useState,
  useCallback, useEffect, type RefObject,
} from 'react';
import { useParams } from 'next/navigation';
import { loadGift, type StoredGift } from '@/lib/gift-store';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AudioState {
  isPlaying:   boolean;
  previewUrl:  string | null;
  coverSrc:    string | null;
  trackTitle:  string;
  trackArtist: string;
  progress:    number;  // 0–100
  currentSec:  number;
  duration:    number;
}

const AUDIO_INIT: AudioState = {
  isPlaying: false, previewUrl: null, coverSrc: null,
  trackTitle: '', trackArtist: '', progress: 0, currentSec: 0, duration: 30,
};

export interface GiftCtxValue {
  gift:        StoredGift | null;
  audio:       AudioState;
  audioRef:    RefObject<HTMLAudioElement>;
  togglePlay:  () => void;
  seek:        (frac: number) => void;
  setAudioInfo: (info: {
    previewUrl:  string | null;
    coverSrc:    string | null;
    trackTitle:  string;
    trackArtist: string;
  }) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GiftCtx = createContext<GiftCtxValue | null>(null);

export function useGift(): GiftCtxValue {
  const ctx = useContext(GiftCtx);
  if (!ctx) throw new Error('useGift must be inside GiftProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GiftProvider({ children }: { children: React.ReactNode }) {
  const { id }        = useParams<{ id: string }>();
  const [gift, setGift] = useState<StoredGift | null>(null);
  const [audio, setAudio] = useState<AudioState>(AUDIO_INIT);
  const audioRef = useRef<HTMLAudioElement>(null!);

  // load gift once
  useEffect(() => { setGift(loadGift(id)); }, [id]);

  // sync src when previewUrl changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const url = audio.previewUrl ?? '';
    if (el.getAttribute('src') !== url) {
      el.src = url;
      if (url) el.load();
    }
  }, [audio.previewUrl]);

  const setAudioInfo = useCallback<GiftCtxValue['setAudioInfo']>((info) => {
    setAudio(prev => ({ ...prev, ...info }));
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || !audio.previewUrl) return;
    if (audio.isPlaying) { el.pause(); }
    else { el.play().catch(() => null); }
  }, [audio.isPlaying, audio.previewUrl]);

  const seek = useCallback((frac: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = frac * (el.duration || 30);
  }, []);

  return (
    <GiftCtx.Provider value={{ gift, audio, audioRef, togglePlay, seek, setAudioInfo }}>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={() => {
          const el = audioRef.current;
          if (!el) return;
          const d = el.duration || 30;
          setAudio(a => ({
            ...a,
            currentSec: el.currentTime,
            progress:   (el.currentTime / d) * 100,
            duration:   d,
          }));
        }}
        onLoadedMetadata={() => {
          const el = audioRef.current;
          if (el) setAudio(a => ({ ...a, duration: el.duration }));
        }}
        onPlay={() => setAudio(a => ({ ...a, isPlaying: true }))}
        onPause={() => setAudio(a => ({ ...a, isPlaying: false }))}
        onEnded={() => setAudio(a => ({ ...a, isPlaying: false, progress: 0, currentSec: 0 }))}
      />
      {children}
    </GiftCtx.Provider>
  );
}
