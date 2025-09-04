import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('system')
@Controller('system')
export class SystemController {
  @Get('status')
  @Public()
  @ApiOperation({ summary: 'Get system status' })
  @ApiResponse({ status: 200, description: 'System status retrieved successfully' })
  getStatus() {
    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.DEPLOYMENT_VERSION || '1.0.0',
      database: 'connected', // This could be enhanced to actually check DB connection
    };
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
