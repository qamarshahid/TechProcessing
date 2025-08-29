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

  @Column({ type: 'uuid', nullable: false })
  requestId: string;

  @Column({ type: 'text', nullable: false })
  fileName: string;

  @Column({ type: 'text', nullable: false })
  fileUrl: string;

  @Column({ type: 'bigint', nullable: false })
  fileSize: number;

  @Column({ type: 'text', nullable: false })
  fileType: string;

  @Column({ type: 'uuid', nullable: false })
  uploadedBy: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FileCategory,
    default: FileCategory.OTHER,
  })
  category: FileCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  serviceRequest: ServiceRequest;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadedBy' })
  uploadedByUser: User;
}
