import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';
import { AgentSale } from './agent-sale.entity';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true, name: 'user_id' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100, name: 'agent_code' })
  agentCode: string;

  @Column({ type: 'varchar', length: 100, name: 'sales_person_name' })
  salesPersonName: string;

  @Column({ type: 'varchar', length: 100, name: 'closer_name' })
  closerName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 6.00, name: 'agent_commission_rate' })
  agentCommissionRate: number; // 6% default

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.00, name: 'closer_commission_rate' })
  closerCommissionRate: number; // 10% default

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, name: 'total_earnings' })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, name: 'total_paid_out' })
  totalPaidOut: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, name: 'pending_commission' })
  pendingCommission: number;

  @Column({ type: 'int', default: 0, name: 'total_sales' })
  totalSales: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00, name: 'total_sales_value' })
  totalSalesValue: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  @Exclude()
  metadata: any;

  @OneToMany(() => AgentSale, (sale) => sale.agent)
  sales: AgentSale[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
