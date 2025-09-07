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
      sgMail.setApiKey(sendGridApiKey);
      this.logger.log('SendGrid initialized successfully');
    } else {
      this.logger.warn('SendGrid API key not found, falling back to SMTP');
    }
  }

  async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      const mailOptions = {
        from: `"TechProcessing Contact Form" <${this.configService.get('EMAIL_USER')}>`,
        to: this.configService.get<string>('EMAIL_RECIPIENT', 'support@techprocessingllc.com'),
        replyTo: data.email,
        subject: `New Contact Form Submission from ${data.name}`,
        html: this.generateContactFormHTML(data),
        text: this.generateContactFormText(data),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contact form email sent successfully: ${result.messageId}`);
      
      return {
        success: true,
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
      };
    } catch (error) {
      this.logger.error('Failed to send contact form email:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again or call us directly at (727) 201-2658.'
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
        }
      }

      const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
      
      if (sendGridApiKey) {
        // Use SendGrid
        const msg = {
          to: data.to,
          from: {
            email: this.configService.get<string>('EMAIL_USER', 'support@techprocessingllc.com'),
            name: 'TechProcessing LLC'
          },
          subject: data.subject,
          html: htmlContent || 'Email content not provided',
          text: textContent || (htmlContent ? htmlContent.replace(/<[^>]*>/g, '') : 'Email content not provided'),
        };

        const result = await sgMail.send(msg);
        this.logger.log(`Email sent successfully via SendGrid to ${data.to}`, {
          messageId: result[0].headers['x-message-id'],
          subject: data.subject,
          template: data.template
        });
        return { success: true, message: 'Email sent successfully' };
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
      const mailOptions = {
        from: `"TechProcessing Appointment Request" <${this.configService.get('EMAIL_USER')}>`,
        to: this.configService.get<string>('EMAIL_RECIPIENT', 'support@techprocessingllc.com'),
        replyTo: data.email,
        subject: `New Appointment Request from ${data.name}`,
        html: this.generateAppointmentHTML(data),
        text: this.generateAppointmentText(data),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Appointment request email sent successfully: ${result.messageId}`);
      
      return {
        success: true,
        message: 'Appointment request sent! We\'ll contact you to confirm your preferred time.'
      };
    } catch (error) {
      this.logger.error('Failed to send appointment request email:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your appointment request. Please call us directly at (727) 201-2658.'
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 4px solid #10b981; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Contact Form Submission</h1>
            <p>TechProcessing LLC Website</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">🏢 Business:</div>
              <div class="value">${data.business}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            <div class="field">
              <div class="label">📞 Phone:</div>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            <div class="field">
              <div class="label">🎯 Project Type:</div>
              <div class="value">${data.projectType}</div>
            </div>
            <div class="field">
              <div class="label">⏰ Timeline:</div>
              <div class="value">${data.timeline}</div>
            </div>
            ${data.message ? `
            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            <div class="footer">
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Reply directly to this email to respond to ${data.name}</li>
                <li>Add to CRM system for follow-up</li>
                <li>Schedule initial consultation if needed</li>
              </ul>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border-left: 4px solid #3b82f6; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
          .urgent { background: #fef3c7; border-left-color: #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Appointment Request</h1>
            <p>TechProcessing LLC Consultation</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">🏢 Business:</div>
              <div class="value">${data.business}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            <div class="field">
              <div class="label">📞 Phone:</div>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            <div class="field">
              <div class="label">🎯 Service Type:</div>
              <div class="value">${data.serviceType}</div>
            </div>
            <div class="field urgent">
              <div class="label">📅 Preferred Date:</div>
              <div class="value">${data.preferredDate}</div>
            </div>
            <div class="field urgent">
              <div class="label">⏰ Preferred Time:</div>
              <div class="value">${data.preferredTime}</div>
            </div>
            ${data.message ? `
            <div class="field">
              <div class="label">💬 Additional Notes:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            <div class="footer">
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Confirm availability for ${data.preferredDate} at ${data.preferredTime}</li>
                <li>Send calendar invite with meeting link</li>
                <li>Reply to confirm or suggest alternative times</li>
              </ul>
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
        <title>Verify Your Email - TechProcessing LLC</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #059669; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Welcome to TechProcessing LLC</h1>
            <p>Verify Your Email Address</p>
          </div>
          <div class="content">
            <h2>Hello ${context.name}!</h2>
            <p>Thank you for registering with TechProcessing LLC. To complete your account setup and start accessing our services, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${context.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This verification link will expire in 24 hours for security reasons.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">${context.verificationUrl}</p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
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
Welcome to TechProcessing LLC - Verify Your Email Address

Hello ${context.name}!

Thank you for registering with TechProcessing LLC. To complete your account setup and start accessing our services, please verify your email address by visiting this link:

${context.verificationUrl}

IMPORTANT: This verification link will expire in 24 hours for security reasons.

If you didn't create an account with us, please ignore this email.

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
              <strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour for security reasons.
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
}
