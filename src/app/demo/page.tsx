'use client';

import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import type { SpotifyData } from '@/lib/types';

const BASE = {
  giverName: 'João', receiverName: 'Ana',
  startDate: '2023-02-14', startTime: '20:30',
};

const DEMO: SpotifyData = {
  source:         'preset',
  musicUrl:       PRESET_TRACKS[0].url,
  musicTitle:     PRESET_TRACKS[0].title,
  musicArtist:    PRESET_TRACKS[0].artist,
  topText:        'Playlist do Amor',
  bottomText:     'Juntos há',
  photos:         ['/demo/photo1.png', '/demo/photo2.png', '/demo/photo3.png'],
  specialMessage: 'Cada dia ao seu lado é uma bênção. Te amo mais do que as palavras podem dizer. ❤️',
  reasons: [
    'Seu sorriso que ilumina meu dia',
    'Por me amar do jeito que eu sou',
    'Por ser minha melhor amiga',
  ],
};

export default function DemoSpotify() {
  return (
    <main style={{ minHeight: '100dvh', background: '#0F172A' }}>
      <SpotifyPlayer spotify={DEMO} base={BASE} />
    </main>
  );
}
