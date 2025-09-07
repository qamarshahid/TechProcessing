import { IsString, IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyEmailCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Code must contain exactly 6 digits' })
  code: string;
}

export class ResendVerificationDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
