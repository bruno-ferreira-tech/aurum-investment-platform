import { Injectable, Logger } from '@nestjs/common';
import { MarketQueryDto, AssetType } from './dto/market-query.dto';
import { CurrenciesService, CurrencyData } from '../currencies/currencies.service';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  currency: string;
  logoUrl: string;
  sparkline: number[];
  isRealData: boolean;
  source: string;
}

export interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  fearGreedIndex: number;
  topGainers: MarketAsset[];
  topLosers: MarketAsset[];
  trending: MarketAsset[];
}

// Mock data for stocks/ETFs/commodities (no free API available)
const MOCK_STOCK_DATA = [
  { id: 's1', symbol: 'AAPL', name: 'Apple Inc.', type: AssetType.STOCK, price: 189.30, change: 2.15, currency: 'USD', volume: 58234567, marketCap: 2940000000000, logoUrl: '/images/logos/aapl.png' },
  { id: 's2', symbol: 'MSFT', name: 'Microsoft Corp.', type: AssetType.STOCK, price: 415.20, change: 5.80, currency: 'USD', volume: 22134890, marketCap: 3080000000000, logoUrl: '/images/logos/msft.png' },
  { id: 's3', symbol: 'GOOGL', name: 'Alphabet Inc.', type: AssetType.STOCK, price: 171.95, change: -1.25, currency: 'USD', volume: 18956234, marketCap: 2120000000000, logoUrl: '/images/logos/googl.png' },
  { id: 's4', symbol: 'NVDA', name: 'NVIDIA Corp.', type: AssetType.STOCK, price: 875.40, change: 21.60, currency: 'USD', volume: 42567890, marketCap: 2160000000000, logoUrl: '/images/logos/nvda.png' },
  { id: 's5', symbol: 'AMZN', name: 'Amazon.com Inc.', type: AssetType.STOCK, price: 184.70, change: 3.20, currency: 'USD', volume: 31245678, marketCap: 1920000000000, logoUrl: '/images/logos/amzn.png' },
  { id: 'e1', symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: AssetType.ETF, price: 521.80, change: 4.20, currency: 'USD', volume: 89456234, marketCap: 490000000000, logoUrl: '/images/logos/spy.png' },
  { id: 'e2', symbol: 'QQQ', name: 'Invesco QQQ Trust', type: AssetType.ETF, price: 447.30, change: 6.15, currency: 'USD', volume: 45678901, marketCap: 220000000000, logoUrl: '/images/logos/qqq.png' },
  { id: 'c1', symbol: 'GOLD', name: 'Gold Spot', type: AssetType.COMMODITY, price: 2345.60, change: 12.30, currency: 'USD', volume: 234567, marketCap: 0, logoUrl: '/images/logos/gold.png' },
];

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(private readonly currenciesService: CurrenciesService) {}

  private generateSparkline(basePrice: number, points = 24): number[] {
    const sparkline: number[] = [];
    let current = basePrice;
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.48) * current * 0.02;
      current = Math.max(current + change, 0.01);
      sparkline.push(parseFloat(current.toFixed(2)));
    }
    return sparkline;
  }

  private convertCurrencyToMarketAsset(currency: CurrencyData, id: string): MarketAsset {
    const type = currency.type === 'crypto' ? AssetType.CRYPTO : AssetType.FOREX;
    return {
      id,
      symbol: currency.symbol,
      name: currency.name,
      type,
      price: currency.price,
      change: currency.change24h,
      changePercent: currency.changePercent24h,
      volume: currency.volume24h,
      marketCap: currency.marketCap,
      high24h: currency.high24h,
      low24h: currency.low24h,
      currency: currency.currency,
      logoUrl: `/images/logos/${currency.symbol.toLowerCase().replace('/', '')}.png`,
      sparkline: this.generateSparkline(currency.price),
      isRealData: true,
      source: currency.source,
    };
  }

  private getMockAssets(): MarketAsset[] {
    return MOCK_STOCK_DATA.map((a) => ({
      ...a,
      changePercent: parseFloat(((a.change / (a.price - a.change)) * 100).toFixed(2)),
      high24h: parseFloat((a.price * (1 + Math.random() * 0.03)).toFixed(2)),
      low24h: parseFloat((a.price * (1 - Math.random() * 0.03)).toFixed(2)),
      sparkline: this.generateSparkline(a.price),
      isRealData: false,
      source: 'Mock Data',
    }));
  }

  async findAll(query: MarketQueryDto): Promise<MarketAsset[]> {
    // Get real data from CurrenciesService
    const realCurrencies = await this.currenciesService.getAllCurrencies();
    const realAssets = realCurrencies.map((c, i) =>
      this.convertCurrencyToMarketAsset(c, `real-${i}`),
    );

    // Combine with mock stocks/ETFs/commodities
    const mockAssets = this.getMockAssets();
    let assets = [...realAssets, ...mockAssets];

    if (query.type) {
      assets = assets.filter((a) => a.type === query.type);
    }
    if (query.symbol) {
      assets = assets.filter((a) =>
        a.symbol.toLowerCase().includes(query.symbol.toLowerCase()),
      );
    }

    return assets.slice(0, query.limit || 20);
  }

  async findOne(symbol: string): Promise<MarketAsset | undefined> {
    // First try real data
    const realCurrency = await this.currenciesService.getCurrencyBySymbol(symbol);
    if (realCurrency) {
      return this.convertCurrencyToMarketAsset(realCurrency, `real-${symbol}`);
    }

    // Fallback to mock
    return this.getMockAssets().find(
      (a) => a.symbol.toLowerCase() === symbol.toLowerCase(),
    );
  }

  async getOverview(): Promise<MarketOverview> {
    const allAssets = await this.findAll({ limit: 50 } as MarketQueryDto);
    const sorted = [...allAssets].sort((a, b) => b.changePercent - a.changePercent);

    // Calculate real total market cap from live crypto data
    const cryptoAssets = allAssets.filter((a) => a.type === AssetType.CRYPTO);
    const totalCryptoMarketCap = cryptoAssets.reduce((sum, a) => sum + a.marketCap, 0);
    const btcAsset = cryptoAssets.find((a) => a.symbol === 'BTC');
    const btcDominance = btcAsset && totalCryptoMarketCap > 0
      ? parseFloat(((btcAsset.marketCap / totalCryptoMarketCap) * 100).toFixed(1))
      : 52.0;

    // Determine sentiment based on top cryptos performance
    const avgChange = cryptoAssets.length > 0
      ? cryptoAssets.reduce((sum, a) => sum + a.changePercent, 0) / cryptoAssets.length
      : 0;
    const sentiment = avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'neutral';

    return {
      totalMarketCap: totalCryptoMarketCap || 42500000000000,
      totalVolume24h: cryptoAssets.reduce((sum, a) => sum + a.volume, 0) || 287000000000,
      btcDominance,
      marketSentiment: sentiment,
      fearGreedIndex: Math.min(100, Math.max(0, Math.round(50 + avgChange * 10))),
      topGainers: sorted.slice(0, 3),
      topLosers: sorted.slice(-3).reverse(),
      trending: allAssets.filter((a) => a.isRealData).slice(0, 5),
    };
  }

  async getChartData(symbol: string, interval: string): Promise<{ timestamp: string; open: number; high: number; low: number; close: number; volume: number }[]> {
    // Map interval to days for CoinGecko
    const daysMap: Record<string, number> = {
      '1d': 1,
      '1w': 7,
      '1M': 30,
      '1h': 1,
      '5m': 1,
      '15m': 1,
    };
    const days = daysMap[interval] || 30;

    // Try real historical data for cryptos
    const historicalData = await this.currenciesService.getHistoricalData(symbol, days);

    if (historicalData.length > 0) {
      // Convert CoinGecko price-only data to OHLCV format
      return historicalData.map((point, i) => {
        const close = point.price;
        const prevPrice = i > 0 ? historicalData[i - 1].price : close;
        const open = prevPrice;
        const high = parseFloat((Math.max(open, close) * (1 + Math.random() * 0.005)).toFixed(2));
        const low = parseFloat((Math.min(open, close) * (1 - Math.random() * 0.005)).toFixed(2));
        const volume = Math.floor(Math.random() * 10000000 + 1000000);
        return {
          timestamp: point.timestamp,
          open: parseFloat(open.toFixed(2)),
          high,
          low,
          close,
          volume,
        };
      });
    }

    // Fallback: generate simulated data for stocks/ETFs
    const asset = await this.findOne(symbol);
    const basePrice = asset?.price || 100;
    const points = interval === '1d' ? 30 : interval === '1h' ? 24 : 60;
    const data = [];
    let current = basePrice * 0.85;

    for (let i = points; i >= 0; i--) {
      const open = current;
      const change = (Math.random() - 0.48) * current * 0.025;
      const close = parseFloat((current + change).toFixed(2));
      const high = parseFloat((Math.max(open, close) * (1 + Math.random() * 0.01)).toFixed(2));
      const low = parseFloat((Math.min(open, close) * (1 - Math.random() * 0.01)).toFixed(2));
      const volume = Math.floor(Math.random() * 10000000 + 1000000);
      const date = new Date();
      date.setDate(date.getDate() - i);

      data.push({
        timestamp: date.toISOString(),
        open: parseFloat(open.toFixed(2)),
        high,
        low,
        close,
        volume,
      });
      current = close;
    }

    return data;
  }
}
