'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import type { SpotifyData } from '@/lib/types';

const BASE = {
  giverName: 'João', receiverName: 'Ana',
  startDate: '2023-02-14', startTime: '20:30',
};

const DEMO: SpotifyData = {
  source:       'preset',
  musicUrl:     PRESET_TRACKS[0].url,
  musicTitle:   PRESET_TRACKS[0].title,
  musicArtist:  PRESET_TRACKS[0].artist,
  topText:      'Playlist do Amor',
  bottomText:   'Juntos há',
  photos: ['/demo/photo1.png', '/demo/photo2.png', '/demo/photo3.png'],
  specialMessage: 'Cada dia ao seu lado é uma bênção. Te amo mais do que as palavras podem dizer. ❤️',
  reasons: [
    'Seu sorriso que ilumina meu dia',
    'Por me amar do jeito que eu sou',
    'Por ser minha melhor amiga',
  ],
};

export default function DemoSpotify() {
  return (
    <DemoPageLayout
      badge="🎵 Spotify Player · ⭐ Mais popular"
      badgeColor="#1DB954"
      badgeBg="#1DB95415"
      heroGradient="linear-gradient(160deg, #071A0E 0%, #0d1117 60%, #1a0010 100%)"
      title="Dedique a música de vocês"
      tagline="Player personalizado com a música, fotos e os motivos que você a ama."
      features={[
        { emoji: '🎵', title: 'Música dedicada', desc: 'Qualquer música do Spotify ou link do YouTube' },
        { emoji: '📸', title: 'Fotos do casal', desc: 'Até 10 fotos em carrossel automático' },
        { emoji: '⏱️', title: 'Contador ao vivo', desc: 'Anos, meses, dias, horas, minutos e segundos juntos' },
        { emoji: '💌', title: 'Mensagem + motivos', desc: 'Escreva uma mensagem e os motivos que você a ama' },
      ]}
      otherDemos={[
        { href: '/demo-wordle',   emoji: '💚', label: 'Wordle do Amor' },
        { href: '/demo-roulette', emoji: '🎰', label: 'Roleta do Casal' },
      ]}
    >
      <SpotifyPlayer spotify={DEMO} base={BASE} />
    </DemoPageLayout>
  );
}
