'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  up: boolean;
  isRealData: boolean;
  source: string;
}

interface ChartPoint {
  date: string;
  value: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const FALLBACK_DATA: MarketAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67845.20, change: 1250.40, changePercent: 1.87, volume: 28400000000, marketCap: 1330000000000, up: true, isRealData: false, source: 'Fallback' },
  { symbol: 'ETH', name: 'Ethereum', price: 3542.80, change: -45.20, changePercent: -1.26, volume: 15200000000, marketCap: 425000000000, up: false, isRealData: false, source: 'Fallback' },
  { symbol: 'SOL', name: 'Solana', price: 182.45, change: 8.90, changePercent: 5.13, volume: 4570000000, marketCap: 82000000000, up: true, isRealData: false, source: 'Fallback' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.30, change: 2.15, changePercent: 1.15, volume: 58200000, marketCap: 2940000000000, up: true, isRealData: false, source: 'Mock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.40, change: 21.60, changePercent: 2.53, volume: 42600000, marketCap: 2160000000000, up: true, isRealData: false, source: 'Mock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, change: 5.80, changePercent: 1.41, volume: 22100000, marketCap: 3080000000000, up: true, isRealData: false, source: 'Mock' },
];

function formatVolume(v: number): string {
  if (v >= 1e12) return '$' + (v / 1e12).toFixed(1) + 'T';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  return v.toLocaleString();
}

function formatCap(cap: number): string {
  if (cap === 0) return '—';
  if (cap >= 1e12) return '$' + (cap / 1e12).toFixed(2) + 'T';
  if (cap >= 1e9) return '$' + (cap / 1e9).toFixed(0) + 'B';
  if (cap >= 1e6) return '$' + (cap / 1e6).toFixed(0) + 'M';
  return '$' + cap.toLocaleString();
}

