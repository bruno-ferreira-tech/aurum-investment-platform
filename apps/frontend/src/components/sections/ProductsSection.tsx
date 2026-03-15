'use client';

import { useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import { TrendingUp, Bitcoin, Shield, Building2, Cpu, ArrowRight, Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const iconMap: Record<string, ElementType> = {
  'trending-up': TrendingUp,
  bitcoin: Bitcoin,
  shield: Shield,
  building: Building2,
  cpu: Cpu,
};

const riskColors: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-400/10',
  medium: 'text-blue-400 bg-blue-400/10',
  high: 'text-amber-400 bg-amber-400/10',
  'very-high': 'text-red-400 bg-red-400/10',
};

const riskLabels: Record<string, string> = {
  low: 'risco baixo',
  medium: 'risco médio',
  high: 'risco alto',
  'very-high': 'risco muito alto',
};

const products = [
  { id: '1', name: 'Aurum Growth', category: 'Portfólio Gerenciado', description: 'Um portfólio diversificado com foco na valorização de capital a longo prazo por meio de ações globais e ativos de crescimento.', minInvestment: 1000, expectedReturn: '12-18% a.a.', risk: 'medium', features: ['Diversificação global', 'Rebalanceamento automático', 'Otimização tributária', 'Seleção ESG'], icon: 'trending-up', featured: true },
  { id: '2', name: 'Aurum Crypto Alpha', category: 'Ativos Digitais', description: 'Exposição estratégica às principais criptomoedas com gestão ativa de risco e otimização de rendimento.', minInvestment: 500, expectedReturn: '20-40% a.a.', risk: 'very-high', features: ['BTC & ETH principal', 'Rendimento DeFi', 'Segurança em cold storage', 'Controles de risco'], icon: 'bitcoin', featured: false },
  { id: '3', name: 'Aurum Stable', category: 'Renda Fixa', description: 'Preservação de capital com renda estável por meio de títulos públicos e corporativos de alta qualidade.', minInvestment: 5000, expectedReturn: '5-8% a.a.', risk: 'low', features: ['Preservação de capital', 'Renda regular', 'Proteção contra inflação', 'Baixa volatilidade'], icon: 'shield', featured: false },
  { id: '4', name: 'Aurum Real Estate', category: 'Ativos Reais', description: 'Acesso a imóveis comerciais e residenciais premium por meio de REITs e fundos imobiliários.', minInvestment: 2500, expectedReturn: '8-12% a.a.', risk: 'medium', features: ['Renda passiva', 'Proteção contra inflação', 'Diversificação do portfólio', 'Gestão profissional'], icon: 'building', featured: false },
  { id: '5', name: 'Aurum AI & Tech', category: 'Temático', description: 'Exposição concentrada aos líderes em inteligência artificial e tecnologia emergente.', minInvestment: 1000, expectedReturn: '15-25% a.a.', risk: 'high', features: ['Líderes em IA', 'Exposição a semicondutores', 'Computação em nuvem', 'Robótica e automação'], icon: 'cpu', featured: false },
];

export default function ProductsSection() {
  const sectionRef = useScrollAnimation();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!trackRef.current) return;

      const cards = trackRef.current.querySelectorAll('.product-card-item');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 80 },
          {
            opacity: 1, y: 0,
            duration: 0.9, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      });
    };
    initGSAP();
  }, []);

  return (
    <section id="products" ref={sectionRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 gsap-hidden">
          <span className="section-tag mb-4">Soluções de Investimento</span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
            Estratégias sob medida para <span className="gold-text">o seu objetivo</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Da preservação de capital ao crescimento acelerado: escolha a estratégia ideal para o seu perfil e horizonte de investimentos.
          </p>
        </div>

        <div ref={trackRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const Icon = iconMap[product.icon] || TrendingUp;
            return (
              <div key={product.id}
                className={`product-card-item product-card relative group ${product.featured ? 'ring-1 ring-gold-500/30' : ''}`}>
                {product.featured && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold-500 text-dark-950 text-xs font-bold rounded-full">
                      <Star size={10} fill="currentColor" /> Mais Popular
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 transition-colors duration-300">
                    <Icon size={22} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${riskColors[product.risk]}`}>
                    {riskLabels[product.risk]}
                  </span>
                </div>
                <p className="text-gold-500 text-xs font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                <p className="text-dark-400 text-sm leading-relaxed mb-5">{product.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-dark-400 mb-1">Retorno Esperado</p>
                    <p className="text-sm font-bold text-emerald-400">{product.expectedReturn}</p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-3">
                    <p className="text-xs text-dark-400 mb-1">Inv. Mínimo</p>
                    <p className="text-sm font-bold text-white">${product.minInvestment.toLocaleString()}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-dark-300">
                      <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 glass-gold rounded-xl text-sm font-semibold text-gold-400 hover:bg-gold-500/15 transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                  Saiba Mais <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
