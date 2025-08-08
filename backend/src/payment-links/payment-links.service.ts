import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentLink, PaymentLinkStatus } from './entities/payment-link.entity';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { UpdatePaymentLinkDto } from './dto/update-payment-link.dto';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PaymentLinksService {
  constructor(
    @InjectRepository(PaymentLink)
    private paymentLinksRepository: Repository<PaymentLink>,
    private auditService: AuditService,
  ) {}

  async create(createPaymentLinkDto: CreatePaymentLinkDto, createdBy: User): Promise<PaymentLink> {
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

    return this.findOne(savedPaymentLink.id);
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
      relations: ['client'],
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