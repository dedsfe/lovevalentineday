'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    emoji: '🎵',
    tag: 'Mais popular',
    name: 'Spotify Player',
    desc: 'Uma música especial de vocês, com as fotos do casal, mensagem e os motivos pelos quais você a ama — tudo em uma única tela emocionante.',
    color: '#1DB954',
    bg: 'linear-gradient(135deg, #0A2A16 0%, #0d1f10 100%)',
    href: '/demo',
  },
  {
    emoji: '💚',
    tag: 'Divertido',
    name: 'Wordle do Amor',
    desc: 'Uma palavra secreta que só quem te conhece vai descobrir. Com dica personalizada e mensagem surpresa ao acertar.',
    color: '#4ADE80',
    bg: 'linear-gradient(135deg, #052e16 0%, #041a0d 100%)',
    href: '/demo-wordle',
  },
  {
    emoji: '🎰',
    tag: 'Interativo',
    name: 'Roleta do Casal',
    desc: 'Deixa a sorte decidir o programa do dia. Ela gira a roleta e descobre o que vocês vão fazer juntos.',
    color: '#F43F5E',
    bg: 'linear-gradient(135deg, #3f0018 0%, #1a000a 100%)',
    href: '/demo-roulette',
  },
];

const TESTIMONIALS = [
  { name: 'Lucas M.', role: 'Namorado', quote: 'Minha namorada chorou quando abriu. Ela ficou me abraçando por horas. Melhor presente que já dei na vida.', stars: 5 },
  { name: 'Fernanda R.', role: 'Esposa', quote: 'Recebi do meu marido no nosso aniversário de 5 anos. Assisti umas 10 vezes seguidas. Simplesmente perfeito.', stars: 5 },
  { name: 'Marcos A.', role: 'Namorado', quote: 'Fiz em 10 minutos e ficou incrível. Ela não acreditou que eu tinha feito. Recomendo muito!', stars: 5 },
  { name: 'Juliana C.', role: 'Namorada', quote: 'O Wordle com a palavra que a gente tem entre a gente foi demais. Ela ficou tentando adivinhar com um sorriso no rosto.', stars: 5 },
  { name: 'Pedro H.', role: 'Marido', quote: 'A roleta foi uma surpresa. Ela girou e caiu em "jantar surpresa" — que eu já tinha combinado. Ela ficou chocada!', stars: 5 },
  { name: 'Ana Clara S.', role: 'Namorada', quote: 'A música com as nossas fotos e a mensagem dele me fez chorar. Faz anos que não recebo algo tão especial.', stars: 5 },
];

