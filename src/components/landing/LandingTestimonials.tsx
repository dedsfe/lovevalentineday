"use client";

import React from 'react';
import { Star, Quote, MessageSquareQuote } from 'lucide-react';

const testimonials = [
  {
    name: "Lucas e Carol",
    role: "Casal",
    time: "3 meses atrás",
    quote: "Montei uma página surpresa para a Carol, com nossas fotos de viagem e uma mensagem sincera. Ela adorou! Com certeza vou usar de novo.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Lucas%20Carol",
  },
  {
    name: "Fernanda",
    role: "Filha",
    time: "1 mês atrás",
    quote: "Fiz pra minha mãe no Dia da Mulher e ela assistiu a retrospectiva umas 5 vezes seguidas! Chorou de emoção.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Fernanda",
  },
  {
    name: "Camila e Felipe",
    role: "Casal",
    time: "2 meses atrás",
    quote: "A interface é simples e criar uma página com nossas fotos e músicas favoritas foi super especial! O resultado final ficou lindo.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Camila%20Felipe",
  },
  {
    name: "Carla",
    role: "Amiga",
    time: "3 semanas atrás",
    quote: "Fiz um presente para minha melhor amiga e ela disse que foi o presente mais criativo que já ganhou na vida! Valeu super a pena.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Carla",
  },
  {
    name: "João e Mari",
    role: "Casal",
    time: "4 dias atrás",
    quote: "Na moral, melhor presente que já dei! Fiz de surpresa e quando ela viu todas as nossas fotos na retrospectiva animada, começou a chorar. Valeu demais!",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Joao%20Mari",
  },
  {
    name: "Ana Clara",
    role: "Neta",
    time: "2 semanas atrás",
    quote: "Presente perfeito pra minha avó! Ela ficou emocionada com as fotos e a música. Toda a família chorou junto vendo a retrospectiva.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Clara",
  },
  {
    name: "Diego e Ju",
    role: "Casal",
    time: "1 semana atrás",
    quote: "Simples, rápido e o resultado ficou incrível! Consegui montar tudo em menos de 30min e o pagamento por pix foi aprovado na hora. Recomendo!",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Diego%20Ju",
  },
  {
    name: "Bruna",
    role: "Irmã",
    time: "5 dias atrás",
    quote: "Fiz pra minha irmã no aniversário dela. Ela não parava de assistir! Adicionei nossas fotos de infância e ficou emocionante demais.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bruna",
  }
];

// Duplicate the array to create a seamless loop
const doubleTestimonials = [...testimonials, ...testimonials];

export default function LandingTestimonials() {
  return (
    <section id="depoimentos" className="w-full bg-[#FFF9F9] py-20 sm:py-28 overflow-hidden select-none">
      <style>{`
        @keyframes marquee-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-horizontal {
          display: flex;
          width: max-content;
          animation: marquee-horizontal 40s linear infinite;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto px-4">
        
        {/* Header da Seção */}
        <div className="mb-14 flex w-full flex-col items-center text-center md:items-start md:text-left max-w-7xl mx-auto md:px-8">
          <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[13px] font-bold tracking-widest text-[#E11D48] uppercase shadow-sm mb-4">
            <MessageSquareQuote className="mr-2 h-4 w-4 text-[#E11D48]" />
            Depoimentos de Clientes
          </span>
          <h2 className="mb-4 font-manrope text-3xl font-extrabold text-[#2D2638] md:text-4xl lg:text-5xl">
            O que nossos <span className="text-[#E11D48]">clientes</span> dizem
          </h2>
          <p className="max-w-2xl text-base text-[#6B6475] md:text-lg">
            Histórias reais de pessoas que criaram presentes digitais para surpreender alguém especial.
          </p>
        </div>

        {/* Marquee Horizontal Slider */}
        <div className="relative flex w-full items-center justify-center overflow-hidden py-4">
          {/* Efeito Fade nas laterais */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FFF9F9] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FFF9F9] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-horizontal">
            {doubleTestimonials.map((t, idx) => (
              <figure 
                key={idx} 
                className="relative w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-b-[4px] border-gray-200/80 bg-white p-6 mx-3 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg flex flex-col justify-between"
              >
                {/* Ícone de Aspas Gigante de fundo */}
                <Quote className="absolute top-4 left-5 h-16 w-16 text-rose-100/40 -z-0 pointer-events-none" />
                
                <div className="relative z-10 flex-grow">
                  {/* Estrelas */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#E11D48] text-[#E11D48]" />
                    ))}
                  </div>
                  
                  {/* Depoimento */}
                  <blockquote className="text-[14px] leading-relaxed text-[#2D2638] font-medium mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Linha Divisória */}
                <div className="relative z-10 flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img 
                    alt={`Foto de ${t.name}`} 
                    src={t.avatar} 
                    className="h-10 w-10 shrink-0 rounded-full object-cover border border-rose-100 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`;
                    }}
                  />
                  <div className="flex flex-col text-left">
                    <figcaption className="text-sm font-semibold text-[#2D2638]">{t.name}</figcaption>
                    <p className="text-[10px] font-medium text-[#6B6475]">{t.role} &bull; {t.time}</p>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
