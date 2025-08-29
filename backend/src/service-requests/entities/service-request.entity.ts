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

  @Column({ type: 'uuid', nullable: true })
  serviceId: string;

  @Column({ type: 'uuid', nullable: false })
  clientId: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'text', nullable: true })
  timeline: string;

  @Column({ type: 'text', nullable: true })
  additionalRequirements: string;

  @Column({
    type: 'enum',
    enum: ServiceRequestStatus,
    default: ServiceRequestStatus.PENDING,
  })
  status: ServiceRequestStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'text', nullable: true })
  estimatedTimeline: string;

  @Column({ type: 'date', nullable: true })
  expectedStartDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quoteAmount: number;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'boolean', default: false })
  isCustomQuote: boolean;

  @Column({
    type: 'enum',
    enum: RequestType,
    default: RequestType.SERVICE_REQUEST,
  })
  requestType: RequestType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => ServicePackage, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'serviceId' })
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
