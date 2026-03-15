'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Chen', title: 'Engenheira de Software', avatar: 'SC', text: "A Aurum mudou completamente como penso sobre investimentos. Os insights de IA são genuinamente úteis e a transparência do portfólio é incomparável. Cresci meu portfólio 31% no último ano.", return: '+31% este ano', color: 'bg-blue-500' },
  { name: 'Marcus Rodriguez', title: 'Empresário', avatar: 'MR', text: "Testei 4 outras plataformas antes da Aurum. Nenhuma chega perto em qualidade de dados e facilidade de uso. O rebalanceamento automático sozinho me economiza horas todo mês.", return: '+24% este ano', color: 'bg-purple-500' },
  { name: 'Emily Park', title: 'Gerente de Produto', avatar: 'EP', text: "Como alguém nova em investimentos, a Aurum tornou tudo acessível sem simplificar demais. Os recursos educacionais e a interface limpa me deram confiança desde o primeiro dia.", return: '+19% este ano', color: 'bg-emerald-600' },
  { name: 'David Okafor', title: 'Médico', avatar: 'DO', text: "Minha agenda cheia exige automação. O rebalanceamento inteligente e a otimização tributária da Aurum foram divisores de águas. Dedico 20 minutos por mês e meu portfólio supera meu assessor.", return: '+28% este ano', color: 'bg-amber-600' },
  { name: 'Lisa Thompson', title: 'Designer Freelancer', avatar: 'LT', text: "O ticker de mercado e os alertas em tempo real me mantêm informada sem sobrecarga. A Aurum respeita seu tempo e inteligência — é a plataforma que gostaria que existisse há 5 anos.", return: '+22% este ano', color: 'bg-pink-600' },
  { name: 'James Wu', title: 'Analista Financeiro', avatar: 'JW', text: "Mesmo tendo formação em finanças, os dados de nível institucional da Aurum impressionam. O acesso à API para estratégias personalizadas é um grande diferencial.", return: '+35% este ano', color: 'bg-yellow-700' },
];

export default function TestimonialsSection() {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 gsap-hidden">
          <span className="section-tag mb-4">Experiências</span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
            A experiência de quem <span className="gold-text">confia na Aurum</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Junte-se a mais de 127.000 investidores que já transformaram sua forma de rentabilizar com a Aurum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-3xl p-7 hover:glass-gold transition-all duration-500 gsap-scale-hidden flex flex-col">
              <Quote size={28} className="text-gold-500/40 mb-4" />
              <p className="text-dark-200 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-dark-400">{t.title}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 bg-emerald-400/10 rounded-lg">{t.return}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
