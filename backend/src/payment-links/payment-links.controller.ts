import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentLinksService } from './payment-links.service';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { UpdatePaymentLinkDto } from './dto/update-payment-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaymentLinkStatus } from './entities/payment-link.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('payment-links')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-links')
export class PaymentLinksController {
  constructor(private readonly paymentLinksService: PaymentLinksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new payment link (Admin only)' })
  @ApiResponse({ status: 201, description: 'Payment link created successfully' })
  create(@Body() createPaymentLinkDto: CreatePaymentLinkDto, @CurrentUser() currentUser: User) {
    return this.paymentLinksService.create(createPaymentLinkDto, currentUser);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all payment links (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment links retrieved successfully' })
  async findAll() {
    const links = await this.paymentLinksService.findAll();
    return { links };
  }

  @Get('token/:token')
  @Public()
  @ApiOperation({ summary: 'Get payment link by token (Public)' })
  @ApiResponse({ status: 200, description: 'Payment link retrieved successfully' })
  async findByToken(@Param('token') token: string) {
    const paymentLink = await this.paymentLinksService.findByToken(token);
    return { link: paymentLink };
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get payment links for a specific client' })
  @ApiResponse({ status: 200, description: 'Client payment links retrieved successfully' })
  findByClient(@Param('clientId') clientId: string) {
    return this.paymentLinksService.findByClient(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment link by ID' })
  @ApiResponse({ status: 200, description: 'Payment link retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.paymentLinksService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update payment link (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment link updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updatePaymentLinkDto: UpdatePaymentLinkDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.paymentLinksService.update(id, updatePaymentLinkDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update payment link status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment link status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentLinkStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.paymentLinksService.updateStatus(id, status, currentUser);
  }

  @Post('token/:token/process-payment')
  @Public()
  @ApiOperation({ summary: 'Process payment for a payment link (Public)' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Payment processing failed' })
  async processPayment(
    @Param('token') token: string,
    @Body() paymentRequest: any,
  ) {
    return this.paymentLinksService.processPayment(token, paymentRequest);
  }

  @Post(':id/resend-email')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Resend payment link email (Admin only)' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async resendEmail(@Param('id') id: string, @CurrentUser() currentUser: User) {
    await this.paymentLinksService.resendEmail(id, currentUser);
    return { message: 'Email sent successfully' };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel payment link (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment link cancelled successfully' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.paymentLinksService.remove(id, currentUser);
  }
}