import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordStrengthDto {
  @ApiProperty({ 
    example: 'MySecurePassword123!',
    description: 'Password to check for strength'
  })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({ 
    example: ['John', 'Doe', 'john.doe@example.com'],
    description: 'User information to check against (optional)',
    required: false
  })
  @IsString({ each: true })
  userInfo?: string[];
}
