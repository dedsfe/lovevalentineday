'use client';

import Link from 'next/link';

const PRODUCTS = [
  {
    emoji: '🎵',
    name: 'Spotify Player',
    description: 'Uma música especial de vocês, com fotos, mensagem e os motivos pelos quais te amo.',
    color: '#1DB954',
    bg: '#0A2A16',
    href: '/demo',
  },
  {
    emoji: '💚',
    name: 'Wordle do Amor',
    description: 'Uma palavra secreta que só o amor de vocês vai descobrir. Com dica e mensagem surpresa.',
    color: '#4ADE80',
    bg: '#052e16',
    href: '/demo-wordle',
  },
  {
    emoji: '🎰',
    name: 'Roleta do Casal',
    description: 'Deixa a sorte decidir o programa do dia. Ela gira e descobre o que vão fazer juntos.',
    color: '#F43F5E',
    bg: '#1F0011',
    href: '/demo-roulette',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Escolha os produtos', desc: 'Spotify, Wordle, Roleta e muito mais. Adicione quantos quiser ao presente.' },
  { step: '02', title: 'Personalize tudo', desc: 'Coloque a música, as fotos, as palavras e as mensagens de vocês.' },
  { step: '03', title: 'Envie o link', desc: 'Gere um link único e mande pra ela pelo WhatsApp ou onde quiser.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-xl font-black text-ink tracking-tight">
          Love<span className="text-brand">Valentine</span>
        </span>
        <Link
          href="#criar"
          className="px-5 py-2.5 rounded-xl border-2 border-ink bg-brand text-white text-sm font-black neo-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
        >
          Criar presente
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink bg-brand-light text-brand text-xs font-black neo-shadow-sm">
            ❤️ Presente digital para casais
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight">
            O presente que ela<br />
            <span className="text-brand">nunca vai esquecer</span>
          </h1>

          <p className="text-lg text-ink-muted font-medium leading-relaxed max-w-md">
            Crie uma página interativa com música, jogos e mensagens personalizadas.
            Envie o link e surpreenda quem você ama.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#criar"
              id="criar"
              className="px-8 py-4 rounded-2xl border-2 border-ink bg-brand text-white text-base font-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all"
            >
              Criar meu presente →
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 rounded-2xl border-2 border-ink bg-white text-ink text-base font-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0A0A0A] transition-all"
            >
              Ver demonstração
            </Link>
          </div>

          <p className="text-xs text-ink-muted font-medium">
            ✅ Sem app · ✅ Funciona pelo WhatsApp · ✅ Pronto em minutos
          </p>
        </div>

        {/* Hero visual — fake phone */}
        <div className="relative flex justify-center">
          <div className="relative w-64 h-[520px] rounded-[36px] border-4 border-ink bg-[#0F172A] neo-shadow-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-col">
              <div className="px-5 pt-6 pb-4" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0e1020 100%)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-lg">🎵</div>
                  <div>
                    <div className="text-white text-xs font-black">Perfeitos Juntos</div>
                    <div className="text-white/50 text-[10px] font-medium">Luan Santana</div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {['#E11D48', '#7C3AED', '#0891B2'].map((c, i) => (
                    <div key={i} className="flex-1 h-16 rounded-xl" style={{ background: c, opacity: 0.7 + i * 0.1 }} />
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-[#111827] px-4 py-4 space-y-3">
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Mensagem especial</div>
                <div className="bg-brand/20 border border-brand/30 rounded-xl p-3">
                  <p className="text-white text-[10px] font-medium leading-relaxed">
                    Cada dia ao seu lado é um presente. Te amo mais do que palavras conseguem dizer. ❤️
                  </p>
                </div>
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider">3 motivos pelos quais te amo</div>
                {['Seu sorriso que ilumina tudo', 'Como você me faz rir', 'Simplesmente por ser você'].map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-brand text-[10px] mt-0.5">♥</span>
                    <span className="text-white/70 text-[10px] font-medium leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -left-4 top-20 bg-white border-2 border-ink rounded-2xl px-3 py-2 neo-shadow-sm rotate-[-4deg]">
            <p className="text-xs font-black">💚 Wordle</p>
            <p className="text-[10px] text-ink-muted font-medium">AMOR — 3 tentativas</p>
          </div>
          <div className="absolute -right-4 bottom-32 bg-white border-2 border-ink rounded-2xl px-3 py-2 neo-shadow-sm rotate-[3deg]">
            <p className="text-xs font-black">🎰 Roleta</p>
            <p className="text-[10px] text-ink-muted font-medium">Cinema 🎬</p>
          </div>
        </div>
      </section>

      {/* ── Como funciona ────────────────────────────────────────────── */}
      <section className="bg-subtle border-y-2 border-ink py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-ink">Como funciona?</h2>
            <p className="text-ink-muted font-medium mt-3">Tão fácil que você faz em 5 minutos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-3xl border-2 border-ink p-7 neo-shadow">
                <span className="text-5xl font-black text-brand/20 leading-none">{step}</span>
                <h3 className="text-lg font-black text-ink mt-2 mb-2">{title}</h3>
                <p className="text-sm text-ink-muted font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produtos ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-ink">O que tem no presente?</h2>
          <p className="text-ink-muted font-medium mt-3">Combine os produtos e monte o presente perfeito</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map(({ emoji, name, description, color, bg, href }) => (
            <Link
              key={name}
              href={href}
              className="group block rounded-3xl border-2 border-ink overflow-hidden neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-lg transition-all"
            >
              <div className="h-40 flex items-center justify-center" style={{ background: bg }}>
                <span className="text-6xl">{emoji}</span>
              </div>
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <h3 className="font-black text-ink text-base">{name}</h3>
                </div>
                <p className="text-sm text-ink-muted font-medium leading-relaxed">{description}</p>
                <p className="text-xs font-black mt-4 text-ink group-hover:text-brand transition-colors">
                  Ver demo →
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-ink-muted font-medium mt-8">
          Em breve: Galeria de fotos · Mapa estelar · Retrospectiva do casal
        </p>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-brand border-y-2 border-ink py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Ela vai amar.<br />Você sabe disso.
          </h2>
          <p className="text-white/75 font-medium mt-4 text-lg">
            Crie o presente agora e envie em minutos. Sem aplicativo, sem complicação.
          </p>
          <Link
            href="#criar"
            className="inline-block mt-8 px-10 py-5 rounded-2xl border-2 border-white bg-white text-brand text-lg font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.35)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.35)] transition-all"
          >
            Criar presente agora →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="px-6 py-8 text-center">
        <p className="text-xs text-ink-muted font-medium">
          © 2025 LoveValentine · Feito com ❤️ para quem ama de verdade
        </p>
      </footer>

    </main>
  );
}
