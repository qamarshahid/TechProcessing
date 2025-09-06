import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../common/enums/user-role.enum';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { Agent } from './agent.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ type: 'json', nullable: true })
  @Exclude()
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  @Column({ name: 'communication_details', type: 'json', nullable: true })
  @Exclude()
  communicationDetails: Array<{
    type: 'PHONE' | 'EMAIL' | 'FAX';
    subType: 'WORK' | 'HOME';
    detail: string;
  }>;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verification_token', nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @Column({ name: 'email_verification_expires', nullable: true })
  emailVerificationExpires: Date;

  @Column({ name: 'password_reset_token', nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ name: 'password_reset_expires', nullable: true })
  passwordResetExpires: Date;

  @Column({ name: 'mfa_enabled', default: false })
  mfaEnabled: boolean;

  @Column({ name: 'mfa_secret', nullable: true })
  @Exclude()
  mfaSecret: string;

  @Column({ name: 'mfa_backup_codes', type: 'json', nullable: true })
  @Exclude()
  mfaBackupCodes: string[];

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'is_phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ name: 'failed_login_attempts', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'account_locked_until', nullable: true })
  accountLockedUntil: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ name: 'last_login_ip', nullable: true })
  lastLoginIp: string;

  @Column({ name: 'two_factor_method', type: 'enum', enum: ['EMAIL', 'SMS', 'TOTP'], nullable: true })
  twoFactorMethod: 'EMAIL' | 'SMS' | 'TOTP';

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Agent, (agent) => agent.user)
  agentProfiles: Agent[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  isAccountLocked(): boolean {
    return this.accountLockedUntil && this.accountLockedUntil > new Date();
  }

  incrementFailedLoginAttempts(): void {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      // Lock account for 30 minutes after 5 failed attempts
      this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
  }

  resetFailedLoginAttempts(): void {
    this.failedLoginAttempts = 0;
    this.accountLockedUntil = null;
  }

  generateEmailVerificationToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.emailVerificationToken = token;
    this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
  }

  generatePasswordResetToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return token;
  }

  generateMfaBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    this.mfaBackupCodes = codes;
    return codes;
  }
}