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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new invoice (Admin only)' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  create(@Body() createInvoiceDto: CreateInvoiceDto, @CurrentUser() currentUser: User) {
    return this.invoicesService.create(createInvoiceDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices (filtered by user role or clientId)' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  findAll(
    @CurrentUser() currentUser: User,
    @Query('status') status?: InvoiceStatus,
    @Query('clientId') clientId?: string
  ) {
    return this.invoicesService.findAll(currentUser, status, clientId);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get invoice statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Invoice statistics retrieved successfully' })
  getStats() {
    return this.invoicesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.invoicesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update invoice (Admin only)' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update invoice status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Invoice status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: InvoiceStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.invoicesService.updateStatus(id, status, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete invoice (Admin only)' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.invoicesService.remove(id, currentUser);
  }
}