import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {}

  async sendSms(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const twilioAccountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
      const twilioPhoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        this.logger.warn('Twilio credentials not configured, logging SMS instead');
        this.logger.log(`SMS to ${to}: ${message}`);
        
        // Simulate SMS sending for development
        const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.logger.log(`SMS sent successfully with ID: ${messageId}`);
        
        return {
          success: true,
          messageId: messageId,
        };
      }

      // Use Twilio SDK to send SMS
      const twilio = require('twilio')(twilioAccountSid, twilioAuthToken);
      
      const result = await twilio.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: to
      });

      this.logger.log(`SMS sent successfully via Twilio with SID: ${result.sid}`);
      
      return {
        success: true,
        messageId: result.sid,
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
    try {
      const twilioAccountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
      const twilioVerifyServiceSid = this.configService.get<string>('TWILIO_VERIFY_SERVICE_SID');

      if (!twilioAccountSid || !twilioAuthToken || !twilioVerifyServiceSid) {
        this.logger.warn('Twilio Verify credentials not configured, using fallback SMS');
        return this.sendSms(phoneNumber, `Your TechProcessing verification code is: ${code}. This code expires in 10 minutes.`);
      }

      // Use Twilio Verify API for better deliverability
      const twilio = require('twilio')(twilioAccountSid, twilioAuthToken);
      
      const verification = await twilio.verify.v2
        .services(twilioVerifyServiceSid)
        .verifications
        .create({
          to: phoneNumber,
          channel: 'sms'
        });

      this.logger.log(`Verification code sent via Twilio Verify with SID: ${verification.sid}`);
      
      return {
        success: true,
        messageId: verification.sid,
      };
    } catch (error) {
      this.logger.error('Failed to send verification code via Twilio Verify:', error);
      // Fallback to regular SMS
      return this.sendSms(phoneNumber, `Your TechProcessing verification code is: ${code}. This code expires in 10 minutes.`);
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const twilioAccountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
      const twilioVerifyServiceSid = this.configService.get<string>('TWILIO_VERIFY_SERVICE_SID');

      if (!twilioAccountSid || !twilioAuthToken || !twilioVerifyServiceSid) {
        this.logger.warn('Twilio Verify credentials not configured, cannot verify code');
        return {
          success: false,
          error: 'Verification service not configured'
        };
      }

      // Use Twilio Verify API to verify the code
      const twilio = require('twilio')(twilioAccountSid, twilioAuthToken);
      
      const verificationCheck = await twilio.verify.v2
        .services(twilioVerifyServiceSid)
        .verificationChecks
        .create({
          to: phoneNumber,
          code: code
        });

      const isValid = verificationCheck.status === 'approved';
      
      this.logger.log(`Code verification result: ${verificationCheck.status} for ${phoneNumber}`);
      
      return {
        success: isValid,
        error: isValid ? undefined : 'Invalid or expired verification code'
      };
    } catch (error) {
      this.logger.error('Failed to verify code via Twilio Verify:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendPasswordResetCode(phoneNumber: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Your TechProcessing password reset code is: ${code}. This code expires in 10 minutes.`;
    return this.sendSms(phoneNumber, message);
  }
}
