import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingTimeline from '@/components/landing/LandingTimeline';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingDemo from '@/components/landing/LandingDemo';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans animate-fade-in">
      <LandingHeader />
      <LandingHero />
      <LandingHowItWorks />
      <LandingTimeline />
      <LandingFeatures />
      <LandingDemo />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFAQ />
      <LandingFooter />
    </main>
  );
}
