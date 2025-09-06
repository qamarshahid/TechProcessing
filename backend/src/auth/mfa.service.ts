import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class MfaService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  /**
   * Generate TOTP secret for Google Authenticator
   */
  generateTotpSecret(user: User): { secret: string; qrCodeUrl: string } {
    const secret = speakeasy.generateSecret({
      name: `TechProcessing (${user.email})`,
      issuer: 'TechProcessing LLC',
      length: 32,
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
    };
  }

  /**
   * Generate QR code for TOTP setup
   */
  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify TOTP token
   */
  verifyTotpToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps (60 seconds) tolerance
    });
  }

  /**
   * Generate 6-digit verification code for email/SMS
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send email verification code
   */
  async sendEmailVerificationCode(user: User, code: string): Promise<void> {
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Your TechProcessing Verification Code',
      template: 'verification-code',
      context: {
        name: user.fullName,
        code,
        company: 'TechProcessing LLC',
      },
    });
  }

  /**
   * Send SMS verification code (placeholder - integrate with SMS service)
   */
  async sendSmsVerificationCode(phoneNumber: string, code: string): Promise<void> {
    // TODO: Integrate with SMS service like Twilio
    console.log(`SMS verification code for ${phoneNumber}: ${code}`);
    // For now, we'll just log it. In production, integrate with Twilio or similar
  }

  /**
   * Setup TOTP for user
   */
  async setupTotp(userId: string): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const user = await this.usersService.findOne(userId);
    
    const { secret, qrCodeUrl } = this.generateTotpSecret(user);
    const backupCodes = user.generateMfaBackupCodes();

    // Save secret and backup codes
    user.mfaSecret = secret;
    user.mfaBackupCodes = backupCodes;
    user.twoFactorMethod = 'TOTP';
    
    await this.usersService.save(user);

    return {
      secret,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Enable MFA for user
   */
  async enableMfa(userId: string, token: string): Promise<{ backupCodes: string[] }> {
    const user = await this.usersService.findOne(userId);
    
    if (!user.mfaSecret) {
      throw new Error('MFA secret not found. Please setup TOTP first.');
    }

    // Verify the token
    if (!this.verifyTotpToken(user.mfaSecret, token)) {
      throw new Error('Invalid verification code');
    }

    // Enable MFA
    user.mfaEnabled = true;
    await this.usersService.save(user);

    return {
      backupCodes: user.mfaBackupCodes,
    };
  }

  /**
   * Disable MFA for user
   */
  async disableMfa(userId: string, password: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    
    // Verify password before disabling MFA
    if (!await user.validatePassword(password)) {
      throw new Error('Invalid password');
    }

    // Disable MFA
    user.mfaEnabled = false;
    user.mfaSecret = null;
    user.mfaBackupCodes = null;
    user.twoFactorMethod = null;
    
    await this.usersService.save(user);
  }

  /**
   * Verify MFA token during login
   */
  async verifyMfaToken(userId: string, token: string): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    
    if (!user.mfaEnabled) {
      return true; // MFA not enabled, skip verification
    }

    switch (user.twoFactorMethod) {
      case 'TOTP':
        if (!user.mfaSecret) {
          throw new Error('MFA secret not found');
        }
        return this.verifyTotpToken(user.mfaSecret, token);
      
      case 'EMAIL':
        // For email verification, we'd store the code temporarily
        // This is a simplified version - in production, store codes in Redis
        return true; // Placeholder
      
      case 'SMS':
        // For SMS verification, we'd store the code temporarily
        // This is a simplified version - in production, store codes in Redis
        return true; // Placeholder
      
      default:
        throw new Error('Invalid MFA method');
    }
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    
    if (!user.mfaBackupCodes || !user.mfaBackupCodes.includes(code)) {
      return false;
    }

    // Remove used backup code
    user.mfaBackupCodes = user.mfaBackupCodes.filter(c => c !== code);
    await this.usersService.save(user);

    return true;
  }

  /**
   * Generate new backup codes
   */
  async generateNewBackupCodes(userId: string, password: string): Promise<string[]> {
    const user = await this.usersService.findOne(userId);
    
    // Verify password before generating new codes
    if (!await user.validatePassword(password)) {
      throw new Error('Invalid password');
    }

    const newCodes = user.generateMfaBackupCodes();
    await this.usersService.save(user);

    return newCodes;
  }
}
