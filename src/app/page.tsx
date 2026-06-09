'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SpotifyPlayer } from '@/components/products/spotify/SpotifyPlayer';
import { PRESET_TRACKS } from '@/components/products/spotify/SpotifyConfig';
import { WordleGame } from '@/components/products/wordle/WordleGame';
import { RouletteWheel } from '@/components/products/roulette/RouletteWheel';
import type { SpotifyData, WordleData, RouletteData } from '@/lib/types';

// ─── Data ─────────────────────────────────────────────────────────────────────

const T_ROW1 = [
  { name: 'Lucas M.', role: 'Namorado', quote: 'Minha namorada chorou quando abriu. Melhor presente que já dei na vida.' },
  { name: 'Fernanda R.', role: 'Esposa', quote: 'Recebi do meu marido no aniversário de 5 anos. Assisti umas 10 vezes seguidas.' },
  { name: 'Marcos A.', role: 'Namorado', quote: 'Fiz em 10 minutos e ficou incrível. Ela não acreditou que eu tinha feito.' },
  { name: 'Carla T.', role: 'Namorada', quote: 'A música com as nossas fotos foi demais. Fiquei olhando por horas.' },
];

const T_ROW2 = [
  { name: 'Juliana C.', role: 'Namorada', quote: 'O Wordle com a nossa palavra secreta foi demais. Ela ficou sorrindo tentando adivinhar.' },
  { name: 'Pedro H.', role: 'Marido', quote: 'A roleta caiu em "jantar surpresa" — que eu já tinha reservado. Ela ficou chocada!' },
  { name: 'Ana Clara S.', role: 'Namorada', quote: 'A mensagem dele me fez chorar. Nunca tinha recebido algo tão especial.' },
  { name: 'Rafael B.', role: 'Namorado', quote: 'Simples de fazer, mas o resultado parece algo profissional. Ela adorou.' },
];

const FAQS = [
  { q: 'Precisa baixar algum aplicativo?', a: 'Não! O presente funciona direto pelo navegador. Você envia o link pelo WhatsApp e ela abre no próprio celular, sem instalar nada.' },
  { q: 'Quanto tempo leva para criar?', a: 'A maioria das pessoas cria em menos de 10 minutos. Você preenche os dados, personaliza e o link fica disponível na hora.' },
  { q: 'O link expira?', a: 'Não. O link fica disponível para sempre. Ela pode abrir quantas vezes quiser, a qualquer momento.' },
  { q: 'Posso adicionar mais de um produto ao presente?', a: 'Sim! Você pode combinar Spotify Player, Wordle, Roleta e todos os outros produtos em um único link.' },
  { q: 'Funciona para qualquer data especial?', a: 'Claro! Aniversário de namoro, Dia dos Namorados, Natal, aniversário dela — funciona para qualquer ocasião.' },
];

// ─── Products showcase data ────────────────────────────────────────────────────

const LP_BASE = { giverName: 'João', receiverName: 'Ana', startDate: '2023-02-14', startTime: '20:30' };

const LP_SPOTIFY: SpotifyData = {
  source: 'preset',
  musicUrl:    PRESET_TRACKS[0].url,
  musicTitle:  PRESET_TRACKS[0].title,
  musicArtist: PRESET_TRACKS[0].artist,
  topText:     'Playlist do Amor',
  bottomText:  'Juntos há',
  photos: ['/demo/photo1.png', '/demo/photo2.png', '/demo/photo3.png'],
  specialMessage: 'Cada dia ao seu lado é uma bênção. Te amo. ❤️',
  reasons: ['Seu sorriso que ilumina meu dia', 'Por me amar do jeito que eu sou', 'Por ser minha melhor amiga'],
};

const LP_WORDLE: WordleData = {
  word: 'AMOR', clue: 'O que sinto por você todos os dias',
  winMessage: 'Sabia que você ia descobrir! Te amo demais 💚',
};

const LP_ROULETTE: RouletteData = {
  title: 'O que vamos fazer hoje?',
  options: ['Cinema', 'Jantar fora', 'Netflix em casa', 'Passeio no parque', 'Spa em casa', 'Piquenique'],
};

