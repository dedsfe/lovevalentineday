'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import type { RouletteData } from '@/lib/types';

const DEMO: RouletteData = {
  title:   'O que vamos fazer hoje?',
  options: ['Cinema', 'Jantar fora', 'Netflix em casa', 'Passeio no parque', 'Spa em casa', 'Piquenique'],
};

export default function DemoRoulette() {
  return (
    <DemoPageLayout
      badge="🎰 Roleta do Casal · Interativo"
      badgeColor="#E11D48"
      badgeBg="#E11D4815"
      heroGradient="linear-gradient(160deg, #3f0018 0%, #0d1117 60%, #3f0018 100%)"
      title="Deixa a sorte decidir"
      tagline="Crie uma roleta com os programas favoritos de vocês e gire para descobrir."
      features={[
        { emoji: '🎯', title: 'Opções personalizadas', desc: 'Coloque até 10 opções de programa do dia' },
        { emoji: '✨', title: 'Animação suave', desc: 'Roda com efeito de desaceleração realista' },
        { emoji: '🎊', title: 'Confete surpresa', desc: 'Coraçõezinhos voam ao revelar o resultado' },
        { emoji: '📝', title: 'Título personalizado', desc: 'Dê um nome especial pra roleta de vocês' },
      ]}
      otherDemos={[
        { href: '/demo',         emoji: '🎵', label: 'Spotify Player' },
        { href: '/demo-wordle',  emoji: '💚', label: 'Wordle do Amor' },
      ]}
    >
      <RouletteWheel data={DEMO} />
    </DemoPageLayout>
  );
}
