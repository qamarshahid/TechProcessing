import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SubscriptionFrequency } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'client-uuid-here' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'service-package-uuid-here', required: false })
  @IsOptional()
  @IsUUID()
  servicePackageId?: string;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: SubscriptionFrequency, example: SubscriptionFrequency.MONTHLY })
  @IsEnum(SubscriptionFrequency)
  frequency: SubscriptionFrequency;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: 'Monthly website maintenance service' })
  @IsString()
  description: string;

  @ApiProperty({ example: {}, required: false })
  @IsOptional()
  metadata?: any;
}