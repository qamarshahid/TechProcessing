import { IsString, IsEmail, IsOptional, IsNumber, Min, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResubmitAgentSaleDto {
  @ApiProperty({ description: 'Original sale ID to resubmit' })
  @IsUUID()
  originalSaleId: string;

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

  @ApiPropertyOptional({ description: 'Additional notes explaining changes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
