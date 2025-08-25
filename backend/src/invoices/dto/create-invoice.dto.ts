import { IsString, IsNumber, IsDateString, IsOptional, IsUUID, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'client-uuid-here' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'service-package-uuid-here', required: false })
  @IsOptional()
  @IsUUID()
  servicePackageId?: string;

  @ApiProperty({ example: 1500.00 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tax?: number;

  @ApiProperty({ example: 'Website development project' })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: [
      { description: 'Frontend Development', quantity: 1, rate: 1000, amount: 1000 },
      { description: 'Backend Development', quantity: 1, rate: 500, amount: 500 }
    ],
    required: false 
  })
  @IsOptional()
  @IsArray()
  lineItems?: any[];

  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 'Please pay within 30 days', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}