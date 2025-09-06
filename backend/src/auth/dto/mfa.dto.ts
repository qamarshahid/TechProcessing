import { IsString, IsNotEmpty, Length, IsOptional, IsIn } from 'class-validator';

export class SetupTotpDto {
  // No additional fields needed - user ID comes from JWT
}

export class EnableMfaDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  token: string;
}

export class VerifyMfaDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  token: string;
}

export class DisableMfaDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyBackupCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

export class GenerateBackupCodesDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SetTwoFactorMethodDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['EMAIL', 'SMS', 'TOTP'])
  method: 'EMAIL' | 'SMS' | 'TOTP';

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
