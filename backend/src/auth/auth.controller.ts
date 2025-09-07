import { Controller, Post, Body, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto, VerifyEmailCodeDto, ResendVerificationDto } from './dto/verify-email.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordCodeDto, ResetPasswordCodeDto } from './dto/password-reset-code.dto';
import { 
  SetupTotpDto, 
  EnableMfaDto, 
  VerifyMfaDto, 
  DisableMfaDto, 
  VerifyBackupCodeDto, 
  GenerateBackupCodesDto,
  SetTwoFactorMethodDto 
} from './dto/mfa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IpAddress, UserAgent } from '../common/decorators/ip-address.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('register')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 registrations per minute
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body() registerDto: RegisterDto,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    return this.authService.register(registerDto, ipAddress, userAgent);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  // Email verification endpoints
  @Post('verify-email')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('verify-email-code')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify email address with code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  async verifyEmailCode(@Body() verifyEmailCodeDto: VerifyEmailCodeDto) {
    return this.authService.verifyEmailCode(verifyEmailCodeDto);
  }

  @Post('resend-verification')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  async resendVerificationEmail(@Body() resendDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendDto);
  }

  // Password reset endpoints
  @Post('forgot-password')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Code-based password reset endpoints
  @Post('forgot-password-code')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiResponse({ status: 200, description: 'Password reset code sent' })
  async forgotPasswordCode(@Body() forgotPasswordCodeDto: ForgotPasswordCodeDto) {
    return this.authService.forgotPasswordCode(forgotPasswordCodeDto);
  }

  @Post('reset-password-code')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password with code' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  async resetPasswordCode(@Body() resetPasswordCodeDto: ResetPasswordCodeDto) {
    return this.authService.resetPasswordCode(resetPasswordCodeDto);
  }

  // MFA verification for login
  @Post('verify-mfa')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify MFA token for login' })
  @ApiResponse({ status: 200, description: 'MFA verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid MFA token' })
  async verifyMfaAndLogin(
    @Body() verifyMfaDto: VerifyMfaDto,
    @Headers('authorization') authHeader: string,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
  ) {
    const tempToken = authHeader?.replace('Bearer ', '');
    if (!tempToken) {
      throw new Error('Temporary token required');
    }
    return this.authService.verifyMfaAndLogin(verifyMfaDto, tempToken, ipAddress, userAgent);
  }

  // MFA setup and management endpoints
  @Post('mfa/setup-totp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Setup TOTP for MFA' })
  @ApiResponse({ status: 200, description: 'TOTP setup initiated' })
  async setupTotp(@CurrentUser() user: User) {
    const result = await this.mfaService.setupTotp(user.id);
    const qrCodeUrl = await this.mfaService.generateQRCode(result.qrCodeUrl);
    return {
      secret: result.secret,
      qrCodeUrl,
      backupCodes: result.backupCodes,
    };
  }

  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable MFA' })
  @ApiResponse({ status: 200, description: 'MFA enabled successfully' })
  async enableMfa(@CurrentUser() user: User, @Body() enableMfaDto: EnableMfaDto) {
    return this.mfaService.enableMfa(user.id, enableMfaDto.token);
  }

  @Post('mfa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable MFA' })
  @ApiResponse({ status: 200, description: 'MFA disabled successfully' })
  async disableMfa(@CurrentUser() user: User, @Body() disableMfaDto: DisableMfaDto) {
    return this.mfaService.disableMfa(user.id, disableMfaDto.password);
  }

  @Post('mfa/verify-backup-code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify backup code' })
  @ApiResponse({ status: 200, description: 'Backup code verified' })
  async verifyBackupCode(@CurrentUser() user: User, @Body() verifyBackupCodeDto: VerifyBackupCodeDto) {
    const isValid = await this.mfaService.verifyBackupCode(user.id, verifyBackupCodeDto.code);
    return { valid: isValid };
  }

  @Post('mfa/generate-backup-codes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate new backup codes' })
  @ApiResponse({ status: 200, description: 'New backup codes generated' })
  async generateNewBackupCodes(@CurrentUser() user: User, @Body() generateBackupCodesDto: GenerateBackupCodesDto) {
    return this.mfaService.generateNewBackupCodes(user.id, generateBackupCodesDto.password);
  }

  @Post('mfa/set-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set two-factor authentication method' })
  @ApiResponse({ status: 200, description: 'Two-factor method set successfully' })
  async setTwoFactorMethod(@CurrentUser() user: User, @Body() setTwoFactorMethodDto: SetTwoFactorMethodDto) {
    // This would update the user's preferred 2FA method
    // Implementation depends on your specific requirements
    return { message: 'Two-factor method updated successfully' };
  }
}