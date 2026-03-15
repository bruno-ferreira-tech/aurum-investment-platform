import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePortfolioDto, AddAssetDto } from './dto/portfolio.dto';

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercent: number;
  assets: PortfolioAsset[];
  createdAt: string;
  updatedAt: string;
}

const MOCK_PRICES: Record<string, number> = {
  AAPL: 189.30,
  MSFT: 415.20,
  GOOGL: 171.95,
  NVDA: 875.40,
  AMZN: 184.70,
  BTC: 67845.20,
  ETH: 3542.80,
  SOL: 182.45,
  SPY: 521.80,
  QQQ: 447.30,
};

const MOCK_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  NVDA: 'NVIDIA Corp.',
  AMZN: 'Amazon.com Inc.',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  SPY: 'SPDR S&P 500 ETF',
  QQQ: 'Invesco QQQ Trust',
};

@Injectable()
export class PortfolioService {
  private portfolios: Map<string, Portfolio> = new Map([
    [
      'demo',
      {
        id: 'demo',
        name: 'Aurum Demo Portfolio',
        description: 'A diversified portfolio showcasing Aurum capabilities',
        totalValue: 0,
        totalCost: 0,
        totalPnl: 0,
        totalPnlPercent: 0,
        assets: [
          { id: '1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 15, purchasePrice: 165.00, currentPrice: 189.30, value: 0, pnl: 0, pnlPercent: 0, allocation: 0 },
          { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 8, purchasePrice: 380.00, currentPrice: 415.20, value: 0, pnl: 0, pnlPercent: 0, allocation: 0 },
          { id: '3', symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 5, purchasePrice: 650.00, currentPrice: 875.40, value: 0, pnl: 0, pnlPercent: 0, allocation: 0 },
          { id: '4', symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, purchasePrice: 52000.00, currentPrice: 67845.20, value: 0, pnl: 0, pnlPercent: 0, allocation: 0 },
          { id: '5', symbol: 'ETH', name: 'Ethereum', quantity: 3, purchasePrice: 3100.00, currentPrice: 3542.80, value: 0, pnl: 0, pnlPercent: 0, allocation: 0 },
          { id: '6', symbol: 'SPY', name: 'SPDR S&P 500 ETF', quantity: 10, purchasePrice: 490.00, currentPrice: 521.80, value: 0, pnl: 0, pnlPercent: 0, allocation: 0 },
        ],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  private calculatePortfolio(portfolio: Portfolio): Portfolio {
    let totalValue = 0;
    let totalCost = 0;

    portfolio.assets = portfolio.assets.map((asset) => {
      const currentPrice = MOCK_PRICES[asset.symbol] || asset.currentPrice;
      const value = parseFloat((asset.quantity * currentPrice).toFixed(2));
      const cost = asset.quantity * asset.purchasePrice;
      const pnl = parseFloat((value - cost).toFixed(2));
      const pnlPercent = parseFloat(((pnl / cost) * 100).toFixed(2));
      totalValue += value;
      totalCost += cost;
      return { ...asset, currentPrice, value, pnl, pnlPercent };
    });

    portfolio.assets = portfolio.assets.map((a) => ({
      ...a,
      allocation: parseFloat(((a.value / totalValue) * 100).toFixed(2)),
    }));

    portfolio.totalValue = parseFloat(totalValue.toFixed(2));
    portfolio.totalCost = parseFloat(totalCost.toFixed(2));
    portfolio.totalPnl = parseFloat((totalValue - totalCost).toFixed(2));
    portfolio.totalPnlPercent = parseFloat((((totalValue - totalCost) / totalCost) * 100).toFixed(2));
    portfolio.updatedAt = new Date().toISOString();

    return portfolio;
  }

  findAll(): Portfolio[] {
    return Array.from(this.portfolios.values()).map((p) => this.calculatePortfolio({ ...p, assets: [...p.assets] }));
  }

  findOne(id: string): Portfolio {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${id} not found`);
    }
    return this.calculatePortfolio({ ...portfolio, assets: [...portfolio.assets] });
  }

  create(dto: CreatePortfolioDto): Portfolio {
    const id = Date.now().toString();
    const portfolio: Portfolio = {
      id,
      name: dto.name,
      description: dto.description,
      totalValue: 0,
      totalCost: 0,
      totalPnl: 0,
      totalPnlPercent: 0,
      assets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  addAsset(portfolioId: string, dto: AddAssetDto): Portfolio {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${portfolioId} not found`);
    }

    const asset: PortfolioAsset = {
      id: Date.now().toString(),
      symbol: dto.symbol.toUpperCase(),
      name: MOCK_NAMES[dto.symbol.toUpperCase()] || dto.symbol,
      quantity: dto.quantity,
      purchasePrice: dto.purchasePrice,
      currentPrice: MOCK_PRICES[dto.symbol.toUpperCase()] || dto.purchasePrice,
      value: 0,
      pnl: 0,
      pnlPercent: 0,
      allocation: 0,
    };

    portfolio.assets.push(asset);
    this.portfolios.set(portfolioId, portfolio);
    return this.calculatePortfolio({ ...portfolio, assets: [...portfolio.assets] });
  }

  getPerformanceHistory(id: string): { date: string; value: number }[] {
    const portfolio = this.findOne(id);
    const history = [];
    let base = portfolio.totalCost;

    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const growth = 1 + (0.003 * (90 - i) / 90) + (Math.random() - 0.45) * 0.015;
      base = base * growth;
      history.push({ date: date.toISOString().split('T')[0], value: parseFloat(base.toFixed(2)) });
    }

    return history;
  }
}
