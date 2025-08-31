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

export enum FileCategory {
  REQUIREMENTS = 'REQUIREMENTS',
  QUOTE = 'QUOTE',
  CONTRACT = 'CONTRACT',
  DELIVERABLE = 'DELIVERABLE',
  REFERENCE = 'REFERENCE',
  OTHER = 'OTHER',
}

@Entity('file_attachments')
export class FileAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false, name: 'request_id' })
  requestId: string;

  @Column({ type: 'text', nullable: false, name: 'file_name' })
  fileName: string;

  @Column({ type: 'text', nullable: false, name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'bigint', nullable: false, name: 'file_size' })
  fileSize: number;

  @Column({ type: 'text', nullable: false, name: 'file_type' })
  fileType: string;

  @Column({ type: 'uuid', nullable: false, name: 'uploaded_by' })
  uploadedBy: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    enum: FileCategory,
    default: FileCategory.OTHER,
  })
  category: FileCategory;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  serviceRequest: ServiceRequest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedByUser: User;
}
