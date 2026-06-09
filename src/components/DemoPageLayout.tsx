import Link from 'next/link';
import { ReactNode } from 'react';
import { PhoneMockup } from '@/components/PhoneMockup';

interface Feature  { emoji: string; title: string; desc: string }
interface OtherDemo { href: string; emoji: string; label: string }

interface Props {
  badge:        string;
  badgeColor:   string;
  badgeBg:      string;
  heroGradient: string;
  title:        string;
  tagline:      string;
  features:     Feature[];
  otherDemos:   OtherDemo[];
  children:     ReactNode;
}

export function DemoPageLayout({
  badge, badgeColor, badgeBg, heroGradient,
  title, tagline, features, otherDemos, children,
}: Props) {
  return (
    <>
      <style>{`
        .demo-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 2px solid #0A0A0A;
        }
        .demo-grad {
          background: linear-gradient(135deg, #E11D48, #FB7185);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="demo-nav px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-black text-xl text-ink tracking-tight shrink-0">
          Love<span className="demo-grad">Valentine</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/#produtos" className="hidden sm:block text-sm font-bold text-ink/50 hover:text-ink transition-colors">
            ← Produtos
          </Link>
          <Link
            href="#criar"
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-black border-2 border-ink shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0A0A0A] transition-all whitespace-nowrap"
          >
            Criar meu presente →
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="px-4 py-12 sm:py-16 text-center" style={{ background: heroGradient }}>
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-5"
          style={{ border: `1px solid ${badgeColor}55`, color: badgeColor, background: badgeBg }}
        >
          {badge}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          {title}
        </h1>
        <p className="text-white/60 text-base sm:text-lg font-medium max-w-md mx-auto">
          {tagline}
        </p>
      </div>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="py-12 sm:py-16" style={{ background: '#F8F4F0' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-start">

            {/* Phone mockup — produto renderiza em tamanho natural, sem scale */}
            <div className="flex justify-center lg:sticky lg:top-[80px]">
              <PhoneMockup maxWidth={390} screenHeight="auto">
                {children}
              </PhoneMockup>
            </div>

            {/* Info panel */}
            <div className="space-y-5">

              {/* Features card */}
              <div className="bg-white border-2 border-ink rounded-3xl p-6 sm:p-7 shadow-[4px_4px_0px_0px_#0A0A0A]">
                <p className="text-[11px] font-black text-ink/40 uppercase tracking-widest mb-5">
                  O que você vai receber
                </p>
                <ul className="space-y-4">
                  {features.map(f => (
                    <li key={f.title} className="flex gap-4">
                      <span className="text-2xl shrink-0 mt-0.5">{f.emoji}</span>
                      <div>
                        <p className="font-black text-ink text-sm">{f.title}</p>
                        <p className="text-sm text-ink/55 font-medium mt-0.5">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA card */}
              <div
                id="criar"
                className="bg-brand border-2 border-ink rounded-3xl p-6 sm:p-7 text-center shadow-[4px_4px_0px_0px_#0A0A0A]"
              >
                <p className="text-xl font-black text-white mb-2">Gostou? Crie o seu agora.</p>
                <p className="text-white/70 text-sm font-medium mb-6">
                  Pronto em minutos · Sem app · Link na hora
                </p>
                <Link
                  href="/"
                  className="block bg-white text-brand font-black text-base rounded-2xl border-2 border-white px-6 py-4 hover:bg-white/90 transition-colors"
                >
                  Criar meu presente →
                </Link>
              </div>

              {/* Ver também */}
              <div>
                <p className="text-[11px] font-black text-ink/40 uppercase tracking-widest mb-3">
                  Ver também
                </p>
                <div className="flex flex-wrap gap-3">
                  {otherDemos.map(d => (
                    <Link
                      key={d.href}
                      href={d.href}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-ink rounded-full text-sm font-black shadow-[2px_2px_0px_0px_#0A0A0A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#0A0A0A] transition-all"
                    >
                      {d.emoji} {d.label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-ink px-6 py-8 text-center">
        <Link href="/" className="font-black text-lg text-white tracking-tight">
          Love<span className="demo-grad">Valentine</span>
        </Link>
        <p className="text-white/30 text-xs font-medium mt-2">© 2025 LoveValentine · Feito com ❤️</p>
      </footer>
    </>
  );
}
