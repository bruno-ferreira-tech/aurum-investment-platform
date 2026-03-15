import { Injectable } from '@nestjs/common';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedAssets: string[];
}

@Injectable()
export class NewsService {
  getNews(): NewsArticle[] {
    return [
      {
        id: '1',
        title: 'Federal Reserve Signals Potential Rate Cuts in Q2 2026',
        summary: 'Fed Chair indicates the central bank is closely monitoring inflation data and may begin easing cycle as economic conditions stabilize.',
        category: 'Macro',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        imageUrl: '/images/news/fed.jpg',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['SPY', 'QQQ', 'BTC'],
      },
      {
        id: '2',
        title: 'NVIDIA Reports Record Q1 Revenue, AI Demand Continues to Surge',
        summary: 'NVIDIA\'s data center division grew 427% YoY as hyperscalers and enterprises accelerate AI infrastructure investments.',
        category: 'Earnings',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        imageUrl: '/images/news/nvidia.jpg',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['NVDA', 'QQQ'],
      },
      {
        id: '3',
        title: 'Bitcoin Surpasses $65K as Institutional Adoption Hits New Record',
        summary: 'Spot Bitcoin ETF inflows reach $2.1B in single week as major pension funds begin allocating to digital assets.',
        category: 'Crypto',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        imageUrl: '/images/news/bitcoin.jpg',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['BTC', 'ETH'],
      },
      {
        id: '4',
        title: 'Global Markets React to Stronger-Than-Expected Jobs Data',
        summary: 'US economy added 285K jobs in February, beating consensus estimate of 200K, raising questions about the pace of Fed easing.',
        category: 'Macro',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        imageUrl: '/images/news/market.jpg',
        url: '#',
        sentiment: 'neutral',
        relatedAssets: ['SPY', 'EUR/USD', 'GOLD'],
      },
      {
        id: '5',
        title: 'Microsoft Azure Cloud Revenue Grows 31% in Latest Quarter',
        summary: 'Microsoft continues to benefit from enterprise cloud migration and AI integration across its product suite.',
        category: 'Earnings',
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        imageUrl: '/images/news/microsoft.jpg',
        url: '#',
        sentiment: 'positive',
        relatedAssets: ['MSFT', 'QQQ'],
      },
    ];
  }
}
