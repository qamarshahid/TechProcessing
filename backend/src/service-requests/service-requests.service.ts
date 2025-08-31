import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest, ServiceRequestStatus } from './entities/service-request.entity';
import { PriceAdjustment, PriceAdjustmentStatus } from './entities/price-adjustment.entity';
import { FileAttachment } from './entities/file-attachment.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { CreatePriceAdjustmentDto } from './dto/create-price-adjustment.dto';
import { UpdatePriceAdjustmentStatusDto } from './dto/update-price-adjustment-status.dto';
import { CreateFileAttachmentDto } from './dto/create-file-attachment.dto';
import { InvoicesService } from '../invoices/invoices.service';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(PriceAdjustment)
    private priceAdjustmentRepository: Repository<PriceAdjustment>,
    @InjectRepository(FileAttachment)
    private fileAttachmentRepository: Repository<FileAttachment>,
    private invoicesService: InvoicesService,
  ) {}

  private optionalRelationsAvailable: boolean | null = null;

  private async getRelations(): Promise<(keyof ServiceRequest | string)[]> {
    if (this.optionalRelationsAvailable === null) {
      try {
        const result = await this.serviceRequestRepository.query(
          `select to_regclass('public.price_adjustments') as pa, to_regclass('public.file_attachments') as fa`
        );
        const row = Array.isArray(result) ? result[0] : {};
        this.optionalRelationsAvailable = Boolean(row?.pa) && Boolean(row?.fa);
      } catch (_err) {
        this.optionalRelationsAvailable = false;
      }
    }

    return this.optionalRelationsAvailable
      ? ['client', 'service', 'priceAdjustments', 'attachments']
      : ['client', 'service'];
  }

  async create(createServiceRequestDto: CreateServiceRequestDto, clientId: string): Promise<ServiceRequest> {
    const serviceRequest = this.serviceRequestRepository.create({
      ...createServiceRequestDto,
      clientId,
    });
    return this.serviceRequestRepository.save(serviceRequest);
  }

  async findAll(): Promise<ServiceRequest[]> {
    const relations = await this.getRelations();
    return this.serviceRequestRepository.find({
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  async findByClient(clientId: string): Promise<ServiceRequest[]> {
    const relations = await this.getRelations();
    // client relation is redundant here; service + optional children are useful
    const uniqueRelations = Array.from(new Set(relations.filter(r => r !== 'client')));
    return this.serviceRequestRepository.find({
      where: { clientId },
      relations: uniqueRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ServiceRequest> {
    const relations = await this.getRelations();
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id },
      relations,
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    return serviceRequest;
  }

  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto): Promise<ServiceRequest> {
    const serviceRequest = await this.findOne(id);

    // Check if status is being changed to IN_PROGRESS
    if (updateServiceRequestDto.status === ServiceRequestStatus.IN_PROGRESS) {
      // Check if there's a pending invoice for this service request
      const pendingInvoices = await this.invoicesService.findAll(
        { id: serviceRequest.clientId, role: 'CLIENT' } as any,
        InvoiceStatus.SENT
      );
      
      const serviceRequestInvoice = pendingInvoices.find(invoice => 
        invoice.description.includes(`Service Request: ${serviceRequest.id}`) ||
        invoice.description.includes(`Service Request #${serviceRequest.id}`)
      );

      if (serviceRequestInvoice && serviceRequestInvoice.status !== InvoiceStatus.PAID) {
        throw new BadRequestException(
          'Cannot start work until the invoice is paid. Please ensure the invoice is paid before marking as IN_PROGRESS.'
        );
      }
    }

    // Auto-set actual dates based on status changes
    if (updateServiceRequestDto.status) {
      if (updateServiceRequestDto.status === ServiceRequestStatus.IN_PROGRESS && !serviceRequest.actualStartDate) {
        updateServiceRequestDto.actualStartDate = new Date().toISOString().split('T')[0];
      }
      if (updateServiceRequestDto.status === ServiceRequestStatus.COMPLETED && !serviceRequest.actualDeliveryDate) {
        updateServiceRequestDto.actualDeliveryDate = new Date().toISOString().split('T')[0];
      }
    }

    // If status is being changed to APPROVED, generate invoice automatically
    if (updateServiceRequestDto.status === ServiceRequestStatus.APPROVED && 
        serviceRequest.status !== ServiceRequestStatus.APPROVED &&
        serviceRequest.quoteAmount) {
      
      await this.generateInvoiceForServiceRequest(serviceRequest);
    }

    Object.assign(serviceRequest, updateServiceRequestDto);
    return this.serviceRequestRepository.save(serviceRequest);
  }

  async remove(id: string): Promise<void> {
    const serviceRequest = await this.findOne(id);
    await this.serviceRequestRepository.remove(serviceRequest);
  }

  // Price Adjustment methods
  async createPriceAdjustment(
    requestId: string,
    createPriceAdjustmentDto: CreatePriceAdjustmentDto,
    adjustedBy: string,
  ): Promise<PriceAdjustment> {
    const serviceRequest = await this.findOne(requestId);
    
    const priceAdjustment = this.priceAdjustmentRepository.create({
      ...createPriceAdjustmentDto,
      requestId,
      adjustedBy,
    });

    return this.priceAdjustmentRepository.save(priceAdjustment);
  }

  async updatePriceAdjustmentStatus(
    adjustmentId: string,
    updateStatusDto: UpdatePriceAdjustmentStatusDto,
  ): Promise<PriceAdjustment> {
    const priceAdjustment = await this.priceAdjustmentRepository.findOne({
      where: { id: adjustmentId },
      relations: ['serviceRequest'],
    });

    if (!priceAdjustment) {
      throw new NotFoundException(`Price adjustment with ID ${adjustmentId} not found`);
    }

    priceAdjustment.status = updateStatusDto.status;
    if (updateStatusDto.clientNotes) {
      priceAdjustment.clientNotes = updateStatusDto.clientNotes;
    }

    const savedAdjustment = await this.priceAdjustmentRepository.save(priceAdjustment);

    // Auto-update service request quote amount when adjustment is approved
    if (updateStatusDto.status === PriceAdjustmentStatus.APPROVED) {
      await this.serviceRequestRepository.update(
        { id: priceAdjustment.requestId },
        { quoteAmount: savedAdjustment.newAmount }
      );

      // Generate new invoice for the adjusted amount
      const serviceRequest = await this.findOne(priceAdjustment.requestId);
      if (serviceRequest.status === ServiceRequestStatus.APPROVED) {
        await this.generateInvoiceForServiceRequest(serviceRequest);
      }
    }

    return savedAdjustment;
  }

  async getPriceAdjustments(requestId: string): Promise<PriceAdjustment[]> {
    return this.priceAdjustmentRepository.find({
      where: { requestId },
      relations: ['adjustedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  // File Attachment methods
  async createFileAttachment(
    requestId: string,
    createFileAttachmentDto: CreateFileAttachmentDto,
    uploadedBy: string,
  ): Promise<FileAttachment> {
    await this.findOne(requestId); // Verify service request exists

    const fileAttachment = this.fileAttachmentRepository.create({
      ...createFileAttachmentDto,
      requestId,
      uploadedBy,
    });

    return this.fileAttachmentRepository.save(fileAttachment);
  }

  async getFileAttachments(requestId: string): Promise<FileAttachment[]> {
    return this.fileAttachmentRepository.find({
      where: { requestId },
      relations: ['uploadedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteFileAttachment(attachmentId: string): Promise<void> {
    const attachment = await this.fileAttachmentRepository.findOne({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new NotFoundException(`File attachment with ID ${attachmentId} not found`);
    }

    await this.fileAttachmentRepository.remove(attachment);
  }

  // Generate invoice for service request when approved
  private async generateInvoiceForServiceRequest(serviceRequest: ServiceRequest): Promise<void> {
    try {
      // Calculate due date (30 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      // Create invoice DTO
      const invoiceData = {
        clientId: serviceRequest.clientId,
        servicePackageId: serviceRequest.serviceId,
        amount: serviceRequest.quoteAmount,
        tax: 0, // No tax for now, can be configured later
        description: `Service Request: ${serviceRequest.description.substring(0, 100)}${serviceRequest.description.length > 100 ? '...' : ''}`,
        lineItems: [
          {
            description: serviceRequest.description,
            quantity: 1,
            unitPrice: serviceRequest.quoteAmount,
            total: serviceRequest.quoteAmount,
          }
        ],
        dueDate: dueDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        notes: `Auto-generated invoice for Service Request #${serviceRequest.id}. Quote Amount: $${serviceRequest.quoteAmount}`,
      };

      // Create the invoice
      await this.invoicesService.create(invoiceData, { id: 'system', role: 'ADMIN' } as any);
      
      // Invoice generation logging removed for security
    } catch (error) {
      console.error('Error generating invoice for service request:', error);
      throw new BadRequestException('Failed to generate invoice for service request');
    }
  }
}
