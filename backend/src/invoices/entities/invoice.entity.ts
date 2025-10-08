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
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { ServicePackage } from '../../common/entities';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_number', unique: true })
  invoiceNumber: string;

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ServicePackage, { nullable: true })
  @JoinColumn({ name: 'service_package_id' })
  servicePackage: ServicePackage;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  @Exclude()
  lineItems: any[];

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({ name: 'sent_date', nullable: true })
  sentDate: Date;

  @Column({ name: 'paid_date', nullable: true })
  paidDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}