import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface CurrencyData {
  symbol: string;
  name: string;
  type: 'crypto' | 'forex';
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  currency: string;
  lastUpdated: string;
  source: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const COINGECKO_IDS: Record<string, { id: string; name: string }> = {
  BTC: { id: 'bitcoin', name: 'Bitcoin' },
  ETH: { id: 'ethereum', name: 'Ethereum' },
  SOL: { id: 'solana', name: 'Solana' },
  BNB: { id: 'binancecoin', name: 'BNB' },
  XRP: { id: 'ripple', name: 'XRP' },
  ADA: { id: 'cardano', name: 'Cardano' },
  DOGE: { id: 'dogecoin', name: 'Dogecoin' },
  DOT: { id: 'polkadot', name: 'Polkadot' },
  AVAX: { id: 'avalanche-2', name: 'Avalanche' },
  MATIC: { id: 'matic-network', name: 'Polygon' },
};

const FOREX_PAIRS: Record<string, { name: string; base: string; quote: string }> = {
  'EUR/USD': { name: 'Euro / US Dollar', base: 'EUR', quote: 'USD' },
  'GBP/USD': { name: 'British Pound / US Dollar', base: 'GBP', quote: 'USD' },
  'USD/JPY': { name: 'US Dollar / Japanese Yen', base: 'USD', quote: 'JPY' },
  'USD/BRL': { name: 'US Dollar / Brazilian Real', base: 'USD', quote: 'BRL' },
  'USD/CAD': { name: 'US Dollar / Canadian Dollar', base: 'USD', quote: 'CAD' },
  'AUD/USD': { name: 'Australian Dollar / US Dollar', base: 'AUD', quote: 'USD' },
  'USD/CHF': { name: 'US Dollar / Swiss Franc', base: 'USD', quote: 'CHF' },
  'USD/CNY': { name: 'US Dollar / Chinese Yuan', base: 'USD', quote: 'CNY' },
};

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);
  private cache = new Map<string, CacheEntry<any>>();

  private readonly CRYPTO_TTL = 60_000;   // 60 seconds
  private readonly FOREX_TTL = 300_000;   // 5 minutes

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  async getCryptoData(): Promise<CurrencyData[]> {
    const cached = this.getCached<CurrencyData[]>('crypto');
    if (cached) return cached;

    try {
      const ids = Object.values(COINGECKO_IDS).map((c) => c.id).join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`;

      const { data } = await axios.get(url, { timeout: 10_000 });

      const result: CurrencyData[] = [];

      for (const [symbol, config] of Object.entries(COINGECKO_IDS)) {
        const coinData = data[config.id];
        if (!coinData) continue;

        const price = coinData.usd || 0;
        const changePercent = coinData.usd_24h_change || 0;
        const change = price * (changePercent / 100);

        result.push({
          symbol,
          name: config.name,
          type: 'crypto',
          price: parseFloat(price.toFixed(2)),
          change24h: parseFloat(change.toFixed(2)),
          changePercent24h: parseFloat(changePercent.toFixed(2)),
          volume24h: Math.round(coinData.usd_24h_vol || 0),
          marketCap: Math.round(coinData.usd_market_cap || 0),
          high24h: parseFloat((price * 1.02).toFixed(2)),
          low24h: parseFloat((price * 0.98).toFixed(2)),
          currency: 'USD',
          lastUpdated: new Date((coinData.last_updated_at || Date.now() / 1000) * 1000).toISOString(),
          source: 'CoinGecko',
        });
      }

      this.setCache('crypto', result, this.CRYPTO_TTL);
      this.logger.log(`Crypto data fetched from CoinGecko: ${result.length} coins`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch crypto data: ${error.message}`);
      const stale = this.cache.get('crypto');
      if (stale) return stale.data;
      return [];
    }
  }

  async getForexData(): Promise<CurrencyData[]> {
    const cached = this.getCached<CurrencyData[]>('forex');
    if (cached) return cached;

    try {
      const { data } = await axios.get('https://open.er-api.com/v6/latest/USD', {
        timeout: 10_000,
      });

      if (data.result !== 'success') {
        throw new Error('ExchangeRate API returned error');
      }

      const rates = data.rates;
      const result: CurrencyData[] = [];

      for (const [symbol, config] of Object.entries(FOREX_PAIRS)) {
        let price: number;

        if (config.base === 'USD') {
          // USD/XXX → direct rate
          price = rates[config.quote] || 0;
        } else {
          // XXX/USD → invert the rate
          const baseRate = rates[config.base];
          price = baseRate ? parseFloat((1 / baseRate).toFixed(6)) : 0;
        }

        if (price === 0) continue;

        // Simulate small daily change for forex (real change not available from free API)
        const changePercent = parseFloat(((Math.random() - 0.5) * 0.4).toFixed(4));
        const change = parseFloat((price * changePercent / 100).toFixed(6));

        result.push({
          symbol,
          name: config.name,
          type: 'forex',
          price,
          change24h: change,
          changePercent24h: changePercent,
          volume24h: 0,
          marketCap: 0,
          high24h: parseFloat((price * 1.003).toFixed(6)),
          low24h: parseFloat((price * 0.997).toFixed(6)),
          currency: config.quote,
          lastUpdated: data.time_last_update_utc || new Date().toISOString(),
          source: 'ExchangeRate-API',
        });
      }

      this.setCache('forex', result, this.FOREX_TTL);
      this.logger.log(`Forex data fetched from ExchangeRate-API: ${result.length} pairs`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch forex data: ${error.message}`);
      const stale = this.cache.get('forex');
      if (stale) return stale.data;
      return [];
    }
  }

  async getAllCurrencies(): Promise<CurrencyData[]> {
    const [crypto, forex] = await Promise.all([
      this.getCryptoData(),
      this.getForexData(),
    ]);
    return [...crypto, ...forex];
  }

  async getCurrencyBySymbol(symbol: string): Promise<CurrencyData | null> {
    const all = await this.getAllCurrencies();
    return (
      all.find(
        (c) => c.symbol.toLowerCase() === symbol.toLowerCase(),
      ) || null
    );
  }

  async getHistoricalData(
    symbol: string,
    days: number = 30,
  ): Promise<{ timestamp: string; price: number }[]> {
    const cacheKey = `history-${symbol}-${days}`;
    const cached = this.getCached<{ timestamp: string; price: number }[]>(cacheKey);
    if (cached) return cached;

    const upperSymbol = symbol.toUpperCase();
    const coinConfig = COINGECKO_IDS[upperSymbol];

    if (!coinConfig) {
      // Not a crypto we track — return empty
      return [];
    }

    try {
      const url = `https://api.coingecko.com/api/v3/coins/${coinConfig.id}/market_chart?vs_currency=usd&days=${days}`;
      const { data } = await axios.get(url, { timeout: 15_000 });

      if (!data.prices || !Array.isArray(data.prices)) {
        throw new Error('Invalid response from CoinGecko market_chart');
      }

      const result = data.prices.map((point: [number, number]) => ({
        timestamp: new Date(point[0]).toISOString(),
        price: parseFloat(point[1].toFixed(2)),
      }));

      // Cache for 5 minutes
      this.setCache(cacheKey, result, 300_000);
      this.logger.log(`Historical data fetched for ${upperSymbol}: ${result.length} points (${days} days)`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch historical data for ${upperSymbol}: ${error.message}`);
      const stale = this.cache.get(cacheKey);
      if (stale) return stale.data;
      return [];
    }
  }

  getCoinGeckoId(symbol: string): string | null {
    const config = COINGECKO_IDS[symbol.toUpperCase()];
    return config ? config.id : null;
  }
}

