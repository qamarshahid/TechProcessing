import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class SendPhoneVerificationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' })
  phoneNumber: string;
}

export class VerifyPhoneCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Code must contain exactly 6 digits' })
  code: string;
}

export class SendPhonePasswordResetDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' })
  phoneNumber: string;
}

export class ResetPasswordWithPhoneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

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
