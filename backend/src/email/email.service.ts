import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as sgMail from '@sendgrid/mail';

export interface ContactFormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  projectType: string;
  timeline: string;
  message?: string;
}

export interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  business: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.initializeSendGrid();
  }

  private initializeTransporter() {
    const emailConfig = {
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('EMAIL_USER', 'support@techprocessingllc.com'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
    
    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email service configuration error:', error);
        this.logger.error('Email config:', {
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          user: emailConfig.auth.user,
          // Don't log password for security
        });
      } else {
        this.logger.log('Email service is ready to send messages');
        this.logger.log('Email config verified:', {
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          user: emailConfig.auth.user,
        });
      }
    });
  }

  private initializeSendGrid() {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (sendGridApiKey) {
      // Clean the API key (remove any whitespace or newlines)
      const cleanApiKey = sendGridApiKey.trim();
      this.logger.log('SendGrid API key found, length:', cleanApiKey.length);
      this.logger.log('SendGrid API key starts with:', cleanApiKey.substring(0, 10) + '...');
      sgMail.setApiKey(cleanApiKey);
      this.logger.log('SendGrid initialized successfully');
    } else {
      this.logger.warn('SendGrid API key not found, falling back to SMTP');
    }
  }

  async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.sendEmail({
        to: this.configService.get<string>('EMAIL_RECIPIENT', 'support@techprocessingllc.com'),
        subject: `New Contact Form Submission from ${data.name}`,
        html: this.generateContactFormHTML(data),
        text: this.generateContactFormText(data),
      });

      if (result.success) {
        this.logger.log(`Contact form email sent successfully`);
        return {
          success: true,
          message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.logger.error('Failed to send contact form email:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again or call us directly at (813) 324-1862.'
      };
    }
  }

  async sendEmail(data: { to: string; subject: string; html?: string; text?: string; template?: string; context?: any }): Promise<{ success: boolean; message: string }> {
    try {
      let htmlContent = data.html;
      let textContent = data.text;

      // Handle template-based emails
      if (data.template && data.context) {
        if (data.template === 'email-verification') {
          htmlContent = this.generateEmailVerificationHTML(data.context);
          textContent = this.generateEmailVerificationText(data.context);
        } else if (data.template === 'password-reset') {
          htmlContent = this.generatePasswordResetHTML(data.context);
          textContent = this.generatePasswordResetText(data.context);
        } else if (data.template === 'password-reset-code') {
          htmlContent = this.generatePasswordResetCodeHTML(data.context);
          textContent = this.generatePasswordResetCodeText(data.context);
        } else if (data.template === 'welcome') {
          htmlContent = this.generateWelcomeHTML(data.context);
          textContent = this.generateWelcomeText(data.context);
        }
      }

      const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
      
      if (sendGridApiKey) {
        // Use SendGrid
        const cleanApiKey = sendGridApiKey.trim();
        this.logger.log('Using SendGrid with API key length:', cleanApiKey.length);
        
        // Determine categories and custom args based on email type
        let categories = ['transactional'];
        let customArgs = {};
        
        if (data.template === 'email-verification') {
          categories = ['verification', 'transactional'];
          customArgs = {
            source: 'email-verification',
            user_type: 'new_registration'
          };
        } else if (data.subject?.includes('Contact Form')) {
          categories = ['contact-form', 'transactional'];
          customArgs = {
            source: 'contact-form',
            user_type: 'lead'
          };
        } else if (data.subject?.includes('Appointment')) {
          categories = ['appointment', 'transactional'];
          customArgs = {
            source: 'appointment-request',
            user_type: 'lead'
          };
        }

        const msg = {
          to: data.to,
          from: {
            email: this.configService.get<string>('EMAIL_USER', 'support@techprocessingllc.com'),
            name: 'TechProcessing LLC'
          },
          replyTo: {
            email: 'support@techprocessingllc.com',
            name: 'TechProcessing Support'
          },
          subject: data.subject,
          html: htmlContent || 'Email content not provided',
          text: textContent || (htmlContent ? htmlContent.replace(/<[^>]*>/g, '') : 'Email content not provided'),
          headers: {
            'X-Mailer': 'TechProcessing-Platform',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal',
            'List-Unsubscribe': '<mailto:unsubscribe@techprocessingllc.com>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          },
          categories: categories,
          customArgs: customArgs
        };

        try {
          const result = await sgMail.send(msg);
          this.logger.log(`Email sent successfully via SendGrid to ${data.to}`, {
            messageId: result[0].headers['x-message-id'],
            subject: data.subject,
            template: data.template
          });
          return { success: true, message: 'Email sent successfully' };
        } catch (sendGridError) {
          this.logger.error('SendGrid error:', {
            error: sendGridError.message,
            code: sendGridError.code,
            response: sendGridError.response?.body
          });
          throw sendGridError;
        }
      } else {
        // Fallback to SMTP
        const mailOptions = {
          from: this.configService.get<string>('EMAIL_USER', 'support@techprocessingllc.com'),
          to: data.to,
          subject: data.subject,
          html: htmlContent || 'Email content not provided',
          text: textContent || (htmlContent ? htmlContent.replace(/<[^>]*>/g, '') : 'Email content not provided'),
        };

        const result = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent successfully via SMTP to ${data.to}`, {
          messageId: result.messageId,
          subject: data.subject,
          template: data.template
        });
        return { success: true, message: 'Email sent successfully' };
      }
    } catch (error) {
      this.logger.error('Failed to send email:', {
        error: error.message,
        to: data.to,
        subject: data.subject,
        template: data.template,
        stack: error.stack
      });
      return { success: false, message: 'Failed to send email' };
    }
  }

  async sendAppointmentRequest(data: AppointmentData): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.sendEmail({
        to: this.configService.get<string>('EMAIL_RECIPIENT', 'support@techprocessingllc.com'),
        subject: `New Appointment Request from ${data.name}`,
        html: this.generateAppointmentHTML(data),
        text: this.generateAppointmentText(data),
      });

      if (result.success) {
        this.logger.log(`Appointment request email sent successfully`);
        return {
          success: true,
          message: 'Appointment request sent! We\'ll contact you to confirm your preferred time.'
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      this.logger.error('Failed to send appointment request email:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your appointment request. Please call us directly at (813) 324-1862.'
      };
    }
  }

  private generateContactFormHTML(data: ContactFormData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px 25px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { padding: 30px 25px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
          .value { padding: 12px 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6; font-size: 15px; color: #1f2937; }
          .value a { color: #3b82f6; text-decoration: none; }
          .value a:hover { text-decoration: underline; }
          .footer { margin-top: 30px; padding-top: 25px; border-top: 2px solid #e5e7eb; }
          .footer h3 { margin: 0 0 15px 0; color: #374151; font-size: 16px; }
          .footer ul { margin: 0; padding-left: 20px; }
          .footer li { margin-bottom: 8px; color: #6b7280; font-size: 14px; }
          .timestamp { text-align: center; margin-top: 20px; padding: 15px; background: #f1f5f9; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>TechProcessing LLC Website</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Full Name</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Business Name</div>
              <div class="value">${data.business}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            <div class="field">
              <div class="label">Project Type</div>
              <div class="value">${data.projectType}</div>
            </div>
            <div class="field">
              <div class="label">Timeline</div>
              <div class="value">${data.timeline}</div>
            </div>
            ${data.message ? `
            <div class="field">
              <div class="label">Message</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            <div class="footer">
              <h3>Recommended Next Steps</h3>
              <ul>
                <li>Reply directly to this email to respond to ${data.name}</li>
                <li>Add lead to CRM system for proper follow-up</li>
                <li>Schedule initial consultation call if appropriate</li>
                <li>Send project proposal or quote if requested</li>
              </ul>
            </div>
            <div class="timestamp">
              Received on ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateContactFormText(data: ContactFormData): string {
    return `
New Contact Form Submission - TechProcessing LLC

Name: ${data.name}
Business: ${data.business}
Email: ${data.email}
Phone: ${data.phone}
Project Type: ${data.projectType}
Timeline: ${data.timeline}
${data.message ? `Message: ${data.message}` : ''}

Reply to: ${data.email}
    `.trim();
  }

  private generateAppointmentHTML(data: AppointmentData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Appointment Request</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 25px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { padding: 30px 25px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
          .value { padding: 12px 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981; font-size: 15px; color: #1f2937; }
          .value a { color: #10b981; text-decoration: none; }
          .value a:hover { text-decoration: underline; }
          .urgent { background: #fef3c7; border-left-color: #f59e0b; }
          .urgent .label { color: #92400e; }
          .footer { margin-top: 30px; padding-top: 25px; border-top: 2px solid #e5e7eb; }
          .footer h3 { margin: 0 0 15px 0; color: #374151; font-size: 16px; }
          .footer ul { margin: 0; padding-left: 20px; }
          .footer li { margin-bottom: 8px; color: #6b7280; font-size: 14px; }
          .timestamp { text-align: center; margin-top: 20px; padding: 15px; background: #f1f5f9; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Appointment Request</h1>
            <p>TechProcessing LLC Consultation</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Full Name</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Business Name</div>
              <div class="value">${data.business}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            <div class="field">
              <div class="label">Service Type</div>
              <div class="value">${data.serviceType}</div>
            </div>
            <div class="field urgent">
              <div class="label">Preferred Date</div>
              <div class="value">${data.preferredDate}</div>
            </div>
            <div class="field urgent">
              <div class="label">Preferred Time</div>
              <div class="value">${data.preferredTime}</div>
            </div>
            ${data.message ? `
            <div class="field">
              <div class="label">Additional Notes</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            <div class="footer">
              <h3>Recommended Next Steps</h3>
              <ul>
                <li>Confirm availability for ${data.preferredDate} at ${data.preferredTime}</li>
                <li>Send calendar invite with meeting link</li>
                <li>Reply to confirm or suggest alternative times</li>
                <li>Prepare consultation materials for ${data.serviceType}</li>
              </ul>
            </div>
            <div class="timestamp">
              Received on ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAppointmentText(data: AppointmentData): string {
    return `
New Appointment Request - TechProcessing LLC

Name: ${data.name}
Business: ${data.business}
Email: ${data.email}
Phone: ${data.phone}
Service Type: ${data.serviceType}
Preferred Date: ${data.preferredDate}
Preferred Time: ${data.preferredTime}
${data.message ? `Additional Notes: ${data.message}` : ''}

Reply to: ${data.email}
    `.trim();
  }

  private generateEmailVerificationHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - TechProcessing LLC</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .code { background: #f8f9fa; border: 2px solid #10b981; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 25px 0; font-family: 'Courier New', monospace; color: #10b981; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 20px 0; }
          .instruction { background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TechProcessing LLC</h1>
            <p>Email Verification Required</p>
          </div>
          <div class="content">
            <h2>Hello ${context.name}!</h2>
            <p>Thank you for registering with TechProcessing LLC. Your account has been created and is currently pending verification. To activate your account and start accessing our services, please use the verification code below:</p>
            
            <div class="code">${context.verificationCode}</div>
            
            <div class="instruction">
              <strong>Enter this 6-digit code in the verification form on our website</strong>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This verification code will expire in 30 minutes for security reasons.
            </div>
            
            <p>If you did not create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p><strong>${context.company}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@techprocessingllc.com">support@techprocessingllc.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateEmailVerificationText(context: any): string {
    return `
Welcome to TechProcessing LLC - Email Verification

Hello ${context.name}!

Thank you for registering with TechProcessing LLC. Your account has been created and is currently pending verification. To activate your account and start accessing our services, please use the verification code below:

Verification Code: ${context.verificationCode}

Enter this 6-digit code in the verification form on our website.

Important: This verification code will expire in 30 minutes for security reasons.

If you did not create an account with us, please ignore this email.

Need help? Contact us at support@techprocessingllc.com

---
TechProcessing LLC
This is an automated message. Please do not reply to this email.
    `.trim();
  }

  private generatePasswordResetHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - TechProcessing LLC</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #dc2626; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
          .warning { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
            <p>TechProcessing LLC</p>
          </div>
          <div class="content">
            <h2>Hello ${context.name}!</h2>
            <p>We received a request to reset your password for your TechProcessing LLC account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${context.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">${context.resetUrl}</p>
            
            <p><strong>If you didn't request a password reset:</strong> Please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p><strong>${context.company}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@techprocessingllc.com">support@techprocessingllc.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetText(context: any): string {
    return `
Password Reset Request - TechProcessing LLC

Hello ${context.name}!

We received a request to reset your password for your TechProcessing LLC account. If you made this request, visit this link to reset your password:

${context.resetUrl}

SECURITY NOTICE: This password reset link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Need help? Contact us at support@techprocessingllc.com

---
TechProcessing LLC
This is an automated message. Please do not reply to this email.
    `.trim();
  }

  private generatePasswordResetCodeHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Code - TechProcessing LLC</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
          .content { padding: 30px; }
          .content h2 { color: #333; margin-top: 0; }
          .code { background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; font-size: 32px; font-weight: bold; color: #495057; letter-spacing: 4px; }
          .instruction { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          .footer a { color: #007bff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Code</h1>
          </div>
          <div class="content">
            <h2>Hello ${context.name}!</h2>
            <p>We received a request to reset your password for your TechProcessing LLC account. To complete the password reset, please use the verification code below:</p>
            
            <div class="code">${context.resetCode}</div>
            
            <div class="instruction">
              <strong>Enter this 6-digit code in the password reset form on our website</strong>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This verification code will expire in 30 minutes for security reasons.
            </div>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p><strong>${context.company}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@techprocessingllc.com">support@techprocessingllc.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetCodeText(context: any): string {
    return `
Password Reset Code - TechProcessing LLC

Hello ${context.name}!

We received a request to reset your password for your TechProcessing LLC account. To complete the password reset, please use the verification code below:

VERIFICATION CODE: ${context.resetCode}

Enter this 6-digit code in the password reset form on our website.

IMPORTANT: This verification code will expire in 30 minutes for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Need help? Contact us at support@techprocessingllc.com

---
TechProcessing LLC
This is an automated message. Please do not reply to this email.
    `.trim();
  }

  private generateWelcomeHTML(context: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TechProcessing LLC</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
          .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TechProcessing LLC</h1>
            <p>Your Account is Ready!</p>
          </div>
          <div class="content">
            <h2>Hello ${context.name}!</h2>
            <p>Welcome to TechProcessing LLC! Your account has been successfully created and is now active.</p>
            
            <p>You can now access all our services and features. Here's what you can do next:</p>
            
            <ul>
              <li>Access your personalized dashboard</li>
              <li>Explore our service offerings</li>
              <li>Connect with our support team</li>
              <li>Manage your account settings</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://qamarshahid.github.io/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <p>If you have any questions or need assistance, don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p><strong>${context.company}</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@techprocessingllc.com">support@techprocessingllc.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeText(context: any): string {
    return `
Welcome to TechProcessing LLC - Your Account is Ready!

Hello ${context.name}!

Welcome to TechProcessing LLC! Your account has been successfully created and is now active.

You can now access all our services and features. Here's what you can do next:

- Access your personalized dashboard
- Explore our service offerings  
- Connect with our support team
- Manage your account settings

Visit your dashboard: https://qamarshahid.github.io/dashboard

If you have any questions or need assistance, don't hesitate to contact our support team.

Need help? Contact us at support@techprocessingllc.com

---
TechProcessing LLC
This is an automated message. Please do not reply to this email.
    `.trim();
  }
}
