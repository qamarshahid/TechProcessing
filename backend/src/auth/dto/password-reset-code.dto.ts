import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class ForgotPasswordCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Code must contain exactly 6 digits' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  newPassword: string;
}