function formatPrice(price: number): string {
  if (price >= 1000) return '$' + price.toLocaleString('en', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(4);
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-gold rounded-xl px-4 py-3">
        <p className="text-gold-400 font-semibold text-sm">${payload[0].value.toLocaleString()}</p>
        <p className="text-dark-400 text-xs">{payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
};

export default function MarketSection() {
  const sectionRef = useScrollAnimation();
  const [marketData, setMarketData] = useState<MarketAsset[]>(FALLBACK_DATA);
  const [selected, setSelected] = useState<MarketAsset>(FALLBACK_DATA[0]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchChartData = useCallback(async (symbol: string) => {
    setChartLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/currencies/${symbol}/chart?days=30`);
      if (!res.ok) throw new Error('Chart API error');
      const json = await res.json();
      const points = json.data || json;

      if (Array.isArray(points) && points.length > 0) {
        // Sample data to ~30 points for performance
        const step = Math.max(1, Math.floor(points.length / 30));
        const sampled = points
          .filter((_: any, i: number) => i % step === 0 || i === points.length - 1)
          .map((p: any) => ({
            date: new Date(p.timestamp).toLocaleDateString('pt-BR', {
              month: 'short',
              day: 'numeric',
            }),
            value: p.price,
          }));
        setChartData(sampled);
        setChartLoading(false);
        return;
      }
    } catch {
      // Fallback to market chart endpoint
      try {
        const res = await fetch(`${API_BASE}/api/v1/market/${symbol}/chart?interval=1M`);
        if (res.ok) {
          const json = await res.json();
          const points = json.data || json;
          if (Array.isArray(points) && points.length > 0) {
            const mapped = points.map((p: any) => ({
              date: new Date(p.timestamp).toLocaleDateString('pt-BR', {
                month: 'short',
                day: 'numeric',
              }),
              value: p.close,
            }));
            setChartData(mapped);
          }
        }
      } catch {
        // Keep empty chart
      }
    }
    setChartLoading(false);
  }, []);

  const fetchMarketData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/market?limit=12`);
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      const assets = json.data || json;

      if (Array.isArray(assets) && assets.length > 0) {
        const mapped: MarketAsset[] = assets.map((a: any) => ({
          symbol: a.symbol,
          name: a.name,
          price: a.price,
          change: a.change,
          changePercent: a.changePercent,
          volume: a.volume,
          marketCap: a.marketCap,
          up: a.changePercent >= 0,
          isRealData: a.isRealData ?? false,
          source: a.source || 'Unknown',
        }));
        setMarketData(mapped);
        setIsLive(true);

        // Update selected if it matches a fetched asset
        const updatedSelected = mapped.find((a) => a.symbol === selected.symbol);
        if (updatedSelected) {
          setSelected(updatedSelected);
        } else {
          setSelected(mapped[0]);
          fetchChartData(mapped[0].symbol);
        }
      }
    } catch {
      setIsLive(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Fetch chart data when component mounts
  useEffect(() => {
    fetchChartData(selected.symbol);
  }, []);

  const handleSelect = (asset: MarketAsset) => {
    setSelected(asset);
    fetchChartData(asset.symbol);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMarketData();
    await fetchChartData(selected.symbol);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <section id="markets" ref={sectionRef} className="py-28 relative overflow-hidden bg-dark-950/50">
      <div className="absolute inset-0 hero-glow opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 gsap-hidden">
          <span className="section-tag mb-4">Mercados ao Vivo</span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
            Inteligência de mercado <span className="gold-text">em tempo real</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Acompanhe cada movimento. De ações a cripto — todos os seus mercados em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Asset List */}
          <div className="lg:col-span-2 glass rounded-3xl p-4 gsap-hidden-left">
            <div className="flex items-center justify-between px-2 pb-3 border-b border-white/5 mb-2">
              <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">Ativo</span>
              <div className="flex gap-8">
                <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">Preço</span>
                <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">24h</span>
              </div>
            </div>
            <div className="space-y-1">
              {marketData.map((asset) => (
                <div key={asset.symbol} onClick={() => handleSelect(asset)}
                  className={`market-row cursor-pointer ${selected.symbol === asset.symbol ? 'bg-gold-500/8 border border-gold-500/20 rounded-xl' : ''}`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white">{asset.symbol}</p>
                      {asset.isRealData && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Dados ao vivo" />
                      )}
                    </div>
                    <p className="text-xs text-dark-400">{asset.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(asset.price)}
                    </p>
                    <span className={`text-xs font-semibold w-16 text-right ${asset.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {asset.up ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Panel */}
          <div className="lg:col-span-3 glass rounded-3xl p-6 gsap-hidden-right">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{selected.symbol}</h3>
                  <span className="text-xs text-dark-400">{selected.name}</span>
                  {selected.isRealData && (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md">
                      AO VIVO
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatPrice(selected.price)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {selected.up ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-red-400" />}
                  <span className={`text-sm font-semibold ${selected.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selected.up ? '+' : ''}{selected.changePercent.toFixed(2)}% hoje
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-dark-400">Volume</p>
                  <p className="text-sm font-semibold text-white">{formatVolume(selected.volume)}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-dark-400">Cap. de Mercado</p>
                  <p className="text-sm font-semibold text-white">{formatCap(selected.marketCap)}</p>
                </div>
                <button onClick={handleRefresh}
                  className={`p-2 glass rounded-lg text-dark-400 hover:text-gold-400 transition-all duration-200 ${isRefreshing ? 'animate-spin' : ''}`}>
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="h-52 relative">
              {chartLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false}
                      tickFormatter={(v) => v >= 1000 ? '$' + (v / 1000).toFixed(0) + 'K' : '$' + v} width={60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={2} fill="url(#chartGrad)"
                      dot={false} activeDot={{ r: 5, fill: '#d4af37', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-500 text-sm">
                  Sem dados históricos disponíveis
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {isLive ? (
                  <><Wifi size={12} className="text-emerald-400" /><span className="text-xs text-emerald-400">Conectado — dados ao vivo</span></>
                ) : (
                  <><WifiOff size={12} className="text-dark-500" /><span className="text-xs text-dark-500">Offline — dados de fallback</span></>
                )}
              </div>
              {selected.source && selected.source !== 'Fallback' && (
                <span className="text-xs text-dark-600">Fonte: {selected.source}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
