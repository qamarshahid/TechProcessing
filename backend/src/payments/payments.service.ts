import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';
import { User } from '../users/entities/user.entity';
import { InvoicesService } from '../invoices/invoices.service';
import { AuthorizeNetService } from './services/authorize-net.service';
import { HostedPaymentService } from './services/hosted-payment.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private invoicesService: InvoicesService,
    private authorizeNetService: AuthorizeNetService,
    private hostedPaymentService: HostedPaymentService,
    private auditService: AuditService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment> {
    const invoice = await this.invoicesService.findOne(createPaymentDto.invoiceId, user);
    
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      userId: user.id,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Process payment based on method
    let processedPayment: Payment;
    
    switch (createPaymentDto.method) {
      case PaymentMethod.CARD:
        processedPayment = await this.processCardPayment(savedPayment, createPaymentDto);
        break;
      case PaymentMethod.ZELLE:
      case PaymentMethod.CASHAPP:
      case PaymentMethod.BANK_TRANSFER:
        processedPayment = await this.processManualPayment(savedPayment);
        break;
      default:
        throw new BadRequestException('Unsupported payment method');
    }

    // Update invoice status if payment is successful
    if (processedPayment.status === PaymentStatus.COMPLETED) {
      await this.invoicesService.updateStatus(
        invoice.id,
        InvoiceStatus.PAID,
        user,
      );
    }

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_CREATED',
      entityType: 'Payment',
      entityId: processedPayment.id,
      details: { 
        amount: processedPayment.amount, 
        method: processedPayment.method,
        status: processedPayment.status 
      },
      user,
    });

    return this.findOne(processedPayment.id);
  }

  async chargeCard(chargeData: any, user: User): Promise<any> {
    try {
      // Validate charge data
      if (!chargeData.amount || chargeData.amount <= 0) {
        throw new BadRequestException('Invalid amount');
      }

      if (!chargeData.cardDetails) {
        throw new BadRequestException('Card details are required');
      }

      // Process payment through Authorize.Net
      const paymentRequest = {
        amount: chargeData.amount,
        cardNumber: chargeData.cardDetails.cardNumber,
        expiryDate: chargeData.cardDetails.expiryDate,
        cvv: chargeData.cardDetails.cvv,
        cardholderName: chargeData.cardDetails.cardholderName,
        billingAddress: chargeData.cardDetails.billingAddress,
        email: chargeData.clientEmail,
        description: chargeData.notes || chargeData.description || 'Direct charge',
        invoiceNumber: chargeData.invoiceId || `DIRECT_${Date.now()}`
      };

      const result = await this.authorizeNetService.processPayment(paymentRequest);

      if (result.success) {
        // Create payment record
        let payment;
        
        if (chargeData.type === 'invoice' && chargeData.invoiceId) {
          // Invoice payment
          const invoice = await this.invoicesService.findOne(chargeData.invoiceId);
          payment = this.paymentsRepository.create({
            invoiceId: chargeData.invoiceId,
            userId: invoice.clientId,
            amount: chargeData.amount,
            method: PaymentMethod.CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: result.transactionId,
            gatewayResponse: result.gatewayResponse,
            processedAt: new Date(),
            notes: chargeData.notes || 'Admin/Agent direct charge'
          });

          await this.paymentsRepository.save(payment);

          // Update invoice status
          await this.invoicesService.updateStatus(
            chargeData.invoiceId,
            InvoiceStatus.PAID,
            user
          );
        } else {
          // Direct charge - create a temporary invoice record for tracking
          const tempInvoice = await this.invoicesService.create({
            clientId: chargeData.clientId || 'temp-client',
            amount: chargeData.amount,
            tax: 0,
            description: chargeData.description || 'Direct charge',
            dueDate: new Date().toISOString(),
            notes: 'Direct charge via admin/agent'
          }, user);

          payment = this.paymentsRepository.create({
            invoiceId: tempInvoice.id,
            userId: chargeData.clientId || user.id,
            amount: chargeData.amount,
            method: PaymentMethod.CARD,
            status: PaymentStatus.COMPLETED,
            transactionId: result.transactionId,
            gatewayResponse: result.gatewayResponse,
            processedAt: new Date(),
            notes: chargeData.notes || 'Direct charge'
          });

          await this.paymentsRepository.save(payment);
        }

        // Audit log
        await this.auditService.log({
          action: 'CARD_CHARGED',
          entityType: 'Payment',
          entityId: payment.id,
          details: { 
            amount: chargeData.amount,
            chargedBy: user.role,
            transactionId: result.transactionId
          },
          user,
        });

        return {
          success: true,
          transactionId: result.transactionId,
          amount: chargeData.amount,
          message: 'Payment processed successfully'
        };
      } else {
        // Audit log for failed payment
        await this.auditService.log({
          action: 'CARD_CHARGE_FAILED',
          entityType: 'Payment',
          entityId: 'failed',
          details: { 
            amount: chargeData.amount,
            error: result.error,
            chargedBy: user.role
          },
          user,
        });

        return {
          success: false,
          error: result.error || 'Payment processing failed'
        };
      }
    } catch (error) {
      console.error('Error charging card:', error);
      throw new BadRequestException(error.message || 'Failed to process payment');
    }
  }

  async processLinkPayment(paymentData: any): Promise<any> {
    try {
      // Process payment through Authorize.Net
      const paymentRequest = {
        amount: paymentData.amount,
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
        billingAddress: paymentData.billingAddress,
        email: paymentData.email,
        description: paymentData.description || 'Payment link payment'
      };

      const result = await this.authorizeNetService.processPayment(paymentRequest);

      if (result.success) {
        return {
          success: true,
          transactionId: result.transactionId,
          message: 'Payment processed successfully'
        };
      } else {
        return {
          success: false,
          error: result.error || 'Payment processing failed'
        };
      }
    } catch (error) {
      console.error('Error processing link payment:', error);
      throw new BadRequestException(error.message || 'Failed to process payment');
    }
  }
  async handleWebhook(payload: any, signature: string, rawBody: Buffer): Promise<any> {
    try {
      // Validate webhook signature
      const isValid = await this.hostedPaymentService.validateWebhookSignature(
        rawBody.toString(),
        signature,
      );

      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Process webhook payload
      const { eventType, payload: webhookData } = payload;

      switch (eventType) {
        case 'net.authorize.payment.authcapture.created':
          await this.handlePaymentSuccess(webhookData);
          break;
        case 'net.authorize.payment.void.created':
          await this.handlePaymentVoid(webhookData);
          break;
        case 'net.authorize.payment.refund.created':
          await this.handlePaymentRefund(webhookData);
          break;
        default:
          console.log(`Unhandled webhook event: ${eventType}`);
      }

      return { status: 'success', message: 'Webhook processed' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(webhookData: any): Promise<void> {
    const { id: transactionId, invoiceNumber } = webhookData;
    
    // Find payment by transaction ID or invoice
    const payment = await this.paymentsRepository.findOne({
      where: { transactionId },
      relations: ['invoice', 'user'],
    });

    if (payment) {
      payment.status = PaymentStatus.COMPLETED;
      payment.processedAt = new Date();
      await this.paymentsRepository.save(payment);

      // Update invoice status
      await this.invoicesService.updateStatus(
        payment.invoiceId,
        InvoiceStatus.PAID,
        payment.user,
      );

      // Audit log
      await this.auditService.log({
        action: 'PAYMENT_WEBHOOK_SUCCESS',
        entityType: 'Payment',
        entityId: payment.id,
        details: { transactionId, webhookData },
        user: payment.user,
      });
    }
  }

  private async handlePaymentVoid(webhookData: any): Promise<void> {
    const { id: transactionId } = webhookData;
    
    const payment = await this.paymentsRepository.findOne({
      where: { transactionId },
      relations: ['user'],
    });

    if (payment) {
      payment.status = PaymentStatus.FAILED;
      await this.paymentsRepository.save(payment);

      await this.auditService.log({
        action: 'PAYMENT_WEBHOOK_VOID',
        entityType: 'Payment',
        entityId: payment.id,
        details: { transactionId, webhookData },
        user: payment.user,
      });
    }
  }

  private async handlePaymentRefund(webhookData: any): Promise<void> {
    const { id: transactionId } = webhookData;
    
    const payment = await this.paymentsRepository.findOne({
      where: { transactionId },
      relations: ['user'],
    });

    if (payment) {
      payment.status = PaymentStatus.REFUNDED;
      await this.paymentsRepository.save(payment);

      await this.auditService.log({
        action: 'PAYMENT_WEBHOOK_REFUND',
        entityType: 'Payment',
        entityId: payment.id,
        details: { transactionId, webhookData },
        user: payment.user,
      });
    }
  }

  async findAll(user: User): Promise<Payment[]> {
    const query = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .leftJoinAndSelect('payment.user', 'paymentUser');

    // If user is CLIENT, only show their payments
    if (user.role === 'CLIENT') {
      query.where('payment.userId = :userId', { userId: user.id });
    }

    query.orderBy('payment.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['invoice', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(id: string, status: PaymentStatus, updatedBy: User): Promise<Payment> {
    const payment = await this.findOne(id);
    
    const oldStatus = payment.status;
    payment.status = status;
    
    if (status === PaymentStatus.COMPLETED) {
      payment.processedAt = new Date();
    }

    const updatedPayment = await this.paymentsRepository.save(payment);

    // Update invoice status if payment is completed
    if (status === PaymentStatus.COMPLETED) {
      await this.invoicesService.updateStatus(
        payment.invoiceId,
        InvoiceStatus.PAID,
        updatedBy,
      );
    }

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_STATUS_CHANGED',
      entityType: 'Payment',
      entityId: updatedPayment.id,
      details: { oldStatus, newStatus: status },
      user: updatedBy,
    });

    return this.findOne(updatedPayment.id);
  }

  private async processCardPayment(payment: Payment, createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const result = await this.authorizeNetService.processPayment({
        amount: payment.amount,
        cardNumber: createPaymentDto.cardDetails.cardNumber,
        expiryDate: createPaymentDto.cardDetails.expiryDate,
        cvv: createPaymentDto.cardDetails.cvv,
        cardholderName: createPaymentDto.cardDetails.cardholderName,
      });

      payment.status = result.success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
      payment.transactionId = result.transactionId;
      payment.gatewayResponse = result;
      
      if (result.success) {
        payment.processedAt = new Date();
      }

      return this.paymentsRepository.save(payment);
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.gatewayResponse = { error: error.message };
      return this.paymentsRepository.save(payment);
    }
  }

  private async processManualPayment(payment: Payment): Promise<Payment> {
    // For manual payments (Zelle, CashApp, Bank Transfer), mark as processing
    // Admin will need to manually confirm these payments
    payment.status = PaymentStatus.PROCESSING;
    return this.paymentsRepository.save(payment);
  }

  async remove(id: string, deletedBy: User): Promise<void> {
    const payment = await this.findOne(id);
    
    // Check if payment is completed - we might want to prevent deletion of completed payments
    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Cannot delete a completed payment');
    }

    await this.paymentsRepository.remove(payment);

    // Audit log
    await this.auditService.log({
      action: 'PAYMENT_DELETED',
      entityType: 'Payment',
      entityId: payment.id,
      details: { amount: payment.amount, method: payment.method },
      user: deletedBy,
    });
  }

  async removeByInvoiceId(invoiceId: string, deletedBy: User): Promise<void> {
    const payments = await this.paymentsRepository.find({
      where: { invoiceId },
      relations: ['invoice'],
    });

    for (const payment of payments) {
      await this.remove(payment.id, deletedBy);
    }
  }

  async getStats(): Promise<any> {
    const totalPayments = await this.paymentsRepository.count();
    
    const statusCounts = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.status')
      .getRawMany();

    const methodCounts = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('payment.method', 'method')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.method')
      .getRawMany();

    const amountStats = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalAmount')
      .addSelect('SUM(CASE WHEN payment.status = :completedStatus THEN payment.amount ELSE 0 END)', 'completedAmount')
      .setParameter('completedStatus', PaymentStatus.COMPLETED)
      .getRawOne();

    return {
      totalPayments,
      statusCounts,
      methodCounts,
      ...amountStats,
    };
  }
}