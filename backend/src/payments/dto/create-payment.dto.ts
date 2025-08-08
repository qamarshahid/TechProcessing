import { IsString, IsNumber, IsEnum, IsOptional, ValidateNested, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../common/enums/payment-method.enum';

class CardDetailsDto {
  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: '12/25' })
  @IsString()
  expiryDate: string;

  @ApiProperty({ example: '123' })
  @IsString()
  cvv: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  cardholderName: string;
}

export class CreatePaymentDto {
  @ApiProperty({ example: 'invoice-uuid-here' })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ example: 1500.00 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ type: CardDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CardDetailsDto)
  cardDetails?: CardDetailsDto;

  @ApiProperty({ example: 'Payment for website development', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}