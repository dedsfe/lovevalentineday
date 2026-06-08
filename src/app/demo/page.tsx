'use client';

import { useState } from 'react';
import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { SpotifyConfig, DEFAULT_MUSIC_URL, PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import type { SpotifyData } from '@/lib/types';

const DEMO_BASE = {
  giverName:    'João',
  receiverName: 'Maria',
  startDate:    '2023-02-14',
  startTime:    '20:30',
};

const DEFAULT_SPOTIFY: SpotifyData = {
  source:      'preset',
  musicUrl:    DEFAULT_MUSIC_URL,
  musicTitle:  PRESET_TRACKS[0].title,
  musicArtist: PRESET_TRACKS[0].artist,
  topText:     'Playlist do Amor',
  bottomText:  'Juntos há',
  photos:      [],
};

export default function DemoPage() {
  const [spotify, setSpotify] = useState<SpotifyData>(DEFAULT_SPOTIFY);

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <h1 className="text-xl font-black text-center mb-8">Demo — Spotify Player</h1>

      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Config (esquerda) */}
        <div className="bg-white rounded-3xl border-2 border-black p-6 neo-shadow">
          <h2 className="text-sm font-black uppercase tracking-wide mb-5">Configurar</h2>
          <SpotifyConfig value={spotify} onChange={setSpotify} />
        </div>

        {/* Player preview (direita) */}
        <div className="flex justify-center lg:sticky lg:top-10">
          <SpotifyPlayer spotify={spotify} base={DEMO_BASE} />
        </div>

      </div>
    </main>
  );
}
