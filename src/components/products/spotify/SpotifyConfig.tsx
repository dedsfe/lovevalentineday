'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Upload, Trash2, Loader2, Search, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { SpotifyData } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TrackResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  previewUrl: string | null;
  durationMs: number;
}

interface Props {
  value: SpotifyData;
  onChange: (data: SpotifyData) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SpotifyConfig({ value, onChange }: Props) {
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState<TrackResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef    = useRef<HTMLDivElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (patch: Partial<SpotifyData>) => onChange({ ...value, ...patch });

  // ── Search debounce ───────────────────────────────────────────────────────
  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setShowResults(false); return; }
    setSearching(true);
    setShowResults(true);
    try {
      const res  = await fetch(`/api/spotify?search=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 420);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Select track ─────────────────────────────────────────────────────────
  const selectTrack = (track: TrackResult) => {
    set({
      source:      'spotify',
      trackId:     track.id,
      previewUrl:  track.previewUrl ?? undefined,
      albumArt:    track.albumArt ?? undefined,
      musicTitle:  track.title,
      musicArtist: track.artist,
    });
    setQuery(track.title);
    setShowResults(false);
  };

  const clearTrack = () => {
    set({ source: 'preset', trackId: undefined, previewUrl: undefined, albumArt: undefined, musicTitle: '', musicArtist: '' });
    setQuery('');
    setResults([]);
  };

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const slots = 5 - (value.photos?.length ?? 0);
    files.slice(0, slots).forEach(file => {
      if (file.size > 3 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string')
          onChange({ ...value, photos: [...(value.photos ?? []), reader.result] });
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (idx: number) =>
    set({ photos: (value.photos ?? []).filter((_, i) => i !== idx) });

  const selectedTrackId = value.trackId;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-7">

      {/* ── Music search ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-black text-ink uppercase tracking-wide">
          <Music className="w-4 h-4 text-brand" /> Música
        </h3>

        {/* Selected track preview */}
        {selectedTrackId && (
          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#1DB954] bg-[#f0fdf4]">
            {value.albumArt && (
              <img src={value.albumArt} alt="capa" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{value.musicTitle}</p>
              <p className="text-xs text-ink-muted truncate">{value.musicArtist}</p>
              {value.previewUrl
                ? <p className="text-[10px] text-[#1DB954] font-bold mt-0.5">✓ Preview 30s disponível</p>
                : <p className="text-[10px] text-amber-500 font-bold mt-0.5">Preview indisponível nesta região</p>
              }
            </div>
            <button type="button" onClick={clearTrack} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
              <X className="w-4 h-4 text-ink-muted" />
            </button>
          </div>
        )}

        {/* Search input */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowResults(true); }}
              placeholder={selectedTrackId ? 'Trocar música...' : 'Nome da música ou artista...'}
              className="w-full rounded-xl border-2 border-ink pl-9 pr-10 py-3 text-sm font-semibold text-ink placeholder:text-ink-muted/50 focus:outline-none neo-shadow-sm bg-white"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted animate-spin" />
            )}
          </div>

          {/* Dropdown de resultados */}
          {showResults && (results.length > 0 || searching) && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 border-ink bg-white neo-shadow z-50 overflow-hidden">
              {searching && results.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink-muted font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                </div>
              ) : (
                <ul>
                  {results.map((track, i) => (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => selectTrack(track)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-subtle transition-colors ${
                          i !== results.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        {track.albumArt ? (
                          <img src={track.albumArt} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-subtle flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-ink truncate">{track.title}</p>
                          <p className="text-xs text-ink-muted truncate">{track.artist} · {track.album}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[11px] text-ink-muted font-medium">{formatDuration(track.durationMs)}</span>
                          {track.previewUrl
                            ? <span className="text-[9px] font-black text-[#1DB954] uppercase tracking-wide">Preview ✓</span>
                            : <span className="text-[9px] font-bold text-ink-muted/50 uppercase">Sem preview</span>
                          }
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-ink-muted font-medium leading-relaxed">
          Músicas marcadas com <span className="text-[#1DB954] font-black">Preview ✓</span> tocam 30 segundos reais no player.
        </p>
      </section>

      {/* ── Photos carousel ──────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-ink uppercase tracking-wide">Fotos do Casal</h3>
          <span className="text-[11px] text-ink-muted font-semibold">{value.photos?.length ?? 0}/5</span>
        </div>
        <p className="text-[11px] text-ink-muted font-medium leading-relaxed">
          Aparecem no lugar da capa da música, em carrossel automático.
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
                <div className="absolute bottom-0 left-0 right-0 bg-brand text-white text-[9px] font-black text-center py-0.5 uppercase tracking-wide">
                  Capa
                </div>
              )}
            </div>
          ))}
          {(value.photos?.length ?? 0) < 5 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-subtle flex flex-col items-center justify-center cursor-pointer hover:border-ink hover:bg-white transition-all">
              <Upload className="w-5 h-5 text-ink-muted mb-1" />
              <span className="text-[10px] font-bold text-ink-muted">Adicionar</span>
              <span className="text-[9px] text-ink-muted/60">máx 3MB</span>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>
      </section>

      {/* ── Texts ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-ink uppercase tracking-wide">Textos do Player</h3>
        <Input
          label="Topo — onde fica o nome da playlist"
          placeholder="Ex: Playlist do Amor, Nossa Trilha Sonora..."
          value={value.topText}
          onChange={e => set({ topText: e.target.value })}
        />
        <Input
          label="Legenda do contador de tempo"
          placeholder="Ex: Juntos há, Apaixonados há..."
          value={value.bottomText}
          onChange={e => set({ bottomText: e.target.value })}
        />
      </section>
    </div>
  );
}