const LP_PRODUCTS = [
  {
    emoji: '🎵', name: 'Spotify Player', badge: '⭐ Mais popular',
    badgeColor: '#1DB954', badgeBg: '#1DB95415',
    desc: 'Player personalizado com a música de vocês, fotos do casal, contador ao vivo e os motivos que você a ama.',
    features: ['Qualquer música do Spotify ou YouTube', 'Até 10 fotos do casal em carrossel', 'Contador ao vivo de anos, meses e dias', 'Mensagem especial + motivos que você a ama'],
    demoUrl: '/demo',
  },
  {
    emoji: '💚', name: 'Wordle do Amor', badge: '💚 Divertido',
    badgeColor: '#16A34A', badgeBg: '#16A34A15',
    desc: 'Desafie seu amor com um jogo de palavras personalizado. Escolha a palavra secreta e veja se ela consegue adivinhar.',
    features: ['Palavra secreta de até 7 letras', 'Dica personalizada para ajudar', 'Mensagem surpresa ao acertar', 'Tentativas com feedback colorido'],
    demoUrl: '/demo-wordle',
  },
  {
    emoji: '🎰', name: 'Roleta do Casal', badge: '🎰 Interativo',
    badgeColor: '#E11D48', badgeBg: '#E11D4815',
    desc: 'Deixa a sorte decidir o programa do dia! Crie uma roleta com as atividades favoritas de vocês.',
    features: ['Até 10 opções de programa', 'Animação suave ao girar', 'Confete ao revelar o resultado', 'Título personalizado'],
    demoUrl: '/demo-roulette',
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function useCounter(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      current += step;
      if (current >= target) { setValue(target); clearInterval(id); }
      else setValue(Math.floor(current));
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return value;
}

// ─── Components ───────────────────────────────────────────────────────────────

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="flex-shrink-0 w-72 bg-white border-2 border-ink rounded-2xl p-5 mx-3 neo-shadow-sm">
      <Stars />
      <p className="text-sm text-ink font-medium leading-relaxed mt-3 mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-2.5 pt-3 border-t border-ink/10">
        <div className="w-8 h-8 rounded-full bg-brand/10 border-2 border-ink flex items-center justify-center text-xs font-black text-brand flex-shrink-0">
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-black text-ink">{name}</p>
          <p className="text-[10px] text-ink-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-ink rounded-2xl overflow-hidden reveal">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-subtle transition-colors"
      >
        <span className="font-black text-ink text-base pr-4">{q}</span>
        <span
          className="text-2xl text-ink-muted flex-shrink-0 font-light leading-none transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      <div style={{ maxHeight: open ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
        <div className="px-6 pb-5 bg-white">
          <p className="text-ink-muted font-medium text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) *  8;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.015)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.18s ease', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  useScrollReveal();
  const scrolled = useNavScroll();

  // Stats counter
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsOn, setStatsOn] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsOn(true); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const count = useCounter(500, statsOn);
  const [activeProduct, setActiveProduct] = useState(0);

  return (
    <>
      <style>{`
        /* ── Animated gradient bg ── */
        @keyframes gradBg {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        /* ── Headline line reveal ── */
        @keyframes lineUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line-reveal {
          display: block;
          animation: lineUp 0.6s ease both;
        }

        /* ── Gradient text shimmer ── */
        @keyframes shimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .grad-text {
          background: linear-gradient(90deg, #E11D48, #9333EA, #F43F5E, #E11D48);
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s ease infinite;
        }

        /* ── Marquee ── */
        @keyframes mLeft  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes mRight { from { transform: translateX(-50%); } to { transform: translateX(0);    } }

        /* ── Floating badge bob ── */
        @keyframes bobA {
          0%,100% { transform: translateY(0)    rotate(-5deg); }
          50%      { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes bobB {
          0%,100% { transform: translateY(0)   rotate(4deg); }
          50%      { transform: translateY(-8px) rotate(4deg); }
        }

        /* ── Scroll reveal ── */
        .reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .line-reveal, .grad-text { animation: none !important; opacity: 1; }
          .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <main className="min-h-screen bg-white overflow-x-hidden">

        {/* ── Nav ───────────────────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{
            background:    scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
            backdropFilter: scrolled ? 'blur(14px)' : 'none',
            borderBottom:  scrolled ? '2px solid #0A0A0A'    : '2px solid transparent',
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
            <span className="text-xl font-black text-ink tracking-tight">
              Love<span className="grad-text">Valentine</span>
            </span>
            <div className="flex items-center gap-3">
              <Link href="/demo" className="hidden sm:block text-sm font-bold text-ink-muted hover:text-ink transition-colors">
                Ver demo
              </Link>
              <Link
                href="#criar"
                className="px-5 py-2.5 rounded-xl border-2 border-ink bg-brand text-white text-sm font-black neo-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                Criar presente
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden min-h-screen flex items-center"
          style={{
            background: 'linear-gradient(-45deg, #fff1f2, #fce7f3, #f5f3ff, #fdf4ff, #fff1f2)',
            backgroundSize: '400% 400%',
            animation: 'gradBg 10s ease infinite',
          }}
        >
          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
              opacity: 0.035,
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-28 md:pb-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">

            {/* Left — copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-ink neo-shadow-sm text-xs font-black text-ink">
                ❤️ +500 presentes enviados essa semana
              </div>

              {/* Headline — line by line reveal */}
              <h1 className="text-[2.25rem] sm:text-5xl lg:text-6xl font-black text-ink leading-[1.08] tracking-tight">
                <span className="line-reveal" style={{ animationDelay: '0ms' }}>O presente que vai</span>
                <span className="line-reveal" style={{ animationDelay: '120ms' }}>
                  fazer ela{' '}
                  <span className="grad-text">chorar</span>
                </span>
                <span className="line-reveal" style={{ animationDelay: '240ms' }}>de felicidade</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-muted font-medium leading-relaxed">
                Crie uma página interativa com música, jogos e mensagens personalizadas.
                Envie o link e surpreenda quem você ama.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="#criar"
                  id="criar"
                  className="text-center px-8 py-4 rounded-2xl border-2 border-ink bg-brand text-white text-base font-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-lg transition-all"
                >
                  Criar meu presente →
                </Link>
                <Link
                  href="/demo"
                  className="text-center px-8 py-4 rounded-2xl border-2 border-ink bg-white text-ink text-base font-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-lg transition-all"
                >
                  Ver demonstração
                </Link>
              </div>

              {/* Avatar row */}
              <div className="flex items-center gap-5">
                <div className="flex -space-x-2">
                  {['#E11D48','#7C3AED','#0891B2','#059669','#D97706'].map((c, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-black"
                      style={{ background: c, zIndex: 5 - i }}
                    >
                      {['L','F','M','J','P'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <Stars />
                  <p className="text-xs text-ink-muted font-medium mt-0.5">+500 casais emocionados</p>
                </div>
              </div>
            </div>

            {/* Right — phone mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">

                {/* Phone */}
                <div className="w-[260px] h-[520px] rounded-[40px] border-4 border-ink bg-[#0A0A12] neo-shadow-lg overflow-hidden relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
                  <div className="absolute inset-0 flex flex-col pt-8">
                    <div className="px-4 pt-2 pb-3 flex-shrink-0" style={{ background: 'linear-gradient(180deg, #2D1B4E 0%, #1a1030 100%)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-brand/30 flex items-center justify-center">🎵</div>
                        <div>
                          <div className="text-white text-[11px] font-black">Perfeitos Juntos</div>
                          <div className="text-white/50 text-[9px]">Luan Santana</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {['#E11D48','#9333EA','#0891B2'].map((c, i) => (
                          <div key={i} className="flex-1 h-14 rounded-lg" style={{ background: c, opacity: 0.75 + i * 0.08 }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 bg-[#111827] px-3 py-3 space-y-2.5 overflow-hidden">
                      <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Mensagem especial</div>
                      <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-2.5">
                        <p className="text-white text-[9px] leading-relaxed font-medium">Cada dia ao seu lado é um presente. Te amo. ❤️</p>
                      </div>
                      <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">3 motivos</div>
                      {['Seu sorriso ilumina tudo','Como você me faz rir','Por ser simplesmente você'].map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-brand text-[9px] mt-0.5 flex-shrink-0">♥</span>
                          <span className="text-white/70 text-[9px] leading-relaxed">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge — Wordle (bobbing, hidden on mobile) */}
                <div
                  className="hidden lg:block absolute -left-16 top-16 bg-white border-2 border-ink rounded-2xl p-3 neo-shadow w-36"
                  style={{ animation: 'bobA 3.2s ease-in-out infinite' }}
                >
                  <p className="text-[10px] font-black text-ink mb-1.5">💚 Wordle do Amor</p>
                  <div className="flex gap-1">
                    {['A','M','O','R'].map((l, i) => (
                      <div key={i} className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
                        <span className="text-white text-[9px] font-black">{l}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-ink-muted mt-1.5">2 tentativas 🎉</p>
                </div>

                {/* Floating badge — Roleta (bobbing, hidden on mobile) */}
                <div
                  className="hidden lg:block absolute -right-14 bottom-28 bg-white border-2 border-ink rounded-2xl p-3 neo-shadow w-32"
                  style={{ animation: 'bobB 3.8s ease-in-out infinite', animationDelay: '0.7s' }}
                >
                  <p className="text-[10px] font-black text-ink mb-1">🎰 Roleta</p>
                  <div className="bg-brand/10 border border-brand/30 rounded-lg p-2 text-center">
                    <p className="text-brand text-[10px] font-black">Cinema 🎬</p>
                  </div>
                  <p className="text-[9px] text-ink-muted mt-1">Decidido! ✨</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar (counter) ───────────────────────────────────── */}
        <div ref={statsRef} className="border-y-2 border-ink bg-brand">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-10 md:gap-20">
            <div className="text-center">
              <p className="text-2xl font-black text-white tabular-nums">+{count}</p>
              <p className="text-[11px] text-white/70 font-medium">presentes criados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-[11px] text-white/70 font-medium">sem app necessário</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">5min</p>
              <p className="text-[11px] text-white/70 font-medium">para criar e enviar</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">❤️</p>
              <p className="text-[11px] text-white/70 font-medium">histórias emocionantes</p>
            </div>
          </div>
        </div>

        {/* ── Como funciona ─────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10 md:mb-14 reveal">
              <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Simples assim</p>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">Pronto em 5 minutos</h2>
              <p className="text-ink-muted font-medium mt-3 max-w-md mx-auto">Você preenche, personaliza e o link está disponível na hora.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { step: '01', emoji: '✍️', title: 'Conte a história', desc: 'Escolha os produtos e personalize com os dados de vocês.' },
                { step: '02', emoji: '🎨', title: 'Personalize tudo', desc: 'Fotos, música, palavras — cada detalhe é de vocês.' },
                { step: '03', emoji: '🔗', title: 'Receba o link', desc: 'O link único do presente fica disponível na hora.' },
                { step: '04', emoji: '💌', title: 'Emocione ela', desc: 'Envie pelo WhatsApp e prepare-se para a reação.' },
              ].map(({ step, emoji, title, desc }, i) => (
                <div
                  key={step}
                  className="bg-white rounded-3xl border-2 border-ink p-6 neo-shadow reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-4xl font-black leading-none" style={{ color: 'rgba(225,29,72,0.12)' }}>{step}</span>
                  </div>
                  <h3 className="font-black text-ink text-base mb-2">{title}</h3>
                  <p className="text-sm text-ink-muted font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Produtos — Showcase ───────────────────────────────────── */}
        <section id="produtos" className="py-16 md:py-20 bg-subtle border-y-2 border-ink">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">

            {/* Header */}
            <div className="text-center mb-10 md:mb-12 reveal">
              <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">O que tem no presente</p>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">Produtos que emocionam</h2>
              <p className="text-ink-muted font-medium mt-3">Escolha um ou combine todos no mesmo link.</p>
            </div>

            {/* Product tabs */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-10 reveal flex-wrap">
              {LP_PRODUCTS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setActiveProduct(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-ink text-sm font-black transition-all ${
                    activeProduct === i
                      ? 'bg-ink text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                      : 'bg-white text-ink hover:bg-ink/5'
                  }`}
                >
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>

            {/* Showcase: phone mockup + info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center reveal">

              {/* Phone mockup */}
              <div className="flex justify-center order-2 lg:order-1">
                <div style={{
                  width: 260,
                  background: '#111',
                  borderRadius: 44,
                  padding: '14px 10px',
                  border: '3px solid #0A0A0A',
                  boxShadow: '6px 6px 0px 0px #0A0A0A',
                }}>
                  {/* Dynamic island */}
                  <div style={{ width: 90, height: 26, background: '#000', borderRadius: 99, margin: '0 auto 10px' }} />
                  {/* Screen */}
                  <div style={{ width: 240, height: 500, borderRadius: 28, overflow: 'hidden', background: '#000' }}>
                    <div style={{ width: 390, transformOrigin: 'top left', transform: 'scale(0.615)' }}>
                      {activeProduct === 0 && <SpotifyPlayer spotify={LP_SPOTIFY} base={LP_BASE} />}
                      {activeProduct === 1 && <WordleGame data={LP_WORDLE} />}
                      {activeProduct === 2 && <RouletteWheel data={LP_ROULETTE} />}
                    </div>
                  </div>
                  {/* Home indicator */}
                  <div style={{ width: 80, height: 4, background: '#333', borderRadius: 99, margin: '10px auto 0' }} />
                </div>
              </div>

              {/* Product info */}
              <div className="order-1 lg:order-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black mb-5"
                  style={{
                    border: `1px solid ${LP_PRODUCTS[activeProduct].badgeColor}55`,
                    color: LP_PRODUCTS[activeProduct].badgeColor,
                    background: LP_PRODUCTS[activeProduct].badgeBg,
                  }}
                >
                  {LP_PRODUCTS[activeProduct].badge}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-ink mb-4">
                  {LP_PRODUCTS[activeProduct].name}
                </h3>
                <p className="text-ink-muted font-medium leading-relaxed mb-6 text-base sm:text-lg">
                  {LP_PRODUCTS[activeProduct].desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {LP_PRODUCTS[activeProduct].features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-ink">
                      <span className="text-brand font-black text-base">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={LP_PRODUCTS[activeProduct].demoUrl}
                    className="flex-1 text-center py-4 px-6 rounded-2xl bg-brand text-white font-black border-2 border-ink shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0A0A0A] transition-all text-sm sm:text-base"
                  >
                    Ver demonstração →
                  </Link>
                  <Link
                    href="#criar"
                    className="flex-1 text-center py-4 px-6 rounded-2xl bg-white text-ink font-black border-2 border-ink shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0A0A0A] transition-all text-sm sm:text-base"
                  >
                    Criar meu presente
                  </Link>
                </div>
              </div>

            </div>

            <p className="text-center text-sm text-ink-muted font-medium mt-12">
              Em breve: Galeria de fotos · Mapa estelar · Retrospectiva do casal
            </p>
          </div>
        </section>

        {/* ── Depoimentos — duplo marquee ───────────────────────────── */}
        <section className="py-16 md:py-20 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-10 md:mb-12 reveal">
            <div className="text-center">
              <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Depoimentos</p>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">Eles já emocionaram alguém</h2>
            </div>
          </div>

          {/* Row 1 — scroll left */}
          <div className="mb-4" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', width: 'max-content', animation: 'mLeft 32s linear infinite' }}>
              {[...T_ROW1, ...T_ROW1].map((t, i) => <TestimonialCard key={i} {...t} />)}
            </div>
          </div>

          {/* Row 2 — scroll right */}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', width: 'max-content', animation: 'mRight 38s linear infinite' }}>
              {[...T_ROW2, ...T_ROW2].map((t, i) => <TestimonialCard key={i} {...t} />)}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-subtle border-y-2 border-ink">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-10 md:mb-12 reveal">
              <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Dúvidas</p>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">Perguntas frequentes</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
            </div>
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-brand border-b-2 border-ink relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)' }}
          />
          <div className="relative max-w-2xl mx-auto px-6 text-center reveal">
            <p className="text-white/70 text-sm font-black uppercase tracking-widest mb-4">Não deixe pra depois</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Ela merece um presente<br className="hidden sm:block" />que vai te lembrar pra sempre
            </h2>
            <p className="text-white/75 font-medium text-base sm:text-lg mb-8 md:mb-10 max-w-lg mx-auto">
              Crie agora, pronto em minutos. Sem app, sem complicação.
            </p>
            <Link
              href="#criar"
              className="block sm:inline-block w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 rounded-2xl border-2 border-white bg-white text-brand text-lg font-black text-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all"
            >
              Criar meu presente agora →
            </Link>
            <p className="text-white/50 text-xs font-medium mt-6">✅ Sem app · ✅ Link na hora · ✅ Funciona pelo WhatsApp</p>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="px-6 py-10 bg-ink">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xl font-black text-white tracking-tight">
              Love<span className="grad-text">Valentine</span>
            </span>
            <p className="text-sm text-white/40 font-medium">© 2025 LoveValentine · Feito com ❤️ para quem ama de verdade</p>
            <div className="flex gap-6">
              <Link href="/demo" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Demo</Link>
              <Link href="#criar" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Criar presente</Link>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
