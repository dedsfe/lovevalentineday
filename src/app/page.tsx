'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { LivePreview } from './criar/LivePreview';

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

const T_META = [
  { reaction: '😭 3',    time: '21:47', color: '#E8637A' },
  { reaction: '❤️',      time: '19:23', color: '#F0A500' },
  { reaction: '😍❤️',    time: '14:32', color: '#5FBA7D' },
  { reaction: '💕 2',    time: '23:15', color: '#E07B54' },
  { reaction: '🥺',      time: '08:42', color: '#53BDEB' },
  { reaction: '😭❤️‍🔥 5', time: '16:58', color: '#E8637A' },
  { reaction: '😢 2',    time: '11:30', color: '#F0A500' },
  { reaction: '🫶❤️',    time: '22:10', color: '#5FBA7D' },
];

const FAQS = [
  { q: 'Precisa baixar algum aplicativo?', a: 'Não! O presente funciona direto pelo navegador. Você envia o link pelo WhatsApp e ela abre no próprio celular, sem instalar nada.' },
  { q: 'Quanto tempo leva para criar?', a: 'A maioria das pessoas cria em menos de 10 minutos. Você preenche os dados, personaliza e o link fica disponível na hora.' },
  { q: 'O link expira?', a: 'Não. O link fica disponível para sempre. Ela pode abrir quantas vezes quiser, a qualquer momento.' },
  { q: 'Posso adicionar mais de um produto ao presente?', a: 'Sim! Você pode combinar Spotify Player, Wordle, Roleta e todos os outros produtos em um único link.' },
  { q: 'Funciona para qualquer data especial?', a: 'Claro! Aniversário de namoro, Dia dos Namorados, Natal, aniversário dela — funciona para qualquer ocasião.' },
];

// ─── Products showcase data ────────────────────────────────────────────────────


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

const HERO_PREVIEW_BASE = {
  giverName: 'Lucas',
  receiverName: 'Isabela',
  startDate: '2021-06-12',
  startTime: '20:30',
  coverPhoto: '',
};

const HERO_PREVIEW_SPOTIFY = {
  source: 'preset' as const,
  musicUrl: '',
  previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  musicTitle: 'Perfeito Assim',
  displayTitle: 'Perfeito Assim',
  musicArtist: 'Zé Neto & Cristiano',
  topText: 'Nossa música ❤️',
  bottomText: 'Namorados há',
  photos: ['/demo/photo1.png', '/demo/photo2.png', '/demo/photo3.png'],
  specialMessage: 'Você transformou minha vida no lugar mais bonito do mundo.',
  closingPhoto: '/demo/photo2.png',
  closingCaption: 'Meu lugar favorito sempre vai ser ao seu lado.',
  reasons: [
    'Seu sorriso muda qualquer dia meu.',
    'Você faz tudo parecer mais leve.',
    'Eu amo a forma como a gente cuida um do outro.',
  ],
};

const HERO_PREVIEW_WORDLE = {
  word: 'AMOR',
  clue: 'O que sinto toda vez que penso em você...',
  winMessage: 'Você me conhece tão bem! ❤️',
};

const HERO_PREVIEW_ROULETTE = {
  title: 'O que vamos fazer hoje?',
  options: ['Jantar especial', 'Cinema', 'Massagem', 'Passeio', 'Netflix'],
};

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


