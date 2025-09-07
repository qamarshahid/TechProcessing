import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

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
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  newPassword: string;
}
