import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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
      } else {
        this.logger.log('Email service is ready to send messages');
      }
    });
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

  async sendEmail(data: { to: string; subject: string; html: string; text?: string; template?: string; context?: any }): Promise<{ success: boolean; message: string }> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER', 'support@techprocessingllc.com'),
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text || data.html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${data.to}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      this.logger.error('Failed to send email:', error);
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
}
