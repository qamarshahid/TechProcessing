import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PriceAdjustmentStatus } from '../entities/price-adjustment.entity';

export class UpdatePriceAdjustmentStatusDto {
  @IsEnum(PriceAdjustmentStatus)
  status: PriceAdjustmentStatus;

  @IsOptional()
  @IsString()
  clientNotes?: string;
}
