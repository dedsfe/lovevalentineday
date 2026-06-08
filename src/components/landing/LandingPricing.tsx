import React from 'react';
import { Check, ArrowUpRight, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Plano Surpresa",
    badge: "Econômico",
    price: "24,90",
    description: "Ideal para uma surpresa pontual e rápida no dia especial.",
    features: [
      "Acesso por 24 horas (após ativação)",
      "Edições ilimitadas no período",
      "Fotos e músicas ilimitadas",
      "Retrospectiva animada inclusa",
      "QR Code romântico na hora",
      "Suporte via e-mail"
    ],
    highlight: false,
    buttonText: "Criar presente",
    href: "/criar?plan=24h"
  },
  {
    name: "Plano Vitalício",
    badge: "Melhor Custo-Benefício",
    price: "34,90",
    description: "Eternize a sua história de amor em um diário digital que nunca expira.",
    features: [
      "Acesso vitalício (para sempre)",
      "Edições liberadas para sempre",
      "Fotos e músicas ilimitadas",
      "Retrospectiva animada inclusa",
      "QR Code romântico na hora",
      "Suporte prioritário via WhatsApp",
      "Garantia de 7 dias",
      "Atualizações de novos recursos"
    ],
    highlight: true,
    buttonText: "Criar presente vitalício",
    href: "/criar?plan=vitalicio"
  }
];

export default function LandingPricing() {
  return (
    <section id="planos" className="w-full bg-white py-24 sm:py-32 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <div className="mb-16 flex w-full flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[13px] font-bold tracking-widest text-[#E11D48] uppercase shadow-sm">
            <Zap className="mr-2 h-4 w-4 text-[#E11D48]" />
            Nossos Planos
          </span>
          <h2 className="mb-4 font-manrope text-3xl font-extrabold text-[#2D2638] sm:text-4xl lg:text-5xl">
            Escolha o plano <span className="text-[#E11D48]">ideal</span> para você
          </h2>
          <p className="max-w-2xl text-base text-[#6B6475] sm:text-lg">
            Pagamento único, sem mensalidade. Crie seu presente digital agora e surpreenda quem você ama.
          </p>
        </div>

        {/* Grid de Planos - Centrado com 2 colunas */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col justify-between rounded-3xl border-2 border-b-[6px] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                plan.highlight
                  ? 'border-[#E11D48] bg-gradient-to-b from-[#FFFDFD] to-white shadow-md shadow-[#E11D48]/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3.5 left-6 rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm border border-gray-100 bg-white text-gray-700">
                {plan.badge === "Melhor Custo-Benefício" ? (
                  <span className="flex items-center text-[#E11D48]">
                    <Sparkles className="mr-1 h-3 w-3 fill-current text-[#E11D48]" />
                    {plan.badge}
                  </span>
                ) : (
                  plan.badge
                )}
              </div>

              {/* Informações Principais */}
              <div>
                <h3 className="text-xl font-bold text-[#2D2638] mt-2">{plan.name}</h3>
                <p className="mt-3 text-xs leading-relaxed text-[#6B6475] min-h-[36px]">{plan.description}</p>
                
                {/* Preço */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-sm font-semibold text-[#6B6475]">R$</span>
                  <span className="text-4xl font-extrabold tracking-tight text-[#2D2638] ml-1">{plan.price.split(',')[0]}</span>
                  <span className="text-lg font-bold text-[#2D2638]">,{plan.price.split(',')[1]}</span>
                  <span className="text-xs text-[#6B6475] ml-2">taxa única</span>
                </div>

                {/* Linha divisória */}
                <div className="my-6 border-t border-gray-100" />

                {/* Lista de Recursos */}
                <ul className="space-y-3.5">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#6B6475]">
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#E11D48]">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Compra */}
              <div className="mt-8">
                <Link
                  href={plan.href}
                  className={`group flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-b-[4px] px-6 text-sm font-bold transition-all active:scale-95 ${
                    plan.highlight
                      ? 'bg-[#E11D48] text-white border-[#BE123C] hover:bg-[#BE123C]'
                      : 'bg-white text-[#E11D48] border-gray-200 hover:border-gray-300 hover:text-[#BE123C]'
                  }`}
                >
                  {plan.buttonText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé da Seção */}
        <p className="mt-10 text-center text-xs text-[#6B6475]/80 font-medium">
          Pagamento único &bull; Sem assinatura &bull; Acesso imediato
        </p>

      </div>
    </section>
  );
}
