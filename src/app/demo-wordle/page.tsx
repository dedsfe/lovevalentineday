'use client';

import { DemoPageLayout } from '@/components/DemoPageLayout';
import { WordleGame } from '@/components/products/wordle/WordleGame';
import type { WordleData } from '@/lib/types';

const DEMO: WordleData = {
  word:       'AMOR',
  clue:       'O que sinto por você todos os dias',
  winMessage: 'Sabia que você ia descobrir! Te amo demais 💚',
};

export default function DemoWordle() {
  return (
    <DemoPageLayout
      badge="💚 Wordle do Amor · Divertido"
      badgeColor="#16A34A"
      badgeBg="#16A34A15"
      heroGradient="linear-gradient(160deg, #052e16 0%, #0d1117 60%, #052e16 100%)"
      title="A palavra secreta de vocês"
      tagline="Desafie seu amor com um jogo personalizado. Ela vai adorar tentar adivinhar."
      features={[
        { emoji: '🔤', title: 'Palavra secreta', desc: 'Escolha qualquer palavra de 3 a 7 letras' },
        { emoji: '💡', title: 'Dica personalizada', desc: 'Uma dica especial para ajudar ela a adivinhar' },
        { emoji: '🎉', title: 'Mensagem surpresa', desc: 'Aparece só quando ela acerta — emocionante!' },
        { emoji: '🟩', title: 'Tentativas coloridas', desc: 'Verde = certa, Amarelo = existe mas lugar errado' },
      ]}
      otherDemos={[
        { href: '/demo',          emoji: '🎵', label: 'Spotify Player' },
        { href: '/demo-roulette', emoji: '🎰', label: 'Roleta do Casal' },
      ]}
    >
      <WordleGame data={DEMO} />
    </DemoPageLayout>
  );
}
