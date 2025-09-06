import { IsEmail, IsString, MinLength, IsEnum, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

class AddressDto {
  @ApiProperty({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '10001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 'United States' })
  @IsOptional()
  @IsString()
  country?: string;
}

export class CommunicationDetailDto {
  @ApiProperty({ example: 'PHONE', enum: ['PHONE', 'EMAIL', 'FAX'] })
  @IsEnum(['PHONE', 'EMAIL', 'FAX'])
  @IsString()
  type: 'PHONE' | 'EMAIL' | 'FAX';

  @ApiProperty({ example: 'WORK', enum: ['WORK', 'HOME'] })
  @IsEnum(['WORK', 'HOME'])
  @IsString()
  subType: 'WORK' | 'HOME';

  @ApiProperty({ example: '+1-555-123-4567' })
  @IsString()
  detail: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CLIENT;

  @ApiProperty({ example: 'Acme Corporation', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: '+1-555-123-4567', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ type: AddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiProperty({ type: [CommunicationDetailDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommunicationDetailDto)
  communicationDetails?: CommunicationDetailDto[];
}