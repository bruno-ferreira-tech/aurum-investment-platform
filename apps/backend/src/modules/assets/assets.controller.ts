import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get all investment products' })
  @ApiResponse({ status: 200, description: 'Investment products retrieved successfully' })
  getProducts() {
    return this.assetsService.getProducts();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  @ApiResponse({ status: 200, description: 'Platform statistics retrieved successfully' })
  getStats() {
    return this.assetsService.getStats();
  }
}
