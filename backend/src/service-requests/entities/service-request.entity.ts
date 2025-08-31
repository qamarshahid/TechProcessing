import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ServicePackage } from '../../service-packages/entities/service-package.entity';
import { PriceAdjustment } from './price-adjustment.entity';
import { FileAttachment } from './file-attachment.entity';

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  QUOTE_READY = 'QUOTE_READY',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
}

export enum RequestType {
  SERVICE_REQUEST = 'SERVICE_REQUEST',
  CUSTOM_QUOTE = 'CUSTOM_QUOTE',
}

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true, name: 'request_number' })
  requestNumber: string;

  @Column({ type: 'uuid', nullable: true, name: 'service_id' })
  serviceId: string;

  @Column({ type: 'uuid', nullable: false, name: 'client_id' })
  clientId: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'budget' })
  budget: number;

  @Column({ type: 'text', nullable: true, name: 'timeline' })
  timeline: string;

  @Column({ type: 'text', nullable: true, name: 'additional_requirements' })
  additionalRequirements: string;

  @Column({
    type: 'varchar',
    enum: ServiceRequestStatus,
    default: ServiceRequestStatus.PENDING,
  })
  status: ServiceRequestStatus;

  @Column({ type: 'text', nullable: true, name: 'admin_notes' })
  adminNotes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'estimated_cost' })
  estimatedCost: number;

  @Column({ type: 'text', nullable: true, name: 'estimated_timeline' })
  estimatedTimeline: string;

  @Column({ type: 'date', nullable: true, name: 'expected_start_date' })
  expectedStartDate: Date;

  @Column({ type: 'date', nullable: true, name: 'expected_delivery_date' })
  expectedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_start_date' })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_delivery_date' })
  actualDeliveryDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'quote_amount' })
  quoteAmount: number;

  @Column({ type: 'text', nullable: true, name: 'payment_terms' })
  paymentTerms: string;

  @Column({ type: 'boolean', default: false, name: 'is_custom_quote' })
  isCustomQuote: boolean;

  @Column({
    type: 'varchar',
    enum: RequestType,
    default: RequestType.SERVICE_REQUEST,
    name: 'request_type',
  })
  requestType: RequestType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => ServicePackage, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_id' })
  service: ServicePackage;

  @OneToMany(() => PriceAdjustment, (adjustment) => adjustment.serviceRequest, {
    cascade: true,
  })
  priceAdjustments: PriceAdjustment[];

  @OneToMany(() => FileAttachment, (attachment) => attachment.serviceRequest, {
    cascade: true,
  })
  attachments: FileAttachment[];
}
