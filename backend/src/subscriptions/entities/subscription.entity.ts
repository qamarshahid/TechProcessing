import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { ServicePackage } from '../../common/entities';

export enum SubscriptionFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ServicePackage, { nullable: true, eager: true })
  @JoinColumn({ name: 'service_package_id' })
  servicePackage: ServicePackage;

  @Column({ name: 'service_package_id', nullable: true })
  servicePackageId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: SubscriptionFrequency,
    default: SubscriptionFrequency.MONTHLY,
  })
  frequency: SubscriptionFrequency;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'next_billing_date' })
  nextBillingDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'total_billed', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalBilled: number;

  @Column({ type: 'json', nullable: true })
  @Exclude()
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}