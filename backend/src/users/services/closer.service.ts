import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Closer, CloserStatus } from '../entities/closer.entity';
import { AgentSale, SaleStatus, CommissionStatus } from '../entities/agent-sale.entity';
import { CreateCloserDto } from '../dto/create-closer.dto';
import { UpdateCloserDto } from '../dto/update-closer.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class CloserService {
  constructor(
    @InjectRepository(Closer)
    private closerRepository: Repository<Closer>,
    @InjectRepository(AgentSale)
    private agentSaleRepository: Repository<AgentSale>,
  ) {}

  async create(createCloserDto: CreateCloserDto): Promise<Closer> {
    // Check if closer code already exists
    const existingCloser = await this.closerRepository.findOne({
      where: { closerCode: createCloserDto.closerCode },
    });

    if (existingCloser) {
      throw new ConflictException('Closer code already exists');
    }

    const closer = this.closerRepository.create(createCloserDto);
    return this.closerRepository.save(closer);
  }

  async findAll(currentUser?: User): Promise<Closer[]> {
    const closers = await this.closerRepository.find({
      order: { closerName: 'ASC' },
    });

    // If user is an agent, hide commission rates
    if (currentUser?.role === UserRole.AGENT) {
      return closers.map(closer => ({
        ...closer,
        commissionRate: undefined, // Hide commission rate from agents
      }));
    }

    return closers;
  }

  async findActive(currentUser?: User): Promise<Closer[]> {
    const closers = await this.closerRepository.find({
      where: { status: CloserStatus.ACTIVE },
      order: { closerName: 'ASC' },
    });

    // If user is an agent, hide commission rates
    if (currentUser?.role === UserRole.AGENT) {
      return closers.map(closer => ({
        ...closer,
        commissionRate: undefined, // Hide commission rate from agents
      }));
    }

    return closers;
  }

  async findOne(id: string, currentUser?: User): Promise<Closer> {
    const closer = await this.closerRepository.findOne({
      where: { id },
    });

    if (!closer) {
      throw new NotFoundException('Closer not found');
    }

    // If user is an agent, hide commission rate
    if (currentUser?.role === UserRole.AGENT) {
      return {
        ...closer,
        commissionRate: undefined, // Hide commission rate from agents
      };
    }

    return closer;
  }

  async update(id: string, updateCloserDto: UpdateCloserDto): Promise<Closer> {
    const closer = await this.findOne(id);

    // Check if closer code is being changed and if it already exists
    if (updateCloserDto.closerCode && updateCloserDto.closerCode !== closer.closerCode) {
      const existingCloser = await this.closerRepository.findOne({
        where: { closerCode: updateCloserDto.closerCode },
      });

      if (existingCloser) {
        throw new ConflictException('Closer code already exists');
      }
    }

    Object.assign(closer, updateCloserDto);
    return this.closerRepository.save(closer);
  }

  async remove(id: string): Promise<void> {
    const closer = await this.findOne(id);

    // Check if closer has any sales
    const salesCount = await this.agentSaleRepository.count({
      where: { closerId: id },
    });

    if (salesCount > 0) {
      throw new ConflictException('Cannot delete closer with existing sales');
    }

    await this.closerRepository.remove(closer);
  }

  async getCloserStats(closerId: string): Promise<any> {
    const closer = await this.findOne(closerId);

    const totalSales = await this.agentSaleRepository.count({
      where: { closerId, saleStatus: SaleStatus.APPROVED },
    });

    const totalSalesValue = await this.agentSaleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.saleAmount)', 'total')
      .where('sale.closerId = :closerId', { closerId })
      .andWhere('sale.saleStatus = :status', { status: SaleStatus.APPROVED })
      .getRawOne();

    const totalCommission = await this.agentSaleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.closerCommission)', 'total')
      .where('sale.closerId = :closerId', { closerId })
      .andWhere('sale.saleStatus = :status', { status: SaleStatus.APPROVED })
      .getRawOne();

    const paidCommission = await this.agentSaleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.closerCommission)', 'total')
      .where('sale.closerId = :closerId', { closerId })
      .andWhere('sale.saleStatus = :status', { status: SaleStatus.APPROVED })
      .andWhere('sale.commissionStatus = :commissionStatus', { commissionStatus: CommissionStatus.PAID })
      .getRawOne();

    const pendingCommission = await this.agentSaleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.closerCommission)', 'total')
      .where('sale.closerId = :closerId', { closerId })
      .andWhere('sale.saleStatus = :status', { status: SaleStatus.APPROVED })
      .andWhere('sale.commissionStatus = :commissionStatus', { commissionStatus: CommissionStatus.PENDING })
      .getRawOne();

    return {
      closer,
      totalSales,
      totalSalesValue: parseFloat(totalSalesValue.total || '0'),
      totalCommission: parseFloat(totalCommission.total || '0'),
      paidCommission: parseFloat(paidCommission.total || '0'),
      pendingCommission: parseFloat(pendingCommission.total || '0'),
    };
  }

  async getCloserMonthlyStats(closerId: string): Promise<any> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const monthlyStats = [];

    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const sales = await this.agentSaleRepository.find({
        where: {
          closerId,
          saleStatus: SaleStatus.APPROVED,
          saleDate: Between(startOfMonth, endOfMonth),
        },
      });

      const totalSales = sales.length;
      const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.saleAmount), 0);
      const totalCommission = sales.reduce((sum, sale) => sum + Number(sale.closerCommission), 0);
      const paidCommission = sales
        .filter(sale => sale.commissionStatus === CommissionStatus.PAID)
        .reduce((sum, sale) => sum + Number(sale.closerCommission), 0);
      const pendingCommission = totalCommission - paidCommission;

      monthlyStats.push({
        year,
        month,
        monthName: targetDate.toLocaleDateString('en-US', { month: 'long' }),
        totalSales,
        totalSalesValue,
        totalCommission,
        paidCommission,
        pendingCommission,
        isCurrentMonth: i === 0,
      });
    }

    return monthlyStats;
  }

  async getAllClosersStats(): Promise<any> {
    const closers = await this.findAll();
    const stats = [];

    for (const closer of closers) {
      const closerStats = await this.getCloserStats(closer.id);
      stats.push(closerStats);
    }

    return stats;
  }

  async getFilteredCloserStats(filters: any): Promise<any> {
    const closers = await this.findAll();
    const stats = [];

    for (const closer of closers) {
      const closerStats = await this.getFilteredCloserStatsForCloser(closer.id, filters);
      if (closerStats) {
        stats.push(closerStats);
      }
    }

    return stats;
  }

  async getFilteredCloserStatsForCloser(closerId: string, filters: any): Promise<any> {
    const closer = await this.findOne(closerId);
    if (!closer) return null;

    let queryBuilder = this.agentSaleRepository
      .createQueryBuilder('sale')
      .where('sale.closerId = :closerId', { closerId })
      .andWhere('sale.saleStatus = :status', { status: SaleStatus.APPROVED });

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      queryBuilder = queryBuilder.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Apply month filter
    if (filters.month) {
      const [year, month] = filters.month.split('-').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      
      queryBuilder = queryBuilder.andWhere('sale.saleDate BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      });
    }

    const sales = await queryBuilder.getMany();

    // Apply commission range filter
    let filteredSales = sales;
    if (filters.minCommission || filters.maxCommission) {
      filteredSales = sales.filter(sale => {
        const commission = Number(sale.closerCommission);
        const minCommission = filters.minCommission ? Number(filters.minCommission) : 0;
        const maxCommission = filters.maxCommission ? Number(filters.maxCommission) : Infinity;
        return commission >= minCommission && commission <= maxCommission;
      });
    }

    const totalSales = filteredSales.length;
    const totalSalesValue = filteredSales.reduce((sum, sale) => sum + Number(sale.saleAmount), 0);
    const totalCommission = filteredSales.reduce((sum, sale) => sum + Number(sale.closerCommission), 0);
    const paidCommission = filteredSales
      .filter(sale => sale.commissionStatus === CommissionStatus.PAID)
      .reduce((sum, sale) => sum + Number(sale.closerCommission), 0);
    const pendingCommission = totalCommission - paidCommission;

    return {
      closer,
      totalSales,
      totalSalesValue,
      totalCommission,
      paidCommission,
      pendingCommission,
      filters,
    };
  }

  async getCloserAuditData(filters: any): Promise<AgentSale[]> {
    let queryBuilder = this.agentSaleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.agent', 'agent')
      .leftJoinAndSelect('sale.closer', 'closer')
      .leftJoinAndSelect('sale.client', 'client');

    // Apply closer filter
    if (filters.closerId) {
      queryBuilder = queryBuilder.andWhere('sale.closerId = :closerId', { closerId: filters.closerId });
    }

    // Apply agent filter
    if (filters.agentId) {
      queryBuilder = queryBuilder.andWhere('sale.agentId = :agentId', { agentId: filters.agentId });
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      queryBuilder = queryBuilder.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Apply sale status filter
    if (filters.saleStatus) {
      queryBuilder = queryBuilder.andWhere('sale.saleStatus = :saleStatus', { saleStatus: filters.saleStatus });
    }

    // Apply commission status filter
    if (filters.commissionStatus) {
      queryBuilder = queryBuilder.andWhere('sale.commissionStatus = :commissionStatus', { commissionStatus: filters.commissionStatus });
    }

    // Apply amount range filter
    if (filters.minAmount || filters.maxAmount) {
      if (filters.minAmount) {
        queryBuilder = queryBuilder.andWhere('sale.saleAmount >= :minAmount', { minAmount: filters.minAmount });
      }
      if (filters.maxAmount) {
        queryBuilder = queryBuilder.andWhere('sale.saleAmount <= :maxAmount', { maxAmount: filters.maxAmount });
      }
    }

    // Order by date descending
    queryBuilder = queryBuilder.orderBy('sale.saleDate', 'DESC').addOrderBy('sale.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  async getCloserSales(closerId: string): Promise<AgentSale[]> {
    const sales = await this.agentSaleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.agent', 'agent')
      .leftJoinAndSelect('sale.closer', 'closer')
      .leftJoinAndSelect('sale.client', 'client')
      .where('sale.closerId = :closerId', { closerId })
      .orderBy('sale.saleDate', 'DESC')
      .addOrderBy('sale.createdAt', 'DESC')
      .getMany();

    return sales;
  }

  async getDebugSales(): Promise<any> {
    const allSales = await this.agentSaleRepository.find();
    const salesWithClosers = allSales.filter(sale => sale.closerId);
    
    return {
      totalSales: allSales.length,
      salesWithClosers: salesWithClosers.length,
      sampleSales: allSales.slice(0, 5).map(sale => ({
        id: sale.id,
        closerId: sale.closerId,
        closerName: sale.closerName,
        clientName: sale.clientName,
        saleAmount: sale.saleAmount,
        saleStatus: sale.saleStatus
      }))
    };
  }
}
