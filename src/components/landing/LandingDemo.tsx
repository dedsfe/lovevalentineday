import React from 'react';
import { Play, Heart, Music, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function LandingDemo() {
  return (
    <section id="demo" className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Banner Container */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-[#E11D48] to-red-600 px-6 py-16 text-center shadow-xl shadow-rose-500/20 sm:px-12 sm:py-20 md:px-16 select-none">
          
          {/* Círculos de Brilho de Fundo */}
          <div className="absolute -left-16 -top-16 z-0 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 z-0 h-64 w-64 rounded-full bg-rose-400/20 blur-2xl pointer-events-none" />
          
          {/* Corações Flutuantes */}
          <Heart className="absolute left-[10%] top-[20%] h-8 w-8 text-white/20 fill-current animate-pulse rotate-12" />
          <Heart className="absolute right-[12%] bottom-[20%] h-10 w-10 text-white/15 fill-current animate-bounce -rotate-12" />

          {/* Conteúdo */}
          <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center">
            
            <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Teste Nossa <br className="sm:hidden" />
              <strong className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-white">
                Demo Interativa
              </strong>
            </h2>
            
            <p className="mt-4 max-w-lg text-sm sm:text-base md:text-lg text-white/95 leading-relaxed">
              Explore uma página de demonstração e veja exatamente como fica a retrospectiva animada, as fotos e o visual no celular.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/criar?type=demo"
                className="group flex h-14 w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-b-[4px] border-rose-100 bg-white px-8 font-bold text-[#E11D48] transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lg active:scale-95"
              >
                <Play className="mr-2 h-5 w-5 fill-current text-[#E11D48]" />
                Explorar a Demo
              </Link>
              <span className="text-xs text-white/80 font-medium">
                Não é necessário cadastro ou pagamento.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
