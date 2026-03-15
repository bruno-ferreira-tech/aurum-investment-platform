'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'Sem investimento mínimo inicial',
  'Cancele ou resgate a qualquer momento',
  'Plataforma regulada e segurada',
  'Zero taxas ocultas',
];

export default function CtaSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!contentRef.current) return;

      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } }
      );
    };
    initGSAP();
  }, []);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.12) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-30" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div ref={contentRef}>
          <span className="section-tag mb-6 inline-flex">Comece Hoje</span>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05]">
            O próximo passo do seu patrimônio <br />começa <span className="gold-text">aqui</span>
          </h2>

          <p className="text-dark-400 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Seja parte dos mais de 127.000 investidores que gerenciam sua riqueza com a Aurum.
            Abertura de conta em menos de 3 minutos.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-sm text-dark-300">{b}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="btn-primary text-lg px-10 py-5">
              Abrir Conta Grátis <ArrowRight size={20} />
            </button>
            <button className="btn-secondary text-lg px-10 py-5">
              Agendar uma Demo
            </button>
          </div>

          <p className="text-dark-600 text-sm">
            Regulado pelo FCA · Certificado SOC 2 Tipo II · Criptografia SSL de 256 bits
          </p>
        </div>
      </div>
    </section>
  );
}
