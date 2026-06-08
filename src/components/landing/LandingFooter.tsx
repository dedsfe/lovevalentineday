import React from 'react';
import Link from 'next/link';

const giftLinks = [
  { text: "Presente para Namorada(o)", href: "/presente-para-namorada" },
  { text: "Presente para Amiga", href: "/presente-para-amiga" },
  { text: "Presente para Mãe", href: "/presente-para-mae" },
  { text: "Presente para Avó", href: "/presente-para-avo" },
  { text: "Presente para Pai", href: "/presente-para-pai" },
  { text: "Presente para Esposa", href: "/presente-para-esposa" }
];

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function LandingFooter() {
  return (
    <footer className="w-full bg-white select-none border-t border-gray-100">
      
      {/* Seção Explore Mais Presentes */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-gray-100">
        <h3 className="text-xl font-bold text-[#2D2638] mb-2">Explore mais presentes</h3>
        <p className="text-sm text-[#6B6475] mb-6">Descubra outras formas de surpreender quem você ama</p>
        <div className="flex flex-wrap gap-2.5">
          {giftLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="inline-flex items-center px-4 py-2 rounded-xl border-2 border-b-[4px] border-gray-200 bg-rose-50/10 text-sm text-[#6B6475] hover:border-[#E11D48] hover:text-[#E11D48] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Principal do Footer */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6 mb-12">
          
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 inline-block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 shadow-sm">
                  <img 
                    alt="Love Valentine Logo" 
                    width="24" 
                    height="24" 
                    src="/bear/logo-transparent.png"
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-[#2D2638]">Love Valentine</span>
              </div>
            </Link>
            <p className="max-w-xs text-sm text-[#6B6475] leading-relaxed">
              Criamos experiências românticas e digitais únicas para eternizar seus melhores momentos com presentes virtuais personalizados.
            </p>
          </div>

          {/* Coluna Produto */}
          <div>
            <h4 className="mb-4 font-bold text-sm text-[#2D2638] uppercase tracking-wider text-[11px]">Produto</h4>
            <ul className="space-y-3">
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="#como-funciona">Como Funciona</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="#recursos">Recursos</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="#planos">Preços</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/criar?type=demo">Exemplo</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/criar">Criar Presente</Link></li>
            </ul>
          </div>

          {/* Coluna Presentes */}
          <div>
            <h4 className="mb-4 font-bold text-sm text-[#2D2638] uppercase tracking-wider text-[11px]">Presentes</h4>
            <ul className="space-y-3">
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/presente-para-namorada">Para Namorada(o)</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/presente-para-amiga">Para Amiga</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/presente-para-mae">Para Mãe</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/presente-para-pai">Para Pai</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/presente-para-avo">Para Avó</Link></li>
            </ul>
          </div>

          {/* Coluna Empresa */}
          <div>
            <h4 className="mb-4 font-bold text-sm text-[#2D2638] uppercase tracking-wider text-[11px]">Empresa</h4>
            <ul className="space-y-3">
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/sobre">Sobre Nós</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/blog">Blog</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/contato">Contato</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Coluna Legal */}
          <div>
            <h4 className="mb-4 font-bold text-sm text-[#2D2638] uppercase tracking-wider text-[11px]">Legal</h4>
            <ul className="space-y-3">
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/termos">Termos de Uso</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/privacidade">Privacidade</Link></li>
              <li><Link className="text-sm text-[#6B6475] transition-colors hover:text-[#E11D48]" href="/cookies">Cookies</Link></li>
            </ul>
          </div>

        </div>

        {/* Rodapé e Redes Sociais */}
        <div className="flex flex-col items-center justify-between gap-6 pt-8 border-t border-gray-100 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-[#6B6475] font-medium">© 2026 Love Valentine. Todos os direitos reservados.</p>
            <p className="text-xs text-[#6B6475]/70 mt-1">
              LOVE VALENTINE LTDA &bull; CNPJ: 60.623.888/0001-40 &bull; Pires do Rio/GO
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com/lovevalentineday" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-b-[4px] border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-[#E11D48] hover:text-[#E11D48] transition-all duration-200"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>

    </footer>
  );
}
