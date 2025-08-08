import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from '../common/enums/invoice-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private auditService: AuditService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, createdBy: User): Promise<Invoice> {
    // Debug log for clientId
    console.log('Creating invoice for clientId:', createInvoiceDto.clientId);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();
    
    // Calculate total
    const total = createInvoiceDto.amount + (createInvoiceDto.tax || 0);

    const invoice = this.invoicesRepository.create({
      ...createInvoiceDto,
      invoiceNumber,
      total,
    });

    const savedInvoice = await this.invoicesRepository.save(invoice);

    // Audit log
    await this.auditService.log({
      action: 'INVOICE_CREATED',
      entityType: 'Invoice',
      entityId: savedInvoice.id,
      details: { invoiceNumber: savedInvoice.invoiceNumber, amount: savedInvoice.amount },
      user: createdBy,
    });

    return this.findOne(savedInvoice.id);
  }

  async findAll(user: User, status?: InvoiceStatus, clientId?: string): Promise<Invoice[]> {
    const query = this.invoicesRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client')
      .leftJoinAndSelect('invoice.servicePackage', 'servicePackage')
      .leftJoinAndSelect('invoice.payments', 'payments');

    // If user is CLIENT, only show their invoices
    if (user.role === UserRole.CLIENT) {
      query.where('invoice.clientId = :clientId', { clientId: user.id });
    } else if (clientId) {
      // If admin or other role, filter by clientId if provided
      query.where('invoice.clientId = :clientId', { clientId });
    }

    if (status) {
      query.andWhere('invoice.status = :status', { status });
    }

    query.orderBy('invoice.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, user?: User): Promise<Invoice> {
    const query = this.invoicesRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client')
      .leftJoinAndSelect('invoice.servicePackage', 'servicePackage')
      .leftJoinAndSelect('invoice.payments', 'payments')
      .where('invoice.id = :id', { id });

    // If user is CLIENT, ensure they can only access their own invoices
    if (user && user.role === UserRole.CLIENT) {
      query.andWhere('invoice.clientId = :clientId', { clientId: user.id });
    }

    const invoice = await query.getOne();

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, updatedBy: User): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Recalculate total if amount or tax changed
    if (updateInvoiceDto.amount !== undefined || updateInvoiceDto.tax !== undefined) {
      const amount = updateInvoiceDto.amount ?? invoice.amount;
      const tax = updateInvoiceDto.tax ?? invoice.tax;
      const total = amount + tax;
      Object.assign(invoice, updateInvoiceDto, { total });
    } else {
      Object.assign(invoice, updateInvoiceDto);
    }

    const updatedInvoice = await this.invoicesRepository.save(invoice);

    // Audit log
    await this.auditService.log({
      action: 'INVOICE_UPDATED',
      entityType: 'Invoice',
      entityId: updatedInvoice.id,
      details: updateInvoiceDto,
      user: updatedBy,
    });

    return this.findOne(updatedInvoice.id);
  }

  async updateStatus(id: string, status: InvoiceStatus, updatedBy: User): Promise<Invoice> {
    const invoice = await this.findOne(id);
    
    const oldStatus = invoice.status;
    invoice.status = status;

    // Set dates based on status
    if (status === InvoiceStatus.SENT && !invoice.sentDate) {
      invoice.sentDate = new Date();
    }
    
    if (status === InvoiceStatus.PAID && !invoice.paidDate) {
      invoice.paidDate = new Date();
    }

    const updatedInvoice = await this.invoicesRepository.save(invoice);

    // Audit log
    await this.auditService.log({
      action: 'INVOICE_STATUS_CHANGED',
      entityType: 'Invoice',
      entityId: updatedInvoice.id,
      details: { oldStatus, newStatus: status },
      user: updatedBy,
    });

    return this.findOne(updatedInvoice.id);
  }

  async remove(id: string, deletedBy: User): Promise<void> {
    const invoice = await this.findOne(id);
    
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot delete a paid invoice');
    }

    await this.invoicesRepository.remove(invoice);

    // Audit log
    await this.auditService.log({
      action: 'INVOICE_DELETED',
      entityType: 'Invoice',
      entityId: invoice.id,
      details: { invoiceNumber: invoice.invoiceNumber },
      user: deletedBy,
    });
  }

  async getStats(): Promise<any> {
    const totalInvoices = await this.invoicesRepository.count();
    
    const statusCounts = await this.invoicesRepository
      .createQueryBuilder('invoice')
      .select('invoice.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('invoice.status')
      .getRawMany();

    const amountStats = await this.invoicesRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'totalAmount')
      .addSelect('SUM(CASE WHEN invoice.status = :paidStatus THEN invoice.total ELSE 0 END)', 'paidAmount')
      .addSelect('SUM(CASE WHEN invoice.status = :unpaidStatus THEN invoice.total ELSE 0 END)', 'unpaidAmount')
      .setParameter('paidStatus', InvoiceStatus.PAID)
      .setParameter('unpaidStatus', InvoiceStatus.SENT)
      .getRawOne();

    return {
      totalInvoices,
      statusCounts,
      ...amountStats,
    };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoicesRepository.count();
    return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}