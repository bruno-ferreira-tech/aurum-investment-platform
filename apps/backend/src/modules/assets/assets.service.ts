import { Injectable } from '@nestjs/common';

export interface InvestmentProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  minInvestment: number;
  expectedReturn: string;
  risk: 'low' | 'medium' | 'high' | 'very-high';
  liquidity: 'daily' | 'monthly' | 'annual' | 'locked';
  features: string[];
  icon: string;
}

@Injectable()
export class AssetsService {
  getProducts(): InvestmentProduct[] {
    return [
      {
        id: '1',
        name: 'Aurum Growth',
        category: 'Managed Portfolio',
        description: 'A diversified portfolio targeting long-term capital appreciation through global equities and growth assets.',
        minInvestment: 1000,
        expectedReturn: '12-18% p.a.',
        risk: 'medium',
        liquidity: 'daily',
        features: ['Global diversification', 'Automatic rebalancing', 'Tax optimization', 'ESG screening'],
        icon: 'trending-up',
      },
      {
        id: '2',
        name: 'Aurum Crypto Alpha',
        category: 'Digital Assets',
        description: 'Strategic exposure to leading cryptocurrencies with active risk management and yield optimization.',
        minInvestment: 500,
        expectedReturn: '20-40% p.a.',
        risk: 'very-high',
        liquidity: 'daily',
        features: ['BTC & ETH core', 'DeFi yield', 'Cold storage security', 'Risk controls'],
        icon: 'bitcoin',
      },
      {
        id: '3',
        name: 'Aurum Stable',
        category: 'Fixed Income',
        description: 'Capital preservation with steady income through government and investment-grade corporate bonds.',
        minInvestment: 5000,
        expectedReturn: '5-8% p.a.',
        risk: 'low',
        liquidity: 'monthly',
        features: ['Capital preservation', 'Regular income', 'Inflation protection', 'Low volatility'],
        icon: 'shield',
      },
      {
        id: '4',
        name: 'Aurum Real Estate',
        category: 'Real Assets',
        description: 'Access to premium commercial and residential real estate through REITs and property funds.',
        minInvestment: 2500,
        expectedReturn: '8-12% p.a.',
        risk: 'medium',
        liquidity: 'monthly',
        features: ['Passive income', 'Inflation hedge', 'Portfolio diversification', 'Professional management'],
        icon: 'building',
      },
      {
        id: '5',
        name: 'Aurum AI & Tech',
        category: 'Thematic',
        description: 'Concentrated exposure to artificial intelligence and emerging technology leaders.',
        minInvestment: 1000,
        expectedReturn: '15-25% p.a.',
        risk: 'high',
        liquidity: 'daily',
        features: ['AI leaders', 'Semiconductor exposure', 'Cloud computing', 'Robotics & automation'],
        icon: 'cpu',
      },
    ];
  }

  getStats() {
    return {
      totalAUM: 4800000000,
      activeInvestors: 127500,
      averageReturn: 18.4,
      yearsOperating: 8,
      countriesServed: 42,
      successRate: 97.8,
    };
  }
}
