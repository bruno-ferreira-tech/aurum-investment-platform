import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get latest financial news' })
  @ApiResponse({ status: 200, description: 'News articles retrieved successfully' })
  findAll() {
    return this.newsService.getNews();
  }
}
