'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Search, X, AlertCircle } from 'lucide-react';
import type { SpotifyData } from '@/lib/types';
import { FieldCard, StepHeader, SectionDivider, inlineInput } from './shared';

interface Props {
  spotify:  SpotifyData;
  onChange: (payload: Partial<SpotifyData>) => void;
}

interface TrackResult {
  id:             string;
  title:          string;
  artist:         string;
  album:          string;
  albumArt:       string | null;
  previewUrl:     string | null;
  hasRealPreview: boolean;
  durationMs:     number;
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export function Step2Music({ spotify, onChange }: Props) {
  const [query, setQuery]             = useState(spotify.musicTitle || '');
  const [results, setResults]         = useState<TrackResult[]>([]);
  const [searching, setSearching]     = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchErr, setSearchErr]     = useState<string | null>(null);
  const [focused, setFocused]         = useState<string | null>(null);

  const searchRef  = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focus = (id: string) => setFocused(id);
  const blur  = () => setFocused(null);
  const isFoc = (id: string) => focused === id;

  const hasTrack = !!spotify.trackId;

  // ── Search with debounce ──────────────────────────────────────────────────

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setShowResults(false); setSearchErr(null); return; }
    setSearching(true);
    setShowResults(true);
    setSearchErr(null);
    try {
      const res  = await fetch(`/api/spotify?search=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.error) { setSearchErr(json.error); setResults([]); }
      else setResults(json.results ?? []);
    } catch {
      setSearchErr('Erro de conexão. Tente novamente.');
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

  // ── Close dropdown on outside click ─────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Select / clear ────────────────────────────────────────────────────────

  const selectTrack = (track: TrackResult) => {
    onChange({
      source:       'spotify',
      trackId:      track.id,
      previewUrl:   track.previewUrl ?? undefined,
      albumArt:     track.albumArt ?? undefined,
      musicTitle:   track.title,
      displayTitle: track.title,
      musicArtist:  track.artist,
    });
    setQuery(track.title);
    setShowResults(false);
  };

  const clearTrack = () => {
    onChange({ source: 'preset', trackId: undefined, previewUrl: undefined, albumArt: undefined, musicTitle: '', musicArtist: '' });
    setQuery('');
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      <StepHeader title="Música" description="A trilha sonora do amor" />

      {/* ── Selected track card ────────────────────────────────────────────── */}
      {hasTrack && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', borderRadius: 14, marginBottom: 16,
          border: '1.5px solid #1DB954', background: '#F0FDF4',
        }}>
          {spotify.albumArt && (
            <img
              src={spotify.albumArt}
              alt="capa"
              style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 15, fontWeight: 700, color: '#111827',
              margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontFamily: 'system-ui',
            }}>
              {spotify.musicTitle}
            </p>
            <p style={{
              fontSize: 13, color: '#4B5563', margin: '0 0 4px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontFamily: 'system-ui',
            }}>
              {spotify.musicArtist}
            </p>
            {spotify.previewUrl
              ? <span style={{ fontSize: 11, color: '#1DB954', fontWeight: 800, fontFamily: 'system-ui' }}>✓ Toca 30s no presente</span>
              : <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={11} /> Sem prévia de áudio
                </span>
            }
          </div>
          <button
            onClick={clearTrack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 8, color: '#6B7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Search field ───────────────────────────────────────────────────── */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          border: `1.5px solid ${focused === 'search' ? '#E11D48' : '#E5E7EB'}`,
          borderRadius: 14, padding: '13px 16px', background: '#fff',
          boxShadow: focused === 'search' ? '0 0 0 3.5px rgba(225,29,72,0.09)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: focused === 'search' ? '#FFF1F2' : '#F9FAFB',
            border: `1.5px solid ${focused === 'search' ? 'rgba(225,29,72,0.18)' : '#F0F0F0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'background 0.15s',
          }}>
            {searching
              ? <Loader2 size={18} style={{ color: '#9CA3AF', animation: 'spin 1s linear infinite' }} />
              : <Search size={18} style={{ color: focused === 'search' ? '#E11D48' : '#9CA3AF' }} />
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800,
              color: focused === 'search' ? '#E11D48' : '#9CA3AF',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
              transition: 'color 0.15s', fontFamily: 'system-ui',
            }}>
              {hasTrack ? 'Trocar música' : 'Buscar no Spotify'}
            </div>
            <input
              style={inlineInput}
              type="text"
              value={query}
              placeholder="Nome da música ou artista..."
              onFocus={() => { focus('search'); if (results.length > 0) setShowResults(true); }}
              onBlur={blur}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Spinner keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Dropdown results */}
        {showResults && (results.length > 0 || searching) && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 50,
            background: '#fff', borderRadius: 16,
            border: '1.5px solid #E5E7EB',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}>
            {searching && results.length === 0 ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '20px 0', fontSize: 13, color: '#9CA3AF', fontWeight: 600, fontFamily: 'system-ui',
              }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Buscando...
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {results.map((track, i) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => selectTrack(track)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', border: 'none', background: 'none',
                        cursor: 'pointer', textAlign: 'left',
                        borderBottom: i < results.length - 1 ? '1px solid #F9FAFB' : 'none',
                        transition: 'background 0.1s',
                        fontFamily: 'system-ui',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {track.albumArt
                        ? <img src={track.albumArt} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 44, height: 44, borderRadius: 8, background: '#F3F4F6', flexShrink: 0 }} />
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {track.title}
                        </p>
                        <p style={{ fontSize: 12, color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {track.artist} · {track.album}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{fmt(track.durationMs)}</span>
                        {track.previewUrl
                          ? <span style={{ fontSize: 9, color: '#1DB954', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Toca ✓</span>
                          : <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>Sem áudio</span>
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

      {searchErr && (
        <p style={{ fontSize: 12, color: '#E11D48', fontWeight: 600, margin: '-8px 0 12px 4px', fontFamily: 'system-ui' }}>
          ⚠️ {searchErr}
        </p>
      )}

      <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '0 0 28px 4px', fontFamily: 'system-ui', lineHeight: 1.5 }}>
        <span style={{ color: '#1DB954', fontWeight: 800 }}>Toca ✓</span> = toca 30s da música real via Spotify ou Deezer.
        Músicas sem prévia mostram só a capa e as informações, sem áudio.
      </p>

      {/* ── Player text customisation ─────────────────────────────────────── */}
      <SectionDivider label="Textos do player" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {hasTrack && (
          <FieldCard icon="🎵" label="Nome da música" focused={isFoc('displayTitle')} note="Exibido no player. Renomeie para algo romántico se quiser.">
            <input
              style={inlineInput}
              type="text"
              value={spotify.displayTitle ?? spotify.musicTitle}
              placeholder={spotify.musicTitle || 'Nome da música…'}
              maxLength={60}
              onFocus={() => focus('displayTitle')}
              onBlur={blur}
              onChange={e => onChange({ displayTitle: e.target.value })}
            />
          </FieldCard>
        )}

        <FieldCard icon="✨" label="Texto do topo" focused={isFoc('top')} note="Título da playlist no topo do player.">
          <input
            style={inlineInput}
            type="text"
            value={spotify.topText}
            placeholder="Nossa música ❤️"
            maxLength={40}
            onFocus={() => focus('top')}
            onBlur={blur}
            onChange={e => onChange({ topText: e.target.value })}
          />
        </FieldCard>

        <FieldCard icon="⏳" label="Texto do contador" focused={isFoc('bottom')} note='Aparece antes do ano. Ex: "Namorados há 2025"'>
          <input
            style={inlineInput}
            type="text"
            value={spotify.bottomText}
            placeholder="Namorados há"
            maxLength={30}
            onFocus={() => focus('bottom')}
            onBlur={blur}
            onChange={e => onChange({ bottomText: e.target.value })}
          />
        </FieldCard>
      </div>
    </div>
  );
}
