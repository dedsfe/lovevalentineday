import React from 'react';
import { Heart, PenLine, Settings, QrCode, Sparkles } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Conte a sua história',
    description: 'Preencha os dados e escolha elementos únicos para surpreender quem você ama.',
    icon: <PenLine className="h-10 w-10 text-[#2D2638]" />,
    highlight: false,
  },
  {
    number: 2,
    title: 'Personalize cada detalhe',
    description: 'Escolha suas melhores fotos, a trilha sonora perfeita e defina o estilo visual que mais combina.',
    icon: <Settings className="h-10 w-10 text-[#2D2638]" />,
    highlight: true,
  },
  {
    number: 3,
    title: 'Receba seu Link e QR Code',
    description: 'Após o pagamento, você recebe instantaneamente o link da sua página e um QR Code exclusivo para compartilhar.',
    icon: <QrCode className="h-10 w-10 text-[#2D2638]" />,
    highlight: false,
  },
  {
    number: 4,
    title: 'Emocione quem você ama',
    description: 'Envie o presente e prepare-se para as lágrimas de felicidade. Uma experiência que ficará marcada para sempre.',
    icon: <Sparkles className="h-10 w-10 text-[#2D2638]" />,
    highlight: false,
  },
];

export default function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="relative w-full bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        
        {/* Tag Superior */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E9DDFE] bg-[#Faf5ff] px-4 py-1.5 text-[13px] font-bold tracking-widest text-[#A855F7] uppercase shadow-sm">
          <Heart className="h-4 w-4" />
          Como Funciona
        </div>

        {/* Títulos */}
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#2D2638] sm:text-4xl lg:text-5xl">
          Crie um presente inesquecível em <span className="text-[#A855F7]">4 passos simples</span>
        </h2>
        <p className="mb-20 max-w-2xl text-[17px] text-[#6B6475] leading-relaxed">
          Nossa plataforma torna fácil criar uma experiência digital e personalizada que vai emocionar quem você ama.
        </p>

        {/* Grid de Passos */}
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 pt-6">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center">
              
              {/* Badge do Número flutuante */}
              <div className="absolute -top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#A855F7] text-xl font-bold text-white shadow-md border-4 border-white">
                {step.number}
              </div>

              {/* Card principal */}
              <div
                className={`flex h-full w-full flex-col items-center rounded-3xl p-8 pt-12 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  step.highlight
                    ? 'border-2 border-[#A855F7] bg-white shadow-xl shadow-[#A855F7]/10'
                    : 'border border-gray-100 bg-[#FAFAFA] shadow-sm'
                }`}
              >
                {/* Ícone / Imagem Placeholder */}
                <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-gray-200/60 shadow-inner">
                  {step.icon}
                </div>

                <h3 className="mb-3 text-[19px] font-bold text-[#2D2638]">
                  {step.title}
                </h3>
                
                <p className="text-[14px] leading-relaxed text-[#6B6475]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
