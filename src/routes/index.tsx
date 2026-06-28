import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Trust } from '@/components/Trust';
import { HowItWorks } from '@/components/HowItWorks';
import { TypesPreview } from '@/components/TypesPreview';
import { Features } from '@/components/Features';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'PersonaScope — Discover Your Personality in 15 Minutes' },
      { name: 'description', content: 'A 60-question, research-backed personality assessment that reveals your work style, strengths, and growth areas across four dimensions.' },
      { property: 'og:title', content: 'PersonaScope — Discover Your Personality' },
      { property: 'og:description', content: 'Take the 60-question PersonaScope assessment and unlock your unique work-style profile.' },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Trust />
        <HowItWorks />
        <TypesPreview />
        <Features />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
