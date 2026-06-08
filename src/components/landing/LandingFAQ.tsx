"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Mail } from 'lucide-react';

const faqItems = [
  {
    question: "O que é a plataforma?",
    answer: "É a plataforma líder para criar Sites de Casal e Presentes Virtuais. É mais do que um simples cartão: você cria uma página exclusiva na internet com suas fotos, música tema e nossa famosa Retrospectiva Animada (estilo Wrapped) para emocionar seu amor por WhatsApp ou imprimir em um QR Code."
  },
  {
    question: "Como funciona? Preciso saber editar?",
    answer: "Zero conhecimento técnico necessário! É mágico e leva menos de 5 minutos. Você preenche os dados do relacionamento, sobe suas fotos e escolhe a música. Nossa tecnologia monta o site e a retrospectiva automaticamente na hora."
  },
  {
    question: "O site fica no ar para sempre?",
    answer: "Você decide! No nosso Plano Vitalício (Best-Seller), o presente é eterno e vira um diário digital do casal que nunca expira. Também oferecemos a opção de acesso por 24 horas para surpresas pontuais."
  },
  {
    question: "Como entrego a surpresa?",
    answer: "Você recebe um Link personalizado e um QR Code exclusivo. Ideias de clientes: enviar o link numa mensagem romântica no WhatsApp à meia-noite, ou imprimir o QR Code e colar em uma caixa de bombons, carta física ou porta-retrato."
  },
  {
    question: "O que tem na Retrospectiva Animada?",
    answer: "É a 'cereja do bolo' que faz chorar! Uma animação cinematográfica (estilo Wrapped) que mostra o contador de dias juntos, linha do tempo e outras seções do casal com suas melhores fotos, tudo sincronizado com a batida da música de vocês."
  },
  {
    question: "O acesso é imediato após o pagamento?",
    answer: "Sim! Aceitamos PIX (aprovação instantânea) e Cartão de Crédito. Assim que finalizar o pagamento, você já recebe o link e o acesso ao painel para enviar o presente na hora. Perfeito para presentes de última hora!"
  },
  {
    question: "Se eu errar algo, posso editar depois?",
    answer: "Com certeza! Todos os planos contam com 7 dias de Garantia de Ajuste para você corrigir textos ou trocar fotos. No Plano Vitalício, a edição é liberada para sempre, permitindo que você atualize o site com novas fotos e momentos ao longo dos anos."
  }
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

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-[#FFF9F9] py-20 sm:py-28 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-16">
          
          {/* Coluna Esquerda: Título e Suporte (Sticky no Desktop) */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24 h-fit mb-12 lg:mb-0">
            <div className="text-center lg:text-left mb-8">
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[13px] font-bold tracking-widest text-[#E11D48] uppercase shadow-sm mb-4">
                <HelpCircle className="mr-2 h-4 w-4" />
                Perguntas Frequentes
              </span>
              <h2 className="mb-4 font-manrope text-3xl font-extrabold text-[#2D2638] md:text-4xl lg:text-5xl">
                Tire suas <span className="text-[#E11D48]">Dúvidas</span>
              </h2>
              <p className="text-base text-[#6B6475] md:text-lg">
                Separamos as perguntas mais comuns. Se a sua não estiver aqui, entre em contato com nosso suporte!
              </p>
            </div>

            {/* Links de Suporte (Desktop) */}
            <div className="hidden lg:flex flex-col gap-4">
              <h3 className="font-bold text-[#2D2638] text-sm">Não encontrou sua pergunta?</h3>
              
              <a 
                href="https://instagram.com/lovevalentineday" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-4 rounded-2xl border-2 border-b-[4px] border-gray-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#E11D48]/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E11D48]">
                  <InstagramIcon className="h-5 w-5" />
                </div>
                <div className="flex-grow text-left">
                  <p className="font-bold text-sm text-[#2D2638]">Instagram</p>
                  <p className="text-xs text-[#6B6475]">@lovevalentineday.ofic</p>
                </div>
              </a>

              <a 
                href="mailto:suporte@lovevalentineday.com" 
                className="group flex items-center gap-4 rounded-2xl border-2 border-b-[4px] border-gray-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#E11D48]/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E11D48]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-grow text-left">
                  <p className="font-bold text-sm text-[#2D2638]">E-mail</p>
                  <p className="text-xs text-[#6B6475]">suporte@lovevalentineday.com</p>
                </div>
              </a>
            </div>
          </div>

          {/* Coluna Direita: Acordeão de FAQ */}
          <div className="w-full lg:w-3/5 space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`group rounded-2xl border-2 border-b-[4px] overflow-hidden transition-all duration-300 bg-white border-gray-200/80 ${
                    isOpen ? 'border-[#E11D48]/40 shadow-md shadow-[#E11D48]/5' : 'hover:border-gray-300'
                  }`}
                >
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full justify-between items-center p-5 text-left gap-4"
                    aria-expanded={isOpen}
                  >
                    <h3 className={`text-base md:text-[17px] font-bold transition-colors duration-200 ${
                      isOpen ? 'text-[#E11D48]' : 'text-[#2D2638]'
                    }`}>
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-185 text-[#E11D48]' : 'group-hover:text-gray-600'
                      }`} />
                    </div>
                  </button>
                  
                  {/* Resposta do FAQ com transição */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-52 opacity-100 border-t border-gray-100/50' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-5 text-sm md:text-[15px] leading-relaxed text-[#6B6475] bg-[#FAF8FF]/40">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Links de Suporte (Mobile) */}
            <div className="flex lg:hidden flex-col gap-4 mt-12">
              <h3 className="font-bold text-[#2D2638] text-sm text-center">Não encontrou sua pergunta?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://instagram.com/lovevalentineday" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-4 rounded-2xl border-2 border-b-[4px] border-gray-200/80 bg-white p-4 transition-all hover:border-[#E11D48]/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E11D48]">
                    <InstagramIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-grow text-left">
                    <p className="font-bold text-xs text-[#2D2638]">Instagram</p>
                    <p className="text-[10px] text-[#6B6475]">@lovevalentineday</p>
                  </div>
                </a>

                <a 
                  href="mailto:suporte@lovevalentineday.com" 
                  className="group flex items-center gap-4 rounded-2xl border-2 border-b-[4px] border-gray-200/80 bg-white p-4 transition-all hover:border-[#E11D48]/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E11D48]">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-grow text-left">
                    <p className="font-bold text-xs text-[#2D2638]">E-mail</p>
                    <p className="text-[10px] text-[#6B6475]">suporte@lovevalentineday.com</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
