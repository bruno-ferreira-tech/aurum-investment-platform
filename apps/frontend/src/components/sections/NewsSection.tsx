'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Clock, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const news = [
  { id: '1', title: 'Federal Reserve Sinaliza Possíveis Cortes de Juros no 2º Trimestre de 2026', summary: 'Presidente do Fed indica que o banco pode iniciar ciclo de afrouxamento à medida que as condições econômicas se estabilizam.', category: 'Macro', source: 'Financial Times', time: '2h atrás', sentiment: 'positive', relatedAssets: ['SPY', 'QQQ', 'BTC'], categoryColor: 'text-blue-400 bg-blue-400/10' },
  { id: '2', title: 'NVIDIA Reporta Receita Recorde no T1, Demanda por IA Continua Crescendo', summary: "Divisão de data center da NVIDIA cresceu 427% ano a ano com aceleração da infraestrutura de IA.", category: 'Resultados', source: 'Bloomberg', time: '5h atrás', sentiment: 'positive', relatedAssets: ['NVDA', 'QQQ'], categoryColor: 'text-emerald-400 bg-emerald-400/10' },
  { id: '3', title: 'Bitcoin Supera $65K com Adoção Institucional Atingindo Novo Recorde', summary: 'Entradas nos ETFs de Bitcoin à vista atingem $2,1 bilhões em uma única semana com fundos de pensão iniciando alocações.', category: 'Cripto', source: 'CoinDesk', time: '8h atrás', sentiment: 'positive', relatedAssets: ['BTC', 'ETH'], categoryColor: 'text-amber-400 bg-amber-400/10' },
  { id: '4', title: 'Mercados Globais Reagem a Dados de Emprego Mais Fortes que o Esperado', summary: 'Economia dos EUA criou 285 mil empregos em fevereiro, superando consenso de 200 mil e levantando dúvidas sobre pausa do Fed.', category: 'Macro', source: 'Reuters', time: '12h atrás', sentiment: 'neutral', relatedAssets: ['SPY', 'GOLD'], categoryColor: 'text-blue-400 bg-blue-400/10' },
  { id: '5', title: 'Receita do Azure da Microsoft Cresce 31% no Último Trimestre', summary: 'Microsoft continua se beneficiando da migração corporativa para nuvem e integração de IA.', category: 'Resultados', source: 'CNBC', time: '18h atrás', sentiment: 'positive', relatedAssets: ['MSFT', 'QQQ'], categoryColor: 'text-emerald-400 bg-emerald-400/10' },
];

const sentimentLabel: Record<string, string> = {
  positive: 'positivo',
  negative: 'negativo',
  neutral: 'neutro',
};

const SentimentIcon = ({ s }: { s: string }) => {
  if (s === 'positive') return <TrendingUp size={12} className="text-emerald-400" />;
  if (s === 'negative') return <TrendingDown size={12} className="text-red-400" />;
  return <Minus size={12} className="text-dark-400" />;
};

export default function NewsSection() {
  const ref = useScrollAnimation();
  const featured = news[0];
  const rest = news.slice(1);

  return (
    <section id="news" ref={ref} className="py-28 relative overflow-hidden bg-dark-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gsap-hidden">
          <div>
            <span className="section-tag mb-4 inline-flex">Inteligência de Mercado</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Antecipe os movimentos <span className="gold-text">do mercado</span>
            </h2>
          </div>
          <button className="btn-secondary mt-6 md:mt-0 self-start md:self-auto">
            Ver Todas as Notícias <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured */}
          <div className="lg:col-span-2 glass rounded-3xl p-7 flex flex-col justify-between gsap-hidden-left hover:glass-gold transition-all duration-500 group cursor-pointer">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${featured.categoryColor}`}>{featured.category}</span>
                <div className="flex items-center gap-1.5 text-dark-400">
                  <SentimentIcon s={featured.sentiment} />
                  <span className="text-xs capitalize">{sentimentLabel[featured.sentiment]}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-gold-300 transition-colors">{featured.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed mb-6">{featured.summary}</p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {featured.relatedAssets.map((a) => (
                  <span key={a} className="px-2.5 py-1 glass rounded-lg text-xs text-dark-300">{a}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-dark-500">
                <span>{featured.source}</span>
                <div className="flex items-center gap-1"><Clock size={11} />{featured.time}</div>
              </div>
            </div>
          </div>

          {/* News List */}
          <div className="lg:col-span-3 space-y-3 gsap-hidden-right">
            {rest.map((article) => (
              <div key={article.id} className="glass rounded-2xl p-5 hover:glass-gold transition-all duration-300 cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${article.categoryColor}`}>{article.category}</span>
                      <SentimentIcon s={article.sentiment} />
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-snug mb-1.5 group-hover:text-gold-300 transition-colors line-clamp-2">{article.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-dark-500">
                      <span>{article.source}</span>
                      <span>·</span>
                      <div className="flex items-center gap-1"><Clock size={10} />{article.time}</div>
                      <div className="flex gap-1 ml-auto">
                        {article.relatedAssets.slice(0, 2).map((a) => (
                          <span key={a} className="glass px-2 py-0.5 rounded text-[10px]">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-dark-600 group-hover:text-gold-400 flex-shrink-0 mt-0.5 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
