import { IsString, IsNumber, IsOptional, IsEmail, Min, Max, IsEnum } from 'class-validator';
import { CloserStatus } from '../entities/closer.entity';

export class CreateCloserDto {
  @IsString()
  closerCode: string;

  @IsString()
  closerName: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate: number;

  @IsEnum(CloserStatus)
  status: CloserStatus;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
