'use client';

import { useState } from 'react';
import { SpotifyPlayer } from '@/components/products/spotify';
import type { SpotifyData } from '@/lib/types';

const DEMO_BASE = {
  giverName:    'João',
  receiverName: 'Maria',
  startDate:    '2023-02-14',
  startTime:    '20:30',
};

const DEMO_SPOTIFY: SpotifyData = {
  source:      'preset',
  musicUrl:    'https://assets.mixkit.co/music/preview/mixkit-romantic-ambience-1033.mp3',
  musicTitle:  'Nossa Música',
  musicArtist: 'João & Maria',
  topText:     'Playlist do Amor',
  bottomText:  'Juntos há',
  photos:      [],
};

export default function DemoPage() {
  const [trackUrl, setTrackUrl] = useState('');
  const [spotify, setSpotify]   = useState<SpotifyData>(DEMO_SPOTIFY);
  const [status, setStatus]     = useState('');

  const resolve = async () => {
    if (!trackUrl.trim()) return;
    setStatus('Buscando...');
    try {
      const res  = await fetch(`/api/spotify?track=${encodeURIComponent(trackUrl.trim())}`);
      const json = await res.json();
      if (!res.ok) { setStatus(`Erro: ${json.error}`); return; }
      setSpotify(prev => ({
        ...prev,
        source:      'spotify',
        trackId:     json.id,
        previewUrl:  json.previewUrl ?? undefined,
        albumArt:    json.albumArt ?? undefined,
        musicTitle:  json.title,
        musicArtist: json.artist,
      }));
      setStatus(json.previewUrl ? '✅ Preview disponível — aperte play!' : '✅ Música encontrada (sem preview nesta região)');
    } catch {
      setStatus('Erro de conexão');
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center gap-8">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-black text-center mb-1">Demo — Spotify Player</h1>
        <p className="text-xs text-center text-slate-500 mb-6">Cole um link do Spotify para testar música real</p>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={trackUrl}
            onChange={e => setTrackUrl(e.target.value)}
            placeholder="https://open.spotify.com/track/..."
            className="flex-1 rounded-xl border-2 border-black px-3 py-2 text-xs font-semibold focus:outline-none"
          />
          <button
            onClick={resolve}
            className="px-4 py-2 rounded-xl border-2 border-b-[3px] border-black bg-rose-600 text-white text-xs font-black"
          >
            OK
          </button>
        </div>
        {status && <p className="text-xs text-center text-slate-600 mb-4 font-medium">{status}</p>}

        <SpotifyPlayer spotify={spotify} base={DEMO_BASE} />
      </div>
    </main>
  );
}
