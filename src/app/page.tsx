import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingTimeline from '@/components/landing/LandingTimeline';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <LandingHeader />
      <LandingHero />
      <LandingHowItWorks />
      <LandingTimeline />
      {/* Bloco provisório para permitir scroll e testar o efeito sticky do header */}
      <div className="h-[100vh] bg-[#FAFAFA]"></div>
    </main>
  );
}
