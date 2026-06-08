import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowUpRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default function LandingTimeline() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFA] py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Esquerda: Carrossel de Celulares (CSS Mockup) */}
        <div className="relative flex w-full justify-center lg:w-1/2 perspective-1000">
          
          {/* Corações Decorativos */}
          <Heart className="absolute -left-4 top-10 z-20 h-16 w-16 -rotate-12 fill-[#D8B4FE] text-[#D8B4FE] opacity-80" />
          <Heart className="absolute bottom-10 right-4 z-20 h-14 w-14 rotate-12 fill-[#C084FC] text-[#C084FC] opacity-90" />
          <Heart className="absolute -right-8 top-1/4 z-20 h-16 w-16 rotate-12 fill-[#E9D5FF] text-[#E9D5FF] opacity-90" />
          <Heart className="absolute bottom-1/4 -left-8 z-20 h-12 w-12 -rotate-12 fill-[#D8B4FE] text-[#D8B4FE] opacity-80" />

          <div className="relative flex h-[500px] w-full max-w-[400px] items-center justify-center">
            
            {/* Celular Traseiro Esquerdo */}
            <div className="absolute left-0 z-10 h-[400px] w-[200px] -translate-x-4 -rotate-[15deg] transform rounded-[2rem] border-8 border-gray-900 bg-[#121212] shadow-xl opacity-60">
              <div className="h-full w-full opacity-30 bg-gradient-to-b from-gray-800 to-[#121212]"></div>
            </div>

            {/* Celular Traseiro Direito */}
            <div className="absolute right-0 z-10 h-[400px] w-[200px] translate-x-4 rotate-[15deg] transform rounded-[2rem] border-8 border-gray-900 bg-[#121212] shadow-xl opacity-60">
              <div className="h-full w-full opacity-30 bg-gradient-to-b from-gray-800 to-[#121212]"></div>
            </div>

            {/* Celular Central (Principal) */}
            <div className="relative z-30 h-[480px] w-[240px] overflow-hidden rounded-[2.5rem] border-[10px] border-gray-900 bg-[#121212] shadow-2xl">
              
              {/* Notch */}
              <div className="absolute left-1/2 top-0 z-40 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-900" />
              
              {/* Tela: Linha do Tempo */}
              <div className="flex h-full w-full flex-col items-center overflow-hidden py-8 px-4">
                
                {/* Polaroid 1 (Topo) */}
                <div className="relative mb-6 w-[85%] -rotate-3 rounded-md bg-white p-2 pb-6 shadow-md">
                  <div className="h-28 w-full bg-cover bg-center rounded-sm" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")' }} />
                  <p className={`${dancingScript.className} absolute bottom-1 left-0 w-full text-center text-[15px] font-bold text-gray-800`}>
                    Nossa viagem
                  </p>
                </div>

                {/* Linha do tempo visual (tracejada) */}
                <div className="absolute left-[15%] top-32 bottom-0 w-0.5 border-l-2 border-dashed border-gray-700 -z-10" />

                {/* Polaroid 2 (Meio) */}
                <div className="relative ml-8 w-[85%] rotate-2 rounded-md bg-white p-2 pb-6 shadow-md">
                  <div className="h-28 w-full bg-cover bg-center rounded-sm" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")' }} />
                  <p className={`${dancingScript.className} absolute bottom-1 left-0 w-full text-center text-[15px] font-bold text-gray-800`}>
                    Pedido de namoro
                  </p>
                </div>

              </div>
            </div>

            {/* Setas do Carrossel flutuando no celular central */}
            <button className="absolute left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-lg transition-transform hover:scale-110 hover:text-gray-600">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button className="absolute right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-lg transition-transform hover:scale-110 hover:text-gray-600">
              <ChevronRight className="h-6 w-6" />
            </button>
            
          </div>
        </div>

        {/* Direita: Textos e Controles */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          
          {/* Ícone */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#A855F7] bg-white text-[#A855F7] shadow-sm">
            <Calendar className="h-6 w-6" />
          </div>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-[#2D2638] sm:text-5xl">
            Linha do Tempo
          </h2>
          
          <p className="mb-10 max-w-lg text-[17px] text-[#6B6475] sm:text-lg leading-relaxed">
            Reviva sua jornada com uma linha do tempo animada e elegante, destacando os marcos mais importantes da sua história.
          </p>

          {/* Controles do Carrossel (Apenas UI) */}
          <div className="mb-10 flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F0FF] text-[#A855F7] transition-colors hover:bg-[#E9D5FF]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-8 rounded-full bg-[#A855F7]"></div>
              {[1, 2, 3, 4, 5, 6].map((dot) => (
                <div key={dot} className="h-2 w-2 rounded-full bg-gray-200"></div>
              ))}
            </div>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F0FF] text-[#A855F7] transition-colors hover:bg-[#E9D5FF]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <Link
            href="#criar"
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#A855F7] px-8 py-3.5 text-[16px] font-bold text-white shadow-md shadow-[#A855F7]/25 transition-all hover:-translate-y-0.5 hover:bg-[#9333EA] w-full sm:w-auto"
          >
            Criar meu presente
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

        </div>
      </div>
    </section>
  );
}
