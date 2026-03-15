import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({ description: 'Portfolio name', example: 'My Growth Portfolio' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Portfolio description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddAssetDto {
  @ApiProperty({ description: 'Asset symbol', example: 'AAPL' })
  @IsString()
  symbol: string;

  @ApiProperty({ description: 'Quantity of shares/units', example: 10 })
  @IsNumber()
  @Min(0.0001)
  quantity: number;

  @ApiProperty({ description: 'Purchase price per unit', example: 175.50 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;
}
