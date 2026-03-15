import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AssetType {
  STOCK = 'stock',
  CRYPTO = 'crypto',
  ETF = 'etf',
  FOREX = 'forex',
  COMMODITY = 'commodity',
}

export enum Interval {
  ONE_MINUTE = '1m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  ONE_HOUR = '1h',
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
}

export class MarketQueryDto {
  @ApiPropertyOptional({ enum: AssetType, description: 'Type of asset' })
  @IsOptional()
  @IsEnum(AssetType)
  type?: AssetType;

  @ApiPropertyOptional({ description: 'Asset symbol (e.g. AAPL, BTC)' })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: Interval, default: Interval.ONE_DAY })
  @IsOptional()
  @IsEnum(Interval)
  interval?: Interval = Interval.ONE_DAY;
}