const FAQS = [
  { q: 'Precisa baixar algum aplicativo?', a: 'Não! O presente funciona direto pelo navegador. Você envia o link pelo WhatsApp e ela abre no próprio celular, sem instalar nada.' },
  { q: 'Quanto tempo leva para criar?', a: 'A maioria das pessoas cria em menos de 10 minutos. Você preenche os dados, personaliza e o link já fica disponível na hora.' },
  { q: 'O link expira?', a: 'Não. O link do presente fica disponível para sempre. Ela pode abrir quantas vezes quiser, a qualquer momento.' },
  { q: 'Posso adicionar mais de um produto ao mesmo presente?', a: 'Sim! Você pode combinar Spotify Player, Wordle, Roleta e todos os outros produtos em um único link para ela.' },
  { q: 'Funciona para qualquer data especial?', a: 'Claro! Aniversário de namoro, Dia dos Namorados, Natal, aniversário dela — funciona para qualquer ocasião.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-ink rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-subtle transition-colors"
      >
        <span className="font-black text-ink text-base pr-4">{q}</span>
        <span className="text-2xl text-ink-muted flex-shrink-0 font-light leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-ink-muted font-medium text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-ink">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <span className="text-xl font-black text-ink tracking-tight">
            Love<span className="text-brand">Valentine</span>
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

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-ink neo-shadow-sm text-xs font-black text-ink">
              ❤️ <span>+500 presentes enviados essa semana</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight">
              O presente que vai<br />
              fazer ela <span className="text-brand relative">
                chorar
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                  <path d="M0 5 Q50 0 100 5" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span> de felicidade
            </h1>

            <p className="text-lg text-ink-muted font-medium leading-relaxed max-w-lg">
              Crie um presente digital com a música de vocês, fotos, jogos e mensagens personalizadas.
              Pronto em minutos. Ela abre pelo WhatsApp, sem baixar nada.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#criar"
                id="criar"
                className="px-8 py-4 rounded-2xl border-2 border-ink bg-brand text-white text-base font-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-lg transition-all"
              >
                Criar presente agora →
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 rounded-2xl border-2 border-ink bg-white text-ink text-base font-black neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-lg transition-all"
              >
                Ver demonstração
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {['#E11D48','#7C3AED','#0891B2','#059669','#D97706'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-black" style={{ background: c, zIndex: 5 - i }}>
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

          {/* Phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main phone */}
              <div className="w-[260px] h-[520px] rounded-[40px] border-4 border-ink bg-[#0A0A12] neo-shadow-lg overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

                <div className="absolute inset-0 flex flex-col pt-8">
                  {/* Player area */}
                  <div className="px-4 pt-2 pb-3 flex-shrink-0" style={{ background: 'linear-gradient(180deg, #2D1B4E 0%, #1a1030 100%)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand/30 flex items-center justify-center text-sm">🎵</div>
                      <div className="min-w-0">
                        <div className="text-white text-[11px] font-black truncate">Perfeitos Juntos</div>
                        <div className="text-white/50 text-[9px]">Luan Santana</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {['#E11D48','#9333EA','#0891B2'].map((c, i) => (
                        <div key={i} className="flex-1 h-14 rounded-lg" style={{ background: c, opacity: 0.75 + i * 0.08 }} />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-[#111827] px-3 py-3 space-y-2.5 overflow-hidden">
                    <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Mensagem especial</div>
                    <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-2.5">
                      <p className="text-white text-[9px] leading-relaxed font-medium">
                        Cada dia ao seu lado é um presente que eu não merecia, mas sou grato por ter. Te amo. ❤️
                      </p>
                    </div>
                    <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">3 motivos pelos quais te amo</div>
                    {['Seu sorriso que ilumina tudo', 'Como você me faz rir nos piores dias', 'Por simplesmente ser você'].map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-brand text-[9px] mt-0.5 flex-shrink-0">♥</span>
                        <span className="text-white/70 text-[9px] leading-relaxed">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating card — wordle */}
              <div className="absolute -left-16 top-16 bg-white border-2 border-ink rounded-2xl p-3 neo-shadow rotate-[-5deg] w-36">
                <p className="text-[10px] font-black text-ink mb-1.5">💚 Wordle do Amor</p>
                <div className="flex gap-1">
                  {['A','M','O','R'].map((l, i) => (
                    <div key={i} className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
                      <span className="text-white text-[9px] font-black">{l}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-ink-muted mt-1.5">Acertou em 2 tentativas! 🎉</p>
              </div>

              {/* Floating card — roleta */}
              <div className="absolute -right-14 bottom-28 bg-white border-2 border-ink rounded-2xl p-3 neo-shadow rotate-[4deg] w-32">
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

      {/* ── Social proof bar ─────────────────────────────────────────── */}
      <div className="border-y-2 border-ink bg-brand">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { n: '+500', label: 'presentes criados' },
            { n: '100%', label: 'sem app necessário' },
            { n: '5min', label: 'para criar e enviar' },
            { n: '❤️', label: 'histórias emocionantes' },
          ].map(({ n, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-white">{n}</p>
              <p className="text-[11px] text-white/70 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Como funciona ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Simples assim</p>
            <h2 className="text-4xl font-black text-ink">Pronto em 5 minutos</h2>
            <p className="text-ink-muted font-medium mt-3 max-w-md mx-auto">
              Você preenche, personaliza e o link já está disponível para enviar.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', emoji: '✍️', title: 'Conte a história', desc: 'Escolha os produtos e personalize com os dados de vocês dois.' },
              { step: '02', emoji: '🎨', title: 'Personalize tudo', desc: 'Fotos, música, palavras, mensagens — cada detalhe é de vocês.' },
              { step: '03', emoji: '🔗', title: 'Receba o link', desc: 'Após confirmar, o link único do presente fica disponível na hora.' },
              { step: '04', emoji: '💌', title: 'Emocione ela', desc: 'Envie pelo WhatsApp e prepare-se para a reação inesquecível.' },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="relative bg-white rounded-3xl border-2 border-ink p-6 neo-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-4xl font-black text-brand/15 leading-none">{step}</span>
                </div>
                <h3 className="font-black text-ink text-base mb-2">{title}</h3>
                <p className="text-sm text-ink-muted font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produtos ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-subtle border-y-2 border-ink">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">O que tem no presente</p>
            <h2 className="text-4xl font-black text-ink">Combine e surpreenda</h2>
            <p className="text-ink-muted font-medium mt-3 max-w-md mx-auto">
              Adicione quantos produtos quiser no mesmo presente. Cada um é uma surpresa diferente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map(({ emoji, tag, name, desc, bg, color, href }) => (
              <div key={name} className="group rounded-3xl border-2 border-ink overflow-hidden bg-white neo-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-lg transition-all">
                {/* Preview area */}
                <div className="h-44 flex flex-col items-center justify-center gap-3 relative" style={{ background: bg }}>
                  <span className="text-5xl">{emoji}</span>
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-black border"
                    style={{ borderColor: color + '50', color, background: color + '15' }}
                  >
                    {tag}
                  </span>
                </div>
                {/* Body */}
                <div className="p-6">
                  <h3 className="font-black text-ink text-lg mb-2">{name}</h3>
                  <p className="text-sm text-ink-muted font-medium leading-relaxed mb-4">{desc}</p>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-brand border-b-2 border-brand pb-0.5 hover:gap-2.5 transition-all"
                  >
                    Ver demonstração →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-ink bg-white neo-shadow-sm">
              <span className="text-sm font-black text-ink">Em breve:</span>
              <span className="text-sm text-ink-muted font-medium">Galeria de fotos · Mapa estelar · Retrospectiva do casal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Depoimentos</p>
            <h2 className="text-4xl font-black text-ink">Eles já emocionaram alguém</h2>
            <p className="text-ink-muted font-medium mt-3">Histórias reais de quem usou o Love Valentine</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, quote, stars }) => (
              <div key={name} className="bg-white border-2 border-ink rounded-3xl p-6 neo-shadow">
                <Stars n={stars} />
                <p className="text-sm text-ink font-medium leading-relaxed mt-3 mb-5">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-ink/10">
                  <div className="w-9 h-9 rounded-full bg-brand/10 border-2 border-ink flex items-center justify-center text-sm font-black text-brand">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink">{name}</p>
                    <p className="text-[11px] text-ink-muted font-medium">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-subtle border-y-2 border-ink">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-black uppercase tracking-widest mb-3">Dúvidas</p>
            <h2 className="text-4xl font-black text-ink">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="py-24 bg-brand border-b-2 border-ink relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <p className="text-white/70 text-sm font-black uppercase tracking-widest mb-4">Não deixe pra depois</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
            Ela merece um presente<br />que vai te lembrar pra sempre
          </h2>
          <p className="text-white/75 font-medium text-lg mb-10 max-w-lg mx-auto">
            Crie agora, pronto em minutos. Sem app, sem complicação.
            Só você, ela e um presente que vai emocionar.
          </p>
          <Link
            href="#criar"
            className="inline-block px-10 py-5 rounded-2xl border-2 border-white bg-white text-brand text-lg font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all"
          >
            Criar meu presente agora →
          </Link>
          <p className="text-white/50 text-xs font-medium mt-6">✅ Sem app &nbsp;·&nbsp; ✅ Link na hora &nbsp;·&nbsp; ✅ Funciona pelo WhatsApp</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="px-6 py-10 bg-ink">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black text-white tracking-tight">
            Love<span className="text-brand">Valentine</span>
          </span>
          <p className="text-sm text-white/40 font-medium">
            © 2025 LoveValentine · Feito com ❤️ para quem ama de verdade
          </p>
          <div className="flex gap-6">
            <Link href="/demo" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Demo</Link>
            <Link href="#criar" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Criar presente</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
