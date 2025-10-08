import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * ServicePackage Entity
 * Represents available service packages that can be purchased by clients
 * Used across: Invoices, Service Requests, and Subscriptions
 */
@Entity('service_packages')
export class ServicePackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'json' })
  @Exclude()
  features: any;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Note: Relationships are lazy-loaded to avoid circular dependencies
  // They can be accessed via repository.find({ relations: ['...'] })
}

