import { IsString, IsNumber, IsDateString, IsOptional, IsUUID, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentLinkDto {
  @ApiProperty({ example: 'client-uuid-here' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'Website Development Payment' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Final payment for website development project', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2500.00 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: '2024-02-15T00:00:00.000Z' })
  @IsDateString()
  expiresAt: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  allowPartialPayment?: boolean;

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  metadata?: any;
}