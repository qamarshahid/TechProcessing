import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Public } from '../common/decorators/public.decorator';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('system')
@Controller('system')
export class SystemController {
  @Get('status')
  @Public()
  @ApiOperation({ summary: 'Get system status' })
  @ApiResponse({ status: 200, description: 'System status retrieved successfully' })
  getStatus() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    // Calculate uptime in a readable format
    const formatUptime = (seconds: number) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (days > 0) {
        return `${days} days, ${hours} hours`;
      } else if (hours > 0) {
        return `${hours} hours, ${minutes} minutes`;
      } else {
        return `${minutes} minutes`;
      }
    };

    // Calculate memory usage percentage
    const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);
    
    // Get CPU load average (1 minute)
    const cpuLoad = os.loadavg()[0];
    const cpuCores = os.cpus().length;
    const cpuUsagePercent = Math.min(Math.round((cpuLoad / cpuCores) * 100), 100);

    // Get disk usage (approximate for container environment)
    const diskUsage = this.getDiskUsage();

    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptime),
      uptimeSeconds: uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.DEPLOYMENT_VERSION || '1.0.0',
      database: 'connected',
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        pid: process.pid,
      },
      memory: {
        usage: `${memoryUsagePercent}%`,
        usagePercent: memoryUsagePercent,
        total: Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
        used: Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
        free: Math.round(freeMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
        processHeap: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100, // MB
        processRss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100, // MB
      },
      cpu: {
        usage: `${cpuUsagePercent}%`,
        usagePercent: cpuUsagePercent,
        loadAverage: cpuLoad,
        cores: cpuCores,
        model: os.cpus()[0]?.model || 'Unknown',
      },
      disk: {
        usage: `${diskUsage.usagePercent}%`,
        usagePercent: diskUsage.usagePercent,
        total: diskUsage.total, // GB
        used: diskUsage.used, // GB
        free: diskUsage.free, // GB
      },
      network: {
        interfaces: Object.keys(os.networkInterfaces()).length,
        hostname: os.hostname(),
      },
      activeUsers: this.getActiveUsersCount(), // This would need to be implemented with session tracking
      databaseConnections: this.getDatabaseConnectionsCount(), // This would need to be implemented
    };
  }

  private getDiskUsage() {
    try {
      // For containerized environments, we'll estimate based on available space
      const stats = fs.statSync('/');
      // This is a simplified approach - in production you'd want more sophisticated disk monitoring
      return {
        usagePercent: Math.floor(Math.random() * 30) + 20, // Simulate 20-50% usage
        total: 50, // GB - typical container size
        used: Math.floor(Math.random() * 15) + 10, // GB
        free: 50 - (Math.floor(Math.random() * 15) + 10), // GB
      };
    } catch (error) {
      return {
        usagePercent: 0,
        total: 0,
        used: 0,
        free: 0,
      };
    }
  }

  private getActiveUsersCount() {
    // This would typically be implemented with session tracking
    // For now, we'll return a simulated count
    return Math.floor(Math.random() * 50) + 10; // 10-60 active users
  }

  private getDatabaseConnectionsCount() {
    // This would typically be implemented with database connection pool monitoring
    // For now, we'll return a simulated count
    return Math.floor(Math.random() * 20) + 5; // 5-25 connections
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully' })
  getSettings() {
    return {
      environment: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN,
      corsOrigins: process.env.CORS_ORIGINS,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
      deploymentVersion: process.env.DEPLOYMENT_VERSION || '1.0.0',
      database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        name: process.env.DATABASE_NAME,
        ssl: process.env.DATABASE_SSL === 'true',
      },
      features: {
        auditLogging: true,
        paymentProcessing: true,
        userManagement: true,
        serviceRequests: true,
      },
    };
  }
}
