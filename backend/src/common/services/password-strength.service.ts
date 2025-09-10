import { Injectable } from '@nestjs/common';

export interface PasswordStrengthResult {
  score: number; // 0-100
  level: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialChars: boolean;
    notCommon: boolean;
    notSequential: boolean;
    notRepeated: boolean;
    notUserInfo: boolean;
  };
}

@Injectable()
export class PasswordStrengthService {
  private readonly COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
    'qwerty123', 'dragon', 'master', 'hello', 'freedom', 'whatever',
    'qazwsx', 'trustno1', '654321', 'jordan23', 'harley', 'password1',
    '1234', 'robert', 'matthew', 'jordan', 'asshole', 'daniel'
  ];

  calculateStrength(password: string, userInfo: string[] = []): PasswordStrengthResult {
    const requirements = this.checkRequirements(password, userInfo);
    const score = this.calculateScore(password, requirements);
    const level = this.getStrengthLevel(score);
    const feedback = this.generateFeedback(requirements, score);

    return {
      score,
      level,
      feedback,
      requirements
    };
  }

  private checkRequirements(password: string, userInfo: string[] = []) {
    const lowerPassword = password.toLowerCase();
    
    return {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
      notCommon: !this.COMMON_PASSWORDS.some(common => lowerPassword.includes(common)),
      notSequential: !/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password),
      notRepeated: !/(.)\1{3,}/.test(password),
      notUserInfo: !userInfo.some(info => info && lowerPassword.includes(info.toLowerCase()))
    };
  }

  private calculateScore(password: string, requirements: any): number {
    let score = 0;
    const length = password.length;

    // Length scoring (0-25 points)
    if (length >= 12) score += 25;
    else if (length >= 10) score += 20;
    else if (length >= 8) score += 15;
    else if (length >= 6) score += 10;
    else if (length >= 4) score += 5;

    // Character variety scoring (0-50 points)
    if (requirements.uppercase) score += 10;
    if (requirements.lowercase) score += 10;
    if (requirements.numbers) score += 10;
    if (requirements.specialChars) score += 10;
    if (requirements.notCommon) score += 5;
    if (requirements.notSequential) score += 5;

    // Bonus for length beyond minimum (0-15 points)
    if (length >= 16) score += 15;
    else if (length >= 14) score += 10;
    else if (length >= 12) score += 5;

    // Penalty for repeated characters (0-10 points)
    if (requirements.notRepeated) score += 10;

    // Penalty for user info (0-10 points)
    if (requirements.notUserInfo) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  private getStrengthLevel(score: number): 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong' {
    if (score >= 90) return 'Very Strong';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Weak';
    return 'Very Weak';
  }

  private generateFeedback(requirements: any, score: number): string[] {
    const feedback: string[] = [];

    if (!requirements.length) {
      feedback.push('Password must be at least 12 characters long');
    } else if (score < 30) {
      feedback.push('Consider using a longer password (16+ characters)');
    }

    if (!requirements.uppercase) {
      feedback.push('Add uppercase letters (A-Z)');
    }

    if (!requirements.lowercase) {
      feedback.push('Add lowercase letters (a-z)');
    }

    if (!requirements.numbers) {
      feedback.push('Add numbers (0-9)');
    }

    if (!requirements.specialChars) {
      feedback.push('Add special characters (!@#$%^&*)');
    }

    if (!requirements.notCommon) {
      feedback.push('Avoid common passwords and dictionary words');
    }

    if (!requirements.notSequential) {
      feedback.push('Avoid sequential characters (123, abc)');
    }

    if (!requirements.notRepeated) {
      feedback.push('Avoid repeated characters (aaaa, 1111)');
    }

    if (!requirements.notUserInfo) {
      feedback.push('Avoid using your personal information');
    }

    if (score >= 75) {
      feedback.push('Great! This is a strong password');
    } else if (score >= 60) {
      feedback.push('Good password, but could be stronger');
    }

    return feedback;
  }

  validatePassword(password: string, userInfo: string[] = []): { isValid: boolean; errors: string[] } {
    const result = this.calculateStrength(password, userInfo);
    const errors: string[] = [];

    if (result.score < 60) {
      errors.push('Password does not meet minimum security requirements');
    }

    if (!result.requirements.length) {
      errors.push('Password must be at least 12 characters long');
    }

    if (!result.requirements.uppercase) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!result.requirements.lowercase) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!result.requirements.numbers) {
      errors.push('Password must contain at least one number');
    }

    if (!result.requirements.specialChars) {
      errors.push('Password must contain at least one special character');
    }

    if (!result.requirements.notCommon) {
      errors.push('Password cannot contain common passwords or dictionary words');
    }

    if (!result.requirements.notSequential) {
      errors.push('Password cannot contain sequential characters');
    }

    if (!result.requirements.notRepeated) {
      errors.push('Password cannot contain more than 3 repeated characters in a row');
    }

    if (!result.requirements.notUserInfo) {
      errors.push('Password cannot contain your personal information');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
