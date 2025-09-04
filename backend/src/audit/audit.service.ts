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

  private getSeverityFromAction(action: string): string {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('logout')) {
      return 'info';
    } else if (actionLower.includes('create') || actionLower.includes('register')) {
      return 'info';
    } else if (actionLower.includes('update') || actionLower.includes('modify')) {
      return 'warning';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'error';
    } else if (actionLower.includes('security') || actionLower.includes('auth')) {
      return 'critical';
    } else {
      return 'info';
    }
  }

  private getDetailedDescription(action: string, details: any, user: any, entityType: string, entityId: string): string {
    const actionLower = action.toLowerCase();
    const userName = user?.fullName || user?.email || 'System';
    const timestamp = new Date().toLocaleString();
    
    if (actionLower.includes('login')) {
      const ipAddress = details?.ipAddress || 'Unknown IP';
      const userAgent = details?.userAgent ? `using ${details.userAgent.split(' ')[0]}` : '';
      return `${userName} successfully logged into the system from IP ${ipAddress} ${userAgent} at ${timestamp}`;
    } else if (actionLower.includes('logout')) {
      return `${userName} logged out of the system at ${timestamp}`;
    } else if (actionLower.includes('create') || actionLower.includes('register')) {
      const entityName = entityType === 'User' ? 'user account' : entityType.toLowerCase();
      return `${userName} created a new ${entityName} (ID: ${entityId}) at ${timestamp}`;
    } else if (actionLower.includes('update') || actionLower.includes('modify')) {
      const changes = details?.changes ? ` - Changes: ${JSON.stringify(details.changes)}` : '';
      return `${userName} updated ${entityType.toLowerCase()} (ID: ${entityId}) at ${timestamp}${changes}`;
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return `${userName} deleted ${entityType.toLowerCase()} (ID: ${entityId}) at ${timestamp}`;
    } else if (actionLower.includes('password')) {
      return `${userName} changed password at ${timestamp}`;
    } else if (actionLower.includes('permission') || actionLower.includes('role')) {
      return `${userName} modified permissions/roles for ${entityType.toLowerCase()} (ID: ${entityId}) at ${timestamp}`;
    } else {
      return `${userName} performed ${action.toLowerCase().replace(/_/g, ' ')} on ${entityType.toLowerCase()} (ID: ${entityId}) at ${timestamp}`;
    }
  }

  private getAuditContext(action: string, details: any, entityType: string, entityId: string): any {
    const context: any = {
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sessionId: details?.sessionId || null,
      requestId: details?.requestId || null,
    };

    if (details?.ipAddress) {
      context.clientInfo = {
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        location: details.location || 'Unknown',
      };
    }

    if (details?.changes) {
      context.changes = details.changes;
    }

    if (details?.metadata) {
      context.metadata = details.metadata;
    }

    context.entity = {
      type: entityType,
      id: entityId,
      name: details?.entityName || null,
    };

    return context;
  }

  private getCategoryFromAction(action: string): string {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('logout') || 
        actionLower.includes('auth') || actionLower.includes('password') ||
        actionLower.includes('permission') || actionLower.includes('security')) {
      return 'security';
    } else if (actionLower.includes('create') || actionLower.includes('register') ||
               actionLower.includes('update') || actionLower.includes('modify') ||
               actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'user';
    } else if (actionLower.includes('system') || actionLower.includes('admin')) {
      return 'system';
    } else {
      return 'user';
    }
  }

  private getActionTypeFromAction(action: string): string {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('logout') || 
        actionLower.includes('auth') || actionLower.includes('password')) {
      return 'security_action';
    } else if (actionLower.includes('create') || actionLower.includes('register')) {
      return 'user_action';
    } else if (actionLower.includes('update') || actionLower.includes('modify')) {
      return 'user_action';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'admin_action';
    } else if (actionLower.includes('admin') || actionLower.includes('system')) {
      return 'admin_action';
    } else {
      return 'user_action';
    }
  }

  private getRiskLevel(action: string, details: any): string {
    const actionLower = action.toLowerCase();
    
    // High risk actions
    if (actionLower.includes('delete') || actionLower.includes('remove') ||
        actionLower.includes('password') || actionLower.includes('permission') ||
        actionLower.includes('role') || actionLower.includes('admin')) {
      return 'High';
    }
    
    // Medium risk actions
    if (actionLower.includes('update') || actionLower.includes('modify') ||
        actionLower.includes('create') || actionLower.includes('register')) {
      return 'Medium';
    }
    
    // Low risk actions
    if (actionLower.includes('login') || actionLower.includes('logout') ||
        actionLower.includes('view') || actionLower.includes('read')) {
      return 'Low';
    }
    
    return 'Medium';
  }

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
  ): Promise<{ logs: any[]; total: number; page: number; limit: number }> {
    try {
      // Ensure page and limit are valid numbers
      const pageNum = page && !isNaN(Number(page)) ? Number(page) : 1;
      const limitNum = limit && !isNaN(Number(limit)) ? Number(limit) : 50;

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
        .skip((pageNum - 1) * limitNum)
        .take(limitNum);

      const [logs, total] = await query.getManyAndCount();

      // Transform logs to match frontend expectations with comprehensive audit details
      const transformedLogs = logs.map(log => {
        const detailedDescription = this.getDetailedDescription(
          log.action, 
          log.details, 
          log.user, 
          log.entityType, 
          log.entityId
        );
        
        const auditContext = this.getAuditContext(
          log.action, 
          log.details, 
          log.entityType, 
          log.entityId
        );

        return {
          id: log.id,
          timestamp: log.createdAt,
          created_at: log.createdAt,
          action: log.action,
          description: detailedDescription,
          user_name: log.user?.fullName || 'System',
          userName: log.user?.fullName || 'System',
          user_email: log.user?.email || null,
          ip_address: log.ipAddress || 'N/A',
          ipAddress: log.ipAddress || 'N/A',
          severity: this.getSeverityFromAction(log.action),
          level: this.getSeverityFromAction(log.action),
          category: this.getCategoryFromAction(log.action),
          action_type: this.getActionTypeFromAction(log.action),
          entityType: log.entityType,
          entityId: log.entityId,
          entityName: log.details?.entityName || null,
          userId: log.userId,
          user: log.user,
          details: log.details,
          auditContext: auditContext,
          // Additional audit fields
          sessionId: log.details?.sessionId || null,
          requestId: log.details?.requestId || null,
          userAgent: log.details?.userAgent || null,
          location: log.details?.location || 'Unknown',
          changes: log.details?.changes || null,
          outcome: log.details?.outcome || 'Success',
          riskLevel: this.getRiskLevel(log.action, log.details),
        };
      });

      return {
        logs: transformedLogs,
        total,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      // Return empty result instead of throwing to prevent 500 errors
      return {
        logs: [],
        total: 0,
        page: 1,
        limit: 50,
      };
    }
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    try {
      return await this.auditLogRepository.find({
        where: { entityType, entityId },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching audit logs by entity:', error);
      return [];
    }
  }

  async getStats(): Promise<any> {
    try {
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
    } catch (error) {
      console.error('Error fetching audit stats:', error);
      return {
        totalLogs: 0,
        actionCounts: [],
        entityTypeCounts: [],
      };
    }
  }
}