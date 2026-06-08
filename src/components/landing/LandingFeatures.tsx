import React from 'react';
import { PenTool, Smartphone, Zap, Heart, ShieldCheck } from 'lucide-react';

export default function LandingFeatures() {
  return (
    <section id="diferenciais" className="w-full bg-[#FFF9F9] py-24 sm:py-32 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <div className="mb-16 flex w-full flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[13px] font-bold tracking-widest text-[#E11D48] uppercase shadow-sm">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Por que nos escolher
          </span>
          <h2 className="mb-4 font-manrope text-3xl font-extrabold text-[#2D2638] sm:text-4xl lg:text-5xl">
            Crie um presente <span className="text-[#E11D48]">memorável</span> e único
          </h2>
          <p className="max-w-3xl text-base text-[#6B6475] sm:text-lg">
            Nossa plataforma oferece tudo o que você precisa para criar uma experiência digital emocionante, estável e segura para quem você ama.
          </p>
        </div>

        {/* Grid Assimétrico */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          
          {/* Lado Esquerdo: Subgrid de 2 Colunas */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            
            {/* Card 1: Edição Fácil */}
            <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-b-[6px] border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/30 to-transparent rounded-tr-3xl -z-10 transition-opacity group-hover:opacity-100" />
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] shadow-sm border border-gray-50/50 group-hover:scale-110 transition-transform">
                  <PenTool className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-[19px] font-bold text-[#2D2638]">Edição Ilimitada</h3>
                <p className="text-[14px] leading-relaxed text-[#6B6475] mb-4">
                  Errou uma data ou quer trocar uma foto? Altere todo o conteúdo do seu presente digital sempre que quiser através do painel.
                </p>
              </div>

            </div>

            {/* Card 2: 100% Responsivo */}
            <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-b-[6px] border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/30 to-transparent rounded-tr-3xl -z-10 transition-opacity group-hover:opacity-100" />
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] shadow-sm border border-gray-50/50 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-[19px] font-bold text-[#2D2638]">Otimizado para Celular</h3>
                <p className="text-[14px] leading-relaxed text-[#6B6475] mb-4">
                  Nossos sites são desenhados sob medida para dispositivos móveis, garantindo carregamento rápido e visualização perfeita no smartphone.
                </p>
              </div>
            </div>

            {/* Card 3: Segurança (Largo) */}
            <div className="group relative sm:col-span-2 flex flex-col justify-between rounded-3xl border-2 border-b-[6px] border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/20 to-transparent rounded-tr-3xl -z-10 transition-opacity group-hover:opacity-100" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] shadow-sm border border-gray-50/50 group-hover:scale-110 transition-transform shrink-0">
                  <Heart className="h-6 w-6 fill-current text-[#E11D48]" />
                </div>
                <div>
                  <h3 className="mb-2 text-[19px] font-bold text-[#2D2638]">Criado com Amor e Privacidade</h3>
                  <p className="text-[14px] leading-relaxed text-[#6B6475]">
                    As fotos do casal e suas mensagens são armazenadas em servidores seguros de alta confiabilidade. O seu site só pode ser acessado por quem tiver o link direto ou escanear o seu QR Code físico.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Lado Direito: Card de Destaque Vertical */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-b-[6px] border-[#E11D48] bg-gradient-to-b from-[#FFFDFD] to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:h-full">
            <div className="absolute -top-3 right-6 rounded-full bg-[#E11D48] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
              Destaque
            </div>
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E11D48] text-white shadow-md shadow-[#E11D48]/25 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#2D2638]">Entrega Imediata</h3>
              <p className="text-[15px] leading-relaxed text-[#6B6475] mb-6">
                Não precisa esperar dias pela confecção ou envio de correios. Aprovado o pagamento, o seu link personalizado e o QR Code romântico são gerados na mesma hora!
              </p>
            </div>
            <div className="border-t border-gray-100 pt-6 mt-6">
              <ul className="space-y-3 text-sm text-[#6B6475]">
                <li className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-100 text-[#E11D48] text-[10px] font-bold">✓</span>
                  Aprovação Pix automática
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-100 text-[#E11D48] text-[10px] font-bold">✓</span>
                  Acesso ao painel na hora
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-100 text-[#E11D48] text-[10px] font-bold">✓</span>
                  Garantia de satisfação de 7 dias
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
