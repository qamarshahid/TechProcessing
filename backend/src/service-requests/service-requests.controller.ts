import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { CreatePriceAdjustmentDto } from './dto/create-price-adjustment.dto';
import { UpdatePriceAdjustmentStatusDto } from './dto/update-price-adjustment-status.dto';
import { CreateFileAttachmentDto } from './dto/create-file-attachment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('service-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  create(@Body() createServiceRequestDto: CreateServiceRequestDto, @Request() req) {
    // Ignore body.clientId and trust authenticated user id
    return this.serviceRequestsService.create({ ...createServiceRequestDto }, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    // Direct raw SQL fallback to bypass metadata issues
    try {
      return await this.serviceRequestsService.findAll();
    } catch (error) {
      // Force raw SQL if any error
      return await this.serviceRequestsService.findAllRaw();
    }
  }

  @Get('client/:clientId')
  @Roles(UserRole.ADMIN)
  findByClient(@Param('clientId') clientId: string) {
    return this.serviceRequestsService.findByClient(clientId);
  }

  @Get('my-requests')
  @Roles(UserRole.CLIENT)
  findMyRequests(@Request() req) {
    return this.serviceRequestsService.findByClient(req.user.id);
  }

  @Get('debug-all')
  async debugAll() {
    // Debug endpoint to see raw data without any filters
    try {
      const result = await this.serviceRequestsService.debugAllRaw();
      return {
        count: result.length,
        data: result
      };
    } catch (error) {
      return {
        error: error.message,
        count: 0,
        data: []
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateServiceRequestDto: UpdateServiceRequestDto) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    try {
      await this.serviceRequestsService.remove(id);
      return { message: 'Service request deleted successfully' };
    } catch (error) {
      console.error('Error in delete controller:', error);
      throw error;
    }
  }

  // Client-specific endpoints
  @Patch(':id/submit')
  @Roles(UserRole.CLIENT)
  async submitRequest(@Param('id') id: string, @Request() req) {
    return this.serviceRequestsService.submitRequest(id, req.user.id);
  }

  @Delete(':id/cancel')
  @Roles(UserRole.CLIENT)
  async cancelRequest(@Param('id') id: string, @Request() req) {
    return this.serviceRequestsService.cancelRequest(id, req.user.id);
  }

  @Patch(':id/request-cancellation')
  @Roles(UserRole.CLIENT)
  async requestCancellation(@Param('id') id: string, @Request() req) {
    return this.serviceRequestsService.requestCancellation(id, req.user.id);
  }

  // Admin-specific endpoints
  @Patch(':id/approve-cancellation')
  @Roles(UserRole.ADMIN)
  async approveCancellation(@Param('id') id: string) {
    return this.serviceRequestsService.approveCancellation(id);
  }

  @Patch(':id/reject-cancellation')
  @Roles(UserRole.ADMIN)
  async rejectCancellation(@Param('id') id: string) {
    return this.serviceRequestsService.rejectCancellation(id);
  }

  // Price Adjustment endpoints
  @Post(':requestId/price-adjustments')
  @Roles(UserRole.ADMIN)
  createPriceAdjustment(
    @Param('requestId') requestId: string,
    @Body() createPriceAdjustmentDto: CreatePriceAdjustmentDto,
    @Request() req,
  ) {
    return this.serviceRequestsService.createPriceAdjustment(
      requestId,
      createPriceAdjustmentDto,
      req.user.id,
    );
  }

  @Patch('price-adjustments/:adjustmentId/status')
  @Roles(UserRole.CLIENT)
  updatePriceAdjustmentStatus(
    @Param('adjustmentId') adjustmentId: string,
    @Body() updateStatusDto: UpdatePriceAdjustmentStatusDto,
  ) {
    return this.serviceRequestsService.updatePriceAdjustmentStatus(adjustmentId, updateStatusDto);
  }

  @Get(':requestId/price-adjustments')
  getPriceAdjustments(@Param('requestId') requestId: string) {
    return this.serviceRequestsService.getPriceAdjustments(requestId);
  }

  // File Attachment endpoints
  @Post(':requestId/attachments')
  async createFileAttachment(
    @Param('requestId') requestId: string,
    @Body() createFileAttachmentDto: CreateFileAttachmentDto,
    @Request() req,
  ) {
    // In a real implementation, you would upload the file to a cloud storage service
    // and get the URL. For now, we'll use the DTO directly.
    return this.serviceRequestsService.createFileAttachment(
      requestId,
      createFileAttachmentDto,
      req.user.id,
    );
  }

  @Get(':requestId/attachments')
  getFileAttachments(@Param('requestId') requestId: string) {
    return this.serviceRequestsService.getFileAttachments(requestId);
  }

  @Delete('attachments/:attachmentId')
  deleteFileAttachment(@Param('attachmentId') attachmentId: string) {
    return this.serviceRequestsService.deleteFileAttachment(attachmentId);
  }
}
