import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CloserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('closers')
export class Closer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'closer_code' })
  closerCode: string;

  @Column({ name: 'closer_name' })
  closerName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'commission_rate' })
  commissionRate: number;

  @Column({
    type: 'enum',
    enum: CloserStatus,
    default: CloserStatus.ACTIVE,
    name: 'status'
  })
  status: CloserStatus;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Note: We don't define the OneToMany relation here to avoid circular dependency
  // The relationship is handled through the ManyToOne in AgentSale entity
}
