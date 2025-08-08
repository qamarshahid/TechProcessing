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
  findAll() {
    return this.paymentLinksService.findAll();
  }

  @Get('token/:token')
  @Public()
  @ApiOperation({ summary: 'Get payment link by token (Public)' })
  @ApiResponse({ status: 200, description: 'Payment link retrieved successfully' })
  findByToken(@Param('token') token: string) {
    return this.paymentLinksService.findByToken(token);
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

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel payment link (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment link cancelled successfully' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.paymentLinksService.remove(id, currentUser);
  }
}