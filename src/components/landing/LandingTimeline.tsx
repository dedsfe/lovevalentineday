"use client";

import React, { useState } from 'react';
import { 
  Tv, 
  Clock, 
  Music, 
  Image as ImageIcon, 
  Moon, 
  QrCode, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Heart 
} from 'lucide-react';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

const slides = [
  {
    title: "Retrospectiva Animada",
    subtitle: "História em Movimento",
    description: "Uma animação cinematográfica estilo Spotify Wrapped, mostrando a jornada de vocês com animações e música sincronizada.",
    icon: Tv,
  },
  {
    title: "Contador do Amor",
    subtitle: "Tempo de União",
    description: "Um cronômetro animado que acompanha em tempo real quantos anos, meses, dias, horas, minutos e segundos vocês estão juntos.",
    icon: Clock,
  },
  {
    title: "Trilha Sonora Integrada",
    subtitle: "Música Tema",
    description: "Sua música tema favorita toca automaticamente em segundo plano, criando a atmosfera perfeita para a surpresa.",
    icon: Music,
  },
  {
    title: "Álbum Polaroid",
    subtitle: "Galeria de Fotos",
    description: "Suas fotos mais marcantes expostas em um design estilo Polaroid retrô, com legendas personalizadas para cada momento.",
    icon: ImageIcon,
  },
  {
    title: "Mapa das Estrelas",
    subtitle: "Céu do Encontro",
    description: "A posição exata das estrelas no céu na data e local em que vocês se conheceram ou começaram a namorar.",
    icon: Moon,
  },
  {
    title: "QR Code Romântico",
    subtitle: "Entrega Surpresa",
    description: "Gere um QR Code personalizado de alta qualidade para imprimir e colar no seu presente físico (caixa, carta, chaveiro).",
    icon: QrCode,
  }
];

