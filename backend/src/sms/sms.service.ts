import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {}

  async sendSms(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // For now, we'll log the SMS instead of actually sending it
      // In production, integrate with Twilio, AWS SNS, or another SMS provider
      
      this.logger.log(`SMS to ${to}: ${message}`);
      
      // Simulate SMS sending
      const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.logger.log(`SMS sent successfully with ID: ${messageId}`);
      
      return {
        success: true,
        messageId: messageId,
      };
    } catch (error) {
      this.logger.error('Failed to send SMS:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Your TechProcessing verification code is: ${code}. This code expires in 10 minutes.`;
    return this.sendSms(phoneNumber, message);
  }

  async sendPasswordResetCode(phoneNumber: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Your TechProcessing password reset code is: ${code}. This code expires in 10 minutes.`;
    return this.sendSms(phoneNumber, message);
  }
}
