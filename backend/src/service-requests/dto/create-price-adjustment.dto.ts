import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePriceAdjustmentDto {
  @IsNumber()
  @IsNotEmpty()
  previousAmount: number;

  @IsNumber()
  @IsNotEmpty()
  newAmount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
