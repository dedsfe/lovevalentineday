import React from 'react';
import { ArrowUpRight, Star, Play, SkipBack, SkipForward, Shuffle, Repeat, Heart, Gift, Music } from 'lucide-react';
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Glows (Mais suaves como a referência) */}
      <div className="absolute left-[80%] top-[-10%] -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-rose-100 opacity-40 blur-[120px]" />
      <div className="absolute left-[-10%] bottom-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-rose-50 opacity-30 blur-[100px]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-100 opacity-20 blur-[80px]" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        
        {/* Esquerda: Conteúdo de Texto */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          
          {/* Tag Promocional */}
          <div className="mb-6 inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-[13px] font-semibold text-[#E11D48] shadow-sm">
            O presente que emociona, pronto em 5 minutos.
          </div>

          {/* Título Principal */}
          <h1 className="mb-4 text-[42px] font-bold leading-[1.1] tracking-tight text-[#2D2638] sm:text-6xl lg:text-[64px]">
            Declare seu amor <br className="hidden lg:block" />
            <span className={`${dancingScript.className} text-[#E11D48] font-bold text-[50px] sm:text-[70px] lg:text-[80px] block mt-1`}>
              de forma única.
            </span>
          </h1>

          {/* Descrição */}
          <p className="mb-8 max-w-lg text-[17px] font-medium text-[#6B6475] sm:text-lg leading-relaxed">
            Crie um presente digital com fotos, música e uma retrospectiva animada no estilo do app de músicas. Pronto em 5 minutos.
          </p>

          {/* Botão de Ação */}
          <Link
            href="/criar"
            className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-b-[4px] border-[#BE123C] bg-[#E11D48] px-8 py-4 text-[17px] font-bold text-white shadow-lg shadow-[#E11D48]/25 transition-all hover:-translate-y-0.5 hover:bg-[#BE123C] w-full sm:w-auto active:scale-95"
          >
            Criar presente agora ↗
          </Link>

          {/* Prova Social */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-sm bg-gray-200">
              <div className="h-full w-full bg-gradient-to-tr from-rose-400 to-rose-500 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white fill-current" />
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2D2638]">Marcos</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-[#E11D48] text-[#E11D48]" />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-sm text-[#6B6475]">
                "Criei em cinco minutos e ficou incrível. Minha namorada amou!"
              </p>
            </div>
          </div>
        </div>

        {/* Direita: Mockup de Celulares */}
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end mt-16 lg:mt-0 perspective-1000 select-none">
          
          {/* Corações Decorativos Flutuantes (Posições da referência) */}
          <Heart className="absolute top-0 right-[60%] z-20 h-16 w-16 -rotate-12 fill-rose-200 text-rose-200 opacity-90" />
          <Heart className="absolute bottom-10 left-0 z-20 h-14 w-14 rotate-12 fill-rose-300 text-rose-300 opacity-90" />
          <Heart className="absolute top-40 -right-4 z-20 h-20 w-20 rotate-12 fill-rose-200 text-rose-200 opacity-80" />
          <Heart className="absolute bottom-20 right-10 z-20 h-12 w-12 -rotate-12 fill-rose-100 text-rose-100 opacity-90" />

          {/* Floating Pill: +100.543 Pessoas emocionadas */}
          <div className="absolute -top-6 right-16 z-40 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl border border-rose-50 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
              <Gift className="h-5 w-5 text-[#E11D48]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#2D2638]">+100.543</span>
              <span className="text-[11px] text-[#6B6475]">Pessoas emocionadas!</span>
            </div>
          </div>

          <div className="relative h-[600px] w-[360px] sm:w-[480px]">
            
            {/* Celular 1 (Esquerda/Trás - Spotify) */}
            <div className="absolute left-0 top-20 z-10 h-[420px] w-[210px] -rotate-[10deg] transform rounded-[2rem] border-8 border-[#1a1a1a] bg-[#121212] p-3 shadow-2xl">
              <div className="flex h-full flex-col">
                <div className="mb-3 h-32 w-full rounded-xl bg-gradient-to-br from-green-500 to-green-700 opacity-90 flex items-center justify-center">
                  <Music className="h-10 w-10 text-white/80" />
                </div>
                <div className="mb-2 h-3 w-3/4 rounded bg-white/80" />
                <div className="mb-4 h-2 w-1/2 rounded bg-gray-600" />
                <div className="mt-auto">
                  <div className="mb-2 h-1 w-full rounded bg-gray-800"><div className="h-full w-1/3 rounded bg-white" /></div>
                  <div className="flex items-center justify-between px-1 text-white">
                    <Shuffle className="h-3 w-3 text-gray-500" />
                    <SkipBack className="h-5 w-5 text-gray-400" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-black">
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </div>
                    <SkipForward className="h-5 w-5 text-gray-400" />
                    <Repeat className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Celular 3 (Direita/Trás - Mensagem) */}
            <div className="absolute right-0 top-16 z-10 h-[440px] w-[220px] rotate-[10deg] transform rounded-[2rem] border-8 border-[#1a1a1a] bg-[#1E293B] p-4 shadow-2xl">
              <div className="flex h-full flex-col gap-3">
                <div className="h-4 w-3/4 rounded bg-white/20" />
                <div className="h-4 w-1/2 rounded bg-white/20" />
                <div className="h-4 w-full rounded bg-white/20" />
                <div className="h-4 w-2/3 rounded bg-white/20" />
                <div className="mt-4 h-16 w-full rounded-xl bg-white/10" />
                <div className="h-16 w-full rounded-xl bg-[#E11D48]/80 mt-auto" />
              </div>
            </div>

            {/* Celular 2 (Centro/Frente - Casal/Ursinho) */}
            <div className="absolute left-1/2 top-0 z-30 h-[500px] w-[250px] -translate-x-1/2 transform overflow-hidden rounded-[2.5rem] border-[10px] border-[#1a1a1a] bg-white shadow-2xl">
              <div className="absolute left-1/2 top-0 z-40 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#1a1a1a]" />
              <div className="relative flex h-full w-full flex-col bg-[#2D2638]">
                {/* Foto de Casal original do mockup de Celular */}
                <div className="h-[55%] w-full bg-cover bg-center relative border-b border-[#2D2638]/10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2638] via-[#2D2638]/20 to-transparent" />
                </div>
                <div className="absolute top-[48%] left-0 w-full px-5 text-white">
                  <h3 className="text-xl font-bold leading-tight">Leonardo e Yasmin</h3>
                  <p className="text-xs text-gray-300 mt-0.5">Juntos desde 2023</p>
                </div>
                {/* Contadores da interface */}
                <div className="absolute bottom-6 left-0 flex w-full flex-col gap-3 px-5">
                  <div className="flex justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                    <div className="text-center"><div className="text-sm font-bold text-white">1</div><div className="text-[10px] text-gray-300">Anos</div></div>
                    <div className="text-center"><div className="text-sm font-bold text-white">10</div><div className="text-[10px] text-gray-300">Meses</div></div>
                    <div className="text-center"><div className="text-sm font-bold text-white">0</div><div className="text-[10px] text-gray-300">Dias</div></div>
                  </div>
                  <div className="rounded-xl bg-[#E11D48] p-3 text-white shadow-lg">
                    <span className="text-[10px] font-semibold opacity-90">Mensagem especial</span>
                    <p className="mt-1 text-xs font-bold leading-tight">E pensar que tudo começou do nada... ✨</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
