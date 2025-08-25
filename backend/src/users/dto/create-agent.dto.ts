import { IsString, IsEmail, IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ description: 'Agent email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Agent password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Agent full name' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Unique agent code' })
  @IsString()
  agentCode: string;

  @ApiProperty({ description: 'Sales person name' })
  @IsString()
  salesPersonName: string;

  @ApiProperty({ description: 'Closer name' })
  @IsString()
  closerName: string;

  @ApiPropertyOptional({ description: 'Agent commission rate (default: 6%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  agentCommissionRate?: number;

  @ApiPropertyOptional({ description: 'Closer commission rate (default: 10%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  closerCommissionRate?: number;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Whether agent is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
