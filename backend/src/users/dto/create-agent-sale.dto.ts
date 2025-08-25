import { IsString, IsEmail, IsOptional, IsNumber, Min, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleStatus } from '../entities/agent-sale.entity';

export class CreateAgentSaleDto {
  @ApiProperty({ description: 'Client name' })
  @IsString()
  clientName: string;

  @ApiProperty({ description: 'Client email' })
  @IsEmail()
  clientEmail: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsOptional()
  @IsString()
  clientPhone?: string;

  @ApiPropertyOptional({ description: 'Closer ID (if using closer dropdown)' })
  @IsOptional()
  @IsString()
  closerId?: string;

  @ApiProperty({ description: 'Closer name' })
  @IsString()
  closerName: string;

  @ApiProperty({ description: 'Service name' })
  @IsString()
  serviceName: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  serviceDescription?: string;

  @ApiProperty({ description: 'Sale amount' })
  @IsNumber()
  @Min(0)
  saleAmount: number;

  @ApiPropertyOptional({ description: 'Sale date' })
  @IsOptional()
  @IsDateString()
  saleDate?: string;

  @ApiPropertyOptional({ description: 'Payment date' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional({ description: 'Sale status' })
  @IsOptional()
  @IsEnum(SaleStatus)
  saleStatus?: SaleStatus;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Client details' })
  @IsOptional()
  clientDetails?: any;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: any;
}
