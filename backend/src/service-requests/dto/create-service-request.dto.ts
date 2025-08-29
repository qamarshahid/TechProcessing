import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { ServiceRequestStatus, RequestType } from '../entities/service-request.entity';

export class CreateServiceRequestDto {
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  timeline?: string;

  @IsOptional()
  @IsString()
  additionalRequirements?: string;

  @IsOptional()
  @IsBoolean()
  isCustomQuote?: boolean;

  @IsOptional()
  @IsEnum(RequestType)
  requestType?: RequestType;
}
