'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import type { SpotifyData } from '@/lib/types';

const BASE = {
  giverName: 'Lucas', receiverName: 'Isabela',
  startDate: '2022-06-12', startTime: '19:30',
};

const DEMO: SpotifyData = {
  source:         'preset',
  musicUrl:       PRESET_TRACKS[0].url,
  musicTitle:     'Perfeito Assim',
  musicArtist:    'Zé Neto & Cristiano',
  topText:        'Nossa música ❤️',
  bottomText:     'Namorados há',
  photos:         ['/demo/photo1.png', '/demo/photo2.png', '/demo/photo3.png'],
  specialMessage: 'Cada vez que essa música toca, eu lembro do dia que você entrou na minha vida e tudo fez sentido. Você é meu lar, Isa. Te amo mais do que consigo expressar. ❤️',
  reasons: [
    'Pelo seu sorriso que derrubou todos os meus muros',
    'Por me amar nos dias em que eu nem conseguia me amar',
    'Por ser minha melhor amiga e o amor da minha vida',
    'Pelo abraço que me faz sentir que tudo vai ficar bem',
  ],
};

export default function DemoSpotify() {
  return (
    <DemoPageLayout bg="#111827">
      <SpotifyPlayer spotify={DEMO} base={BASE} />
    </DemoPageLayout>
  );
}
