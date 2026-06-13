'use client';

import { useEffect, useState } from 'react';
import type { SpotifyData } from '@/lib/types';

// Demo com música real: busca a faixa via /api/spotify (Spotify + fallback
// Deezer) e só troca nome/capa quando o preview chega — assim o título exibido
// SEMPRE bate com o áudio que toca. Se a busca falhar, o fallback fica no
// preset, cujo nome também corresponde à trilha ambiente.
export function useDemoTrack(fallback: SpotifyData, query: string): SpotifyData {
  const [track, setTrack] = useState<SpotifyData>(fallback);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res  = await fetch(`/api/spotify?search=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const json = await res.json();
        const hit = (json.results ?? []).find(
          (t: { previewUrl: string | null }) => t.previewUrl
        );
        if (!alive || !hit) return;
        setTrack(prev => ({
          ...prev,
          source:       'spotify',
          trackId:      hit.id,
          previewUrl:   hit.previewUrl,
          albumArt:     hit.albumArt ?? prev.albumArt,
          musicTitle:   hit.title,
          displayTitle: hit.title,
          musicArtist:  hit.artist,
        }));
      } catch {
        // sem rede / rate limit: mantém o fallback honesto
      }
    })();
    return () => { alive = false; };
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps -- fallback é estático

  return track;
}

// Música real do demo: romântica, sertaneja e conhecida. A busca retorna a
// versão de estúdio com preview tanto no Spotify quanto no Deezer.
export const DEMO_TRACK_QUERY = 'Os Anjos Cantam Jorge Mateus';
