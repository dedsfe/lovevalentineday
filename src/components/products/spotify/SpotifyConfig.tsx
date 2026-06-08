'use client';

import { useState, useRef } from 'react';
import { Music, Upload, Trash2, Loader2, Check, AlertCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import type { SpotifyData } from '@/lib/types';

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESET_TRACKS: Array<{ title: string; artist: string; url: string }> = [
  { title: 'Violão Romântico',   artist: 'Love Valentine', url: 'https://assets.mixkit.co/music/preview/mixkit-romantic-ambience-1033.mp3' },
  { title: 'Piano Suave',        artist: 'Love Valentine', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Ukulele de Casal',   artist: 'Love Valentine', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'Orquestra e Violinos', artist: 'Love Valentine', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  value: SpotifyData;
  onChange: (data: SpotifyData) => void;
}

type ResolveStatus = 'idle' | 'loading' | 'ok' | 'error';

// ─── Component ───────────────────────────────────────────────────────────────

export function SpotifyConfig({ value, onChange }: Props) {
  const [spotifyUrl, setSpotifyUrl]     = useState('');
  const [resolveStatus, setResolveStatus] = useState<ResolveStatus>('idle');
  const [resolveMsg, setResolveMsg]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<SpotifyData>) => onChange({ ...value, ...patch });

  // ── Resolve Spotify URL ───────────────────────────────────────────────────
  const resolveSpotifyTrack = async () => {
    if (!spotifyUrl.trim()) return;
    setResolveStatus('loading');
    setResolveMsg('');

    try {
      const res = await fetch(`/api/spotify?track=${encodeURIComponent(spotifyUrl.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setResolveStatus('error');
        setResolveMsg(json.error ?? 'Não foi possível encontrar a música.');
        return;
      }

      set({
        source:     'spotify',
        trackId:    json.id,
        previewUrl: json.previewUrl ?? undefined,
        albumArt:   json.albumArt ?? undefined,
        musicTitle: json.title,
        musicArtist: json.artist,
      });

      setResolveStatus('ok');
      setResolveMsg(json.previewUrl ? 'Música encontrada! Preview de 30s disponível.' : 'Música encontrada (sem preview disponível nesta região).');
    } catch {
      setResolveStatus('error');
      setResolveMsg('Erro de conexão. Tente novamente.');
    }
  };

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - (value.photos?.length ?? 0);
    const toAdd = files.slice(0, remaining);

    toAdd.forEach(file => {
      if (file.size > 3 * 1024 * 1024) return; // skip >3MB
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          set({ photos: [...(value.photos ?? []), reader.result] });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (idx: number) =>
    set({ photos: (value.photos ?? []).filter((_, i) => i !== idx) });

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-7">

      {/* ── Music source ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-black text-ink uppercase tracking-wide">
          <Music className="w-4 h-4 text-brand" /> Música
        </h3>

        {/* Toggle */}
        <div className="flex gap-1.5 p-1 bg-subtle rounded-xl border border-border">
          {(['preset', 'spotify'] as const).map(src => (
            <button
              key={src}
              type="button"
              onClick={() => set({ source: src })}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                value.source === src
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {src === 'preset' ? 'Trilhas Românticas' : 'Link do Spotify'}
            </button>
          ))}
        </div>

        {/* Preset tracks */}
        {value.source === 'preset' && (
          <div className="space-y-2">
            {PRESET_TRACKS.map(track => (
              <button
                key={track.url}
                type="button"
                onClick={() => set({ musicUrl: track.url, musicTitle: track.title, musicArtist: track.artist, previewUrl: undefined, albumArt: undefined })}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                  value.musicUrl === track.url
                    ? 'border-brand bg-brand-light'
                    : 'border-border bg-white hover:border-ink-muted'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-ink">{track.title}</p>
                  <p className="text-[11px] text-ink-muted">{track.artist}</p>
                </div>
                {value.musicUrl === track.url && <Check className="w-4 h-4 text-brand" />}
              </button>
            ))}
          </div>
        )}

        {/* Spotify URL resolver */}
        {value.source === 'spotify' && (
          <div className="space-y-3">
            <p className="text-[11px] text-ink-muted font-medium leading-relaxed">
              Abra o Spotify → toque nos 3 pontinhos da música → <strong>Compartilhar</strong> → <strong>Copiar link</strong>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={spotifyUrl}
                onChange={e => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                className="flex-1 rounded-xl border-2 border-border px-3 py-2.5 text-xs font-semibold text-ink focus:outline-none focus:border-ink neo-shadow-sm"
              />
              <button
                type="button"
                onClick={resolveSpotifyTrack}
                disabled={resolveStatus === 'loading'}
                className="px-4 py-2.5 rounded-xl border-2 border-b-[4px] border-ink bg-brand text-white text-xs font-black uppercase tracking-wide disabled:opacity-60"
              >
                {resolveStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
              </button>
            </div>

            {/* Status feedback */}
            {resolveStatus === 'ok' && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-700">{value.musicTitle}</p>
                  <p className="text-[11px] text-emerald-600">{resolveMsg}</p>
                </div>
              </div>
            )}
            {resolveStatus === 'error' && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-rose-600">{resolveMsg}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Photos carousel ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-ink uppercase tracking-wide">
            Fotos do Casal
          </h3>
          <span className="text-[11px] text-ink-muted font-semibold">
            {value.photos?.length ?? 0}/5
          </span>
        </div>
        <p className="text-[11px] text-ink-muted font-medium">
          Substituem a capa da música. Ficam em carrossel automático no player.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {(value.photos ?? []).map((photo, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-ink">
              <img src={photo} alt="foto" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-black transition-colors"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
              {idx === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-brand text-white text-[9px] font-bold text-center py-0.5">
                  CAPA
                </div>
              )}
            </div>
          ))}

          {(value.photos?.length ?? 0) < 5 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-subtle flex flex-col items-center justify-center cursor-pointer hover:border-ink hover:bg-white transition-all">
              <Upload className="w-5 h-5 text-ink-muted mb-1" />
              <span className="text-[10px] font-bold text-ink-muted">Adicionar</span>
              <span className="text-[9px] text-ink-muted/70">máx 3MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </section>

      {/* ── Texts ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-ink uppercase tracking-wide">Textos do Player</h3>
        <Input
          label="Topo (onde seria o nome da playlist)"
          placeholder="Ex: Playlist do Amor, Nossa Trilha Sonora..."
          value={value.topText}
          onChange={e => set({ topText: e.target.value })}
        />
        <Input
          label="Legenda do contador"
          placeholder="Ex: Juntos há, Apaixonados há..."
          value={value.bottomText}
          onChange={e => set({ bottomText: e.target.value })}
        />
      </section>

    </div>
  );
}
