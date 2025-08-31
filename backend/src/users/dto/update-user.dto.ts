import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean } from 'class-validator';

// Exclude sensitive/immutable fields such as password and role from generic updates
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role'] as const),
) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}