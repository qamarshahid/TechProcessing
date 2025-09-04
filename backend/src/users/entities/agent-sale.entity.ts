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
import { Agent } from './agent.entity';
import { User } from './user.entity';
import { Closer } from './closer.entity';

export enum SaleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
  RESUBMITTED = 'RESUBMITTED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('agent_sales')
export class AgentSale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'agent_id' })
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @Column({ type: 'uuid', nullable: true, name: 'client_id' })
  clientId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ type: 'varchar', length: 100, name: 'sale_reference' })
  saleReference: string;

  @Column({ type: 'varchar', length: 200, name: 'client_name' })
  clientName: string;

  @Column({ type: 'varchar', length: 200, name: 'client_email' })
  clientEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'client_phone' })
  clientPhone: string;

  @Column({ type: 'uuid', nullable: true, name: 'closer_id' })
  closerId: string;

  @ManyToOne(() => Closer, { nullable: true })
  @JoinColumn({ name: 'closer_id' })
  closer: Closer;

  @Column({ type: 'varchar', length: 200, name: 'closer_name' })
  closerName: string;

  @Column({ type: 'varchar', length: 200, name: 'service_name' })
  serviceName: string;

  @Column({ type: 'text', nullable: true, name: 'service_description' })
  serviceDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'sale_amount' })
  saleAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'agent_commission_rate' })
  agentCommissionRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'closer_commission_rate' })
  closerCommissionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'agent_commission' })
  agentCommission: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'closer_commission' })
  closerCommission: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_commission' })
  totalCommission: number;

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.PENDING, name: 'sale_status' })
  saleStatus: SaleStatus;

  @Column({ type: 'enum', enum: CommissionStatus, default: CommissionStatus.PENDING, name: 'commission_status' })
  commissionStatus: CommissionStatus;

  @Column({ type: 'date', nullable: true, name: 'sale_date' })
  saleDate: Date;

  @Column({ type: 'date', nullable: true, name: 'payment_date' })
  paymentDate: Date;

  @Column({ type: 'date', nullable: true, name: 'commission_paid_date' })
  commissionPaidDate: Date;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Column({ type: 'jsonb', nullable: true, name: 'client_details' })
  @Exclude()
  clientDetails: any;

  @Column({ type: 'jsonb', nullable: true, name: 'metadata' })
  @Exclude()
  metadata: any;

  @Column({ type: 'uuid', nullable: true, name: 'original_sale_id' })
  originalSaleId: string;

  @ManyToOne(() => AgentSale, { nullable: true })
  @JoinColumn({ name: 'original_sale_id' })
  originalSale: AgentSale;

  @Column({ type: 'jsonb', nullable: true, name: 'changes_made' })
  @Exclude()
  changesMade: any;

  @Column({ type: 'int', default: 0, name: 'resubmission_count' })
  resubmissionCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
