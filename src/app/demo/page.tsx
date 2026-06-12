'use client';

import { useState } from 'react';
import { DemoPageLayout } from '@/components/DemoPageLayout';
import { LivePreview } from '@/app/criar/LivePreview';
import { PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import type { SpotifyData, WordleData, RouletteData } from '@/lib/types';

type ProductKey = 'spotify' | 'wordle' | 'roulette';

const BASE = {
  giverName: 'Lucas', receiverName: 'Isabela',
  startDate: '2022-06-12', startTime: '19:30',
  coverPhoto: '',
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

const WORDLE: WordleData = {
  word:       'AMOR',
  clue:       'O que sinto toda vez que penso em você',
  winMessage: 'Você me conhece tão bem! ❤️',
};

const ROULETTE: RouletteData = {
  title:   'O que vamos fazer hoje?',
  options: ['Jantar especial', 'Cinema juntinhos', 'Passeio ao pôr do sol', 'Netflix e pipoca', 'Spa em casa', 'Surpresa romântica'],
};

export default function DemoSpotify() {
  const [previewProduct, setPreviewProduct] = useState<ProductKey>('spotify');

  return (
    <DemoPageLayout bg="#111827">
      <div style={{
        minHeight: 'calc(100dvh - 57px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '28px 18px 36px',
      }}>
        <LivePreview
          base={BASE}
          spotify={DEMO}
          extras={['wordle', 'roulette']}
          wordle={WORDLE}
          roulette={ROULETTE}
          previewProduct={previewProduct}
          onPreviewChange={setPreviewProduct}
          width={360}
        />
      </div>
    </DemoPageLayout>
  );
}
