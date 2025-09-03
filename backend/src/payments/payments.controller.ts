import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  RawBody,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateHostedPaymentDto } from './dto/create-hosted-payment.dto';
import { HostedPaymentService } from './services/hosted-payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly hostedPaymentService: HostedPaymentService,
  ) {}

  @Post('hosted-token')
  @ApiOperation({ summary: 'Generate hosted payment token' })
  @ApiResponse({ status: 201, description: 'Hosted payment token created successfully' })
  createHostedPaymentToken(
    @Body() createHostedPaymentDto: CreateHostedPaymentDto,
  ) {
    return this.hostedPaymentService.createHostedPaymentToken(createHostedPaymentDto);
  }

  @Post('charge-card')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({ summary: 'Charge a card directly (Admin/Agent only)' })
  @ApiResponse({ status: 201, description: 'Card charged successfully' })
  async chargeCard(@Body() chargeData: any, @CurrentUser() currentUser: User) {
    return this.paymentsService.chargeCard(chargeData, currentUser);
  }

  @Post('process-link-payment')
  @Public()
  @ApiOperation({ summary: 'Process payment via payment link (Public)' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  async processLinkPayment(@Body() paymentData: any) {
    return this.paymentsService.processLinkPayment(paymentData);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() currentUser: User) {
    return this.paymentsService.create(createPaymentDto, currentUser);
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Authorize.Net webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-anet-signature') signature: string,
    @RawBody() rawBody: Buffer,
  ) {
    return this.paymentsService.handleWebhook(payload, signature, rawBody);
  }
  @Get()
  @ApiOperation({ summary: 'Get all payments (filtered by user role)' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  findAll(@CurrentUser() currentUser: User) {
    return this.paymentsService.findAll(currentUser);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history for current user' })
  @ApiResponse({ status: 200, description: 'Payment history retrieved successfully' })
  getHistory(@CurrentUser() currentUser: User) {
    return this.paymentsService.findAll(currentUser);
  }
  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get payment statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment statistics retrieved successfully' })
  getStats() {
    return this.paymentsService.getStats();
  }

  // Removed duplicate findOne method to resolve duplicate function implementation error

  // Payment Links are now handled by PaymentLinksController at /payment-links

  // Subscriptions are now handled by SubscriptionsController at /subscriptions

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update payment status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.paymentsService.updateStatus(id, status, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.paymentsService.remove(id, currentUser);
  }
}