'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import MarketTicker from '@/components/ui/MarketTicker';

interface CardData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
  delay: number;
  position: string;
}

const FALLBACK_CARDS: CardData[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$875.40', change: '+2.53%', up: true, delay: 0, position: 'top-[18%] right-[8%]' },
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,845', change: '+1.87%', up: true, delay: 1.5, position: 'top-[45%] right-[3%]' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,542', change: '-1.26%', up: false, delay: 0.8, position: 'bottom-[25%] right-[10%]' },
  { symbol: 'SOL', name: 'Solana', price: '$182.45', change: '+5.13%', up: true, delay: 2, position: 'top-[22%] left-[4%]' },
  { symbol: 'USD/BRL', name: 'Dólar / Real', price: '$5.25', change: '+0.12%', up: true, delay: 1.2, position: 'bottom-[30%] left-[2%]' },
];

const CARD_POSITIONS = [
  'top-[18%] right-[8%]',
  'top-[45%] right-[3%]',
  'bottom-[25%] right-[10%]',
  'top-[22%] left-[4%]',
  'bottom-[30%] left-[2%]',
];

const CARD_DELAYS = [0, 1.5, 0.8, 2, 1.2];

function formatCardPrice(price: number): string {
  if (price >= 1000) return '$' + price.toLocaleString('en', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(4);
}

const portfolioSparkline = [40, 55, 48, 62, 58, 72, 68, 80, 75, 90, 85, 100];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const [floatingCards, setFloatingCards] = useState<CardData[]>(FALLBACK_CARDS);

  // Fetch live data for floating cards
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const res = await fetch(
          (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/v1/currencies',
        );
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        const currencies = json.data || json;

        if (Array.isArray(currencies) && currencies.length > 0) {
          // Pick first 5 currencies for the cards
          const picked = currencies.slice(0, 5);
          const newCards: CardData[] = picked.map((c: any, i: number) => ({
            symbol: c.symbol,
            name: c.name,
            price: formatCardPrice(c.price),
            change: `${c.changePercent24h >= 0 ? '+' : ''}${c.changePercent24h.toFixed(2)}%`,
            up: c.changePercent24h >= 0,
            delay: CARD_DELAYS[i] || 0,
            position: CARD_POSITIONS[i] || CARD_POSITIONS[0],
          }));
          setFloatingCards(newCards);
        }
      } catch {
        // Keep fallback
      }
    };

    fetchCardData();
    const interval = setInterval(fetchCardData, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!heroRef.current) return;

      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          yPercent: -40,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          yPercent: -20, xPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 2 },
        });
      }

      const heroText = heroRef.current.querySelector('.hero-text');
      if (heroText) {
        gsap.to(heroText, {
          yPercent: 30, opacity: 0.3,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'center top', scrub: 1 },
        });
      }
    };
    initGSAP();
  }, []);

  const sparklinePath = portfolioSparkline.reduce((path, point, i) => {
    const x = (i / (portfolioSparkline.length - 1)) * 200;
    const y = 60 - (point / 100) * 50;
    return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
  }, '');

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden bg-dark-950">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-40" />

      <div ref={orb1Ref} className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div ref={orb2Ref} className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {floatingCards.map((card) => (
        <motion.div key={card.symbol}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 + card.delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute ${card.position} hidden lg:block z-10`}
        >
          <motion.div animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-gold rounded-2xl p-4 min-w-[160px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{card.symbol}</span>
              {card.up ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-red-400" />}
            </div>
            <p className="text-dark-400 text-xs mb-2">{card.name}</p>
            <p className="text-white font-semibold text-sm">{card.price}</p>
            <span className={`text-xs font-medium ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>{card.change}</span>
          </motion.div>
        </motion.div>
      ))}

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16">
        <div className="hero-text max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center mb-8">
            <span className="section-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              Terminal de Mercado ao Vivo
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
            Construa seu patrimônio <br />com <span className="gold-text">precisão</span>.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Acesso a portfólios institucionais, cotações em tempo real e análises guiadas por inteligência artificial. Toda a infraestrutura para multiplicar seu capital, em um único ambiente.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="btn-primary text-base">
              Comece a Investir <ArrowRight size={18} />
            </button>
            <button className="btn-secondary text-base">
              <Play size={16} /> Ver Demonstração
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="glass-gold rounded-3xl p-6 max-w-xl mx-auto shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-dark-400 text-sm mb-1">Portfólio Demo</p>
                <p className="text-3xl font-bold text-white">$<AnimatedCounter value={124580} duration={2000} /></p>
                <p className="text-emerald-400 text-sm mt-1 font-medium">↑ +$18.420 &nbsp;(+17,3%) acumulado</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-dark-400">Retorno (1A)</span>
                <p className="text-2xl font-bold text-gold-400 mt-0.5">+24.7%</p>
              </div>
            </div>
            <div className="relative h-16 mt-2">
              <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={sparklinePath + ` L 200,60 L 0,60 Z`} fill="url(#sparkGrad)" />
                <path d={sparklinePath} fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
      <MarketTicker />
    </section>
  );
}