function WhatsAppBubble({ name, quote, idx }: { name: string; role: string; quote: string; idx: number }) {
  const { reaction, time, color } = T_META[idx % T_META.length];
  return (
    <div className="flex-shrink-0 mx-4 py-1" style={{ width: '272px' }}>
      <div className="flex items-start" style={{ gap: '8px' }}>
        {/* Avatar */}
        <div
          className="rounded-full flex-shrink-0 flex items-center justify-center font-bold"
          style={{
            width: 32, height: 32, marginTop: 2,
            background: 'linear-gradient(135deg, #E11D48 0%, #7F1027 100%)',
            color: '#fff', fontSize: 13,
          }}
        >
          {name[0]}
        </div>

        {/* Bubble + reaction */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div
            style={{
              position: 'relative',
              background: '#202C33',
              borderRadius: '0 7.5px 7.5px 7.5px',
              maxWidth: 224,
              padding: '6px 12px 8px 12px',
            }}
          >
            {/* WA received-message tail */}
            <svg
              width="8" height="13" viewBox="0 0 8 13"
              style={{ position: 'absolute', top: 0, left: -8, display: 'block' }}
            >
              <path d="M5.188 0H6c1.105 0 2 .895 2 2v11L0 4.932A3.5 3.5 0 0 1 .726 1.01z" fill="#202C33" />
            </svg>

            {/* Sender name — unique color per contact */}
            <p style={{ color, fontSize: 12, fontWeight: 600, marginBottom: 3, lineHeight: 1 }}>
              {name}
            </p>

            {/* Message text */}
            <p style={{ color: '#E9EDEF', fontSize: 14, lineHeight: 1.45, margin: 0 }}>
              {quote}
            </p>

            {/* Timestamp + read ticks */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, marginTop: 4 }}>
              <span style={{ color: '#8696A0', fontSize: 11 }}>{time}</span>
              {/* double blue read ticks */}
              <svg width="16" height="11" viewBox="0 0 16 11" fill="#53BDEB">
                <path d="M15.854.146a.5.5 0 0 0-.707 0l-6 6-.354-.354a.5.5 0 1 0-.707.708l.707.707a.5.5 0 0 0 .707 0l6.354-6.354a.5.5 0 0 0 0-.707z"/>
                <path d="M9.854.146a.5.5 0 0 0-.707 0L4 5.293 1.854 3.146a.5.5 0 1 0-.707.708L3.293 6l-1.5 1.5a.5.5 0 0 0 .707.707L4 6.707l5.146-5.146a.5.5 0 0 0 .708-.707z"/>
              </svg>
            </div>
          </div>

          {/* Emoji reaction pill */}
          <div
            className="reaction-pop"
            style={{
              marginTop: 4,
              padding: '2px 7px',
              borderRadius: 999,
              background: '#1F2C34',
              border: '1px solid rgba(134,150,160,0.22)',
              fontSize: 14,
              lineHeight: 1.5,
              userSelect: 'none',
              color: '#E9EDEF',
            }}
          >
            {reaction}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden reveal"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
        style={{ background: 'transparent' }}
      >
        <span className="font-bold pr-4 text-base" style={{ color: 'rgba(255,255,255,0.90)' }}>{q}</span>
        <span
          className="flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'none', color: 'rgba(255,255,255,0.40)', fontSize: 22, fontWeight: 300, lineHeight: 1 }}
        >
          +
        </span>
      </button>
      <div style={{ maxHeight: open ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div className="px-6 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm leading-relaxed pt-4" style={{ color: 'rgba(255,255,255,0.52)' }}>{a}</p>
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
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const [heroPreviewProduct, setHeroPreviewProduct] = useState<'spotify' | 'wordle' | 'roulette'>('spotify');
  const PRODUCT_KEYS = ['spotify', 'wordle', 'roulette'] as const;
  const productsPreview = PRODUCT_KEYS[activeProduct];

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
          background: linear-gradient(90deg, #FFFFFF, #FB7185, #E11D48, #FFFFFF);
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s ease infinite;
        }

        /* ── Marquee ── */
        @keyframes mLeft  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes mRight { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
        .reaction-pop { cursor: pointer; transition: transform 0.2s ease; }
        .reaction-pop:hover { transform: scale(1.12); }
        .reaction-pop:active { transform: scale(0.96); }
        @keyframes statsMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .stats-marquee {
          animation: statsMarquee 34s linear infinite;
        }
        .stats-edge-blur-left {
          background: linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.84) 24%, rgba(0,0,0,0.42) 62%, rgba(0,0,0,0) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          mask-image: linear-gradient(90deg, #000 0%, #000 72%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 72%, transparent 100%);
        }
        .stats-edge-blur-right {
          background: linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.84) 24%, rgba(0,0,0,0.42) 62%, rgba(0,0,0,0) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          mask-image: linear-gradient(270deg, #000 0%, #000 72%, transparent 100%);
          -webkit-mask-image: linear-gradient(270deg, #000 0%, #000 72%, transparent 100%);
        }

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
        <nav className="fixed left-0 right-0 top-4 z-50 px-4 sm:top-6">
          <div
            className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-[2rem] px-5 transition-all duration-300 sm:px-7"
            style={{
              background: scrolled
                ? 'rgba(12,12,15,0.78)'
                : 'rgba(12,12,15,0.62)',
              border: '1px solid var(--lp-line)',
              boxShadow: scrolled
                ? '0 22px 70px rgba(9, 9, 12, 0.34), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 18px 55px rgba(9, 9, 12, 0.22), inset 0 1px 0 rgba(255,255,255,0.1)',
              backdropFilter: 'var(--lp-blur)',
              WebkitBackdropFilter: 'var(--lp-blur)',
            }}
          >
            <Link href="/" className="flex items-center gap-3 no-underline">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 0 22px rgba(225,29,72,0.16)',
                }}
              >
                <img
                  src="/lovepanda-logo.png"
                  alt=""
                  className="h-6 w-6 object-contain"
                  draggable={false}
                />
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-white sm:text-base">
                LoveValentine
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {[
                ['Ver demo', '/demo'],
                ['Como funciona', '#como-funciona'],
                ['Produtos', '#produtos'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[15px] font-medium text-white/46 transition-colors duration-200 hover:text-white/82"
                >
                  {label}
                </Link>
              ))}
            </div>

            <Link
              href="/criar"
              className="block rounded-2xl px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] text-neutral-950 transition-all duration-200 hover:-translate-y-0.5 sm:px-5"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.97), rgba(232,232,235,0.95))',
                border: '1px solid rgba(255,255,255,0.74)',
                boxShadow: '0 12px 34px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.92)',
              }}
            >
              Criar presente
            </Link>
          </div>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 pb-16 pt-40 text-white sm:pt-44 lg:pt-36">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 22%, color-mix(in srgb, var(--lp-rose) 8%, transparent), transparent 22%), radial-gradient(circle at 74% 36%, color-mix(in srgb, var(--lp-red-deep) 8%, transparent), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 25%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.055]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          <div className="relative isolate mx-auto flex max-w-6xl flex-col items-center text-center">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[360px] sm:h-[460px]">
              <span className="absolute left-[-1%] top-[4%] text-6xl opacity-28 blur-[3px] sm:text-8xl lg:text-9xl">❤️</span>
              <span className="absolute right-[6%] top-[2%] text-5xl opacity-80 sm:text-7xl lg:text-8xl">💌</span>
              <span className="absolute left-[12%] top-[44%] text-6xl opacity-36 blur-[5px] sm:text-8xl lg:text-9xl">💖</span>
              <span className="absolute right-[-3%] top-[48%] text-7xl opacity-16 blur-[10px] sm:text-9xl lg:text-[10rem]">❤️</span>
              <span className="absolute left-[43%] top-[-14%] text-4xl opacity-72 sm:text-6xl lg:text-7xl">💕</span>
              <span className="absolute right-[30%] top-[30%] text-5xl opacity-22 blur-[4px] sm:text-7xl lg:text-8xl">💘</span>
              <span className="absolute left-[-2%] top-[72%] text-5xl opacity-72 sm:text-7xl lg:text-8xl">💝</span>
              <span className="absolute right-[20%] top-[78%] text-4xl opacity-28 blur-[3px] sm:text-6xl lg:text-7xl">❤️</span>
            </div>
            <h1 className="relative z-10 max-w-5xl text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-[5.8rem] lg:text-[8.25rem]">
              <span className="line-reveal" style={{ animationDelay: '0ms' }}>O presente que vai</span>
              <span className="line-reveal" style={{ animationDelay: '120ms' }}>fazer ela chorar</span>
              <span className="line-reveal" style={{ animationDelay: '240ms' }}>de felicidade</span>
            </h1>

            <p className="relative z-10 mt-8 max-w-2xl text-base font-medium leading-7 text-white/58 sm:text-lg">
              Crie uma página interativa com música, jogos e mensagens personalizadas.
              Envie o link e surpreenda quem você ama.
            </p>

            <div className="relative z-10 mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/criar"
                className="rounded-2xl px-7 py-4 text-center text-sm font-semibold tracking-[-0.01em] text-neutral-950 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(232,232,235,0.95))',
                  border: '1px solid rgba(255,255,255,0.74)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.44), inset 0 1px 0 rgba(255,255,255,0.94)',
                }}
              >
                Criar meu presente →
              </Link>
              <Link
                href="/demo"
                className="rounded-2xl border border-white/12 bg-white/[0.045] px-7 py-4 text-center text-sm font-semibold tracking-[-0.01em] text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.075] hover:text-white"
              >
                Ver demonstração
              </Link>
            </div>

            <div className="relative z-10 mt-12 w-full sm:mt-14">
              <div
                className="pointer-events-none absolute left-1/2 top-12 h-[400px] w-[min(70vw,320px)] -translate-x-1/2 rounded-[3rem] opacity-40 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 34% 24%, color-mix(in srgb, var(--lp-rose) 12%, transparent), transparent 22%), radial-gradient(circle at 70% 62%, color-mix(in srgb, var(--lp-red-deep) 12%, transparent), transparent 22%)',
                }}
              />
              <div className="relative flex justify-center">
                <LivePreview
                  base={HERO_PREVIEW_BASE}
                  spotify={HERO_PREVIEW_SPOTIFY}
                  extras={['wordle', 'roulette']}
                  wordle={HERO_PREVIEW_WORDLE}
                  roulette={HERO_PREVIEW_ROULETTE}
                  previewProduct={heroPreviewProduct}
                  onPreviewChange={setHeroPreviewProduct}
                  showProductTabs={false}
                  width={310}
                  scrollable
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar (counter) ───────────────────────────────────── */}
        <div
          ref={statsRef}
          className="relative overflow-hidden border-y border-white/10 bg-black"
        >

          <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-8 bg-black sm:w-10 lg:w-12" />
          <div className="stats-edge-blur-left pointer-events-none absolute inset-y-0 left-6 z-20 w-24 sm:left-8 sm:w-32 lg:left-10 lg:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-8 bg-black sm:w-10 lg:w-12" />
          <div className="stats-edge-blur-right pointer-events-none absolute inset-y-0 right-6 z-20 w-24 sm:right-8 sm:w-32 lg:right-10 lg:w-40" />
          <div className="relative py-9 md:py-7">
            <div className="stats-marquee flex w-max items-center gap-52 will-change-transform md:gap-56 lg:gap-72">
              {[0, 1].map((group) => (
                <div key={group} className="flex items-center gap-52 md:gap-56 lg:gap-72">
                  <div className="min-w-[260px] text-center md:min-w-[280px]">
                    <p className="text-2xl font-black text-white tabular-nums">+{count}</p>
                    <p className="text-[11px] text-white/48 font-medium">presentes criados</p>
                  </div>
                  <div className="min-w-[260px] text-center md:min-w-[280px]">
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-[11px] text-white/48 font-medium">sem app necessário</p>
                  </div>
                  <div className="min-w-[260px] text-center md:min-w-[280px]">
                    <p className="text-2xl font-black text-white">5min</p>
                    <p className="text-[11px] text-white/48 font-medium">para criar e enviar</p>
                  </div>
                  <div className="min-w-[260px] text-center md:min-w-[280px]">
                    <p className="text-2xl font-black text-white">❤️</p>
                    <p className="text-[11px] text-white/48 font-medium">histórias emocionantes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Como funciona ─────────────────────────────────────────── */}
        <section id="como-funciona" className="relative overflow-hidden bg-black py-16 text-white md:py-24">
          {/* Single stage light — one red ellipse at bottom-center, cards sit on top of it */}

          {/* Film grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/56">Simples assim</p>
              <h2 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">Pronto em 5 minutos</h2>
              <p className="mx-auto mt-5 max-w-md text-base font-medium leading-7 text-white/68">Você preenche, personaliza e o link está disponível na hora.</p>
            </div>

            {/* Bento grid — 2 rows × 6 cols at desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6 md:[grid-auto-rows:290px]">
              {([
                {
                  step: '01', title: 'Conte a história',
                  desc: 'Escolha os produtos e personalize com os dados de vocês.',
                  img: '/bento/bear-step-01.png',
                  cls: 'md:col-span-4',
                  wide: true,
                },
                {
                  step: '02', title: 'Personalize tudo',
                  desc: 'Fotos, música, palavras — cada detalhe é de vocês.',
                  img: '/bento/bear-step-02.png',
                  cls: 'md:col-span-2',
                  wide: false,
                },
                {
                  step: '03', title: 'Receba o link',
                  desc: 'O link único do presente fica disponível na hora.',
                  img: '/bento/bear-step-03.png',
                  cls: 'md:col-span-2',
                  wide: false,
                },
                {
                  step: '04', title: 'Emocione ela',
                  desc: 'Envie pelo WhatsApp e prepare-se para a reação.',
                  img: '/bento/bear-step-04.png',
                  cls: 'md:col-span-4',
                  wide: true,
                },
              ] as const).map(({ step, title, desc, img, cls, wide }) => (
                <div
                  key={step}
                  className={`relative min-h-[260px] overflow-hidden rounded-[1.75rem] border border-white/[0.12] p-6 backdrop-blur-xl sm:min-h-[260px] md:min-h-0 md:p-8 ${cls}`}
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.028) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.38)',
                  }}
                >
                  {/* Top edge highlight */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.22) 38%, rgba(255,255,255,0.12) 68%, transparent 95%)' }}
                  />
                  {/* Very subtle top ambient — neutral only */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.07),transparent_50%)]" />

                  {/* Bear illustration */}
                  <img
                    src={img}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className={`pointer-events-none absolute bottom-0 right-0 select-none object-contain ${wide ? 'h-40 w-40 sm:h-44 sm:w-44 md:h-[200px] md:w-[200px]' : 'h-40 w-40 sm:h-44 sm:w-44 md:h-44 md:w-44'}`}
                  />

                  {/* Text */}
                  <div className="relative flex h-full flex-col justify-between">
                    <span
                      className="inline-flex w-fit rounded-full px-2.5 py-[5px] text-[11px] font-semibold tracking-[0.1em] text-white/36"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                    >
                      {step}
                    </span>
                    <div className={wide ? 'max-w-[55%] md:max-w-[54%]' : 'max-w-[55%] md:max-w-[46%]'}>
                      <h3 className="mb-1.5 text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">{title}</h3>
                      <p className="text-[13px] font-medium leading-[1.7] text-white/54 sm:text-sm">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Produtos — Showcase ───────────────────────────────────── */}
        <section
          id="produtos"
          className="relative overflow-hidden bg-black py-16 text-white md:py-24"
          onMouseEnter={() => setAutoplay(false)}
        >
          {/* mesmos padrões do bento */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6">

            {/* Header — mesmo padrão do bento */}
            <div className="mx-auto mb-10 max-w-2xl text-center reveal md:mb-14">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/56">O que tem no presente</p>
              <h2 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">Produtos que emocionam</h2>
              <p className="mx-auto mt-5 max-w-md text-base font-medium leading-7 text-white/68">Escolha um ou combine todos no mesmo link.</p>
            </div>

            {/* Showcase — segmented control vem de dentro do LivePreview */}
            <div className="grid grid-cols-1 items-center gap-10 reveal lg:grid-cols-2 lg:gap-16">

              {/* LivePreview com tabs embutidas (mesmo componente do hero) */}
              <div className="flex justify-center">
                <LivePreview
                  base={HERO_PREVIEW_BASE}
                  spotify={HERO_PREVIEW_SPOTIFY}
                  extras={['wordle', 'roulette']}
                  wordle={HERO_PREVIEW_WORDLE}
                  roulette={HERO_PREVIEW_ROULETTE}
                  previewProduct={productsPreview}
                  onPreviewChange={(p) => {
                    setActiveProduct({ spotify: 0, wordle: 1, roulette: 2 }[p]);
                    setAutoplay(false);
                  }}
                  showProductTabs={true}
                  width={290}
                  scrollable
                />
              </div>

              {/* Info */}
              <div>
                <span
                  className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{
                    border: `1px solid ${LP_PRODUCTS[activeProduct].badgeColor}55`,
                    color: LP_PRODUCTS[activeProduct].badgeColor,
                    background: LP_PRODUCTS[activeProduct].badgeBg,
                  }}
                >
                  {LP_PRODUCTS[activeProduct].badge}
                </span>
                <h3 className="mb-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  {LP_PRODUCTS[activeProduct].name}
                </h3>
                <p className="mb-6 text-base font-medium leading-relaxed text-white/64 sm:text-lg">
                  {LP_PRODUCTS[activeProduct].desc}
                </p>
                <ul className="mb-8 space-y-3">
                  {LP_PRODUCTS[activeProduct].features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-white/78">
                      <span className="text-base text-[#E11D48]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Botões — mesmo estilo do hero */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={LP_PRODUCTS[activeProduct].demoUrl}
                    className="flex-1 rounded-2xl px-6 py-4 text-center text-sm font-semibold tracking-[-0.01em] text-neutral-950"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(232,232,235,0.95))',
                      border: '1px solid rgba(255,255,255,0.74)',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.44), inset 0 1px 0 rgba(255,255,255,0.94)',
                    }}
                  >
                    Ver demonstração →
                  </Link>
                  <Link
                    href="/criar"
                    className="flex-1 rounded-2xl border border-white/[0.12] bg-white/[0.045] px-6 py-4 text-center text-sm font-semibold tracking-[-0.01em] text-white/76 backdrop-blur-xl"
                  >
                    Criar meu presente
                  </Link>
                </div>
              </div>

            </div>

            <p className="mt-12 text-center text-sm font-medium text-white/36">
              Em breve: Galeria de fotos · Mapa estelar · Retrospectiva do casal
            </p>
          </div>
        </section>

        {/* ── Depoimentos — WhatsApp bubble marquee ───────────────── */}
        <section className="py-16 md:py-20 overflow-hidden relative" style={{ background: '#0B141A', backgroundImage: 'url(/bear-pattern.png)', backgroundSize: '600px auto', backgroundRepeat: 'repeat' }}>
          <div className="max-w-6xl mx-auto px-6 mb-10 md:mb-12 reveal relative z-10">
            <div className="text-center">
              <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Depoimentos</p>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: 'rgba(255,255,255,0.92)' }}>Eles já emocionaram alguém</h2>
            </div>
          </div>

          {/* fade masks left/right */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #141414, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #141414, transparent)' }} />

            {/* Row 1 — scroll left */}
            <div className="mb-2" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', width: 'max-content', animation: 'mLeft 34s linear infinite' }}>
                {[...T_ROW1, ...T_ROW1].map((t, i) => <WhatsAppBubble key={i} {...t} idx={i} />)}
              </div>
            </div>

            {/* Row 2 — scroll right */}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', width: 'max-content', animation: 'mRight 42s linear infinite' }}>
                {[...T_ROW2, ...T_ROW2].map((t, i) => <WhatsAppBubble key={i} {...t} idx={i + 4} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: '#030305' }}>
          <div className="max-w-2xl mx-auto px-6 relative z-10">
            <div className="text-center mb-10 md:mb-12 reveal">
              <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Dúvidas</p>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: 'rgba(255,255,255,0.92)' }}>Perguntas frequentes</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
            </div>
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────────────── */}
        <section className="py-28 md:py-44 relative overflow-hidden" style={{ background: '#030305' }}>
          {/* bokeh — soft rose light orbs */}
          <div className="absolute pointer-events-none rounded-full" style={{ width: 420, height: 420, top: '-15%', left: '-8%',  background: '#E11D48', opacity: 0.09, filter: 'blur(90px)' }} />
          <div className="absolute pointer-events-none rounded-full" style={{ width: 260, height: 260, top: '10%',  left: '8%',   background: '#E11D48', opacity: 0.07, filter: 'blur(60px)' }} />
          <div className="absolute pointer-events-none rounded-full" style={{ width: 360, height: 360, top: '-8%',  right: '-5%', background: '#E11D48', opacity: 0.10, filter: 'blur(80px)' }} />
          <div className="absolute pointer-events-none rounded-full" style={{ width: 180, height: 180, bottom: '5%', right: '10%', background: '#E11D48', opacity: 0.08, filter: 'blur(50px)' }} />
          <div className="absolute pointer-events-none rounded-full" style={{ width: 140, height: 140, bottom: '15%',left: '18%', background: '#FB7185', opacity: 0.06, filter: 'blur(45px)' }} />
          <div className="absolute pointer-events-none rounded-full" style={{ width: 300, height: 300, top: '45%', left: '42%', background: '#E11D48', opacity: 0.05, filter: 'blur(100px)' }} />
          {/* grain */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '180px' }} />

          {/* floating emojis — same pattern as hero */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0">
            <span className="absolute left-[2%]  top-[8%]  text-5xl sm:text-7xl opacity-25 blur-[3px]">❤️</span>
            <span className="absolute right-[5%] top-[5%]  text-4xl sm:text-6xl opacity-70">💌</span>
            <span className="absolute left-[10%] top-[50%] text-5xl sm:text-7xl opacity-30 blur-[4px]">💖</span>
            <span className="absolute right-[2%] top-[45%] text-6xl sm:text-8xl opacity-14 blur-[8px]">❤️</span>
            <span className="absolute left-[45%] top-[-8%] text-3xl sm:text-5xl opacity-60">💕</span>
            <span className="absolute right-[25%] top-[28%] text-4xl sm:text-6xl opacity-18 blur-[3px]">💘</span>
            <span className="absolute left-[3%]  bottom-[10%] text-4xl sm:text-6xl opacity-55">💝</span>
            <span className="absolute right-[18%] bottom-[8%] text-3xl sm:text-5xl opacity-22 blur-[2px]">❤️</span>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center reveal">
            {/* logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 36, height: 36,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <img src="/lovepanda-logo.png" alt="" className="h-5 w-5 object-contain" draggable={false} />
              </span>
              <span className="text-base font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.70)' }}>
                Love<span className="grad-text">Valentine</span>
              </span>
            </div>

            <p className="text-sm font-black uppercase tracking-widest mb-6" style={{ color: 'rgba(225,29,72,0.70)' }}>
              Não deixe pra depois
            </p>
            <h2 className="font-black leading-[1.02] mb-6" style={{
              fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)',
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.03em',
            }}>
              Ela merece um presente<br />que vai te lembrar pra sempre
            </h2>
            <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Crie agora, pronto em minutos. Sem app, sem complicação.
            </p>
            <Link
              href="/criar"
              className="block sm:inline-block w-full sm:w-auto px-10 py-4 text-base font-black text-center"
              style={{
                background: '#E11D48',
                color: '#fff',
                borderRadius: 999,
                boxShadow: '0 0 60px rgba(225,29,72,0.50), 0 8px 30px rgba(225,29,72,0.35), inset 0 1px 0 rgba(255,255,255,0.20)',
                letterSpacing: '-0.01em',
              }}
            >
              Criar meu presente agora →
            </Link>
            <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.20)' }}>
              Sem app · Link na hora · Funciona pelo WhatsApp
            </p>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="px-6 py-12" style={{ background: '#030305', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span
                className="grid place-items-center rounded-2xl"
                style={{
                  width: 56, height: 56,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 0 32px rgba(225,29,72,0.16)',
                }}
              >
                <img
                  src="/lovepanda-logo.png"
                  alt=""
                  className="h-9 w-9 object-contain"
                  draggable={false}
                />
              </span>
              <span className="text-2xl font-black tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                Love<span className="grad-text">Valentine</span>
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.30)' }}>
              © 2026 LoveValentine · Feito com ❤️ para quem ama de verdade
              <span className="mx-2" style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
              Feito por{' '}
              <a
                href="https://digitaldna.space"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                DNA Digital
              </a>
            </p>
            <div className="flex gap-6">
              <Link href="/demo" className="text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.40)' }}>Demo</Link>
              <Link href="/criar" className="text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.40)' }}>Criar presente</Link>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
