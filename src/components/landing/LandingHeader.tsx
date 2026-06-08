'use client';

import React, { useState } from 'react';
import { Menu, X, Gift, Languages, LogIn } from 'lucide-react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Criar', href: '#criar' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Sobre Nós', href: '#sobre-nos' },
];

export default function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 flex flex-col w-full">
      {/* 1. Barra superior promocional */}
      <div className="flex items-center justify-center bg-[#A855F7] px-4 py-2.5 md:h-[40px]">
        <p className="text-center text-[12px] md:text-[14px] font-semibold text-white tracking-wide">
          +100.000 pessoas já fizeram alguém chorar de emoção. Garanta a sua surpresa em 5 minutos.
        </p>
      </div>

      {/* 2. Header principal */}
      <div className="relative flex h-[64px] md:h-[72px] w-full items-center justify-center bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Esquerda: Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Gift className="h-7 w-7 text-[#2D2638]" />
            <span className="text-[22px] font-bold tracking-tight text-[#2D2638]">
              LoveGift
            </span>
          </Link>

          {/* Centro: Navegação Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-semibold text-[#6B6475] transition-colors hover:text-[#2D2638]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Direita: Ações Desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Botão Idioma */}
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#2D2638] transition-colors hover:bg-gray-200">
              <Languages className="h-[18px] w-[18px]" />
            </button>
            
            {/* Botão Login */}
            <button className="flex h-10 items-center gap-2 rounded-full bg-[#F3F4F6] px-5 text-[14px] font-bold text-[#2D2638] transition-colors hover:bg-gray-200">
              <LogIn className="h-[18px] w-[18px]" />
              Fazer Login
            </button>
          </div>

          {/* Mobile: Menu Hamburguer */}
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center p-2 text-[#2D2638] md:hidden transition-colors hover:bg-gray-100 rounded-md"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 3. Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full flex w-full flex-col bg-white px-4 py-6 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#2D2638] transition-colors hover:text-[#A855F7]"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="my-2 h-px w-full bg-gray-100"></div>
              
              <button className="flex items-center gap-3 text-lg font-bold text-[#2D2638] transition-colors hover:text-[#A855F7]">
                <Languages className="h-5 w-5" />
                <span>Mudar Idioma</span>
              </button>
              
              <button className="flex items-center gap-3 text-left text-lg font-bold text-[#2D2638] transition-colors hover:text-[#A855F7]">
                <LogIn className="h-5 w-5" />
                Fazer Login
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
