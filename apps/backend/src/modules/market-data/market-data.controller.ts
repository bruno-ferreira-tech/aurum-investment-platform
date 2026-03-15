import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';
import { MarketQueryDto } from './dto/market-query.dto';

@ApiTags('Market Data')
@Controller('market')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all market assets', description: 'Returns a list of market assets with real-time data (crypto/forex live, stocks/ETFs mock)' })
  @ApiResponse({ status: 200, description: 'List of market assets retrieved successfully' })
  async findAll(@Query() query: MarketQueryDto) {
    return this.marketDataService.findAll(query);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get market overview', description: 'Returns overall market statistics with real crypto data including top gainers, losers and trending assets' })
  @ApiResponse({ status: 200, description: 'Market overview retrieved successfully' })
  async getOverview() {
    return this.marketDataService.getOverview();
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Get asset by symbol' })
  @ApiParam({ name: 'symbol', description: 'Asset symbol (e.g. AAPL, BTC)', example: 'BTC' })
  @ApiResponse({ status: 200, description: 'Asset data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findOne(@Param('symbol') symbol: string) {
    return this.marketDataService.findOne(symbol);
  }

  @Get(':symbol/chart')
  @ApiOperation({ summary: 'Get OHLCV chart data for an asset' })
  @ApiParam({ name: 'symbol', description: 'Asset symbol', example: 'AAPL' })
  @ApiResponse({ status: 200, description: 'Chart data retrieved successfully' })
  getChartData(
    @Param('symbol') symbol: string,
    @Query() query: MarketQueryDto,
  ) {
    return this.marketDataService.getChartData(symbol, query.interval || '1d');
  }
}
