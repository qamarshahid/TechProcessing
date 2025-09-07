import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto, VerifyEmailCodeDto, ResendVerificationDto } from './dto/verify-email.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordCodeDto, ResetPasswordCodeDto } from './dto/password-reset-code.dto';
import { SendPhoneVerificationDto, VerifyPhoneCodeDto, SendPhonePasswordResetDto, ResetPasswordWithPhoneDto } from './dto/phone-otp.dto';
import { VerifyMfaDto } from './dto/mfa.dto';
import { AuditService } from '../audit/audit.service';
import { SessionTrackingService } from '../common/services/session-tracking.service';
import { MfaService } from './mfa.service';
import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
    private sessionTrackingService: SessionTrackingService,
    private mfaService: MfaService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      if (user.isAccountLocked()) {
        throw new UnauthorizedException('Account is temporarily locked due to too many failed login attempts');
      }

      if (await user.validatePassword(password)) {
        // Reset failed login attempts on successful login
        user.resetFailedLoginAttempts();
        await this.usersService.save(user);
        
        const { password, ...result } = user;
        return result;
      } else {
        // Increment failed login attempts
        user.incrementFailedLoginAttempts();
        await this.usersService.save(user);
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      return null;
    }
    return null;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in');
    }

    // Check if account is active
    if (user.accountStatus !== 'ACTIVE') {
      throw new UnauthorizedException('Your account is not active. Please verify your email address.');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id, ipAddress);

    // Audit log with IP and User Agent
    await this.auditService.log({
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: { 
        email: user.email,
        ipAddress,
        userAgent,
      },
      user: user,
      ipAddress,
      userAgent,
    });

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      // Return temporary token for MFA verification
      const tempPayload = { 
        email: user.email, 
        sub: user.id, 
        role: user.role,
        mfaRequired: true,
        temp: true
      };
      
      const tempToken = this.jwtService.sign(tempPayload, { expiresIn: '5m' });
      
      return {
        requires_mfa: true,
        temp_token: tempToken,
        mfa_method: user.twoFactorMethod,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    }

    // Generate full JWT token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    const accessToken = this.jwtService.sign(payload);
    
    // Track active session
    const sessionId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessionTrackingService.addSession(sessionId, {
      id: user.id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    }, ipAddress || 'Unknown', userAgent || 'Unknown');

    return {
      access_token: accessToken,
      session_id: sessionId,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
      },
    };
  }

  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string) {
    try {
      const user = await this.usersService.create(registerDto);
      
      // Generate email verification code
      const verificationCode = user.generateEmailVerificationCode();
      await this.usersService.save(user);

      // Send verification email
      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Verify Your TechProcessing Account',
        template: 'email-verification',
        context: {
          name: user.fullName,
          verificationCode: verificationCode,
          company: 'TechProcessing LLC',
        },
      });

      // Audit log with IP and User Agent
      await this.auditService.log({
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: user.id,
        details: { 
          email: user.email, 
          role: user.role,
          ipAddress,
          userAgent,
        },
        user: user,
        ipAddress,
        userAgent,
      });

      return {
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          accountStatus: user.accountStatus,
        },
      };
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    const { password, ...profile } = user;
    return profile;
  }

  // Email verification methods
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByEmailVerificationToken(verifyEmailDto.token);
    
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.emailVerificationExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    user.isEmailVerified = true;
    user.accountStatus = 'ACTIVE';
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    
    await this.usersService.save(user);

    await this.auditService.log({
      action: 'EMAIL_VERIFIED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
      user: user,
    });

    return { message: 'Email verified successfully' };
  }

  async verifyEmailCode(verifyEmailCodeDto: VerifyEmailCodeDto) {
    const user = await this.usersService.findByEmail(verifyEmailCodeDto.email);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.emailVerificationCode || user.emailVerificationCode !== verifyEmailCodeDto.code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.emailVerificationCodeExpires || user.emailVerificationCodeExpires < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    user.isEmailVerified = true;
    user.accountStatus = 'ACTIVE';
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpires = null;
    
    await this.usersService.save(user);

    await this.auditService.log({
      action: 'EMAIL_VERIFIED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email, method: 'code' },
      user: user,
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(resendDto: ResendVerificationDto) {
    const user = await this.usersService.findByEmail(resendDto.email);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationCode = user.generateEmailVerificationCode();
    await this.usersService.save(user);

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Verify Your TechProcessing Account',
      template: 'email-verification',
        context: {
          name: user.fullName,
          verificationCode: verificationCode,
          company: 'TechProcessing LLC',
        },
    });

    return { message: 'Verification email sent' };
  }

  // Password reset methods
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    const resetToken = user.generatePasswordResetToken();
    await this.usersService.save(user);

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Reset Your TechProcessing Password',
      template: 'password-reset',
        context: {
          name: user.fullName,
          resetUrl: `${this.configService.get<string>('FRONTEND_URL', 'https://qamarshahid.github.io')}/reset-password?token=${resetToken}`,
          company: 'TechProcessing LLC',
        },
    });

    await this.auditService.log({
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
      user: user,
    });

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByPasswordResetToken(resetPasswordDto.token);
    
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    user.password = resetPasswordDto.newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.resetFailedLoginAttempts();
    
    await this.usersService.save(user);

    await this.auditService.log({
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
      user: user,
    });

    return { message: 'Password reset successfully' };
  }

  // Code-based password reset methods
  async forgotPasswordCode(forgotPasswordCodeDto: ForgotPasswordCodeDto) {
    const user = await this.usersService.findByEmail(forgotPasswordCodeDto.email);
    
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists, a password reset code has been sent' };
    }

    const resetCode = user.generatePasswordResetCode();
    await this.usersService.save(user);

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Reset Your TechProcessing Password',
      template: 'password-reset-code',
      context: {
        name: user.fullName,
        resetCode: resetCode,
        company: 'TechProcessing LLC',
      },
    });

    await this.auditService.log({
      action: 'PASSWORD_RESET_CODE_REQUESTED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
      user: user,
    });

    return { message: 'If the email exists, a password reset code has been sent' };
  }

  async resetPasswordCode(resetPasswordCodeDto: ResetPasswordCodeDto) {
    const user = await this.usersService.findByEmail(resetPasswordCodeDto.email);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.passwordResetCode || user.passwordResetCode !== resetPasswordCodeDto.code) {
      throw new BadRequestException('Invalid reset code');
    }

    if (!user.passwordResetCodeExpires || user.passwordResetCodeExpires < new Date()) {
      throw new BadRequestException('Reset code has expired');
    }

    user.password = resetPasswordCodeDto.newPassword;
    user.passwordResetCode = null;
    user.passwordResetCodeExpires = null;
    user.resetFailedLoginAttempts(); // Also unlock the account
    
    await this.usersService.save(user);

    await this.auditService.log({
      action: 'PASSWORD_RESET_CODE_USED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
      user: user,
    });

    return { message: 'Password reset successfully' };
  }

  // Phone OTP methods
  async sendPhoneVerification(sendPhoneVerificationDto: SendPhoneVerificationDto) {
    const user = await this.usersService.findByPhoneNumber(sendPhoneVerificationDto.phoneNumber);
    
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the phone number exists, a verification code has been sent' };
    }

    const verificationCode = user.generatePhoneVerificationCode();
    await this.usersService.save(user);

    const smsResult = await this.smsService.sendVerificationCode(user.phoneNumber, verificationCode);
    
    if (!smsResult.success) {
      throw new BadRequestException('Failed to send verification code');
    }

    await this.auditService.log({
      action: 'PHONE_VERIFICATION_SENT',
      entityType: 'User',
      entityId: user.id,
      details: { phoneNumber: user.phoneNumber },
      user: user,
    });

    return { message: 'If the phone number exists, a verification code has been sent' };
  }

  async verifyPhoneCode(verifyPhoneCodeDto: VerifyPhoneCodeDto) {
    const user = await this.usersService.findByPhoneNumber(verifyPhoneCodeDto.phoneNumber);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.phoneVerificationCode || user.phoneVerificationCode !== verifyPhoneCodeDto.code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.phoneVerificationCodeExpires || user.phoneVerificationCodeExpires < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = null;
    user.phoneVerificationCodeExpires = null;
    
    await this.usersService.save(user);

    await this.auditService.log({
      action: 'PHONE_VERIFIED',
      entityType: 'User',
      entityId: user.id,
      details: { phoneNumber: user.phoneNumber },
      user: user,
    });

    return { message: 'Phone number verified successfully' };
  }

  async sendPhonePasswordReset(sendPhonePasswordResetDto: SendPhonePasswordResetDto) {
    const user = await this.usersService.findByPhoneNumber(sendPhonePasswordResetDto.phoneNumber);
    
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the phone number exists, a password reset code has been sent' };
    }

    const resetCode = user.generatePhonePasswordResetCode();
    await this.usersService.save(user);

    const smsResult = await this.smsService.sendPasswordResetCode(user.phoneNumber, resetCode);
    
    if (!smsResult.success) {
      throw new BadRequestException('Failed to send password reset code');
    }

    await this.auditService.log({
      action: 'PHONE_PASSWORD_RESET_SENT',
      entityType: 'User',
      entityId: user.id,
      details: { phoneNumber: user.phoneNumber },
      user: user,
    });

    return { message: 'If the phone number exists, a password reset code has been sent' };
  }

  async resetPasswordWithPhone(resetPasswordWithPhoneDto: ResetPasswordWithPhoneDto) {
    const user = await this.usersService.findByPhoneNumber(resetPasswordWithPhoneDto.phoneNumber);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.phonePasswordResetCode || user.phonePasswordResetCode !== resetPasswordWithPhoneDto.code) {
      throw new BadRequestException('Invalid reset code');
    }

    if (!user.phonePasswordResetCodeExpires || user.phonePasswordResetCodeExpires < new Date()) {
      throw new BadRequestException('Reset code has expired');
    }

    user.password = resetPasswordWithPhoneDto.newPassword;
    user.phonePasswordResetCode = null;
    user.phonePasswordResetCodeExpires = null;
    user.resetFailedLoginAttempts(); // Also unlock the account
    
    await this.usersService.save(user);

    await this.auditService.log({
      action: 'PASSWORD_RESET_WITH_PHONE',
      entityType: 'User',
      entityId: user.id,
      details: { phoneNumber: user.phoneNumber },
      user: user,
    });

    return { message: 'Password reset successfully' };
  }

  // MFA verification for login
  async verifyMfaAndLogin(verifyMfaDto: VerifyMfaDto, tempToken: string, ipAddress?: string, userAgent?: string) {
    try {
      const payload = this.jwtService.verify(tempToken);
      
      if (!payload.temp || !payload.mfaRequired) {
        throw new UnauthorizedException('Invalid temporary token');
      }

      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify MFA token
      const isValid = await this.mfaService.verifyMfaToken(user.id, verifyMfaDto.token);
      
      if (!isValid) {
        throw new UnauthorizedException('Invalid MFA token');
      }

      // Generate full JWT token
      const fullPayload = { 
        email: user.email, 
        sub: user.id, 
        role: user.role 
      };
      const accessToken = this.jwtService.sign(fullPayload);
      
      // Track active session
      const sessionId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.sessionTrackingService.addSession(sessionId, {
        id: user.id,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
      }, ipAddress || 'Unknown', userAgent || 'Unknown');

      await this.auditService.log({
        action: 'MFA_VERIFIED',
        entityType: 'User',
        entityId: user.id,
        details: { 
          email: user.email,
          mfaMethod: user.twoFactorMethod,
          ipAddress,
          userAgent,
        },
        user: user,
        ipAddress,
        userAgent,
      });

      return {
        access_token: accessToken,
        session_id: sessionId,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          mfaEnabled: user.mfaEnabled,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid MFA verification');
    }
  }
}