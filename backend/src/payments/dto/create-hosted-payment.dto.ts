import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHostedPaymentDto {
  @ApiProperty({ example: 'invoice-uuid-here' })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ example: 1500.00 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: 'https://yourapp.com/payment/success', required: false })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiProperty({ example: 'https://yourapp.com/payment/cancel', required: false })
  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @ApiProperty({ example: 'Payment for website development', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}