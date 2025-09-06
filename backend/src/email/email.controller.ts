import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailService, ContactFormData, AppointmentData } from './email.service';
import { IsString, IsEmail, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

// DTOs for validation
export class ContactFormDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  business: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  projectType: string;

  @IsString()
  timeline: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}

export class AppointmentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  business: string;

  @IsString()
  serviceType: string;

  @IsString()
  preferredDate: string;

  @IsString()
  preferredTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}

@ApiTags('Email')
@Controller('email')
  // @UseGuards(ThrottlerGuard) // Rate limiting - commented out until throttler is properly configured
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Send contact form email',
    description: 'Sends an email notification when someone submits the contact form'
  })
  @ApiBody({ type: ContactFormDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid form data' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Email sending failed' 
  })
  async sendContactForm(@Body() contactData: ContactFormDto) {
    return await this.emailService.sendContactForm(contactData);
  }

  @Post('appointment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Send appointment request email',
    description: 'Sends an email notification when someone requests an appointment'
  })
  @ApiBody({ type: AppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Appointment request sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid appointment data' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Email sending failed' 
  })
  async sendAppointmentRequest(@Body() appointmentData: AppointmentDto) {
    return await this.emailService.sendAppointmentRequest(appointmentData);
  }
}
