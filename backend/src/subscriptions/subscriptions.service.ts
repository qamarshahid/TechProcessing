import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus, SubscriptionFrequency } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private auditService: AuditService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, createdBy: User): Promise<Subscription> {
    const nextBillingDate = this.calculateNextBillingDate(
      new Date(createSubscriptionDto.startDate),
      createSubscriptionDto.frequency
    );

    const subscription = this.subscriptionsRepository.create({
      ...createSubscriptionDto,
      nextBillingDate,
    });

    const savedSubscription = await this.subscriptionsRepository.save(subscription);

    // Audit log
    await this.auditService.log({
      action: 'SUBSCRIPTION_CREATED',
      entityType: 'Subscription',
      entityId: savedSubscription.id,
      details: { 
        clientId: savedSubscription.clientId,
        amount: savedSubscription.amount,
        frequency: savedSubscription.frequency 
      },
      user: createdBy,
    });

    return this.findOneInternal(savedSubscription.id);
  }

  async findAll(): Promise<Subscription[]> {
    try {
      console.log('[SubscriptionsService] findAll called');
      const results = await this.subscriptionsRepository.find({
        relations: ['client'],
        order: { createdAt: 'DESC' },
      });
      console.log('[SubscriptionsService] findAll results:', results);
      return results;
    } catch (err) {
      console.error('[SubscriptionsService] findAll error:', err);
      throw err;
    }
  }

  async findOne(id: string, currentUser?: User): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['client', 'servicePackage'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Access control: clients can only see their own subscriptions
    if (currentUser && currentUser.role === UserRole.CLIENT && subscription.clientId !== currentUser.id) {
      throw new ForbiddenException('Access denied: You can only view your own subscriptions');
    }

    return subscription;
  }

  private async findOneInternal(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['client', 'servicePackage'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async findByClient(clientId: string, currentUser?: User): Promise<Subscription[]> {
    // Access control: clients can only see their own subscriptions
    if (currentUser && currentUser.role === UserRole.CLIENT && currentUser.id !== clientId) {
      throw new ForbiddenException('Access denied: You can only view your own subscriptions');
    }

    return this.subscriptionsRepository.find({
      where: { clientId },
      relations: ['client', 'servicePackage'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto, updatedBy: User): Promise<Subscription> {
    const subscription = await this.findOneInternal(id);

    // If frequency changed, recalculate next billing date
    if (updateSubscriptionDto.frequency && updateSubscriptionDto.frequency !== subscription.frequency) {
      updateSubscriptionDto.nextBillingDate = this.calculateNextBillingDate(
        subscription.startDate,
        updateSubscriptionDto.frequency
      );
    }

    Object.assign(subscription, updateSubscriptionDto);
    const updatedSubscription = await this.subscriptionsRepository.save(subscription);

    // Audit log
    await this.auditService.log({
      action: 'SUBSCRIPTION_UPDATED',
      entityType: 'Subscription',
      entityId: updatedSubscription.id,
      details: updateSubscriptionDto,
      user: updatedBy,
    });

    return this.findOneInternal(updatedSubscription.id);
  }

  async updateStatus(id: string, status: SubscriptionStatus, updatedBy: User): Promise<Subscription> {
    const subscription = await this.findOneInternal(id);
    
    const oldStatus = subscription.status;
    subscription.status = status;

    const updatedSubscription = await this.subscriptionsRepository.save(subscription);

    // Audit log
    await this.auditService.log({
      action: 'SUBSCRIPTION_STATUS_CHANGED',
      entityType: 'Subscription',
      entityId: updatedSubscription.id,
      details: { oldStatus, newStatus: status },
      user: updatedBy,
    });

    return this.findOneInternal(updatedSubscription.id);
  }

  async remove(id: string, deletedBy: User): Promise<void> {
    const subscription = await this.findOneInternal(id);
    
    // Soft delete by setting status to CANCELLED
    subscription.status = SubscriptionStatus.CANCELLED;
    await this.subscriptionsRepository.save(subscription);

    // Audit log
    await this.auditService.log({
      action: 'SUBSCRIPTION_CANCELLED',
      entityType: 'Subscription',
      entityId: subscription.id,
      details: { clientId: subscription.clientId },
      user: deletedBy,
    });
  }

  async getStats(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRecurringRevenue: number;
  }> {
    const totalSubscriptions = await this.subscriptionsRepository.count();
    const activeSubscriptions = await this.subscriptionsRepository.count({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    const mrr = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .select('SUM(CASE WHEN subscription.frequency = :monthly THEN subscription.amount WHEN subscription.frequency = :quarterly THEN subscription.amount / 3 WHEN subscription.frequency = :yearly THEN subscription.amount / 12 ELSE 0 END)', 'mrr')
      .where('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
      .setParameter('monthly', SubscriptionFrequency.MONTHLY)
      .setParameter('quarterly', SubscriptionFrequency.QUARTERLY)
      .setParameter('yearly', SubscriptionFrequency.YEARLY)
      .getRawOne();

    return {
      totalSubscriptions,
      activeSubscriptions,
      monthlyRecurringRevenue: parseFloat(mrr.mrr || '0'),
    };
  }

  private calculateNextBillingDate(startDate: Date, frequency: SubscriptionFrequency): Date {
    const nextBilling = new Date(startDate);
    
    switch (frequency) {
      case SubscriptionFrequency.MONTHLY:
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        break;
      case SubscriptionFrequency.QUARTERLY:
        nextBilling.setMonth(nextBilling.getMonth() + 3);
        break;
      case SubscriptionFrequency.YEARLY:
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
        break;
    }
    
    return nextBilling;
  }
}