import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { SubscriptionStatus } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new subscription (Admin only)' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto, @CurrentUser() currentUser: User) {
    return this.subscriptionsService.create(createSubscriptionDto, currentUser);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all subscriptions (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get subscriptions for a specific client' })
  @ApiResponse({ status: 200, description: 'Client subscriptions retrieved successfully' })
  findByClient(@Param('clientId') clientId: string) {
    return this.subscriptionsService.findByClient(clientId);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get subscription statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription statistics retrieved successfully' })
  getStats() {
    return this.subscriptionsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update subscription (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update subscription status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: SubscriptionStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.subscriptionsService.updateStatus(id, status, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel subscription (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.subscriptionsService.remove(id, currentUser);
  }
}