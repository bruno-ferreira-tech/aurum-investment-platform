'use client';

import { useEffect, useRef } from 'react';
import { Shield, Zap, LineChart, Lock, Globe, Cpu, ArrowRight } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Execução em Tempo Real', description: 'Execução de ordens em sub-milissegundo com acesso direto ao mercado. Nunca mais perca um movimento.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { icon: Shield, title: 'Segurança Institucional', description: 'Criptografia de 256 bits, armazenamento frio e carteiras multi-assinatura protegem cada ativo.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: LineChart, title: 'Análises com IA', description: 'Modelos de machine learning analisam milhares de sinais para gerar insights acionáveis.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Lock, title: 'Conformidade Regulatória', description: 'Totalmente regulado em 42 jurisdições. Seus investimentos estão sempre protegidos por lei.', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { icon: Globe, title: 'Acesso a Mercados Globais', description: 'Negocie mais de 10.000 instrumentos entre ações, cripto, forex e commodities no mundo todo.', color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { icon: Cpu, title: 'Automação Inteligente', description: 'Defina regras, gatilhos e estratégias de DCA. Deixe a Aurum trabalhar por você 24/7.', color: 'text-gold-400', bg: 'bg-gold-400/10' },
];

export default function TechSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      if (phoneRef.current) {
        gsap.fromTo(phoneRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
        );
        gsap.to(phoneRef.current, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        });
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            }
          );
        });
      }
    };
    initGSAP();
  }, []);

  return (
    <section id="technology" ref={sectionRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Features */}
          <div ref={cardsRef}>
            <span className="section-tag mb-6 inline-flex">Infraestrutura</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Arquitetura de alta performance,<br />segurança <span className="gold-text">inegociável</span>
            </h2>
            <p className="text-dark-400 text-lg mb-10 leading-relaxed">
              Apoiada pela mesma tecnologia utilizada pelos maiores fundos institucionais do mundo, agora disponível para as suas decisões diárias.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="feature-card glass rounded-2xl p-5 hover:glass-gold transition-all duration-300 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center ${feature.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={18} />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h4>
                    <p className="text-xs text-dark-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
            <button className="btn-primary mt-8">
              Explorar a Plataforma <ArrowRight size={16} />
            </button>
          </div>

          {/* Phone Mockup */}
          <div ref={phoneRef} className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.2) 0%, transparent 70%)', filter: 'blur(30px)', transform: 'scale(1.3)' }} />
              <div className="relative w-72 h-[580px] bg-dark-900 rounded-[40px] border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-dark-950 rounded-b-2xl z-10" />
                <div className="absolute inset-[2px] rounded-[38px] bg-dark-950 overflow-hidden">
                  <div className="p-6 pt-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-dark-400 text-xs">Portfólio Total</p>
                        <p className="text-2xl font-bold text-white">$124.580</p>
                        <p className="text-emerald-400 text-xs mt-0.5">+$1.847 hoje</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center">
                        <LineChart size={18} className="text-gold-400" />
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-4 mb-4">
                      <svg viewBox="0 0 200 60" className="w-full h-12">
                        <defs>
                          <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0,55 L 20,48 L 40,52 L 60,40 L 80,44 L 100,32 L 120,36 L 140,24 L 160,20 L 180,12 L 200,8 L 200,60 L 0,60 Z" fill="url(#pg)" />
                        <path d="M 0,55 L 20,48 L 40,52 L 60,40 L 80,44 L 100,32 L 120,36 L 140,24 L 160,20 L 180,12 L 200,8" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-xs text-dark-400 mb-3 font-medium">Posições</p>
                    {[
                      { s: 'AAPL', v: '$2,840', p: '+1.15%', up: true },
                      { s: 'NVDA', v: '$4,377', p: '+2.53%', up: true },
                      { s: 'BTC', v: '$33,923', p: '+1.87%', up: true },
                      { s: 'ETH', v: '$10,629', p: '-1.26%', up: false },
                    ].map((h) => (
                      <div key={h.s} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gold-500/10 flex items-center justify-center">
                            <span className="text-gold-400 text-[9px] font-bold">{h.s[0]}</span>
                          </div>
                          <span className="text-xs text-white font-medium">{h.s}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white">{h.v}</p>
                          <p className={`text-[10px] ${h.up ? 'text-emerald-400' : 'text-red-400'}`}>{h.p}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
