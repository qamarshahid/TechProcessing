import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {}

  async sendSms(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const firebaseServerKey = this.configService.get<string>('FIREBASE_SERVER_KEY');
      
      if (!firebaseServerKey) {
        this.logger.warn('Firebase Server Key not configured, logging SMS instead');
        this.logger.log(`SMS to ${to}: ${message}`);
        
        // Simulate SMS sending for development
        const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.logger.log(`SMS sent successfully with ID: ${messageId}`);
        
        return {
          success: true,
          messageId: messageId,
        };
      }

      // Use Firebase Cloud Messaging to send SMS
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${firebaseServerKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          notification: {
            title: 'TechProcessing LLC',
            body: message,
          },
          data: {
            type: 'sms',
            message: message,
          },
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        this.logger.log(`SMS sent successfully via Firebase with MessageId: ${result.message_id}`);
        return {
          success: true,
          messageId: result.message_id,
        };
      } else {
        throw new Error(result.error || 'Failed to send SMS via Firebase');
      }
    } catch (error) {
      this.logger.error('Failed to send SMS via Firebase:', error);
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