export default function LandingTimeline() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderPhoneContent = (index: number) => {
    switch (index) {
      case 0: // Retrospectiva Animada
        return (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#1E1B4B] via-[#311042] to-[#0F0A15] p-6 text-white text-center font-sans">
            {/* Progress indicators */}
            <div className="flex gap-1 w-full pt-2">
              <div className="h-1 flex-1 bg-white/80 rounded-full"></div>
              <div className="h-1 flex-1 bg-white/30 rounded-full"></div>
              <div className="h-1 flex-1 bg-white/30 rounded-full"></div>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-grow gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Nossa História</span>
              <h4 className="text-xl font-extrabold leading-tight tracking-tight">O ano de <br/><span className="text-rose-500">2026</span> foi especial...</h4>
              <div className="relative w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/30 animate-pulse">
                <Heart className="h-8 w-8 text-rose-500 fill-current" />
              </div>
              <p className="text-[12px] text-gray-300 px-2 leading-snug">Passamos muitos momentos incríveis lado a lado.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 mb-4">
              <p className="text-[10px] text-rose-300 font-bold">Slide 1 de 5</p>
            </div>
          </div>
        );
      case 1: // Contador do Amor
        return (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 text-white text-center font-sans">
            <div className="pt-4">
              <Heart className="h-5 w-5 text-rose-500 fill-current mx-auto animate-bounce" />
            </div>
            
            <div className="flex flex-col items-center justify-center flex-grow gap-4">
              <p className="text-xs text-gray-400 font-medium">Estamos juntos há</p>
              
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-[160px]">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <p className="text-lg font-bold text-rose-400">4</p>
                  <p className="text-[8px] text-gray-400 uppercase">Anos</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <p className="text-lg font-bold text-rose-400">2</p>
                  <p className="text-[8px] text-gray-400 uppercase">Meses</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <p className="text-lg font-bold text-rose-400">18</p>
                  <p className="text-[8px] text-gray-400 uppercase">Dias</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <p className="text-lg font-bold text-rose-400">59</p>
                  <p className="text-[8px] text-gray-400 uppercase">Segs</p>
                </div>
              </div>
              
              <p className="text-[10px] text-gray-300">Cada segundo ao seu lado vale a pena!</p>
            </div>
            
            <div className="mb-4">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-rose-500 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 2: // Trilha Sonora Integrada
        return (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#181818] via-[#121212] to-[#050505] p-6 text-white text-center font-sans">
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-gray-400 font-medium">Tocando agora</span>
              <Music className="h-3 w-3 text-green-500 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center justify-center flex-grow gap-4">
              {/* Record / Album art placeholder */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-rose-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-black/40 animate-spin [animation-duration:8s]">
                <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-rose-500 fill-current" />
                </div>
              </div>
              
              <div>
                <h5 className="font-bold text-sm tracking-tight truncate max-w-[140px] mx-auto">Nossa Música</h5>
                <p className="text-[10px] text-gray-400 truncate max-w-[140px] mx-auto">Ed Sheeran - Perfect</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <div className="w-full flex flex-col gap-1">
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-green-500 rounded-full"></div>
                </div>
                <div className="flex justify-between text-[8px] text-gray-500">
                  <span>1:42</span>
                  <span>4:23</span>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <div className="w-2 h-2 border-t-2 border-r-2 border-gray-400 transform -rotate-[135deg]" />
                <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                  <div className="w-2.5 h-2.5 bg-black transform translate-x-[1px]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                </div>
                <div className="w-2 h-2 border-t-2 border-r-2 border-gray-400 transform rotate-45" />
              </div>
            </div>
          </div>
        );
      case 3: // Álbum Polaroid
        return (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-rose-50 to-rose-100 p-5 text-[#2D2638] text-center font-sans">
            <div className="pt-2">
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100/50">Nosso Álbum</span>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-grow pt-2">
              <div className="w-36 bg-white p-2 pb-5 shadow-xl border border-rose-100/50 rounded-sm transform -rotate-2">
                <div className="w-full h-20 bg-gradient-to-br from-rose-300 via-pink-200 to-rose-100 rounded-sm flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white/80" />
                </div>
                <p className={`${dancingScript.className} mt-2 text-xs font-bold text-gray-700`}>
                  Primeiro beijo ❤️
                </p>
              </div>
            </div>
            
            <div className="flex justify-center gap-1 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div>
            </div>
          </div>
        );
      case 4: // Mapa das Estrelas
        return (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#020617] to-[#0F172A] p-6 text-white text-center font-sans">
            <div className="pt-2">
              <span className="text-[9px] uppercase font-bold tracking-widest text-rose-400">O Céu daquela Noite</span>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-grow gap-3">
              <div className="relative w-24 h-24 rounded-full border border-white/20 bg-black/40 flex items-center justify-center overflow-hidden">
                <div className="absolute w-16 h-16 border border-dashed border-white/10 rounded-full"></div>
                <div className="absolute w-8 h-8 border border-dashed border-white/10 rounded-full"></div>
                <div className="absolute w-full h-[1px] bg-white/5 top-1/2 left-0"></div>
                <div className="absolute h-full w-[1px] bg-white/5 left-1/2 top-0"></div>
                
                <div className="absolute top-6 left-6 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-white/80 rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                <div className="absolute bottom-4 right-6 w-1 h-1 bg-white/80 rounded-full"></div>
                
                <Heart className="absolute top-1/3 right-1/4 h-2.5 w-2.5 text-rose-500 fill-current opacity-70" />
              </div>
              
              <p className="text-[9px] text-gray-300 font-medium leading-tight">12/06/2022 às 22h <br/>São Paulo, Brasil</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-1 mb-4">
              <p className="text-[9px] text-rose-300">Constelações em destaque</p>
            </div>
          </div>
        );
      case 5: // QR Code Romântico
        return (
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#FFF5F7] to-[#FFEDF2] p-6 text-[#2D2638] text-center font-sans">
            <div className="pt-2">
              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200/50">QR Code Surpresa</span>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-grow gap-2">
              <div className="bg-white p-2 rounded-2xl shadow-lg border border-rose-200/50 flex flex-col items-center gap-1">
                <div className="relative w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-1 border border-rose-500/15">
                  <QrCode className="h-16 w-16 text-gray-800" />
                  <div className="absolute w-4 h-4 bg-white rounded-full flex items-center justify-center border border-rose-500/10">
                    <Heart className="h-2 w-2 text-rose-500 fill-current" />
                  </div>
                </div>
              </div>
              
              <p className="text-[9px] text-gray-500 max-w-[120px] mx-auto leading-snug">
                Imprima e cole no presente físico
              </p>
            </div>
            
            <div className="bg-rose-500 text-white rounded-xl py-1.5 px-3 text-[10px] font-bold shadow-md shadow-rose-500/20 mb-4">
              Escaneie para Abrir
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const CurrentIcon = slides[activeSlide].icon;

  return (
    <section id="recursos" className="relative w-full overflow-hidden bg-[#FAFAFA] py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Esquerda: Carrossel de Celulares (CSS Mockup) */}
        <div className="relative flex w-full justify-center lg:w-1/2 perspective-1000 select-none">
          
          {/* Corações Decorativos */}
          <Heart className="absolute -left-4 top-10 z-20 h-16 w-16 -rotate-12 fill-rose-100 text-rose-100 opacity-80 pointer-events-none" />
          <Heart className="absolute bottom-10 right-4 z-20 h-14 w-14 rotate-12 fill-rose-200 text-rose-200 opacity-90 pointer-events-none" />
          <Heart className="absolute -right-8 top-1/4 z-20 h-16 w-16 rotate-12 fill-rose-100 text-rose-100 opacity-90 pointer-events-none" />
          <Heart className="absolute bottom-1/4 -left-8 z-20 h-12 w-12 -rotate-12 fill-rose-100 text-rose-100 opacity-80 pointer-events-none" />

          <div className="relative flex h-[500px] w-full max-w-[400px] items-center justify-center">
            
            {/* Celular Traseiro Esquerdo */}
            <div className="absolute left-0 z-10 h-[400px] w-[200px] -translate-x-4 -rotate-[15deg] transform rounded-[2rem] border-8 border-gray-900 bg-[#121212] shadow-xl opacity-60">
              <div className="h-full w-full opacity-30 bg-gradient-to-b from-gray-800 to-[#121212]" />
            </div>

            {/* Celular Traseiro Direito */}
            <div className="absolute right-0 z-10 h-[400px] w-[200px] translate-x-4 rotate-[15deg] transform rounded-[2rem] border-8 border-gray-900 bg-[#121212] shadow-xl opacity-60">
              <div className="h-full w-full opacity-30 bg-gradient-to-b from-gray-800 to-[#121212]" />
            </div>

            {/* Celular Central (Principal) */}
            <div className="relative z-30 h-[480px] w-[240px] overflow-hidden rounded-[2.5rem] border-[10px] border-gray-900 bg-[#121212] shadow-2xl">
              
              {/* Notch */}
              <div className="absolute left-1/2 top-0 z-40 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-900" />
              
              {/* Conteúdo Dinâmico */}
              <div className="h-full w-full overflow-hidden transition-all duration-300">
                {renderPhoneContent(activeSlide)}
              </div>
            </div>

            {/* Setas do Carrossel */}
            <button 
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="absolute left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-lg transition-transform hover:scale-110 active:scale-95 hover:text-gray-800"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              aria-label="Próximo slide"
              className="absolute right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-lg transition-transform hover:scale-110 active:scale-95 hover:text-gray-800"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
          </div>
        </div>

        {/* Direita: Textos e Controles */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          
          {/* Ícone Dinâmico */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E11D48] bg-white text-[#E11D48] shadow-sm transition-transform duration-300">
            <CurrentIcon className="h-6 w-6" />
          </div>

          <span className="text-[12px] font-bold uppercase tracking-widest text-[#E11D48] mb-2">
            {slides[activeSlide].subtitle}
          </span>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-[#2D2638] sm:text-5xl min-h-[48px] lg:min-h-0">
            {slides[activeSlide].title}
          </h2>
          
          <p className="mb-10 max-w-lg text-[17px] text-[#6B6475] sm:text-lg leading-relaxed min-h-[84px] lg:min-h-0">
            {slides[activeSlide].description}
          </p>

          {/* Controles do Carrossel */}
          <div className="mb-10 flex items-center gap-4">
            <button 
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] transition-all hover:bg-rose-100 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    activeSlide === index ? 'w-8 bg-[#E11D48]' : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              aria-label="Próximo slide"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] transition-all hover:bg-rose-100 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <Link
            href="#criar"
            className="group flex items-center justify-center gap-2 rounded-xl border-2 border-b-[4px] border-[#BE123C] bg-[#E11D48] px-8 py-3.5 text-[16px] font-bold text-white shadow-md shadow-[#E11D48]/25 transition-all hover:-translate-y-0.5 hover:bg-[#BE123C] w-full sm:w-auto active:scale-95"
          >
            Criar meu presente
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

        </div>
      </div>
    </section>
  );
}
