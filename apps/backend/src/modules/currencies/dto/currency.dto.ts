import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum CurrencyType {
  CRYPTO = 'crypto',
  FOREX = 'forex',
}

export class CurrencyQueryDto {
  @ApiPropertyOptional({ enum: CurrencyType, description: 'Tipo de moeda' })
  @IsOptional()
  @IsEnum(CurrencyType)
  type?: CurrencyType;
}
