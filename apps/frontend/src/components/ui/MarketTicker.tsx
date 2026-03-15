'use client';

import { useState, useEffect } from 'react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

const FALLBACK_DATA: TickerItem[] = [
  { symbol: 'BTC', price: '$67,845', change: '+1.87%', up: true },
  { symbol: 'ETH', price: '$3,542', change: '-1.26%', up: false },
  { symbol: 'SOL', price: '$182.45', change: '+5.13%', up: true },
];

function formatPrice(price: number): string {
  if (price >= 1000) return '$' + price.toLocaleString('en', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(4);
}

export default function MarketTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>(FALLBACK_DATA);

  const fetchData = async () => {
    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/v1/currencies',
      );
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      const currencies = json.data || json;

      if (Array.isArray(currencies) && currencies.length > 0) {
        const items: TickerItem[] = currencies.map((c: any) => ({
          symbol: c.symbol,
          price: formatPrice(c.price),
          change: `${c.changePercent24h >= 0 ? '+' : ''}${c.changePercent24h.toFixed(2)}%`,
          up: c.changePercent24h >= 0,
        }));
        setTickerData(items);
      }
    } catch {
      // Keep existing data on error
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  const doubled = [...tickerData, ...tickerData];

  return (
    <div className="w-full overflow-hidden glass border-y border-white/5 py-3">
      <div className="ticker-track gap-8 px-4">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-6 flex-shrink-0">
            <span className="text-dark-300 text-sm font-medium">{item.symbol}</span>
            <span className="text-white text-sm font-semibold">{item.price}</span>
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                item.up
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-red-400 bg-red-400/10'
              }`}
            >
              {item.change}
            </span>
            <span className="text-dark-700 mx-2">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
