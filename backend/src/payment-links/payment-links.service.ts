import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentLink, PaymentLinkStatus } from './entities/payment-link.entity';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { UpdatePaymentLinkDto } from './dto/update-payment-link.dto';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { AuthorizeNetService } from '../payments/services/authorize-net.service';
import { ConfigService } from '@nestjs/config';

interface PaymentRequest {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email?: string;
}

@Injectable()
export class PaymentLinksService {
  constructor(
    @InjectRepository(PaymentLink)
    private paymentLinksRepository: Repository<PaymentLink>,
    private auditService: AuditService,
    private authorizeNetService: AuthorizeNetService,
    private configService: ConfigService,
  ) {}

  async create(createPaymentLinkDto: CreatePaymentLinkDto, createdBy: User): Promise<PaymentLink> {
    // Handle both client-based and non-client payment links
    let clientId = createPaymentLinkDto.clientId;
    let clientName = '';
    let clientEmail = '';
    
    if (createPaymentLinkDto.clientId) {
      // Existing client
      const client = await this.usersService.findOne(createPaymentLinkDto.clientId);
      clientName = client.fullName;
      clientEmail = client.email;
    } else {
      // Non-client payment (from metadata)
      const metadata = createPaymentLinkDto.metadata || {};
      if (metadata.newClient) {
        clientName = metadata.newClient.name;
        clientEmail = metadata.newClient.email;
        clientId = null; // No client_id for non-clients
      }
    }

    const paymentLink = this.paymentLinksRepository.create(createPaymentLinkDto);
    const savedPaymentLink = await this.paymentLinksRepository.save(paymentLink);

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_LINK_CREATED',
      entityType: 'PaymentLink',
      entityId: savedPaymentLink.id,
      details: { 
        clientId: savedPaymentLink.clientId,
        amount: savedPaymentLink.amount,
        title: savedPaymentLink.title 
      },
      user: createdBy,
    });

    // Get the full payment link with relations
    const fullPaymentLink = await this.findOne(savedPaymentLink.id);

    // Send email notification if client email is provided and sendEmail is true in metadata
    if (fullPaymentLink.client?.email && createPaymentLinkDto.metadata?.sendEmail) {
      await this.sendPaymentLinkEmail(fullPaymentLink);
    }

    return fullPaymentLink;
  }

  async findAll(): Promise<PaymentLink[]> {
    return this.paymentLinksRepository.find({
      relations: ['client', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaymentLink> {
    const paymentLink = await this.paymentLinksRepository.findOne({
      where: { id },
      relations: ['client', 'payment'],
    });

    if (!paymentLink) {
      throw new NotFoundException('Payment link not found');
    }

    return paymentLink;
  }

  async findByToken(token: string): Promise<PaymentLink> {
    const paymentLink = await this.paymentLinksRepository.findOne({
      where: { secureToken: token },
      relations: ['client'], // This will be null for non-client payments
    });

    if (!paymentLink) {
      throw new NotFoundException('Payment link not found');
    }

    // Check if expired
    if (paymentLink.expiresAt < new Date() && paymentLink.status === PaymentLinkStatus.ACTIVE) {
      paymentLink.status = PaymentLinkStatus.EXPIRED;
      await this.paymentLinksRepository.save(paymentLink);
    }

    return paymentLink;
  }

  async findByClient(clientId: string): Promise<PaymentLink[]> {
    return this.paymentLinksRepository.find({
      where: { clientId },
      relations: ['client', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updatePaymentLinkDto: UpdatePaymentLinkDto, updatedBy: User): Promise<PaymentLink> {
    const paymentLink = await this.findOne(id);

    Object.assign(paymentLink, updatePaymentLinkDto);
    const updatedPaymentLink = await this.paymentLinksRepository.save(paymentLink);

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_LINK_UPDATED',
      entityType: 'PaymentLink',
      entityId: updatedPaymentLink.id,
      details: updatePaymentLinkDto,
      user: updatedBy,
    });

    return this.findOne(updatedPaymentLink.id);
  }

  async updateStatus(id: string, status: PaymentLinkStatus, updatedBy: User): Promise<PaymentLink> {
    const paymentLink = await this.findOne(id);
    
    const oldStatus = paymentLink.status;
    paymentLink.status = status;

    if (status === PaymentLinkStatus.USED) {
      paymentLink.usedAt = new Date();
    }

    const updatedPaymentLink = await this.paymentLinksRepository.save(paymentLink);

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_LINK_STATUS_CHANGED',
      entityType: 'PaymentLink',
      entityId: updatedPaymentLink.id,
      details: { oldStatus, newStatus: status },
      user: updatedBy,
    });

    return this.findOne(updatedPaymentLink.id);
  }

  async processPayment(token: string, paymentRequest: PaymentRequest): Promise<any> {
    const paymentLink = await this.findByToken(token);

    // Validate payment link status
    if (paymentLink.status !== PaymentLinkStatus.ACTIVE) {
      throw new BadRequestException('Payment link is not active');
    }

    if (paymentLink.expiresAt < new Date()) {
      throw new BadRequestException('Payment link has expired');
    }

    // Process payment through Authorize.Net with enhanced data
    const paymentResult = await this.authorizeNetService.processPayment({
      amount: paymentLink.amount,
      cardNumber: paymentRequest.cardNumber,
      expiryDate: paymentRequest.expiryDate,
      cvv: paymentRequest.cvv,
      cardholderName: paymentRequest.cardholderName,
      billingAddress: paymentRequest.billingAddress,
      email: paymentRequest.email,
      description: paymentLink.title,
      invoiceNumber: `PL_${paymentLink.id.substring(0, 8)}`
    });

    if (paymentResult.success) {
      // Update payment link status
      paymentLink.status = PaymentLinkStatus.USED;
      paymentLink.usedAt = new Date();
      paymentLink.metadata = {
        ...paymentLink.metadata,
        paymentProcessed: true,
        transactionId: paymentResult.transactionId,
        authCode: paymentResult.authCode,
        cardholderName: paymentRequest.cardholderName,
        billingAddress: paymentRequest.billingAddress,
        email: paymentRequest.email,
        processedAt: new Date(),
      };
      await this.paymentLinksRepository.save(paymentLink);

      // Create payment record for tracking
      try {
        // Create a temporary invoice for non-client payments or link to existing client
        const tempInvoice = await this.createTempInvoiceForPaymentLink(paymentLink, paymentResult);
        
        // Update payment link with payment reference
        paymentLink.paymentId = tempInvoice.id;
        await this.paymentLinksRepository.save(paymentLink);
      } catch (error) {
        console.error('Error creating payment record for payment link:', error);
        // Don't fail the payment if record creation fails
      }

      // Audit log
      await this.auditService.log({
        action: 'PAYMENT_LINK_PAYMENT_COMPLETED',
        entityType: 'PaymentLink',
        entityId: paymentLink.id,
        details: { 
          transactionId: paymentResult.transactionId,
          amount: paymentLink.amount,
          clientType: paymentLink.clientId ? 'existing' : 'non-client'
        },
        user: paymentLink.client || null,
      });

      return {
        success: true,
        message: 'Payment processed successfully',
        transactionId: paymentResult.transactionId,
        authCode: paymentResult.authCode,
        amount: paymentLink.amount
      };
    } else {
      // Audit log for failed payment
      await this.auditService.log({
        action: 'PAYMENT_LINK_PAYMENT_FAILED',
        entityType: 'PaymentLink',
        entityId: paymentLink.id,
        details: { 
          error: paymentResult.error,
          amount: paymentLink.amount 
        },
        user: paymentLink.client,
      });

      throw new BadRequestException(paymentResult.error || 'Payment processing failed');
    }
  }

  private async createTempInvoiceForPaymentLink(paymentLink: PaymentLink, paymentResult: any): Promise<any> {
    // This would create a temporary invoice record for tracking purposes
    // Implementation depends on your invoice service structure
    return {
      id: `temp_${paymentLink.id}`,
      amount: paymentLink.amount,
      description: paymentLink.title,
      status: 'PAID',
      transactionId: paymentResult.transactionId
    };
  }

  async resendEmail(id: string, updatedBy: User): Promise<void> {
    const paymentLink = await this.findOne(id);
    
    if (!paymentLink.client?.email) {
      throw new BadRequestException('No email address available for this payment link');
    }

    await this.sendPaymentLinkEmail(paymentLink);

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_LINK_EMAIL_RESENT',
      entityType: 'PaymentLink',
      entityId: paymentLink.id,
      details: { clientEmail: paymentLink.client.email },
      user: updatedBy,
    });
  }

  private async sendPaymentLinkEmail(paymentLink: PaymentLink): Promise<void> {
    try {
      const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5174');
      const paymentUrl = `${baseUrl}/payment-link/${paymentLink.secureToken}`;
      
      // In a real implementation, you would use a proper email service like SendGrid, Mailgun, etc.
      // For demo purposes, we'll just log the email details
          // Email logging removed for security

      // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
      // Example with SendGrid:
      // await this.emailService.sendPaymentLinkEmail({
      //   to: paymentLink.client.email,
      //   subject: `Payment Request - ${paymentLink.title}`,
      //   amount: paymentLink.amount,
      //   paymentUrl,
      //   expiresAt: paymentLink.expiresAt,
      //   clientName: paymentLink.client.fullName,
      // });
    } catch (error) {
      console.error('Failed to send payment link email:', error);
      // Don't throw error to avoid breaking the payment link creation
    }
  }

  async remove(id: string, deletedBy: User): Promise<void> {
    const paymentLink = await this.findOne(id);
    
    // Soft delete by setting status to CANCELLED
    paymentLink.status = PaymentLinkStatus.CANCELLED;
    await this.paymentLinksRepository.save(paymentLink);

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_LINK_CANCELLED',
      entityType: 'PaymentLink',
      entityId: paymentLink.id,
      details: { clientId: paymentLink.clientId },
      user: deletedBy,
    });
  }

  async expireOldLinks(): Promise<void> {
    await this.paymentLinksRepository
      .createQueryBuilder()
      .update(PaymentLink)
      .set({ status: PaymentLinkStatus.EXPIRED })
      .where('status = :status', { status: PaymentLinkStatus.ACTIVE })
      .andWhere('expires_at < :now', { now: new Date() })
      .execute();
  }
}