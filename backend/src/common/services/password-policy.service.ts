import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
  preventSequentialChars: boolean;
  preventRepeatedChars: boolean;
  maxRepeatedChars: number;
  historyLimit: number;
  expirationDays: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
}

@Injectable()
export class PasswordPolicyService {
  constructor(private configService: ConfigService) {}

  getPasswordPolicy(): PasswordPolicy {
    return {
      minLength: this.configService.get<number>('PASSWORD_MIN_LENGTH', 12),
      maxLength: this.configService.get<number>('PASSWORD_MAX_LENGTH', 128),
      requireUppercase: this.configService.get<boolean>('PASSWORD_REQUIRE_UPPERCASE', true),
      requireLowercase: this.configService.get<boolean>('PASSWORD_REQUIRE_LOWERCASE', true),
      requireNumbers: this.configService.get<boolean>('PASSWORD_REQUIRE_NUMBERS', true),
      requireSpecialChars: this.configService.get<boolean>('PASSWORD_REQUIRE_SPECIAL_CHARS', true),
      preventCommonPasswords: this.configService.get<boolean>('PASSWORD_PREVENT_COMMON', true),
      preventUserInfo: this.configService.get<boolean>('PASSWORD_PREVENT_USER_INFO', true),
      preventSequentialChars: this.configService.get<boolean>('PASSWORD_PREVENT_SEQUENTIAL', true),
      preventRepeatedChars: this.configService.get<boolean>('PASSWORD_PREVENT_REPEATED', true),
      maxRepeatedChars: this.configService.get<number>('PASSWORD_MAX_REPEATED_CHARS', 3),
      historyLimit: this.configService.get<number>('PASSWORD_HISTORY_LIMIT', 5),
      expirationDays: this.configService.get<number>('PASSWORD_EXPIRATION_DAYS', 90),
      maxFailedAttempts: this.configService.get<number>('PASSWORD_MAX_FAILED_ATTEMPTS', 5),
      lockoutDurationMinutes: this.configService.get<number>('PASSWORD_LOCKOUT_DURATION', 30),
    };
  }

  getPasswordRequirements(): string[] {
    const policy = this.getPasswordPolicy();
    const requirements: string[] = [];

    requirements.push(`At least ${policy.minLength} characters long`);
    
    if (policy.maxLength < 128) {
      requirements.push(`No more than ${policy.maxLength} characters`);
    }

    if (policy.requireUppercase) {
      requirements.push('At least one uppercase letter (A-Z)');
    }

    if (policy.requireLowercase) {
      requirements.push('At least one lowercase letter (a-z)');
    }

    if (policy.requireNumbers) {
      requirements.push('At least one number (0-9)');
    }

    if (policy.requireSpecialChars) {
      requirements.push('At least one special character (!@#$%^&*)');
    }

    if (policy.preventCommonPasswords) {
      requirements.push('Cannot contain common passwords or dictionary words');
    }

    if (policy.preventUserInfo) {
      requirements.push('Cannot contain your personal information');
    }

    if (policy.preventSequentialChars) {
      requirements.push('Cannot contain sequential characters (123, abc)');
    }

    if (policy.preventRepeatedChars) {
      requirements.push(`Cannot contain more than ${policy.maxRepeatedChars} repeated characters in a row`);
    }

    return requirements;
  }

  getPasswordPolicyDescription(): string {
    const requirements = this.getPasswordRequirements();
    return `Password must meet the following requirements:\n• ${requirements.join('\n• ')}`;
  }

  isPasswordExpired(lastPasswordChange: Date): boolean {
    const policy = this.getPasswordPolicy();
    if (policy.expirationDays <= 0) {
      return false; // No expiration
    }

    const expirationDate = new Date(lastPasswordChange);
    expirationDate.setDate(expirationDate.getDate() + policy.expirationDays);
    
    return new Date() > expirationDate;
  }

  getDaysUntilExpiration(lastPasswordChange: Date): number {
    const policy = this.getPasswordPolicy();
    if (policy.expirationDays <= 0) {
      return -1; // No expiration
    }

    const expirationDate = new Date(lastPasswordChange);
    expirationDate.setDate(expirationDate.getDate() + policy.expirationDays);
    
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }
}
