'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Users, BarChart3, Globe, Award } from 'lucide-react';

const stats = [
  { icon: BarChart3, value: 4800000000, prefix: '$', label: 'Ativos sob Gestão', sub: 'Em todos os portfólios', color: 'text-gold-400' },
  { icon: Users, value: 127500, suffix: '+', label: 'Investidores Ativos', sub: 'Confiando na Aurum', color: 'text-emerald-400' },
  { icon: Award, value: 18.4, suffix: '%', decimals: 1, label: 'Retorno Médio Anual', sub: 'Desde o início', color: 'text-blue-400' },
  { icon: Globe, value: 42, suffix: '+', label: 'Países Atendidos', sub: 'Alcance global', color: 'text-purple-400' },
];

export default function StatsSection() {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 gsap-hidden">
          <span className="section-tag mb-4">A força dos números</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            A escolha de investidores <span className="gold-text">em todo o mundo</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Resultados expressivos e consistentes. Nossa trajetória de excelência fala por si.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card gsap-scale-hidden">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} duration={2200} />
                </div>
                <p className="text-white font-medium text-sm mb-1">{stat.label}</p>
                <p className="text-dark-400 text-xs">{stat.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
