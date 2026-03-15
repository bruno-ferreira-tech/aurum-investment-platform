export const api = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/api/v1${path}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json.data as T;
  },

  async getMarketOverview() {
    return this.get('/market/overview');
  },

  async getMarketAssets(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/market${query}`);
  },

  async getCurrencies() {
    return this.get('/currencies');
  },

  async getCryptoCurrencies() {
    return this.get('/currencies/crypto');
  },

  async getForexCurrencies() {
    return this.get('/currencies/forex');
  },

  async getPortfolio(id = 'demo') {
    return this.get(`/portfolios/${id}`);
  },

  async getPortfolioPerformance(id = 'demo') {
    return this.get(`/portfolios/${id}/performance`);
  },

  async getProducts() {
    return this.get('/assets/products');
  },

  async getStats() {
    return this.get('/assets/stats');
  },

  async getNews() {
    return this.get('/news');
  },
};

