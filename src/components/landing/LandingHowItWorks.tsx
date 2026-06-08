import React from 'react';
import { Heart } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Conte a sua história',
    description: 'Preencha os dados e escolha elementos únicos para surpreender quem você ama.',
    image: '/bear/urso-sf.png',
    highlight: false,
  },
  {
    number: 2,
    title: 'Personalize cada detalhe',
    description: 'Escolha suas melhores fotos, a trilha sonora perfeita e defina o estilo visual que mais combina.',
    image: '/bear/urso2-sf.png',
    highlight: true,
  },
  {
    number: 3,
    title: 'Receba seu Link e QR Code',
    description: 'Após o pagamento, você recebe instantaneamente o link da sua página e um QR Code exclusivo para compartilhar.',
    image: '/bear/urso3-sf.png',
    highlight: false,
  },
  {
    number: 4,
    title: 'Emocione quem você ama',
    description: 'Envie o presente e prepare-se para as lágrimas de felicidade. Uma experiência que ficará marcada para sempre.',
    image: '/bear/imagem-refinada.png',
    highlight: false,
  },
];

export default function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="relative w-full bg-white px-4 py-20 sm:px-6 lg:px-8 select-none">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        
        {/* Tag Superior */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-[13px] font-bold tracking-widest text-[#E11D48] uppercase shadow-sm">
          <Heart className="h-4 w-4 fill-current text-[#E11D48]" />
          Como Funciona
        </div>

        {/* Títulos */}
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#2D2638] sm:text-4xl lg:text-5xl">
          Crie um presente inesquecível em <span className="text-[#E11D48]">4 passos simples</span>
        </h2>
        <p className="mb-20 max-w-2xl text-[17px] text-[#6B6475] leading-relaxed">
          Nossa plataforma torna fácil criar uma experiência digital e personalizada que vai emocionar quem você ama.
        </p>

        {/* Grid de Passos */}
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 pt-6">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center">
              
              {/* Badge do Número flutuante */}
              <div className="absolute -top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#E11D48] text-xl font-bold text-white shadow-md border-4 border-white">
                {step.number}
              </div>

              {/* Card principal */}
              <div
                className={`flex h-full w-full flex-col items-center rounded-3xl p-8 pt-12 transition-all hover:-translate-y-1 hover:shadow-lg border-2 border-b-[6px] ${
                  step.highlight
                    ? 'border-[#E11D48] bg-white shadow-xl shadow-[#E11D48]/5'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Imagem do Mascote Ursinho sem fundo */}
                <div className="relative mx-auto mb-6 h-40 w-40 rounded-2xl bg-transparent">
                  <img 
                    src={step.image} 
                    alt={`Ilustração do Ursinho para o passo: ${step.title}`}
                    className="h-full w-full object-contain"
                  />
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
