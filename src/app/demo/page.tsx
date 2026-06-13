'use client';

import dynamic from 'next/dynamic';
import { Component, type ErrorInfo, type ReactNode, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { DemoPageLayout } from '@/components/DemoPageLayout';
import { SpotifyPlayer, type ProductNav } from '@/components/products/spotify/SpotifyPlayer';
import { PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import type { SpotifyData, WordleData, RouletteData } from '@/lib/types';

type ProductKey = 'spotify' | 'wordle' | 'roulette';

const LoadingProduct = () => (
  <div style={{
    minHeight: 360,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'system-ui',
  }}>
    Carregando...
  </div>
);

const WordleGame = dynamic(
  () => import('@/components/products/wordle/WordleGame').then(mod => mod.WordleGame),
  { ssr: false, loading: LoadingProduct }
);

const RouletteWheel = dynamic(
  () => import('@/components/products/roulette/RouletteWheel').then(mod => mod.RouletteWheel),
  { ssr: false, loading: LoadingProduct }
);

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

function ProductHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px 10px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: '#0F172A',
      position: 'sticky',
      top: 0,
      zIndex: 2,
    }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.68)',
          padding: '6px 12px 6px 8px',
          fontSize: 12,
          fontWeight: 800,
          fontFamily: 'system-ui',
          cursor: 'pointer',
        }}
      >
        <ChevronLeft size={13} strokeWidth={2.5} />
        Spotify
      </button>
      <h1 style={{
        flex: 1,
        margin: 0,
        color: '#fff',
        fontSize: 14,
        fontWeight: 800,
        textAlign: 'center',
        fontFamily: 'system-ui',
      }}>
        {title}
      </h1>
      <div style={{ width: 76 }} />
    </div>
  );
}

class ProductErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Demo product failed:', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'system-ui',
      }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Não foi possível abrir este extra.</p>
        <button
          onClick={() => {
            this.setState({ failed: false });
            this.props.onReset();
          }}
          style={{
            border: 'none',
            borderRadius: 12,
            background: '#E11D48',
            color: '#fff',
            padding: '12px 16px',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'system-ui',
          }}
        >
          Voltar ao presente
        </button>
      </div>
    );
  }
}

export default function DemoSpotify() {
  const [previewProduct, setPreviewProduct] = useState<ProductKey>('spotify');

  const products: ProductNav[] = [
    {
      key: 'wordle',
      icon: '🟩',
      label: 'Wordle do Amor',
      accent: '#22C55E',
      onClick: () => setPreviewProduct('wordle'),
    },
    {
      key: 'roulette',
      icon: '🎡',
      label: 'Roleta Surpresa',
      accent: '#E11D48',
      count: ROULETTE.options.length,
      onClick: () => setPreviewProduct('roulette'),
    },
  ];

  return (
    <DemoPageLayout bg="#111827">
      <div style={{ width: '100%', minHeight: 'calc(100dvh - 57px)', background: '#0F172A' }}>
        <ProductErrorBoundary onReset={() => setPreviewProduct('spotify')} key={previewProduct}>
          {previewProduct === 'spotify' && (
            <SpotifyPlayer spotify={DEMO} base={BASE} products={products} />
          )}

          {previewProduct === 'wordle' && (
            <>
              <ProductHeader title="Wordle do Amor" onBack={() => setPreviewProduct('spotify')} />
              <div style={{ padding: '16px 16px 28px' }}>
                <WordleGame data={WORDLE} />
              </div>
            </>
          )}

          {previewProduct === 'roulette' && (
            <>
              <ProductHeader title="Roleta Surpresa" onBack={() => setPreviewProduct('spotify')} />
              <div style={{ padding: '16px 16px 28px' }}>
                <RouletteWheel data={ROULETTE} noConfetti />
              </div>
            </>
          )}
        </ProductErrorBoundary>
      </div>
    </DemoPageLayout>
  );
}
