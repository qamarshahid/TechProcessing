import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';

interface LogEntry {
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  user?: User;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(entry: LogEntry): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      details: entry.details,
      userId: entry.user?.id,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
    });

    return this.auditLogRepository.save(auditLog);
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
    action?: string,
    entityType?: string,
    userId?: string,
  ): Promise<{ logs: AuditLog[]; total: number; page: number; limit: number }> {
    const query = this.auditLogRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user');

    if (action) {
      query.andWhere('audit.action = :action', { action });
    }

    if (entityType) {
      query.andWhere('audit.entityType = :entityType', { entityType });
    }

    if (userId) {
      query.andWhere('audit.userId = :userId', { userId });
    }

    query
      .orderBy('audit.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [logs, total] = await query.getManyAndCount();

    return {
      logs,
      total,
      page,
      limit,
    };
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const totalLogs = await this.auditLogRepository.count();
    
    const actionCounts = await this.auditLogRepository
      .createQueryBuilder('audit')
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .getRawMany();

    const entityTypeCounts = await this.auditLogRepository
      .createQueryBuilder('audit')
      .select('audit.entityType', 'entityType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.entityType')
      .getRawMany();

    return {
      totalLogs,
      actionCounts,
      entityTypeCounts,
    };
  }
}