'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import ProductsSection from '@/components/sections/ProductsSection';
import MarketSection from '@/components/sections/MarketSection';
import TechSection from '@/components/sections/TechSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsSection from '@/components/sections/NewsSection';
import CtaSection from '@/components/sections/CtaSection';

export default function Home() {
  useEffect(() => {
    let animFrameId: number;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void; on: (e: string, cb: unknown) => void } | null = null;

    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisInstance = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      function raf(time: number) {
        lenis.raf(time);
        animFrameId = requestAnimationFrame(raf);
      }
      animFrameId = requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      cancelAnimationFrame(animFrameId);
      lenisInstance?.destroy();
    };
  }, []);

  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <MarketSection />
      <TechSection />
      <TestimonialsSection />
      <NewsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
