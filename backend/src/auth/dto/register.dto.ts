import { IsEmail, IsString, MinLength, IsEnum, IsOptional, ValidateNested, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotDisposableEmail } from '../../common/validators/email-domain.validator';
import { IsStrongPassword, IsNotUserInfo } from '../../common/validators/password.validator';
import { UserRole } from '../../common/enums/user-role.enum';

class AddressDto {
  @ApiProperty({ example: '123 Main Street', required: false })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'NY', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '10001', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: 'United States', required: false })
  @IsString()
  @IsOptional()
  country?: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotDisposableEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePass123!@#',
    description: 'Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters'
  })
  @IsString()
  @IsStrongPassword({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventUserInfo: true,
    userInfoFields: ['firstName', 'lastName', 'email']
  })
  @IsNotUserInfo(['firstName', 'lastName', 'email'])
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'M', required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CLIENT;

  @ApiProperty({ example: 'Acme Corporation', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ example: '+1-555-123-4567', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ type: AddressDto, required: false })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}