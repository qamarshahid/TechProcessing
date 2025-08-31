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

  @Column({ type: 'uuid', nullable: false, name: 'request_id' })
  requestId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, name: 'previous_amount' })
  previousAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, name: 'new_amount' })
  newAmount: number;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({ type: 'uuid', nullable: false, name: 'adjusted_by' })
  adjustedBy: string;

  @Column({
    type: 'enum',
    enum: PriceAdjustmentStatus,
    default: PriceAdjustmentStatus.PENDING_APPROVAL,
  })
  status: PriceAdjustmentStatus;

  @Column({ type: 'text', nullable: true, name: 'client_notes' })
  clientNotes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'adjusted_at' })
  adjustedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  serviceRequest: ServiceRequest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adjusted_by' })
  adjustedByUser: User;
}
