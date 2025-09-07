import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

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
  code: string;
}

export class ResendVerificationDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
