import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { User } from '../../users/entities/user.entity';

export enum PriceAdjustmentStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('price_adjustments')
export class PriceAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  requestId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  previousAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  newAmount: number;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({ type: 'uuid', nullable: false })
  adjustedBy: string;

  @Column({
    type: 'enum',
    enum: PriceAdjustmentStatus,
    default: PriceAdjustmentStatus.PENDING_APPROVAL,
  })
  status: PriceAdjustmentStatus;

  @Column({ type: 'text', nullable: true })
  clientNotes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  adjustedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  serviceRequest: ServiceRequest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adjustedBy' })
  adjustedByUser: User;
}
