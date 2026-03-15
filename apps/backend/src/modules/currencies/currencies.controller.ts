import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all real-time currency data',
    description: 'Returns all crypto + forex currencies with live prices from CoinGecko and ExchangeRate-API',
  })
  @ApiResponse({ status: 200, description: 'All currencies retrieved successfully' })
  async findAll() {
    return this.currenciesService.getAllCurrencies();
  }

  @Get('crypto')
  @ApiOperation({
    summary: 'Get real-time cryptocurrency prices',
    description: 'Returns live crypto data from CoinGecko (BTC, ETH, SOL, etc.)',
  })
  @ApiResponse({ status: 200, description: 'Crypto data retrieved successfully' })
  async getCrypto() {
    return this.currenciesService.getCryptoData();
  }

  @Get('forex')
  @ApiOperation({
    summary: 'Get real-time forex exchange rates',
    description: 'Returns live forex data from ExchangeRate-API (EUR/USD, GBP/USD, USD/BRL, etc.)',
  })
  @ApiResponse({ status: 200, description: 'Forex data retrieved successfully' })
  async getForex() {
    return this.currenciesService.getForexData();
  }

  @Get(':symbol/chart')
  @ApiOperation({
    summary: 'Get historical price chart for a cryptocurrency',
    description: 'Returns real historical price data from CoinGecko for charting',
  })
  @ApiParam({ name: 'symbol', description: 'Crypto symbol (e.g. BTC, ETH, SOL)', example: 'BTC' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days of history (default 30)', example: '30' })
  @ApiResponse({ status: 200, description: 'Historical chart data retrieved successfully' })
  async getChart(
    @Param('symbol') symbol: string,
    @Query('days') days?: string,
  ) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.currenciesService.getHistoricalData(symbol, numDays);
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Get currency data by symbol' })
  @ApiParam({
    name: 'symbol',
    description: 'Currency symbol (e.g. BTC, ETH, EUR/USD)',
    example: 'BTC',
  })
  @ApiResponse({ status: 200, description: 'Currency data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  async findOne(@Param('symbol') symbol: string) {
    const data = await this.currenciesService.getCurrencyBySymbol(symbol);
    if (!data) {
      throw new NotFoundException(`Currency ${symbol} not found`);
    }
    return data;
  }
}
