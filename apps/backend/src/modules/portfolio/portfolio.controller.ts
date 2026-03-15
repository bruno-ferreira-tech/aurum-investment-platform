import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, AddAssetDto } from './dto/portfolio.dto';

@ApiTags('Portfolio')
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get all portfolios' })
  @ApiResponse({ status: 200, description: 'Portfolios retrieved successfully' })
  findAll() {
    return this.portfolioService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully' })
  create(@Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get portfolio by ID' })
  @ApiParam({ name: 'id', description: 'Portfolio ID', example: 'demo' })
  @ApiResponse({ status: 200, description: 'Portfolio retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(id);
  }

  @Post(':id/assets')
  @ApiOperation({ summary: 'Add asset to portfolio' })
  @ApiParam({ name: 'id', description: 'Portfolio ID' })
  @ApiResponse({ status: 200, description: 'Asset added successfully' })
  addAsset(@Param('id') id: string, @Body() dto: AddAssetDto) {
    return this.portfolioService.addAsset(id, dto);
  }

  @Get(':id/performance')
  @ApiOperation({ summary: 'Get portfolio performance history' })
  @ApiParam({ name: 'id', description: 'Portfolio ID', example: 'demo' })
  @ApiResponse({ status: 200, description: 'Performance history retrieved successfully' })
  getPerformance(@Param('id') id: string) {
    return this.portfolioService.getPerformanceHistory(id);
  }
}
